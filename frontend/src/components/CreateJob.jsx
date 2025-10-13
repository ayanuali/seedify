import { useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function CreateJob({ address }) {
  const [form, setForm] = useState({
    freelancer: '',
    amount: '',
    title: '',
    description: '',
    category: 'code'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // create job in database
      const res = await axios.post(`${API_URL}/api/jobs/create`, {
        clientAddress: address,
        freelancerAddress: form.freelancer,
        amount: form.amount,
        title: form.title,
        description: form.description,
        category: form.category
      });

      setSuccess('Job created! In production, you would now create it on-chain.');
      setForm({ freelancer: '', amount: '', title: '', description: '', category: 'code' });

      // in production, next step would be to call smart contract
      console.log('Job created with ID:', res.data.jobId);

    } catch (err) {
      console.error('failed:', err);
      setError(err.response?.data?.error || 'Job creation failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card" style={{ maxWidth: '600px' }}>
      <h2 style={{ marginBottom: '1.5rem' }}>Create New Job</h2>

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

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Job Title</label>
          <input
            type="text"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            placeholder="e.g. Build React Component"
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            placeholder="Describe the work needed..."
            rows="4"
            required
          />
        </div>

        <div className="form-group">
          <label>Freelancer Wallet Address</label>
          <input
            type="text"
            value={form.freelancer}
            onChange={e => setForm({ ...form, freelancer: e.target.value })}
            placeholder="0x..."
            required
          />
        </div>

        <div className="form-group">
          <label>Amount (USDC)</label>
          <input
            type="number"
            step="0.01"
            min="0.01"
            value={form.amount}
            onChange={e => setForm({ ...form, amount: e.target.value })}
            placeholder="50.00"
            required
          />
        </div>

        <div className="form-group">
          <label>Category</label>
          <select
            value={form.category}
            onChange={e => setForm({ ...form, category: e.target.value })}
          >
            <option value="code">Code/Development</option>
            <option value="content">Content Writing</option>
            <option value="design">Design</option>
            <option value="other">Other</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary"
          style={{ width: '100%' }}
        >
          {loading ? 'Creating...' : 'Create Job'}
        </button>

        <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#666' }}>
          2% platform fee will be deducted when job completes
        </p>
      </form>
    </div>
  );
}

export default CreateJob;
