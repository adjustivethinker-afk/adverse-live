<?php
require_once __DIR__ . '/utils.php';

$userId = require_auth();
$pdo = db();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $pdo->prepare('SELECT balance, pending, total_earned FROM users WHERE id = ? LIMIT 1');
    $stmt->execute([$userId]);
    $user = $stmt->fetch();
    if (!$user) {
        json_response(['ok' => false, 'error' => 'User not found.'], 404);
    }

    $stmt = $pdo->prepare('SELECT * FROM transactions WHERE uid = ? ORDER BY created_at DESC LIMIT 40');
    $stmt->execute([$userId]);
    $transactions = array_map(function ($row) {
        return [
            'id' => $row['id'],
            'uid' => $row['uid'],
            'type' => $row['type'],
            'amount' => (float)$row['amount'],
            'status' => $row['status'],
            'description' => $row['description'],
            'balanceAfter' => (float)$row['balance_after'],
            'createdAt' => strtotime($row['created_at']) * 1000,
        ];
    }, $stmt->fetchAll());

    json_response(['ok' => true, 'totals' => [
        'balance' => (float)$user['balance'],
        'pending' => (float)$user['pending'],
        'totalEarned' => (float)$user['total_earned'],
    ], 'transactions' => $transactions]);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $body = get_json_body();
    $action = trim((string)($body['action'] ?? ''));
    if ($action !== 'withdraw') {
        json_response(['ok' => false, 'error' => 'Unknown action.'], 400);
    }

    $amount = isset($body['amount']) ? (float)$body['amount'] : 0.0;
    if ($amount <= 0) {
        json_response(['ok' => false, 'error' => 'Enter a positive amount.'], 400);
    }

    $settings = settings();
    if ($amount < (float)$settings['minWithdraw']) {
        json_response(['ok' => false, 'error' => 'Amount is below the minimum withdrawal.'], 400);
    }

    $stmt = $pdo->prepare('SELECT balance, pending FROM users WHERE id = ? LIMIT 1');
    $stmt->execute([$userId]);
    $user = $stmt->fetch();
    if (!$user) {
        json_response(['ok' => false, 'error' => 'User not found.'], 404);
    }
    if ((float)$user['balance'] < $amount) {
        json_response(['ok' => false, 'error' => 'Insufficient balance.'], 400);
    }

    $newBalance = (float)$user['balance'] - $amount;
    $stmt = $pdo->prepare('UPDATE users SET balance = ?, pending = ? WHERE id = ?');
    $stmt->execute([$newBalance, (float)$user['pending'] + $amount, $userId]);

    add_transaction($userId, 'WITHDRAWAL', $amount, 'pending', 'Withdrawal request', $newBalance);
    json_response(['ok' => true, 'balance' => $newBalance, 'pending' => (float)$user['pending'] + $amount]);
}

json_response(['ok' => false, 'error' => 'Unsupported method.'], 405);
