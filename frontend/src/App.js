import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Dashboard from './pages/Dashboard';
import ReworkTracking from './pages/ReworkTracking';
import RootCauseAnalysis from './pages/RootCauseAnalysis';
import CorrectiveActions from './pages/CorrectiveActions';
import RecurringDefects from './pages/RecurringDefects';
import RiskHeatMap from './pages/RiskHeatMap';
import KnowledgeBase from './pages/KnowledgeBase';

function App() {
  return (
    <Router>
      <div className="app">
        <header className="app-header">
          <div className="header-content">
            <h1>⚡ Alstom RCIS</h1>
            <p className="subtitle">Power Module ESD Line Rework Intelligence System</p>
          </div>
        </header>
        
        <div className="app-container">
          <nav className="sidebar">
            <Link to="/" className="nav-link">
              <span className="nav-icon">📊</span>
              Dashboard
            </Link>
            <Link to="/rework" className="nav-link">
              <span className="nav-icon">🔧</span>
              Rework Tracking
            </Link>
            <Link to="/root-cause" className="nav-link">
              <span className="nav-icon">🔍</span>
              Root Cause Analysis
            </Link>
            <Link to="/corrective-actions" className="nav-link">
              <span className="nav-icon">✅</span>
              Corrective Actions
            </Link>
            <Link to="/recurring-defects" className="nav-link">
              <span className="nav-icon">⚠️</span>
              Recurring Defects
            </Link>
            <Link to="/heat-map" className="nav-link">
              <span className="nav-icon">🔥</span>
              Risk Heat Map
            </Link>
            <Link to="/knowledge-base" className="nav-link">
              <span className="nav-icon">📚</span>
              Knowledge Base
            </Link>
          </nav>

          <main className="main-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/rework" element={<ReworkTracking />} />
              <Route path="/root-cause" element={<RootCauseAnalysis />} />
              <Route path="/corrective-actions" element={<CorrectiveActions />} />
              <Route path="/recurring-defects" element={<RecurringDefects />} />
              <Route path="/heat-map" element={<RiskHeatMap />} />
              <Route path="/knowledge-base" element={<KnowledgeBase />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
