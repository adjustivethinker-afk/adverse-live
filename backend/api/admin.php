<?php
require_once __DIR__ . '/utils.php';

$userId = require_auth();
$pdo = db();
$stmt = $pdo->prepare('SELECT * FROM users WHERE id = ? LIMIT 1');
$stmt->execute([$userId]);
$user = $stmt->fetch();
if (!$user || !$user['is_admin']) {
    json_response(['ok' => false, 'error' => 'Forbidden'], 403);
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stats = [];
    $stats['users'] = (int)$pdo->query('SELECT COUNT(*) FROM users')->fetchColumn();
    $stats['activeUsers'] = (int)$pdo->query("SELECT COUNT(*) FROM users WHERE status = 'ACTIVE'")->fetchColumn();
    $stats['pendingProfiles'] = (int)$pdo->query("SELECT COUNT(*) FROM users WHERE status = 'PENDING_PROFILE'")->fetchColumn();
    $stats['transactions'] = (int)$pdo->query('SELECT COUNT(*) FROM transactions')->fetchColumn();
    $stats['balanceTotal'] = (float)$pdo->query('SELECT COALESCE(SUM(balance),0) FROM users')->fetchColumn();
    $stats['withdrawalsPending'] = (int)$pdo->query("SELECT COUNT(*) FROM transactions WHERE type = 'WITHDRAWAL' AND status = 'pending'")->fetchColumn();
    json_response(['ok' => true, 'stats' => $stats]);
}

json_response(['ok' => false, 'error' => 'Unsupported method.'], 405);
