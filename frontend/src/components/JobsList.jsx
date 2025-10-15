import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function JobsList({ address }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadJobs();
  }, [address, filter]);

  async function loadJobs() {
    try {
      setLoading(true);
      const role = filter === 'all' ? '' : filter;
      const res = await axios.get(`${API_URL}/api/jobs/user/${address}?role=${role}`, {
        timeout: 10000 // 10 second timeout
      });
      setJobs(res.data || []);
    } catch (err) {
      console.error('failed to load jobs:', err);
      setJobs([]); // Set empty array on error so loading stops
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(jobId) {
    if (!confirm('Delete this failed job?')) return;

    try {
      await axios.delete(`${API_URL}/api/jobs/${jobId}?clientAddress=${address}`);
      loadJobs(); // Reload list
    } catch (err) {
      console.error('failed to delete:', err);
      alert('Failed to delete job');
    }
  }

  function getStatusClass(status) {
    switch (status) {
      case 'active':
      case 'pending_blockchain':
        return 'status-active';
      case 'submitted':
      case 'verified':
        return 'status-submitted';
      case 'completed':
        return 'status-completed';
      case 'disputed':
      case 'needs_review':
        return 'status-disputed';
      default:
        return 'status-active';
    }
  }

  function formatStatus(status) {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>Loading jobs...</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <button
          onClick={() => setFilter('all')}
          className={filter === 'all' ? 'tab active' : 'tab'}
        >
          All Jobs
        </button>
        <button
          onClick={() => setFilter('client')}
          className={filter === 'client' ? 'tab active' : 'tab'}
        >
          As Client
        </button>
        <button
          onClick={() => setFilter('freelancer')}
          className={filter === 'freelancer' ? 'tab active' : 'tab'}
        >
          As Freelancer
        </button>
      </div>

      {jobs.length === 0 ? (
        <div className="empty-state">
          <p>No jobs found</p>
          <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
            {filter === 'client' ? 'Create a job to get started' : 'Wait for jobs to be assigned to you'}
          </p>
        </div>
      ) : (
        <div>
          {jobs.map(job => (
            <div key={job.id} className="job-card">
              <div className="job-header">
                <div className="job-info">
                  <h3>{job.title}</h3>
                  <p>{job.description}</p>
                  <p style={{ fontSize: '0.875rem', marginTop: '0.5rem', color: '#999' }}>
                    Category: {job.category}
                  </p>
                </div>
                <div className="job-amount">
                  <div className="amount">${job.amount}</div>
                  <div className="currency">USDC</div>
                </div>
              </div>

              {job.ai_analysis && (
                <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#f9fafb', borderRadius: '0.375rem' }}>
                  <p style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem' }}>
                    AI Analysis:
                  </p>
                  <p style={{ fontSize: '0.875rem', color: '#666' }}>
                    {job.ai_analysis}
                  </p>
                </div>
              )}

              <div className="job-footer">
                <span className={`status-badge ${getStatusClass(job.status)}`}>
                  {formatStatus(job.status)}
                </span>

                {job.status === 'pending_blockchain' && job.client_address.toLowerCase() === address.toLowerCase() && (
                  <button
                    className="btn-danger"
                    style={{ fontSize: '0.875rem', background: '#dc2626' }}
                    onClick={() => handleDelete(job.id)}
                  >
                    Delete (Failed)
                  </button>
                )}

                {job.status === 'active' && job.freelancer_address.toLowerCase() === address.toLowerCase() && (
                  <button className="btn-primary" style={{ fontSize: '0.875rem' }}>
                    Submit Work
                  </button>
                )}

                {job.status === 'submitted' && job.client_address.toLowerCase() === address.toLowerCase() && (
                  <button className="btn-success" style={{ fontSize: '0.875rem' }}>
                    Approve & Release Payment
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default JobsList;
