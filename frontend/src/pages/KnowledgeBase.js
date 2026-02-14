import React, { useState } from 'react';

function KnowledgeBase() {
  const [searchTerm, setSearchTerm] = useState('');

  // Sample knowledge base entries
  const knowledgeEntries = [
    {
      id: 1,
      title: 'Common Soldering Defects and Prevention',
      category: 'Soldering',
      content: 'Guide to identifying and preventing common soldering defects including cold joints, bridging, and insufficient solder.',
      tags: ['soldering', 'prevention', 'quality'],
      author: 'Quality Team',
      created_at: new Date().toISOString(),
    },
    {
      id: 2,
      title: 'Component Handling Best Practices',
      category: 'Components',
      content: 'Standard operating procedures for handling sensitive electronic components to prevent ESD damage and mechanical stress.',
      tags: ['components', 'ESD', 'handling'],
      author: 'Manufacturing Team',
      created_at: new Date().toISOString(),
    },
    {
      id: 3,
      title: 'PCB Inspection Checklist',
      category: 'Quality Control',
      content: 'Comprehensive checklist for PCB inspection covering trace integrity, component placement, and solder quality.',
      tags: ['PCB', 'inspection', 'checklist'],
      author: 'QC Department',
      created_at: new Date().toISOString(),
    },
    {
      id: 4,
      title: 'Root Cause Analysis Methodology',
      category: 'Process',
      content: 'Step-by-step guide for conducting effective root cause analysis using 5-Why and Fishbone diagram techniques.',
      tags: ['RCA', 'methodology', 'process'],
      author: 'Process Engineering',
      created_at: new Date().toISOString(),
    },
  ];

  const filteredEntries = knowledgeEntries.filter(
    (entry) =>
      entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div>
      <h1 className="page-title">Knowledge Base</h1>

      <div className="card">
        <h2 className="card-title">Digital Knowledge Bank</h2>
        <p style={{ color: '#b0b0b0', marginBottom: '1.5rem' }}>
          Centralized repository of best practices, procedures, and lessons learned from rework analysis.
        </p>

        <div className="form-group">
          <input
            type="text"
            placeholder="🔍 Search knowledge base..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ fontSize: '1rem' }}
          />
        </div>

        <div style={{ marginTop: '1.5rem' }}>
          {filteredEntries.map((entry) => (
            <div key={entry.id} className="knowledge-item">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                  <h3>{entry.title}</h3>
                  <p style={{ color: '#b0b0b0', margin: '0.5rem 0', lineHeight: '1.6' }}>
                    {entry.content}
                  </p>
                </div>
                <span className="badge" style={{ background: '#3b82f6' }}>
                  {entry.category}
                </span>
              </div>
              <div className="tags">
                {entry.tags.map((tag, idx) => (
                  <span key={idx} className="tag">
                    #{tag}
                  </span>
                ))}
              </div>
              <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: '#6b7280' }}>
                By {entry.author} • {new Date(entry.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}

          {filteredEntries.length === 0 && (
            <div className="empty-state">
              <div className="empty-state-icon">📚</div>
              <div className="empty-state-text">No knowledge entries found</div>
              <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                Try a different search term
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <h2 className="card-title">Quick Links</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
          <div style={{ background: '#2a2a2a', padding: '1rem', borderRadius: '6px', cursor: 'pointer' }}>
            <h4 style={{ color: '#3b82f6', marginBottom: '0.5rem' }}>📖 Standard Operating Procedures</h4>
            <p style={{ color: '#b0b0b0', fontSize: '0.85rem' }}>
              Access manufacturing SOPs and guidelines
            </p>
          </div>
          <div style={{ background: '#2a2a2a', padding: '1rem', borderRadius: '6px', cursor: 'pointer' }}>
            <h4 style={{ color: '#3b82f6', marginBottom: '0.5rem' }}>🎓 Training Materials</h4>
            <p style={{ color: '#b0b0b0', fontSize: '0.85rem' }}>
              Operator training resources and videos
            </p>
          </div>
          <div style={{ background: '#2a2a2a', padding: '1rem', borderRadius: '6px', cursor: 'pointer' }}>
            <h4 style={{ color: '#3b82f6', marginBottom: '0.5rem' }}>🔧 Equipment Manuals</h4>
            <p style={{ color: '#b0b0b0', fontSize: '0.85rem' }}>
              Technical documentation and maintenance guides
            </p>
          </div>
          <div style={{ background: '#2a2a2a', padding: '1rem', borderRadius: '6px', cursor: 'pointer' }}>
            <h4 style={{ color: '#3b82f6', marginBottom: '0.5rem' }}>📊 Best Practices</h4>
            <p style={{ color: '#b0b0b0', fontSize: '0.85rem' }}>
              Industry standards and recommended practices
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default KnowledgeBase;
