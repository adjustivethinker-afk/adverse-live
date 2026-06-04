<?php
require_once __DIR__ . '/utils.php';

$body = get_json_body();
$email = trim((string)($body['email'] ?? ''));
$password = (string)($body['password'] ?? '');

if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    json_response(['ok' => false, 'error' => 'Enter a valid email.'], 400);
}
if ($password === '') {
    json_response(['ok' => false, 'error' => 'Enter your password.'], 400);
}

$pdo = db();
$user = find_user_by_email($pdo, $email);
if (!$user || !isset($user['password_hash']) || !password_verify($password, $user['password_hash'])) {
    json_response(['ok' => false, 'error' => 'Invalid email or password.'], 401);
}

session_start_if_needed();
$_SESSION['user_id'] = $user['id'];

if ($user['status'] === 'PENDING_PROFILE') {
    json_response(['ok' => true, 'kind' => 'new']);
}

json_response(['ok' => true, 'kind' => 'existing', 'user' => user_response($user)]);
