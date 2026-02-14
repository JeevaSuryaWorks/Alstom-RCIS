import React, { useState, useEffect } from 'react';
import { analyticsAPI } from '../services/api';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [defectTrends, setDefectTrends] = useState([]);
  const [timeSeries, setTimeSeries] = useState([]);
  const [topStations, setTopStations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [summaryRes, trendsRes, timeSeriesRes, stationsRes] = await Promise.all([
        analyticsAPI.getSummary(),
        analyticsAPI.getDefectTrends(),
        analyticsAPI.getTimeSeries(30),
        analyticsAPI.getTopStations(),
      ]);

      setSummary(summaryRes.data);
      setDefectTrends(trendsRes.data);
      setTimeSeries(timeSeriesRes.data);
      setTopStations(stationsRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div>
      <h1 className="page-title">Dashboard Overview</h1>

      {/* Summary Statistics */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Reworks</div>
          <div className="stat-value">{summary?.total_reworks || 0}</div>
        </div>
        <div className="stat-card warning">
          <div className="stat-label">Open Cases</div>
          <div className="stat-value">{summary?.open_reworks || 0}</div>
        </div>
        <div className="stat-card success">
          <div className="stat-label">Resolved</div>
          <div className="stat-value">{summary?.resolved_reworks || 0}</div>
        </div>
        <div className="stat-card danger">
          <div className="stat-label">High Severity</div>
          <div className="stat-value">{summary?.high_severity || 0}</div>
        </div>
        <div className="stat-card warning">
          <div className="stat-label">Pending Actions</div>
          <div className="stat-value">{summary?.pending_actions || 0}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Defect Patterns</div>
          <div className="stat-value">{summary?.total_patterns || 0}</div>
        </div>
      </div>

      {/* Defect Trends */}
      <div className="card">
        <h2 className="card-title">Defect Distribution by Type</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={defectTrends}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
            <XAxis dataKey="defect_type" stroke="#b0b0b0" />
            <YAxis stroke="#b0b0b0" />
            <Tooltip contentStyle={{ backgroundColor: '#1e1e1e', border: '1px solid #3b82f6' }} />
            <Legend />
            <Bar dataKey="count" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top Stations */}
      <div className="card">
        <h2 className="card-title">Top Stations by Defect Count</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Station</th>
                <th>Total Defects</th>
                <th>High Severity</th>
              </tr>
            </thead>
            <tbody>
              {topStations.map((station, index) => (
                <tr key={index}>
                  <td><strong>{station.station}</strong></td>
                  <td>{station.defect_count}</td>
                  <td>
                    <span className="badge danger">{station.high_severity_count}</span>
                  </td>
                </tr>
              ))}
              {topStations.length === 0 && (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center', color: '#6b7280' }}>
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
