<?php
require_once __DIR__ . '/utils.php';

$userId = trim((string)($_GET['id'] ?? ''));
$username = trim((string)($_GET['username'] ?? ''));
$pdo = db();

if ($userId !== '') {
    $stmt = $pdo->prepare('SELECT * FROM users WHERE id = ? LIMIT 1');
    $stmt->execute([$userId]);
    $user = $stmt->fetch();
    if (!$user) {
        json_response(['ok' => false, 'error' => 'User not found.'], 404);
    }
    json_response(['ok' => true, 'user' => user_response($user)]);
}

if ($username !== '') {
    $user = find_user_by_username($pdo, $username);
    if (!$user) {
        json_response(['ok' => false, 'error' => 'User not found.'], 404);
    }
    json_response(['ok' => true, 'user' => user_response($user)]);
}

json_response(['ok' => false, 'error' => 'Missing id or username.'], 400);
