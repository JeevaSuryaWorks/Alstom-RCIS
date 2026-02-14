import React, { useState, useEffect } from 'react';
import { analyticsAPI } from '../services/api';

function RiskHeatMap() {
  const [heatMapData, setHeatMapData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHeatMapData();
  }, []);

  const fetchHeatMapData = async () => {
    try {
      const response = await analyticsAPI.getHeatMap();
      setHeatMapData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching heat map data:', error);
      setLoading(false);
    }
  };

  const getRiskLevel = (count) => {
    if (count >= 10) return 'high-risk';
    if (count >= 5) return 'medium-risk';
    return 'low-risk';
  };

  const getRiskLabel = (count) => {
    if (count >= 10) return 'High Risk';
    if (count >= 5) return 'Medium Risk';
    return 'Low Risk';
  };

  if (loading) {
    return <div className="loading">Loading risk heat map...</div>;
  }

  const stations = Object.keys(heatMapData);
  const allDefectTypes = [...new Set(
    stations.flatMap(station => Object.keys(heatMapData[station]))
  )];

  return (
    <div>
      <h1 className="page-title">Risk Heat Map</h1>

      <div className="card">
        <h2 className="card-title">Station vs Defect Type Analysis</h2>
        <p style={{ color: '#b0b0b0', marginBottom: '1.5rem' }}>
          Visual representation of defect concentration across stations and types. Darker colors indicate higher risk areas.
        </p>

        {stations.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ minWidth: '800px' }}>
              <thead>
                <tr>
                  <th style={{ position: 'sticky', left: 0, background: '#2a2a2a', zIndex: 1 }}>Station</th>
                  {allDefectTypes.map((type, idx) => (
                    <th key={idx}>{type}</th>
                  ))}
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {stations.map((station, idx) => {
                  const total = Object.values(heatMapData[station]).reduce(
                    (sum, data) => sum + data.count,
                    0
                  );
                  return (
                    <tr key={idx}>
                      <td style={{ position: 'sticky', left: 0, background: '#1e1e1e', zIndex: 1 }}>
                        <strong>{station}</strong>
                      </td>
                      {allDefectTypes.map((type, typeIdx) => {
                        const data = heatMapData[station][type];
                        const count = data ? data.count : 0;
                        const riskLevel = getRiskLevel(count);
                        return (
                          <td key={typeIdx}>
                            {count > 0 ? (
                              <div
                                className={`heat-cell ${riskLevel}`}
                                style={{ padding: '0.5rem', borderRadius: '4px' }}
                              >
                                {count}
                              </div>
                            ) : (
                              <span style={{ color: '#6b7280' }}>-</span>
                            )}
                          </td>
                        );
                      })}
                      <td>
                        <strong className={`badge ${getRiskLevel(total)}`}>
                          {total}
                        </strong>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">🔥</div>
            <div className="empty-state-text">No heat map data available</div>
            <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
              Add rework records to generate heat map analysis
            </p>
          </div>
        )}
      </div>

      {stations.length > 0 && (
        <div className="card">
          <h2 className="card-title">Risk Level Legend</h2>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div className="heat-cell low-risk" style={{ padding: '0.5rem 1rem' }}>1-4</div>
              <span style={{ color: '#b0b0b0' }}>Low Risk</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div className="heat-cell medium-risk" style={{ padding: '0.5rem 1rem' }}>5-9</div>
              <span style={{ color: '#b0b0b0' }}>Medium Risk</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div className="heat-cell high-risk" style={{ padding: '0.5rem 1rem' }}>10+</div>
              <span style={{ color: '#b0b0b0' }}>High Risk</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RiskHeatMap;
