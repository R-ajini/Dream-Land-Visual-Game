const express = require('express');
const cors = require('cors');
const config = require('./config');

const app = express();

// ── Middleware ──
app.use(cors({
  origin: config.clientUrl,
  credentials: true,
}));
app.use(express.json());

// ── Health Check ──
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Dream Island API is running 🏝️',
    timestamp: new Date().toISOString(),
  });
});

// ── Routes (will be added in Phase 4) ──
// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/player', require('./routes/player'));
// app.use('/api/game', require('./routes/game'));
// app.use('/api/missions', require('./routes/missions'));
// app.use('/api/achievements', require('./routes/achievements'));
// app.use('/api/leaderboard', require('./routes/leaderboard'));

// ── 404 Handler ──
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ── Error Handler ──
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: config.nodeEnv === 'development' ? err.message : 'Internal server error',
  });
});

// ── Start Server ──
app.listen(config.port, () => {
  console.log(`\n🏝️  Dream Island API running on port ${config.port}`);
  console.log(`   Environment: ${config.nodeEnv}`);
  console.log(`   Health: http://localhost:${config.port}/api/health\n`);
});
