-- =========================================================
-- ENGLISH LEARNING APP
-- =========================================================

CREATE DATABASE IF NOT EXISTS english_app
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE english_app;

-- 1. USERS
CREATE TABLE users (
  id                BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  username          VARCHAR(32)  NOT NULL UNIQUE,
  email             VARCHAR(255) NOT NULL UNIQUE,
  password_hash     VARCHAR(255) NOT NULL,
  avatar_url        VARCHAR(500),
  role              ENUM('user', 'admin') NOT NULL DEFAULT 'user',
  status            ENUM('active', 'inactive', 'banned') NOT NULL DEFAULT 'active',
  -- Gamification
  level             INT UNSIGNED NOT NULL DEFAULT 1,
  xp                INT UNSIGNED NOT NULL DEFAULT 0,
  elo_rating        INT          NOT NULL DEFAULT 1200,
  streak_days       INT UNSIGNED NOT NULL DEFAULT 0,
  last_active_date  DATE,
  created_at        TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_elo (elo_rating DESC)
) ENGINE=InnoDB;

-- 2. FRIENDSHIPS
CREATE TABLE friendships (
  id             BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id        BIGINT UNSIGNED NOT NULL,
  friend_id      BIGINT UNSIGNED NOT NULL,
  action_user_id BIGINT UNSIGNED NOT NULL, -- Người gửi yêu cầu
  status         ENUM('pending','accepted','blocked') NOT NULL DEFAULT 'pending',
  created_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_friend_pair (user_id, friend_id),
  FOREIGN KEY (user_id)        REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (friend_id)      REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (action_user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_status (user_id, status),
  INDEX idx_friend_status (friend_id, status)
) ENGINE=InnoDB;

-- 3. DECKS
CREATE TABLE decks (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  owner_id      BIGINT UNSIGNED NULL, -- NULL = deck hệ thống
  title         VARCHAR(150) NOT NULL,
  description   VARCHAR(500),
  category      VARCHAR(50)  DEFAULT 'General', -- IELTS, TOEIC, Business...
  cover_image   VARCHAR(500),
  is_public     BOOLEAN NOT NULL DEFAULT TRUE,
  card_count    INT UNSIGNED NOT NULL DEFAULT 0,
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_public_category (is_public, category)
) ENGINE=InnoDB;

-- 4. FLASHCARDS
CREATE TABLE flashcards (
  id                  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  deck_id             BIGINT UNSIGNED NOT NULL,
  front_text          VARCHAR(255) NOT NULL,
  back_text           VARCHAR(255) NOT NULL,
  phonetic            VARCHAR(100),
  part_of_speech      VARCHAR(30),
  example_sentence    VARCHAR(500),
  example_translation VARCHAR(500),
  image_url           VARCHAR(500),
  audio_url           VARCHAR(500),
  difficulty          TINYINT UNSIGNED DEFAULT 1,
  order_index         INT UNSIGNED DEFAULT 0,
  created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (deck_id) REFERENCES decks(id) ON DELETE CASCADE,
  INDEX idx_deck_order (deck_id, order_index)
) ENGINE=InnoDB;

-- 5. USER_CARD_PROGRESS (SM-2 Algorithm)
CREATE TABLE user_card_progress (
  id                BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id           BIGINT UNSIGNED NOT NULL,
  flashcard_id      BIGINT UNSIGNED NOT NULL,
  easiness_factor   DECIMAL(4,2) NOT NULL DEFAULT 2.50,
  interval_days     INT UNSIGNED NOT NULL DEFAULT 0,
  repetitions       INT UNSIGNED NOT NULL DEFAULT 0,
  last_quality      TINYINT UNSIGNED,
  status            ENUM('new','learning','review','mastered') NOT NULL DEFAULT 'new',
  next_review_at    DATETIME,
  last_reviewed_at  DATETIME,
  created_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_user_card (user_id, flashcard_id),
  FOREIGN KEY (user_id)      REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (flashcard_id) REFERENCES flashcards(id) ON DELETE CASCADE,
  INDEX idx_due (user_id, next_review_at),
  INDEX idx_user_status (user_id, status)
) ENGINE=InnoDB;

-- 6. STUDY_SESSIONS
CREATE TABLE study_sessions (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id       BIGINT UNSIGNED NOT NULL,
  deck_id       BIGINT UNSIGNED NOT NULL,
  started_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ended_at      TIMESTAMP NULL,
  total_cards   INT UNSIGNED NOT NULL DEFAULT 0,
  correct_count INT UNSIGNED NOT NULL DEFAULT 0,
  xp_earned     INT UNSIGNED NOT NULL DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (deck_id) REFERENCES decks(id) ON DELETE CASCADE,
  INDEX idx_user_time (user_id, started_at)
) ENGINE=InnoDB;

-- 7. ROOMS
CREATE TABLE rooms (
  id                  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  room_code           VARCHAR(10) NOT NULL UNIQUE,
  host_id             BIGINT UNSIGNED NOT NULL,
  deck_id             BIGINT UNSIGNED NOT NULL,
  is_private          BOOLEAN NOT NULL DEFAULT TRUE,
  status              ENUM('waiting','in_progress','finished') NOT NULL DEFAULT 'waiting',
  max_players         TINYINT UNSIGNED NOT NULL DEFAULT 8,
  rounds_total        TINYINT UNSIGNED NOT NULL DEFAULT 10,
  time_per_round_sec  SMALLINT UNSIGNED NOT NULL DEFAULT 15,
  created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  started_at          TIMESTAMP NULL,
  ended_at            TIMESTAMP NULL,
  FOREIGN KEY (host_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (deck_id) REFERENCES decks(id) ON DELETE CASCADE,
  INDEX idx_status_private (status, is_private)
) ENGINE=InnoDB;

-- 8. ROOM_PLAYERS
CREATE TABLE room_players (
  id           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  room_id      BIGINT UNSIGNED NOT NULL,
  user_id      BIGINT UNSIGNED NOT NULL,
  joined_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  left_at      TIMESTAMP NULL,
  total_score  INT UNSIGNED NOT NULL DEFAULT 0,
  final_rank   TINYINT UNSIGNED,
  elo_before   INT NOT NULL,
  elo_after    INT,
  UNIQUE KEY uq_room_user (room_id, user_id),
  FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 9. ROOM_ROUNDS
CREATE TABLE room_rounds (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  room_id       BIGINT UNSIGNED NOT NULL,
  round_number  TINYINT UNSIGNED NOT NULL,
  flashcard_id  BIGINT UNSIGNED NOT NULL,
  started_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ended_at      TIMESTAMP NULL,
  UNIQUE KEY uq_room_round (room_id, round_number),
  FOREIGN KEY (room_id)      REFERENCES rooms(id) ON DELETE CASCADE,
  FOREIGN KEY (flashcard_id) REFERENCES flashcards(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 10. ROUND_ANSWERS
CREATE TABLE round_answers (
  id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  round_id        BIGINT UNSIGNED NOT NULL,
  user_id         BIGINT UNSIGNED NOT NULL,
  answer_text     VARCHAR(255),
  is_correct      BOOLEAN NOT NULL,
  answer_time_ms  INT UNSIGNED NOT NULL,
  points_earned   INT UNSIGNED NOT NULL DEFAULT 0,
  submitted_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_round_user (round_id, user_id),
  FOREIGN KEY (round_id) REFERENCES room_rounds(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id)  REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 11. ELO_HISTORY
CREATE TABLE elo_history (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id     BIGINT UNSIGNED NOT NULL,
  room_id     BIGINT UNSIGNED NOT NULL,
  elo_before  INT NOT NULL,
  elo_after   INT NOT NULL,
  delta       INT NOT NULL,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
  INDEX idx_user_history (user_id, created_at)
) ENGINE=InnoDB;

-- 12. BADGES & USER_BADGES
CREATE TABLE badges (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code         VARCHAR(50) NOT NULL UNIQUE,
  name         VARCHAR(100) NOT NULL,
  description  VARCHAR(255),
  icon_url     VARCHAR(500)
) ENGINE=InnoDB;

CREATE TABLE user_badges (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id     BIGINT UNSIGNED NOT NULL,
  badge_id    INT UNSIGNED NOT NULL,
  earned_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_user_badge (user_id, badge_id),
  FOREIGN KEY (user_id)  REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (badge_id) REFERENCES badges(id) ON DELETE CASCADE
) ENGINE=InnoDB;
