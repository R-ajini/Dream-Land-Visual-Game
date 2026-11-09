-- ============================================
-- DREAM ISLAND — Database Schema
-- PostgreSQL
-- ============================================

-- Drop tables if they exist (for fresh setup)
DROP TABLE IF EXISTS discovered_locations CASCADE;
DROP TABLE IF EXISTS player_achievements CASCADE;
DROP TABLE IF EXISTS player_collectibles CASCADE;
DROP TABLE IF EXISTS player_missions CASCADE;
DROP TABLE IF EXISTS collectible_spawns CASCADE;
DROP TABLE IF EXISTS collectibles CASCADE;
DROP TABLE IF EXISTS achievements CASCADE;
DROP TABLE IF EXISTS missions CASCADE;
DROP TABLE IF EXISTS player_profiles CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ── Users ──
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);

-- ── Player Profiles ──
CREATE TABLE player_profiles (
    profile_id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    character_type VARCHAR(20) DEFAULT 'girl',
    character_name VARCHAR(50) DEFAULT 'Explorer',
    hair_style VARCHAR(30) DEFAULT 'short',
    hair_colour VARCHAR(30) DEFAULT 'brown',
    outfit VARCHAR(30) DEFAULT 'explorer',
    outfit_colour VARCHAR(30) DEFAULT 'turquoise',
    total_score INTEGER DEFAULT 0,
    current_level INTEGER DEFAULT 1
);

-- ── Missions ──
CREATE TABLE missions (
    mission_id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    target_quantity INTEGER DEFAULT 1,
    reward_points INTEGER DEFAULT 0
);

-- ── Player Missions ──
CREATE TABLE player_missions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    mission_id INTEGER NOT NULL REFERENCES missions(mission_id) ON DELETE CASCADE,
    current_progress INTEGER DEFAULT 0,
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP,
    UNIQUE(user_id, mission_id)
);

-- ── Collectibles (item definitions) ──
CREATE TABLE collectibles (
    collectible_id SERIAL PRIMARY KEY,
    item_name VARCHAR(100) NOT NULL,
    item_type VARCHAR(50) NOT NULL,  -- coin, seashell, gem, treasure_chest, special
    description TEXT,
    points INTEGER DEFAULT 0
);

-- ── Collectible Spawns (individual instances on the island) ──
CREATE TABLE collectible_spawns (
    spawn_id SERIAL PRIMARY KEY,
    collectible_id INTEGER NOT NULL REFERENCES collectibles(collectible_id) ON DELETE CASCADE,
    location_name VARCHAR(100),
    pos_x FLOAT DEFAULT 0,
    pos_y FLOAT DEFAULT 0,
    pos_z FLOAT DEFAULT 0
);

-- ── Player Collectibles (tracks which spawns a player has collected) ──
CREATE TABLE player_collectibles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    spawn_id INTEGER NOT NULL REFERENCES collectible_spawns(spawn_id) ON DELETE CASCADE,
    collected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, spawn_id)
);

-- ── Achievements ──
CREATE TABLE achievements (
    achievement_id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    badge_image VARCHAR(255) DEFAULT '',
    required_condition VARCHAR(255)
);

-- ── Player Achievements ──
CREATE TABLE player_achievements (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    achievement_id INTEGER NOT NULL REFERENCES achievements(achievement_id) ON DELETE CASCADE,
    unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, achievement_id)
);

-- ── Discovered Locations ──
CREATE TABLE discovered_locations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    location_name VARCHAR(100) NOT NULL,
    discovered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, location_name)
);
