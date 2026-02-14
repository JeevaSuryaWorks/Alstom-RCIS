import React, { useState, useEffect } from 'react';
import { reworkAPI } from '../services/api';

function ReworkTracking() {
  const [reworks, setReworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    module_id: '',
    line_number: '',
    defect_type: '',
    defect_description: '',
    severity: 'medium',
    station: '',
    operator_id: '',
    date_detected: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    fetchReworks();
  }, []);

  const fetchReworks = async () => {
    try {
      const response = await reworkAPI.getAll({ limit: 50 });
      setReworks(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching reworks:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await reworkAPI.create(formData);
      setShowForm(false);
      setFormData({
        module_id: '',
        line_number: '',
        defect_type: '',
        defect_description: '',
        severity: 'medium',
        station: '',
        operator_id: '',
        date_detected: new Date().toISOString().split('T')[0],
      });
      fetchReworks();
    } catch (error) {
      console.error('Error creating rework:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleResolve = async (id) => {
    try {
      await reworkAPI.update(id, {
        status: 'resolved',
        date_resolved: new Date().toISOString(),
      });
      fetchReworks();
    } catch (error) {
      console.error('Error resolving rework:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading rework data...</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 className="page-title" style={{ marginBottom: 0 }}>Rework Tracking</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ New Rework'}
        </button>
      </div>

      {showForm && (
        <div className="card">
          <h2 className="card-title">Create New Rework Record</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Module ID *</label>
                <input
                  type="text"
                  name="module_id"
                  value={formData.module_id}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Line Number *</label>
                <input
                  type="text"
                  name="line_number"
                  value={formData.line_number}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Defect Type *</label>
                <select name="defect_type" value={formData.defect_type} onChange={handleChange} required>
                  <option value="">Select...</option>
                  <option value="Soldering">Soldering</option>
                  <option value="Component">Component</option>
                  <option value="Assembly">Assembly</option>
                  <option value="Testing">Testing</option>
                  <option value="PCB">PCB</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Severity *</label>
                <select name="severity" value={formData.severity} onChange={handleChange} required>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              <div className="form-group">
                <label>Station *</label>
                <input
                  type="text"
                  name="station"
                  value={formData.station}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Operator ID</label>
                <input
                  type="text"
                  name="operator_id"
                  value={formData.operator_id}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Date Detected *</label>
                <input
                  type="date"
                  name="date_detected"
                  value={formData.date_detected}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                name="defect_description"
                value={formData.defect_description}
                onChange={handleChange}
                rows="3"
              />
            </div>
            <button type="submit" className="btn btn-primary">Create Rework Record</button>
          </form>
        </div>
      )}

      <div className="card">
        <h2 className="card-title">Recent Rework Records</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Module ID</th>
                <th>Line</th>
                <th>Defect Type</th>
                <th>Station</th>
                <th>Severity</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reworks.map((rework) => (
                <tr key={rework.id}>
                  <td><strong>{rework.module_id}</strong></td>
                  <td>{rework.line_number}</td>
                  <td>{rework.defect_type}</td>
                  <td>{rework.station}</td>
                  <td><span className={`badge ${rework.severity}`}>{rework.severity}</span></td>
                  <td><span className={`badge ${rework.status}`}>{rework.status}</span></td>
                  <td>{new Date(rework.date_detected).toLocaleDateString()}</td>
                  <td>
                    {rework.status === 'open' && (
                      <button
                        className="btn btn-secondary"
                        style={{ padding: '0.375rem 0.75rem', fontSize: '0.75rem' }}
                        onClick={() => handleResolve(rework.id)}
                      >
                        Resolve
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {reworks.length === 0 && (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>
                    <div className="empty-state">
                      <div className="empty-state-icon">📋</div>
                      <div className="empty-state-text">No rework records found</div>
                      <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                        Create your first rework record to start tracking
                      </p>
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

export default ReworkTracking;
