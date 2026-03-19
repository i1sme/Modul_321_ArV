-- Chat App Schema
-- Runs automatically on first container start

CREATE DATABASE IF NOT EXISTS chatdb
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE chatdb;

CREATE TABLE IF NOT EXISTS users (
  id         INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  username   VARCHAR(50)     NOT NULL UNIQUE,
  created_at DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS messages (
  id         INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  user_id    INT UNSIGNED    NOT NULL,
  room       VARCHAR(100)    NOT NULL DEFAULT 'general',
  content    TEXT            NOT NULL,
  created_at DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_room_created (room, created_at),
  CONSTRAINT fk_messages_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
