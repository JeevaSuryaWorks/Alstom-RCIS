import React, { useState, useEffect } from 'react';
import { analyticsAPI } from '../services/api';

function RecurringDefects() {
  const [defects, setDefects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecurringDefects();
  }, []);

  const fetchRecurringDefects = async () => {
    try {
      const response = await analyticsAPI.getRecurringDefects();
      setDefects(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching recurring defects:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading recurring defects...</div>;
  }

  return (
    <div>
      <h1 className="page-title">Recurring Defects</h1>

      <div className="card">
        <h2 className="card-title">Frequently Occurring Defects</h2>
        <p style={{ color: '#b0b0b0', marginBottom: '1.5rem' }}>
          Defects that have occurred 2 or more times, indicating potential systematic issues.
        </p>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Defect Type</th>
                <th>Occurrences</th>
                <th>Severity</th>
                <th>Affected Stations</th>
                <th>First Occurrence</th>
                <th>Last Occurrence</th>
                <th>Risk Level</th>
              </tr>
            </thead>
            <tbody>
              {defects.map((defect, index) => (
                <tr key={index}>
                  <td><strong>{defect.defect_type}</strong></td>
                  <td>
                    <span className={`badge ${defect.occurrence_count >= 5 ? 'danger' : 'warning'}`}>
                      {defect.occurrence_count}
                    </span>
                  </td>
                  <td><span className={`badge ${defect.severity}`}>{defect.severity}</span></td>
                  <td>{defect.stations}</td>
                  <td>{new Date(defect.first_occurrence).toLocaleDateString()}</td>
                  <td>{new Date(defect.last_occurrence).toLocaleDateString()}</td>
                  <td>
                    <span className={`badge ${defect.occurrence_count >= 5 ? 'critical' : 'high'}`}>
                      {defect.occurrence_count >= 5 ? 'HIGH' : 'MEDIUM'}
                    </span>
                  </td>
                </tr>
              ))}
              {defects.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>
                    <div className="empty-state">
                      <div className="empty-state-icon">⚠️</div>
                      <div className="empty-state-text">No recurring defects detected</div>
                      <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                        This is good news! No defects have occurred multiple times.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {defects.length > 0 && (
        <div className="card">
          <h2 className="card-title">Insights & Recommendations</h2>
          <div style={{ padding: '1rem', background: '#2a2a2a', borderRadius: '6px', borderLeft: '4px solid #f97316' }}>
            <p style={{ marginBottom: '0.75rem', color: '#f97316', fontWeight: 600 }}>⚠️ Attention Required</p>
            <ul style={{ paddingLeft: '1.5rem', color: '#b0b0b0', lineHeight: '1.8' }}>
              <li>
                <strong>{defects.length}</strong> defect patterns are recurring and require root cause investigation
              </li>
              <li>
                Consider implementing preventive measures at affected stations
              </li>
              <li>
                Review operator training and process documentation for high-frequency defects
              </li>
              <li>
                Schedule maintenance checks for equipment at affected stations
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default RecurringDefects;
