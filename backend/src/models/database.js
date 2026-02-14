const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../../data/rcis.db');
const db = new sqlite3.Database(dbPath);

// Initialize database schema
db.serialize(() => {
  // Rework Records table
  db.run(`CREATE TABLE IF NOT EXISTS rework_records (
    id TEXT PRIMARY KEY,
    module_id TEXT NOT NULL,
    line_number TEXT NOT NULL,
    defect_type TEXT NOT NULL,
    defect_description TEXT,
    severity TEXT NOT NULL,
    station TEXT NOT NULL,
    operator_id TEXT,
    date_detected TEXT NOT NULL,
    date_resolved TEXT,
    status TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )`);

  // Root Causes table
  db.run(`CREATE TABLE IF NOT EXISTS root_causes (
    id TEXT PRIMARY KEY,
    rework_id TEXT NOT NULL,
    category TEXT NOT NULL,
    cause_description TEXT NOT NULL,
    confidence_level REAL,
    frequency_count INTEGER DEFAULT 1,
    created_at TEXT NOT NULL,
    FOREIGN KEY (rework_id) REFERENCES rework_records(id)
  )`);

  // Corrective Actions table
  db.run(`CREATE TABLE IF NOT EXISTS corrective_actions (
    id TEXT PRIMARY KEY,
    rework_id TEXT NOT NULL,
    action_type TEXT NOT NULL,
    action_description TEXT NOT NULL,
    assigned_to TEXT,
    priority TEXT NOT NULL,
    status TEXT NOT NULL,
    due_date TEXT,
    completed_date TEXT,
    effectiveness_rating INTEGER,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (rework_id) REFERENCES rework_records(id)
  )`);

  // Defect Patterns table (for recurring defects tracking)
  db.run(`CREATE TABLE IF NOT EXISTS defect_patterns (
    id TEXT PRIMARY KEY,
    defect_type TEXT NOT NULL,
    pattern_signature TEXT NOT NULL,
    occurrence_count INTEGER DEFAULT 1,
    first_occurrence TEXT NOT NULL,
    last_occurrence TEXT NOT NULL,
    stations TEXT,
    risk_level TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )`);

  // Knowledge Base entries
  db.run(`CREATE TABLE IF NOT EXISTS knowledge_base (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    content TEXT NOT NULL,
    related_defects TEXT,
    tags TEXT,
    author TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )`);

  console.log('Database schema initialized successfully');
});

module.exports = db;
