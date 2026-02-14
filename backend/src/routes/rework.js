const express = require('express');
const router = express.Router();
const db = require('../models/database');
const { v4: uuidv4 } = require('uuid');

// Get all rework records
router.get('/', (req, res) => {
  const { status, severity, limit = 100 } = req.query;
  let query = 'SELECT * FROM rework_records';
  const params = [];

  if (status || severity) {
    query += ' WHERE';
    if (status) {
      query += ' status = ?';
      params.push(status);
    }
    if (severity) {
      query += (status ? ' AND' : '') + ' severity = ?';
      params.push(severity);
    }
  }

  query += ' ORDER BY created_at DESC LIMIT ?';
  params.push(parseInt(limit));

  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Get single rework record
router.get('/:id', (req, res) => {
  db.get('SELECT * FROM rework_records WHERE id = ?', [req.params.id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Rework record not found' });
    }
    res.json(row);
  });
});

// Create new rework record
router.post('/', (req, res) => {
  const {
    module_id,
    line_number,
    defect_type,
    defect_description,
    severity,
    station,
    operator_id,
    date_detected
  } = req.body;

  if (!module_id || !line_number || !defect_type || !severity || !station || !date_detected) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const id = uuidv4();
  const now = new Date().toISOString();
  const status = 'open';

  const query = `INSERT INTO rework_records 
    (id, module_id, line_number, defect_type, defect_description, severity, station, operator_id, date_detected, status, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.run(query, [id, module_id, line_number, defect_type, defect_description, severity, station, operator_id, date_detected, status, now, now], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id, message: 'Rework record created successfully' });
  });
});

// Update rework record
router.put('/:id', (req, res) => {
  const { status, date_resolved } = req.body;
  const now = new Date().toISOString();

  db.run(
    'UPDATE rework_records SET status = ?, date_resolved = ?, updated_at = ? WHERE id = ?',
    [status, date_resolved, now, req.params.id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Rework record not found' });
      }
      res.json({ message: 'Rework record updated successfully' });
    }
  );
});

// Delete rework record
router.delete('/:id', (req, res) => {
  db.run('DELETE FROM rework_records WHERE id = ?', [req.params.id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Rework record not found' });
    }
    res.json({ message: 'Rework record deleted successfully' });
  });
});

module.exports = router;
