<?php
require_once __DIR__ . '/utils.php';

$userId = require_auth();
$pdo = db();
$today = (new DateTime('now', new DateTimeZone('UTC')))->format('Y-m-d');

$stmt = $pdo->query('SELECT * FROM quiz_questions ORDER BY id ASC');
$questions = $stmt->fetchAll();
if (!$questions) {
    json_response(['ok' => false, 'error' => 'Quiz bank is empty.'], 404);
}

$hash = crc32($userId . ':' . $today);
$index = abs((int)$hash) % count($questions);
$question = $questions[$index];
$attemptId = $userId . '_' . $today;

$stmt = $pdo->prepare('SELECT * FROM quiz_attempts WHERE id = ? LIMIT 1');
$stmt->execute([$attemptId]);
$attempt = $stmt->fetch();

$response = [
    'ok' => true,
    'question' => [
        'id' => $question['id'],
        'category' => $question['category'],
        'question' => $question['question'],
        'options' => json_decode($question['options'], true) ?: [],
        'correctIndex' => (int)$question['correct_index'],
    ],
    'attempted' => false,
];

if ($attempt) {
    $response['attempted'] = true;
    $response['attempt'] = [
        'id' => $attempt['id'],
        'uid' => $attempt['uid'],
        'date' => $attempt['date'],
        'questionId' => $attempt['question_id'],
        'picked' => (int)$attempt['picked'],
        'correct' => (bool)$attempt['correct'],
        'reward' => (float)$attempt['reward'],
        'at' => strtotime($attempt['created_at']) * 1000,
        'question' => $question['question'],
        'category' => $question['category'],
        'options' => json_decode($question['options'], true) ?: [],
    ];
}

json_response($response);
