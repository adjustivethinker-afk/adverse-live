<?php
require_once __DIR__ . '/db.php';

function uuid_v4(): string
{
    $data = random_bytes(16);
    $data[6] = chr((ord($data[6]) & 0x0f) | 0x40);
    $data[8] = chr((ord($data[8]) & 0x3f) | 0x80);
    return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
}

function normalize_phone(string $phone): string
{
    $clean = preg_replace('/[^0-9]/', '', $phone);
    if (strlen($clean) === 10 && str_starts_with($clean, '3')) {
        return '0' . $clean;
    }
    if (strlen($clean) === 11 && str_starts_with($clean, '03')) {
        return $clean;
    }
    return $phone;
}

function generate_referral_code(PDO $pdo): string
{
    do {
        $code = strtoupper(substr(bin2hex(random_bytes(4)), 0, 8));
        $stmt = $pdo->prepare('SELECT 1 FROM users WHERE referral_code = ? LIMIT 1');
        $stmt->execute([$code]);
    } while ($stmt->fetchColumn());
    return $code;
}

function generate_username(string $username): string
{
    return strtolower(trim($username));
}

function app_user_from_row(array $row): array
{
    return [
        'id' => $row['id'],
        'email' => $row['email'],
        'fullName' => $row['full_name'],
        'displayName' => $row['display_name'],
        'username' => $row['username'] ?? '',
        'phone' => $row['phone'] ?? '',
        'city' => $row['city'] ?? '',
        'gender' => $row['gender'] ?? 'male',
        'level' => (int) $row['level'],
        'xp' => (int) $row['xp'],
        'streak' => (int) $row['streak'],
        'balance' => (float) $row['balance'],
        'totalEarned' => (float) $row['total_earned'],
        'pending' => (float) $row['pending'],
        'referralCode' => $row['referral_code'] ?? '',
        'referredBy' => $row['referred_by'] ?? null,
        'role' => $row['role'],
        'isAdmin' => (bool) $row['is_admin'],
        'joinedAt' => $row['joined_at'],
        'lastActiveAt' => $row['last_active_at'] ?? null,
        'avatarUrl' => $row['avatar_url'] ?? null,
        'status' => $row['status'],
    ];
}

function find_user_by_email(PDO $pdo, string $email): ?array
{
    $stmt = $pdo->prepare('SELECT * FROM users WHERE email = ? LIMIT 1');
    $stmt->execute([strtolower(trim($email))]);
    $user = $stmt->fetch();
    return $user ?: null;
}

function find_user_by_username(PDO $pdo, string $username): ?array
{
    $stmt = $pdo->prepare('SELECT * FROM users WHERE username = ? LIMIT 1');
    $stmt->execute([generate_username($username)]);
    $user = $stmt->fetch();
    return $user ?: null;
}

function find_user_by_referral_code(PDO $pdo, string $code): ?array
{
    $stmt = $pdo->prepare('SELECT * FROM users WHERE referral_code = ? LIMIT 1');
    $stmt->execute([strtoupper(trim($code))]);
    $user = $stmt->fetch();
    return $user ?: null;
}

function user_response(array $row): array
{
    $user = app_user_from_row($row);
    $user['profileIncomplete'] = $row['status'] === 'PENDING_PROFILE';
    $user['needsProfile'] = $row['status'] === 'PENDING_PROFILE';
    return $user;
}

function require_auth(): string
{
    session_start_if_needed();
    if (empty($_SESSION['user_id'])) {
        json_response(['ok' => false, 'error' => 'Unauthorized'], 401);
    }
    return $_SESSION['user_id'];
}

function is_admin_email(string $email): bool
{
    $list = json_decode(ADMIN_EMAILS, true);
    return is_array($list) && in_array(strtolower(trim($email)), array_map('strtolower', $list), true);
}

function settings(): array
{
    $pdo = db();
    $stmt = $pdo->query('SELECT * FROM settings LIMIT 1');
    $row = $stmt->fetch();
    if (!$row) {
        return [
            'welcomeBonus' => 10.0,
            'dailyQuizReward' => 30.0,
            'minWithdraw' => 200.0,
            'refRates' => ['l1' => 0.1, 'l2' => 0.05, 'l3' => 0.02],
        ];
    }
    return [
        'welcomeBonus' => (float) $row['welcome_bonus'],
        'dailyQuizReward' => (float) $row['daily_quiz_reward'],
        'minWithdraw' => (float) $row['min_withdraw'],
        'refRates' => [
            'l1' => (float) $row['ref_rate_l1'],
            'l2' => (float) $row['ref_rate_l2'],
            'l3' => (float) $row['ref_rate_l3'],
        ],
    ];
}

function add_transaction(string $uid, string $type, float $amount, string $status, string $description, float $balanceAfter): void
{
    $pdo = db();
    $stmt = $pdo->prepare('INSERT INTO transactions (id, uid, type, amount, status, description, balance_after, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
    $stmt->execute([
        uuid_v4(),
        $uid,
        $type,
        $amount,
        $status,
        $description,
        $balanceAfter,
        date('Y-m-d H:i:s'),
    ]);
}
