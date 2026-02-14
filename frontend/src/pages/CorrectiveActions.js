import React, { useState, useEffect } from 'react';
import { correctiveActionAPI } from '../services/api';

function CorrectiveActions() {
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActions();
  }, []);

  const fetchActions = async () => {
    try {
      const response = await correctiveActionAPI.getAll();
      setActions(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching corrective actions:', error);
      setLoading(false);
    }
  };

  const handleComplete = async (id) => {
    try {
      await correctiveActionAPI.update(id, {
        status: 'completed',
        completed_date: new Date().toISOString(),
      });
      fetchActions();
    } catch (error) {
      console.error('Error updating corrective action:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading corrective actions...</div>;
  }

  return (
    <div>
      <h1 className="page-title">Corrective Actions</h1>

      <div className="card">
        <h2 className="card-title">Active Corrective Actions</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Action Type</th>
                <th>Description</th>
                <th>Priority</th>
                <th>Assigned To</th>
                <th>Status</th>
                <th>Due Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {actions.map((action) => (
                <tr key={action.id}>
                  <td><strong>{action.action_type}</strong></td>
                  <td>{action.action_description}</td>
                  <td><span className={`badge ${action.priority}`}>{action.priority}</span></td>
                  <td>{action.assigned_to || 'Unassigned'}</td>
                  <td><span className={`badge ${action.status}`}>{action.status}</span></td>
                  <td>{action.due_date ? new Date(action.due_date).toLocaleDateString() : '-'}</td>
                  <td>
                    {action.status === 'pending' && (
                      <button
                        className="btn btn-secondary"
                        style={{ padding: '0.375rem 0.75rem', fontSize: '0.75rem' }}
                        onClick={() => handleComplete(action.id)}
                      >
                        Complete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {actions.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>
                    <div className="empty-state">
                      <div className="empty-state-icon">✅</div>
                      <div className="empty-state-text">No corrective actions found</div>
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

export default CorrectiveActions;
