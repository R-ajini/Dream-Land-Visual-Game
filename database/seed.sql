-- ============================================
-- DREAM ISLAND — Seed Data
-- ============================================

-- ── Missions ──
INSERT INTO missions (title, description, target_quantity, reward_points) VALUES
  ('Beach Explorer', 'Find five seashells along the shore.', 5, 50),
  ('Treasure Hunter', 'Discover three treasure chests hidden around the island.', 3, 100),
  ('Forest Explorer', 'Find five hidden objects deep in the forest.', 5, 75),
  ('Waterfall Discovery', 'Reach the hidden waterfall in the jungle.', 1, 100),
  ('Mountain Explorer', 'Climb to the mountain viewpoint.', 1, 150);

-- ── Collectibles (item definitions) ──
INSERT INTO collectibles (item_name, item_type, description, points) VALUES
  ('Gold Coin', 'coin', 'A shiny gold coin washed ashore.', 5),
  ('Silver Coin', 'coin', 'A small silver coin found in the sand.', 5),
  ('Pink Seashell', 'seashell', 'A beautiful pink spiral shell.', 10),
  ('Conch Shell', 'seashell', 'A large conch shell that echoes the ocean.', 10),
  ('Starfish Shell', 'seashell', 'A delicate starfish-shaped shell.', 10),
  ('Emerald Gem', 'gem', 'A sparkling green emerald.', 20),
  ('Ruby Gem', 'gem', 'A fiery red ruby.', 20),
  ('Sapphire Gem', 'gem', 'A deep blue sapphire.', 20),
  ('Beach Treasure Chest', 'treasure_chest', 'A wooden chest buried in the sand.', 50),
  ('Forest Treasure Chest', 'treasure_chest', 'An ancient chest hidden among the trees.', 50),
  ('Cave Treasure Chest', 'treasure_chest', 'A glowing chest deep inside the crystal cave.', 50),
  ('Golden Compass', 'special', 'A mysterious golden compass that always points to adventure.', 30),
  ('Ancient Map Fragment', 'special', 'A torn piece of an ancient island map.', 30);

-- ── Achievements ──
INSERT INTO achievements (title, description, badge_image, required_condition) VALUES
  ('First Adventure', 'Enter the island for the first time.', '🏝️', 'first_login'),
  ('Treasure Beginner', 'Collect your first treasure.', '💰', 'collect_first'),
  ('Shell Collector', 'Collect ten seashells.', '🐚', 'shells_10'),
  ('Explorer', 'Discover three island locations.', '🗺️', 'locations_3'),
  ('Mission Master', 'Complete five missions.', '⭐', 'missions_5'),
  ('Island Champion', 'Reach a score of 500 points.', '🏆', 'score_500');

-- ── Collectible Spawns (positions on the island — will align with 3D scene in Phase 2) ──
-- Beach area
INSERT INTO collectible_spawns (collectible_id, location_name, pos_x, pos_y, pos_z) VALUES
  (1, 'Sunny Beach', 15, 0.5, 10),
  (1, 'Sunny Beach', 20, 0.5, 8),
  (2, 'Sunny Beach', 12, 0.5, 15),
  (3, 'Sunny Beach', 18, 0.5, 12),
  (4, 'Sunny Beach', 25, 0.5, 5),
  (5, 'Sunny Beach', 22, 0.5, 14);

-- Forest area
INSERT INTO collectible_spawns (collectible_id, location_name, pos_x, pos_y, pos_z) VALUES
  (1, 'Treasure Forest', -15, 0.5, -10),
  (6, 'Treasure Forest', -20, 0.5, -5),
  (10, 'Treasure Forest', -18, 0.5, -15),
  (12, 'Treasure Forest', -22, 0.5, -8),
  (13, 'Treasure Forest', -12, 0.5, -20);

-- Cave area
INSERT INTO collectible_spawns (collectible_id, location_name, pos_x, pos_y, pos_z) VALUES
  (7, 'Crystal Cave', 0, 0.5, -30),
  (8, 'Crystal Cave', 3, 0.5, -32),
  (11, 'Crystal Cave', -2, 0.5, -28);

-- Flower Garden
INSERT INTO collectible_spawns (collectible_id, location_name, pos_x, pos_y, pos_z) VALUES
  (1, 'Flower Garden', 30, 0.5, 0),
  (3, 'Flower Garden', 28, 0.5, -3),
  (6, 'Flower Garden', 32, 0.5, 5);

-- Mountain / Waterfall
INSERT INTO collectible_spawns (collectible_id, location_name, pos_x, pos_y, pos_z) VALUES
  (9, 'Hidden Waterfall', -5, 3, 25),
  (7, 'Mountain Viewpoint', 0, 8, -10);
