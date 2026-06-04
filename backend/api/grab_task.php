<?php
require_once __DIR__ . '/utils.php';

$pdo = db();
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $maxItems = isset($_GET['maxItems']) ? min(100, max(5, (int)$_GET['maxItems'])) : 10;
    $stmt = $pdo->prepare('SELECT * FROM tasks WHERE status = ? ORDER BY created_at ASC LIMIT ?');
    $stmt->bindValue(1, 'available', PDO::PARAM_STR);
    $stmt->bindValue(2, $maxItems, PDO::PARAM_INT);
    $stmt->execute();
    $tasks = array_map(function ($row) {
        return [
            'id' => $row['id'],
            'title' => $row['title'],
            'description' => $row['description'],
            'reward' => (float)$row['reward'],
            'taskType' => $row['task_type'],
            'targetUrl' => $row['target_url'],
        ];
    }, $stmt->fetchAll());
    json_response(['ok' => true, 'tasks' => $tasks]);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $userId = require_auth();
    $body = get_json_body();
    $taskId = trim((string)($body['taskId'] ?? ''));
    if ($taskId === '') {
        json_response(['ok' => false, 'error' => 'Missing taskId.'], 400);
    }
    $pdo->beginTransaction();
    try {
        $stmt = $pdo->prepare('SELECT * FROM tasks WHERE id = ? FOR UPDATE');
        $stmt->execute([$taskId]);
        $task = $stmt->fetch();
        if (!$task || $task['status'] !== 'available') {
            throw new Exception('Task not available.');
        }
        $stmt = $pdo->prepare('UPDATE tasks SET status = ?, assigned_uid = ?, assigned_at = ? WHERE id = ?');
        $stmt->execute(['claimed', $userId, date('Y-m-d H:i:s'), $taskId]);
        $pdo->commit();
    } catch (Exception $e) {
        $pdo->rollBack();
        json_response(['ok' => false, 'error' => $e->getMessage()], 400);
    }
    json_response(['ok' => true, 'task' => [
        'id' => $task['id'],
        'title' => $task['title'],
        'description' => $task['description'],
        'reward' => (float)$task['reward'],
        'taskType' => $task['task_type'],
        'targetUrl' => $task['target_url'],
    ]]);
}

json_response(['ok' => false, 'error' => 'Unsupported method.'], 405);
