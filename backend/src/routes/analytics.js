const express = require('express');
const router = express.Router();
const db = require('../models/database');

// Get dashboard summary statistics
router.get('/summary', (req, res) => {
  const queries = {
    total_reworks: 'SELECT COUNT(*) as count FROM rework_records',
    open_reworks: "SELECT COUNT(*) as count FROM rework_records WHERE status = 'open'",
    resolved_reworks: "SELECT COUNT(*) as count FROM rework_records WHERE status = 'resolved'",
    pending_actions: "SELECT COUNT(*) as count FROM corrective_actions WHERE status = 'pending'",
    total_patterns: 'SELECT COUNT(*) as count FROM defect_patterns',
    high_severity: "SELECT COUNT(*) as count FROM rework_records WHERE severity = 'high' OR severity = 'critical'"
  };

  const results = {};
  let completed = 0;
  const total = Object.keys(queries).length;

  Object.entries(queries).forEach(([key, query]) => {
    db.get(query, [], (err, row) => {
      if (err) {
        results[key] = 0;
      } else {
        results[key] = row.count;
      }
      completed++;
      if (completed === total) {
        res.json(results);
      }
    });
  });
});

// Get defect trends by type
router.get('/defect-trends', (req, res) => {
  const query = `
    SELECT 
      defect_type,
      COUNT(*) as count,
      severity
    FROM rework_records
    GROUP BY defect_type, severity
    ORDER BY count DESC
  `;

  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Get risk heat map data (station vs defect type)
router.get('/heat-map', (req, res) => {
  const query = `
    SELECT 
      station,
      defect_type,
      COUNT(*) as count,
      severity
    FROM rework_records
    GROUP BY station, defect_type, severity
    ORDER BY count DESC
  `;

  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    // Transform data for heat map
    const heatMapData = {};
    rows.forEach(row => {
      if (!heatMapData[row.station]) {
        heatMapData[row.station] = {};
      }
      if (!heatMapData[row.station][row.defect_type]) {
        heatMapData[row.station][row.defect_type] = {
          count: 0,
          severity: row.severity
        };
      }
      heatMapData[row.station][row.defect_type].count += row.count;
    });

    res.json(heatMapData);
  });
});

// Get recurring defects
router.get('/recurring-defects', (req, res) => {
  const query = `
    SELECT 
      defect_type,
      COUNT(*) as occurrence_count,
      GROUP_CONCAT(DISTINCT station) as stations,
      MIN(date_detected) as first_occurrence,
      MAX(date_detected) as last_occurrence,
      severity
    FROM rework_records
    GROUP BY defect_type
    HAVING COUNT(*) >= 2
    ORDER BY occurrence_count DESC
    LIMIT 20
  `;

  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Get time series data for charts
router.get('/time-series', (req, res) => {
  const { days = 30 } = req.query;
  const query = `
    SELECT 
      DATE(date_detected) as date,
      COUNT(*) as count,
      severity
    FROM rework_records
    WHERE date_detected >= DATE('now', '-${parseInt(days)} days')
    GROUP BY DATE(date_detected), severity
    ORDER BY date DESC
  `;

  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Get top stations by defect count
router.get('/top-stations', (req, res) => {
  const query = `
    SELECT 
      station,
      COUNT(*) as defect_count,
      COUNT(CASE WHEN severity = 'high' OR severity = 'critical' THEN 1 END) as high_severity_count
    FROM rework_records
    GROUP BY station
    ORDER BY defect_count DESC
    LIMIT 10
  `;

  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

module.exports = router;
