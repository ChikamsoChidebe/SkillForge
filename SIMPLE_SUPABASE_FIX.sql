-- Simple Supabase Schema Fix
-- Run this in Supabase SQL Editor

-- Drop existing tables and recreate with correct structure
DROP TABLE IF EXISTS entries;
DROP TABLE IF EXISTS users;

-- Create users table with correct structure
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  fullName TEXT,
  avatar TEXT,
  createdAt TIMESTAMP DEFAULT NOW(),
  totalEntries INTEGER DEFAULT 0,
  totalBadges INTEGER DEFAULT 0,
  learningStreak INTEGER DEFAULT 0,
  lastEntryDate TIMESTAMP,
  preferences JSONB DEFAULT '{"theme": "system", "notifications": true, "publicProfile": true}'
);

-- Create entries table with correct structure
CREATE TABLE entries (
  id TEXT PRIMARY KEY,
  userId TEXT REFERENCES users(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  date DATE NOT NULL,
  createdAt TIMESTAMP DEFAULT NOW(),
  transactionId TEXT,
  blockchainStatus TEXT
);

-- Add indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_entries_userId ON entries(userId);