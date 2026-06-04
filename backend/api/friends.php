<?php
require_once __DIR__ . '/utils.php';

$maxItems = isset($_GET['maxItems']) ? (int)$_GET['maxItems'] : 60;
$maxItems = max(10, min(100, $maxItems));
$pdo = db();
$userId = null;
if (session_status() === PHP_SESSION_ACTIVE || session_start_if_needed()) {
    $userId = $_SESSION['user_id'] ?? null;
}

$stmt = $pdo->prepare('SELECT * FROM users WHERE status = ? ORDER BY last_active_at DESC LIMIT ?');
$stmt->bindValue(1, 'ACTIVE');
$stmt->bindValue(2, $maxItems, PDO::PARAM_INT);
$stmt->execute();
$users = $stmt->fetchAll();
$out = [];
foreach ($users as $row) {
    if ($userId !== null && $row['id'] === $userId) {
        continue;
    }
    $out[] = user_response($row);
}
json_response(['ok' => true, 'users' => $out]);
