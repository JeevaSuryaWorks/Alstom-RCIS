const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./models/database');

const reworkRoutes = require('./routes/rework');
const rootCauseRoutes = require('./routes/rootCause');
const correctiveActionRoutes = require('./routes/correctiveAction');
const analyticsRoutes = require('./routes/analytics');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/rework', reworkRoutes);
app.use('/api/root-cause', rootCauseRoutes);
app.use('/api/corrective-action', correctiveActionRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Alstom RCIS Backend is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Alstom RCIS Backend running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;
