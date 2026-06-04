<?php
require_once __DIR__ . '/utils.php';

$body = get_json_body();
$userId = require_auth();

$patch = [];
if (isset($body['fullName']) && trim((string)$body['fullName']) !== '') {
    $patch['full_name'] = trim((string)$body['fullName']);
    $patch['display_name'] = explode(' ', $patch['full_name'])[0] ?: $patch['full_name'];
}
if (isset($body['city']) && trim((string)$body['city']) !== '') {
    $patch['city'] = trim((string)$body['city']);
}
if (array_key_exists('avatarUrl', $body)) {
    $patch['avatar_url'] = $body['avatarUrl'] === null ? null : trim((string)$body['avatarUrl']);
}

if (count($patch) === 0) {
    json_response(['ok' => true]);
}

$pdo = db();
$sets = [];
$params = [];
foreach ($patch as $key => $value) {
    $sets[] = sprintf('%s = ?', $key);
    $params[] = $value;
}
$params[] = $userId;

$stmt = $pdo->prepare('UPDATE users SET ' . implode(', ', $sets) . ' WHERE id = ?');
$stmt->execute($params);

json_response(['ok' => true]);
