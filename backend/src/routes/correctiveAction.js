const express = require('express');
const router = express.Router();
const db = require('../models/database');
const { v4: uuidv4 } = require('uuid');

// Get all corrective actions
router.get('/', (req, res) => {
  const { rework_id, status, priority } = req.query;
  let query = 'SELECT * FROM corrective_actions';
  const params = [];
  const conditions = [];

  if (rework_id) {
    conditions.push('rework_id = ?');
    params.push(rework_id);
  }
  if (status) {
    conditions.push('status = ?');
    params.push(status);
  }
  if (priority) {
    conditions.push('priority = ?');
    params.push(priority);
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  query += ' ORDER BY created_at DESC';

  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Create new corrective action
router.post('/', (req, res) => {
  const {
    rework_id,
    action_type,
    action_description,
    assigned_to,
    priority,
    due_date
  } = req.body;

  if (!rework_id || !action_type || !action_description || !priority) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const id = uuidv4();
  const now = new Date().toISOString();
  const status = 'pending';

  const query = `INSERT INTO corrective_actions 
    (id, rework_id, action_type, action_description, assigned_to, priority, status, due_date, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.run(query, [id, rework_id, action_type, action_description, assigned_to, priority, status, due_date, now, now], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id, message: 'Corrective action created successfully' });
  });
});

// Update corrective action
router.put('/:id', (req, res) => {
  const { status, completed_date, effectiveness_rating } = req.body;
  const now = new Date().toISOString();

  db.run(
    'UPDATE corrective_actions SET status = ?, completed_date = ?, effectiveness_rating = ?, updated_at = ? WHERE id = ?',
    [status, completed_date, effectiveness_rating, now, req.params.id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Corrective action not found' });
      }
      res.json({ message: 'Corrective action updated successfully' });
    }
  );
});

module.exports = router;
