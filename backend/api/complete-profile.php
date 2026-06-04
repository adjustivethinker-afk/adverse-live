<?php
require_once __DIR__ . '/utils.php';

$body = get_json_body();
$username = trim((string)($body['username'] ?? ''));
$fullName = trim((string)($body['fullName'] ?? ''));
gender = trim((string)($body['gender'] ?? 'male']);
$city = trim((string)($body['city'] ?? ''));
$phone = trim((string)($body['phone'] ?? ''));
$referralCode = trim((string)($body['referralCode'] ?? ''));

if ($username === '' || !preg_match('/^[a-z0-9_]{3,20}$/i', $username)) {
    json_response(['ok' => false, 'error' => 'Username must be 3-20 letters, numbers, or underscore.'], 400);
}
if (strlen($fullName) < 2) {
    json_response(['ok' => false, 'error' => 'Enter your full name.'], 400);
}
if (!in_array(strtolower($gender), ['male', 'female'], true)) {
    json_response(['ok' => false, 'error' => 'Select a valid gender.'], 400);
}
if (strlen($city) < 2) {
    json_response(['ok' => false, 'error' => 'Select a city.'], 400);
}
$phone = normalize_phone($phone);

$pdo = db();
$userId = require_auth();
$stmt = $pdo->prepare('SELECT * FROM users WHERE id = ? LIMIT 1');
$stmt->execute([$userId]);
$user = $stmt->fetch();
if (!$user) {
    json_response(['ok' => false, 'error' => 'Signed in user not found.'], 404);
}
if ($user['status'] !== 'PENDING_PROFILE') {
    json_response(['ok' => false, 'error' => 'Profile is already complete.'], 400);
}

$normalizedUsername = generate_username($username);
$existing = find_user_by_username($pdo, $normalizedUsername);
if ($existing && $existing['id'] !== $userId) {
    json_response(['ok' => false, 'error' => 'This username is already taken.'], 409);
}

$referredBy = null;
if ($referralCode !== '') {
    $referrer = find_user_by_referral_code($pdo, $referralCode);
    if ($referrer && $referrer['id'] !== $userId) {
        $referredBy = $referrer['id'];
    }
}

$settings = settings();
$welcomeBonus = (float)$settings['welcomeBonus'];
$role = is_admin_email($user['email']) ? 'ADMIN' : 'USER';
$isAdmin = $role === 'ADMIN' ? 1 : 0;
$displayName = explode(' ', $fullName)[0] ?: $fullName;
$referralCodeForUser = $user['referral_code'] ?: generate_referral_code($pdo);

$pdo->beginTransaction();
try {
    $stmt = $pdo->prepare(
        'UPDATE users SET full_name = ?, display_name = ?, username = ?, gender = ?, city = ?, phone = ?, referred_by = ?, role = ?, is_admin = ?, status = ?, balance = ?, total_earned = ?, referral_code = ?, last_active_at = ? WHERE id = ?'
    );
    $stmt->execute([
        $fullName,
        $displayName,
        $normalizedUsername,
        strtolower($gender),
        $city,
        $phone,
        $referredBy,
        $role,
        $isAdmin,
        'ACTIVE',
        $welcomeBonus,
        $welcomeBonus,
        $referralCodeForUser,
        date('Y-m-d H:i:s'),
        $userId,
    ]);

    if ($welcomeBonus > 0) {
        add_transaction($userId, 'WELCOME_BONUS', $welcomeBonus, 'completed', 'Welcome bonus', $welcomeBonus);
    }

    if ($referredBy) {
        $commission = round($welcomeBonus * $settings['refRates']['l1'], 2);
        if ($commission > 0) {
            $refBalance = (float)$referrer['balance'] + $commission;
            $refTotalEarned = (float)$referrer['total_earned'] + $commission;
            $stmt2 = $pdo->prepare('UPDATE users SET balance = ?, total_earned = ? WHERE id = ?');
            $stmt2->execute([$refBalance, $refTotalEarned, $referredBy]);
            add_transaction($referredBy, 'REFERRAL_COMMISSION', $commission, 'completed', 'Referral commission', $refBalance);
        }
    }

    $pdo->commit();
} catch (Exception $e) {
    $pdo->rollBack();
    json_response(['ok' => false, 'error' => 'Could not complete profile.'], 500);
}

$stmt = $pdo->prepare('SELECT * FROM users WHERE id = ? LIMIT 1');
$stmt->execute([$userId]);
$updated = $stmt->fetch();

json_response(['ok' => true, 'user' => user_response($updated)]);
