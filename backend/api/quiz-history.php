<?php
require_once __DIR__ . '/utils.php';

$userId = require_auth();
$maxItems = isset($_GET['maxItems']) ? min(100, max(10, (int)$_GET['maxItems'])) : 14;
$pdo = db();
$stmt = $pdo->prepare('SELECT * FROM quiz_attempts WHERE uid = ? ORDER BY created_at DESC LIMIT ?');
$stmt->bindValue(1, $userId, PDO::PARAM_STR);
$stmt->bindValue(2, $maxItems, PDO::PARAM_INT);
$stmt->execute();
$attempts = array_map(function ($row) {
    return [
        'id' => $row['id'],
        'uid' => $row['uid'],
        'date' => $row['date'],
        'questionId' => $row['question_id'],
        'picked' => (int)$row['picked'],
        'correct' => (bool)$row['correct'],
        'reward' => (float)$row['reward'],
        'at' => strtotime($row['created_at']) * 1000,
        'question' => $row['question_text'] ?? '',
        'category' => $row['category'] ?? 'GENERAL',
        'options' => json_decode($row['options'], true) ?: [],
    ];
}, $stmt->fetchAll());
json_response(['ok' => true, 'attempts' => $attempts]);
