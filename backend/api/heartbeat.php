<?php
require_once __DIR__ . '/utils.php';
$userId = require_auth();
$pdo = db();
$stmt = $pdo->prepare('UPDATE users SET last_active_at = ? WHERE id = ?');
$stmt->execute([date('Y-m-d H:i:s'), $userId]);
json_response(['ok' => true]);
