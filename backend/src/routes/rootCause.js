const express = require('express');
const router = express.Router();
const db = require('../models/database');
const { v4: uuidv4 } = require('uuid');

// Get all root causes
router.get('/', (req, res) => {
  const { rework_id, category } = req.query;
  let query = 'SELECT * FROM root_causes';
  const params = [];

  if (rework_id || category) {
    query += ' WHERE';
    if (rework_id) {
      query += ' rework_id = ?';
      params.push(rework_id);
    }
    if (category) {
      query += (rework_id ? ' AND' : '') + ' category = ?';
      params.push(category);
    }
  }

  query += ' ORDER BY created_at DESC';

  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Get root cause patterns (aggregated)
router.get('/patterns', (req, res) => {
  const query = `
    SELECT 
      category,
      COUNT(*) as count,
      AVG(confidence_level) as avg_confidence,
      GROUP_CONCAT(DISTINCT cause_description) as descriptions
    FROM root_causes
    GROUP BY category
    ORDER BY count DESC
  `;

  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Create new root cause
router.post('/', (req, res) => {
  const { rework_id, category, cause_description, confidence_level } = req.body;

  if (!rework_id || !category || !cause_description) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const id = uuidv4();
  const now = new Date().toISOString();

  const query = `INSERT INTO root_causes 
    (id, rework_id, category, cause_description, confidence_level, created_at)
    VALUES (?, ?, ?, ?, ?, ?)`;

  db.run(query, [id, rework_id, category, cause_description, confidence_level || 0.5, now], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id, message: 'Root cause created successfully' });
  });
});

module.exports = router;
