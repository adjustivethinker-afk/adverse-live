<?php
require_once __DIR__ . '/utils.php';

$body = get_json_body();
$email = trim((string)($body['email'] ?? ''));
$password = (string)($body['password'] ?? '');
$fullName = trim((string)($body['fullName'] ?? ''));

if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    json_response(['ok' => false, 'error' => 'Enter a valid email.'], 400);
}
if (strlen($password) < 8) {
    json_response(['ok' => false, 'error' => 'Password must be at least 8 characters.'], 400);
}
if (strlen($fullName) < 2) {
    json_response(['ok' => false, 'error' => 'Enter your full name.'], 400);
}

$pdo = db();
if (find_user_by_email($pdo, $email)) {
    json_response(['ok' => false, 'error' => 'An account already exists with that email.'], 409);
}

$userId = uuid_v4();
$displayName = explode(' ', $fullName)[0] ?: $fullName;
$referralCode = generate_referral_code($pdo);
$hashed = password_hash($password, PASSWORD_DEFAULT);
$role = is_admin_email($email) ? 'ADMIN' : 'USER';
$isAdmin = is_admin_email($email) ? 1 : 0;

$stmt = $pdo->prepare(
    'INSERT INTO users (id, email, password_hash, full_name, display_name, username, phone, city, gender, level, xp, streak, balance, total_earned, pending, referral_code, referred_by, role, is_admin, status, joined_at, created_at)
     VALUES (?, ?, ?, ?, ?, NULL, NULL, NULL, ?, 1, 0, 0, 0.00, 0.00, 0.00, ?, NULL, ?, ?, ?, ?, ?)' 
);
$stmt->execute([
    $userId,
    strtolower($email),
    $hashed,
    $fullName,
    $displayName,
    'male',
    $referralCode,
    $role,
    $isAdmin,
    'PENDING_PROFILE',
    date('Y-m-d H:i:s'),
    date('Y-m-d H:i:s'),
]);

session_start_if_needed();
$_SESSION['user_id'] = $userId;

json_response(['ok' => true, 'needsProfile' => true]);
