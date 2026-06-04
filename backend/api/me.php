<?php
require_once __DIR__ . '/utils.php';

$userId = require_auth();
$pdo = db();
$stmt = $pdo->prepare('SELECT * FROM users WHERE id = ? LIMIT 1');
$stmt->execute([$userId]);
$user = $stmt->fetch();
if (!$user) {
    json_response(['ok' => false, 'error' => 'User not found.'], 404);
}

$json = user_response($user);
$json['ok'] = true;
json_response($json);
