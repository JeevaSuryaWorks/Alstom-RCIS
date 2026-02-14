import React, { useState, useEffect } from 'react';
import { rootCauseAPI } from '../services/api';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = ['#3b82f6', '#ef4444', '#22c55e', '#f97316', '#a855f7', '#06b6d4'];

function RootCauseAnalysis() {
  const [patterns, setPatterns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPatterns();
  }, []);

  const fetchPatterns = async () => {
    try {
      const response = await rootCauseAPI.getPatterns();
      setPatterns(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching root cause patterns:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading root cause analysis...</div>;
  }

  return (
    <div>
      <h1 className="page-title">Root Cause Analysis</h1>

      <div className="card">
        <h2 className="card-title">Root Cause Distribution</h2>
        {patterns.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={patterns}
                dataKey="count"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={120}
                label
              >
                {patterns.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1e1e1e', border: '1px solid #3b82f6' }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <div className="empty-state-text">No root cause patterns found</div>
          </div>
        )}
      </div>

      <div className="card">
        <h2 className="card-title">Root Cause Categories</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th>Occurrence Count</th>
                <th>Average Confidence</th>
              </tr>
            </thead>
            <tbody>
              {patterns.map((pattern, index) => (
                <tr key={index}>
                  <td><strong>{pattern.category}</strong></td>
                  <td>{pattern.count}</td>
                  <td>{(pattern.avg_confidence * 100).toFixed(1)}%</td>
                </tr>
              ))}
              {patterns.length === 0 && (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center', padding: '2rem' }}>
                    <div className="empty-state">
                      <div className="empty-state-icon">🔍</div>
                      <div className="empty-state-text">No patterns detected yet</div>
                    </div>
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

export default RootCauseAnalysis;
