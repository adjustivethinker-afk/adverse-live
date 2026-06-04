-- MySQL schema for Adverse app migration to PHP + MySQL

CREATE TABLE IF NOT EXISTS `users` (
  `id` CHAR(36) NOT NULL PRIMARY KEY,
  `email` VARCHAR(191) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NULL,
  `full_name` VARCHAR(191) NOT NULL,
  `display_name` VARCHAR(100) NOT NULL,
  `username` VARCHAR(100) NULL UNIQUE,
  `phone` VARCHAR(32) NULL,
  `city` VARCHAR(100) NULL,
  `gender` ENUM('male','female') NOT NULL DEFAULT 'male',
  `level` INT NOT NULL DEFAULT 1,
  `xp` INT NOT NULL DEFAULT 0,
  `streak` INT NOT NULL DEFAULT 0,
  `balance` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `total_earned` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `pending` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `referral_code` VARCHAR(16) NULL UNIQUE,
  `referred_by` CHAR(36) NULL,
  `role` ENUM('USER','ADMIN','SUPER_ADMIN') NOT NULL DEFAULT 'USER',
  `is_admin` TINYINT(1) NOT NULL DEFAULT 0,
  `status` ENUM('PENDING_PROFILE','ACTIVE','SUSPENDED') NOT NULL DEFAULT 'PENDING_PROFILE',
  `joined_at` DATETIME NOT NULL,
  `last_active_at` DATETIME NULL,
  `avatar_url` VARCHAR(255) NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `transactions` (
  `id` CHAR(36) NOT NULL PRIMARY KEY,
  `uid` CHAR(36) NOT NULL,
  `type` ENUM('QUIZ_REWARD','REFERRAL_COMMISSION','WELCOME_BONUS','DEPOSIT','WITHDRAWAL','MISSION') NOT NULL,
  `amount` DECIMAL(12,2) NOT NULL,
  `status` ENUM('completed','pending','failed') NOT NULL,
  `description` VARCHAR(255) NOT NULL,
  `balance_after` DECIMAL(12,2) NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX (`uid`),
  CONSTRAINT `fk_transactions_user` FOREIGN KEY (`uid`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `settings` (
  `id` INT NOT NULL PRIMARY KEY,
  `welcome_bonus` DECIMAL(12,2) NOT NULL DEFAULT 10.00,
  `daily_quiz_reward` DECIMAL(12,2) NOT NULL DEFAULT 30.00,
  `min_withdraw` DECIMAL(12,2) NOT NULL DEFAULT 200.00,
  `ref_rate_l1` DECIMAL(5,4) NOT NULL DEFAULT 0.1000,
  `ref_rate_l2` DECIMAL(5,4) NOT NULL DEFAULT 0.0500,
  `ref_rate_l3` DECIMAL(5,4) NOT NULL DEFAULT 0.0200
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `vip_config` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `tier_name` VARCHAR(50) NOT NULL,
  `min_monthly_deposit` DECIMAL(12,2) NOT NULL,
  `reward_multiplier` DECIMAL(5,2) NOT NULL,
  `benefits` TEXT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `tasks` (
  `id` CHAR(36) NOT NULL PRIMARY KEY,
  `title` VARCHAR(191) NOT NULL,
  `description` TEXT NOT NULL,
  `reward` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `task_type` ENUM('quiz','mission','survey','referral') NOT NULL DEFAULT 'mission',
  `status` ENUM('available','claimed','completed') NOT NULL DEFAULT 'available',
  `assigned_uid` CHAR(36) NULL,
  `assigned_at` DATETIME NULL,
  `completed_at` DATETIME NULL,
  `target_url` VARCHAR(255) NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX (`assigned_uid`),
  CONSTRAINT `fk_tasks_user` FOREIGN KEY (`assigned_uid`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `quiz_questions` (
  `id` CHAR(36) NOT NULL PRIMARY KEY,
  `category` ENUM('ISLAMIC','PAKISTAN','GENERAL','ADAB') NOT NULL DEFAULT 'GENERAL',
  `question` TEXT NOT NULL,
  `options` JSON NOT NULL,
  `correct_index` INT NOT NULL,
  `explanation` TEXT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `quiz_attempts` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `uid` CHAR(36) NOT NULL,
  `date` DATE NOT NULL,
  `question_id` CHAR(36) NOT NULL,
  `picked` INT NOT NULL,
  `correct` TINYINT(1) NOT NULL,
  `reward` DECIMAL(12,2) NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX (`uid`),
  CONSTRAINT `fk_quiz_attempts_user` FOREIGN KEY (`uid`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_quiz_attempts_question` FOREIGN KEY (`question_id`) REFERENCES `quiz_questions`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `withdrawals` (
  `id` CHAR(36) NOT NULL PRIMARY KEY,
  `uid` CHAR(36) NOT NULL,
  `amount` DECIMAL(12,2) NOT NULL,
  `status` ENUM('pending','completed','failed') NOT NULL DEFAULT 'pending',
  `requested_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NULL,
  INDEX (`uid`),
  CONSTRAINT `fk_withdrawals_user` FOREIGN KEY (`uid`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `settings` (`id`, `welcome_bonus`, `daily_quiz_reward`, `min_withdraw`, `ref_rate_l1`, `ref_rate_l2`, `ref_rate_l3`) VALUES
(1, 10.00, 30.00, 200.00, 0.1000, 0.0500, 0.0200)
ON DUPLICATE KEY UPDATE `welcome_bonus` = VALUES(`welcome_bonus`), `daily_quiz_reward` = VALUES(`daily_quiz_reward`), `min_withdraw` = VALUES(`min_withdraw`), `ref_rate_l1` = VALUES(`ref_rate_l1`), `ref_rate_l2` = VALUES(`ref_rate_l2`), `ref_rate_l3` = VALUES(`ref_rate_l3`);

INSERT INTO `vip_config` (`tier_name`, `min_monthly_deposit`, `reward_multiplier`, `benefits`) VALUES
('Bronze', 500.00, 1.00, 'Access to basic offers and quiz bonuses.'),
('Silver', 1500.00, 1.10, 'Higher referral level 1 reward and extra bonus offers.'),
('Gold', 5000.00, 1.25, 'Higher quiz rewards and fast withdrawal priority.'),
('Platinum', 15000.00, 1.50, 'Exclusive mission rewards and VIP support.')
ON DUPLICATE KEY UPDATE `min_monthly_deposit` = VALUES(`min_monthly_deposit`), `reward_multiplier` = VALUES(`reward_multiplier`), `benefits` = VALUES(`benefits`);

INSERT INTO `tasks` (`id`, `title`, `description`, `reward`, `task_type`, `target_url`) VALUES
('00000000-0000-0000-0000-000000000001', 'Daily Survey', 'Answer a quick survey to earn credits.', 15.00, 'survey', '/quiz/'),
('00000000-0000-0000-0000-000000000002', 'Invite a Friend', 'Share your referral code and earn bonus points.', 25.00, 'referral', '/settings/'),
('00000000-0000-0000-0000-000000000003', 'Complete Profile', 'Finish your profile to unlock your wallet.', 10.00, 'mission', '/complete-profile/')
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`), `description` = VALUES(`description`), `reward` = VALUES(`reward`), `task_type` = VALUES(`task_type`), `target_url` = VALUES(`target_url`);

INSERT INTO `quiz_questions` (`id`, `category`, `question`, `options`, `correct_index`, `explanation`) VALUES
('00000000-0000-0000-0000-000000000011', 'GENERAL', 'Which of the following is the capital of Pakistan?', JSON_ARRAY('Lahore', 'Islamabad', 'Karachi', 'Peshawar'), 1, 'Islamabad is the federal capital.'),
('00000000-0000-0000-0000-000000000012', 'ISLAMIC', 'How many times a day do Muslims pray?', JSON_ARRAY('3', '4', '5', '6'), 2, 'Muslims pray five times daily.'),
('00000000-0000-0000-0000-000000000013', 'PAKISTAN', 'Which river is the longest in Pakistan?', JSON_ARRAY('Chenab', 'Jhelum', 'Indus', 'Ravi'), 2, 'The Indus River is the longest.'),
('00000000-0000-0000-0000-000000000014', 'ADAB', 'What is the proper greeting in Urdu for a gathering?', JSON_ARRAY('Hello', 'Salam Alaikum', 'Goodbye', 'Thank you'), 1, 'Salam Alaikum is the respectful greeting.');

INSERT INTO `users` (`id`, `email`, `password_hash`, `full_name`, `display_name`, `username`, `phone`, `city`, `gender`, `level`, `xp`, `streak`, `balance`, `total_earned`, `pending`, `referral_code`, `referred_by`, `role`, `is_admin`, `status`, `joined_at`, `last_active_at`, `created_at`, `avatar_url`) VALUES
('00000000-0000-0000-0000-000000000999', 'admin@example.com', '$2b$12$avRbHindR1NN35bLVWBIruW/L61lvfTD24FxdjsL1NmeB21rLx6UC', 'Site Admin', 'Admin', 'admin', NULL, NULL, 'male', 1, 0, 0, 1000.00, 1000.00, 0.00, 'ADMIN0001', NULL, 'ADMIN', 1, 'ACTIVE', NOW(), NOW(), NOW(), NULL)
ON DUPLICATE KEY UPDATE `email` = VALUES(`email`);
