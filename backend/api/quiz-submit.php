<?php
require_once __DIR__ . '/utils.php';

$body = get_json_body();
$questionId = trim((string)($body['questionId'] ?? ''));
$pickedIndex = isset($body['pickedIndex']) ? (int)$body['pickedIndex'] : null;

if ($questionId === '' || $pickedIndex === null) {
    json_response(['ok' => false, 'error' => 'Missing questionId or pickedIndex.'], 400);
}

$userId = require_auth();
$pdo = db();

$stmt = $pdo->prepare('SELECT * FROM quiz_questions WHERE id = ? LIMIT 1');
$stmt->execute([$questionId]);
$question = $stmt->fetch();
if (!$question) {
    json_response(['ok' => false, 'error' => 'Question not found.'], 404);
}

$today = (new DateTime('now', new DateTimeZone('UTC')))->format('Y-m-d');
$attemptId = $userId . '_' . $today;
$stmt = $pdo->prepare('SELECT 1 FROM quiz_attempts WHERE id = ? LIMIT 1');
$stmt->execute([$attemptId]);
if ($stmt->fetch()) {
    json_response(['ok' => false, 'error' => "You already attempted today's quiz."], 400);
}

$settings = settings();
$reward = (float)$settings['dailyQuizReward'];
$options = json_decode($question['options'], true) ?: [];
$correct = $pickedIndex === (int)$question['correct_index'];
$xpGain = $correct ? 20 : 5;
$balanceAdd = $correct ? $reward : 0.0;

$pdo->beginTransaction();
try {
    $stmt = $pdo->prepare('SELECT * FROM users WHERE id = ? LIMIT 1');
    $stmt->execute([$userId]);
    $user = $stmt->fetch();
    if (!$user) {
        throw new Exception('User not found.');
    }

    $newBalance = (float)$user['balance'] + $balanceAdd;
    $newTotal = (float)$user['total_earned'] + $balanceAdd;
    $newXp = (int)$user['xp'] + $xpGain;
    $newLevel = 1 + floor($newXp / 200);
    $newStreak = $correct ? ((int)$user['streak'] + 1) : 0;

    $stmt = $pdo->prepare('INSERT INTO quiz_attempts (id, uid, date, question_id, picked, correct, reward, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
    $stmt->execute([
        $attemptId,
        $userId,
        $today,
        $questionId,
        $pickedIndex,
        $correct ? 1 : 0,
        $balanceAdd,
        date('Y-m-d H:i:s'),
    ]);

    $stmt = $pdo->prepare('UPDATE users SET balance = ?, total_earned = ?, xp = ?, level = ?, streak = ?, last_active_at = ? WHERE id = ?');
    $stmt->execute([
        $newBalance,
        $newTotal,
        $newXp,
        $newLevel,
        $newStreak,
        date('Y-m-d H:i:s'),
        $userId,
    ]);

    if ($correct && $balanceAdd > 0) {
        add_transaction($userId, 'QUIZ_REWARD', $balanceAdd, 'completed', 'Daily quiz reward', $newBalance);
    }

    $pdo->commit();
} catch (Exception $e) {
    $pdo->rollBack();
    json_response(['ok' => false, 'error' => $e->getMessage() ?: 'Failed to submit answer.'], 500);
}

json_response(['ok' => true, 'correct' => $correct, 'reward' => $balanceAdd, 'correctIndex' => (int)$question['correct_index'], 'newBalance' => $newBalance]);
