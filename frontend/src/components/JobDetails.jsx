import { useState, useEffect } from 'react';
import { useSigner } from '@thirdweb-dev/react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function JobDetails({ jobId, address, onClose }) {
  const signer = useSigner();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [workUrl, setWorkUrl] = useState('');
  const [deliverableType, setDeliverableType] = useState('code');

  useEffect(() => {
    loadJob();
  }, [jobId]);

  async function loadJob() {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/jobs/${jobId}`);
      setJob(res.data);
    } catch (err) {
      console.error('failed to load job:', err);
      setError('Failed to load job details');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmitWork(e) {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      await axios.post(`${API_URL}/api/jobs/submit`, {
        jobId: job.id,
        workUrl,
        deliverableType
      });

      setSuccess('Work submitted! AI verification in progress...');
      setTimeout(() => loadJob(), 2000); // Reload after 2s
      setWorkUrl('');
    } catch (err) {
      setError(err.response?.data?.error || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleApprove() {
    if (!confirm('Approve this work and release payment?')) return;

    setSubmitting(true);
    setError('');

    try {
      // TODO: Call smart contract approveWork function
      setSuccess('Payment approved and released!');
      setTimeout(() => loadJob(), 2000);
    } catch (err) {
      setError('Failed to approve payment');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDispute() {
    if (!confirm('Open a dispute for this job?')) return;

    setSubmitting(true);
    setError('');

    try {
      // TODO: Call smart contract disputeJob function
      setSuccess('Dispute opened. Platform admin will review.');
      setTimeout(() => loadJob(), 2000);
    } catch (err) {
      setError('Failed to open dispute');
    } finally {
      setSubmitting(false);
    }
  }

  function formatStatus(status) {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  function getStatusColor(status) {
    switch (status) {
      case 'active': return '#3b82f6';
      case 'submitted': return '#f59e0b';
      case 'verified': return '#10b981';
      case 'completed': return '#059669';
      case 'disputed': return '#ef4444';
      case 'needs_review': return '#dc2626';
      default: return '#6b7280';
    }
  }

  if (loading) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <p style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return null;
  }

  const isClient = job.client_address.toLowerCase() === address.toLowerCase();
  const isFreelancer = job.freelancer_address.toLowerCase() === address.toLowerCase();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2>Job Details</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#666' }}>×</button>
        </div>

        {error && (
          <div style={{ padding: '1rem', background: '#fee2e2', color: '#991b1b', borderRadius: '0.375rem', marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{ padding: '1rem', background: '#d1fae5', color: '#065f46', borderRadius: '0.375rem', marginBottom: '1rem' }}>
            {success}
          </div>
        )}

        <div className="job-card" style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
            <div>
              <h3 style={{ marginBottom: '0.5rem' }}>{job.title}</h3>
              <span style={{
                padding: '0.25rem 0.75rem',
                borderRadius: '9999px',
                fontSize: '0.875rem',
                background: getStatusColor(job.status) + '20',
                color: getStatusColor(job.status)
              }}>
                {formatStatus(job.status)}
              </span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>${job.amount}</div>
              <div style={{ fontSize: '0.875rem', color: '#666' }}>USDC</div>
            </div>
          </div>

          <p style={{ marginBottom: '1rem', color: '#374151' }}>{job.description}</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.875rem', color: '#666' }}>
            <div>
              <strong>Client:</strong><br />
              {job.client_address.substring(0, 10)}...{job.client_address.substring(38)}
            </div>
            <div>
              <strong>Freelancer:</strong><br />
              {job.freelancer_address.substring(0, 10)}...{job.freelancer_address.substring(38)}
            </div>
            <div>
              <strong>Category:</strong> {job.category}
            </div>
            {job.chain_job_id && (
              <div>
                <strong>Chain Job ID:</strong> #{job.chain_job_id}
              </div>
            )}
          </div>

          {job.tx_hash && (
            <div style={{ marginTop: '1rem', fontSize: '0.875rem' }}>
              <a
                href={`https://amoy.polygonscan.com/tx/${job.tx_hash}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#3b82f6', textDecoration: 'none' }}
              >
                View Transaction ↗
              </a>
            </div>
          )}
        </div>

        {job.ai_analysis && (
          <div style={{ padding: '1rem', background: '#f9fafb', borderRadius: '0.375rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '1.25rem' }}>🤖</span>
              <strong>AI Analysis</strong>
              {job.ai_approved !== null && (
                <span style={{
                  marginLeft: 'auto',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '9999px',
                  fontSize: '0.875rem',
                  background: job.ai_approved ? '#d1fae5' : '#fee2e2',
                  color: job.ai_approved ? '#065f46' : '#991b1b'
                }}>
                  {job.ai_approved ? '✓ Approved' : '✗ Rejected'}
                </span>
              )}
            </div>
            <p style={{ fontSize: '0.875rem', color: '#666', margin: 0 }}>{job.ai_analysis}</p>
          </div>
        )}

        {job.work_url && (
          <div style={{ padding: '1rem', background: '#eff6ff', borderRadius: '0.375rem', marginBottom: '1rem' }}>
            <strong style={{ display: 'block', marginBottom: '0.5rem' }}>Submitted Work</strong>
            <a
              href={job.work_url.startsWith('http') ? job.work_url : `https://gateway.pinata.cloud/ipfs/${job.work_url}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#3b82f6', fontSize: '0.875rem', wordBreak: 'break-all' }}
            >
              {job.work_url}
            </a>
          </div>
        )}

        {/* Freelancer: Submit Work Form */}
        {isFreelancer && job.status === 'active' && (
          <form onSubmit={handleSubmitWork} style={{ marginTop: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>Submit Your Work</h3>

            <div className="form-group">
              <label>Deliverable URL or IPFS Hash</label>
              <input
                type="text"
                value={workUrl}
                onChange={e => setWorkUrl(e.target.value)}
                placeholder="https://github.com/... or Qm..."
                required
              />
              <small style={{ color: '#666', fontSize: '0.875rem' }}>
                Provide a link to your GitHub repo, Google Doc, or IPFS hash
              </small>
            </div>

            <div className="form-group">
              <label>Deliverable Type</label>
              <select value={deliverableType} onChange={e => setDeliverableType(e.target.value)}>
                <option value="code">Code Review</option>
                <option value="content">Content Analysis</option>
                <option value="other">Other</option>
              </select>
            </div>

            <button type="submit" disabled={submitting} className="btn-primary" style={{ width: '100%' }}>
              {submitting ? 'Submitting...' : 'Submit Work for AI Review'}
            </button>
          </form>
        )}

        {/* Client: Approve Payment */}
        {isClient && (job.status === 'submitted' || job.status === 'verified') && (
          <div style={{ marginTop: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={handleApprove}
                disabled={submitting}
                className="btn-success"
                style={{ flex: 1 }}
              >
                {submitting ? 'Processing...' : '✓ Approve & Release Payment'}
              </button>
              <button
                onClick={handleDispute}
                disabled={submitting}
                style={{
                  flex: 1,
                  background: '#dc2626',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem',
                  borderRadius: '0.375rem',
                  cursor: 'pointer'
                }}
              >
                ⚠ Dispute
              </button>
            </div>
            <p style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.5rem', textAlign: 'center' }}>
              {job.ai_approved
                ? '✓ AI says it looks good. Check it yourself and release payment if you agree.'
                : '✗ AI found some issues. Take a look before deciding.'}
            </p>
          </div>
        )}

        {/* Show role indicator */}
        <div style={{ marginTop: '1.5rem', padding: '0.75rem', background: '#f3f4f6', borderRadius: '0.375rem', fontSize: '0.875rem', textAlign: 'center', color: '#666' }}>
          You are viewing as: <strong>{isClient ? 'Client' : isFreelancer ? 'Freelancer' : 'Observer'}</strong>
        </div>
      </div>
    </div>
  );
}

export default JobDetails;
