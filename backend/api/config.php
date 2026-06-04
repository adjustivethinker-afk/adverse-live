<?php
// Copy this file and set your production values before deployment.
// Hostinger may also allow environment variables; prefer those for secrets.

if (!defined('DB_HOST')) {
    define('DB_HOST', '127.0.0.1');
    define('DB_NAME', 'game_db');
    define('DB_USER', 'db_user');
    define('DB_PASS', 'db_pass');
    define('ADMIN_EMAILS', json_encode(['admin@example.com', 'admin@adverse.live']));
    define('SITE_URL', '/');
    define('GOOGLE_CLIENT_ID', '');
    define('GOOGLE_CLIENT_SECRET', '');
}
