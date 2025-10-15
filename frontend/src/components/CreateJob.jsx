import { useState } from 'react';
import { useSigner } from '@thirdweb-dev/react';
import axios from 'axios';
import { checkUSDCBalance, mintTestUSDC, approveUSDC, createJobOnChain } from '../contracts/contract';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function CreateJob({ address }) {
  const signer = useSigner();
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
  const [status, setStatus] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (!signer) {
        throw new Error('Please connect your wallet');
      }

      // check network
      setStatus('Checking network...');
      const network = await signer.provider.getNetwork();
      if (network.chainId !== 80002) {
        throw new Error('Please switch to Polygon Amoy Testnet (Chain ID: 80002)');
      }

      // step 1: create job in database first
      setStatus('Creating job in database...');
      const dbRes = await axios.post(`${API_URL}/api/jobs/create`, {
        clientAddress: address,
        freelancerAddress: form.freelancer,
        amount: form.amount,
        title: form.title,
        description: form.description,
        category: form.category
      });

      const jobId = dbRes.data.jobId;

      // step 2: check usdc balance, mint if needed (for local testing)
      setStatus('Checking USDC balance...');
      const balance = await checkUSDCBalance(signer);
      if (parseFloat(balance) < parseFloat(form.amount)) {
        setStatus('Minting test USDC...');
        await mintTestUSDC(signer, 1000); // mint 1000 test usdc
      }

      // step 3: approve usdc spending
      setStatus('Approving USDC...');
      await approveUSDC(signer, form.amount);

      // step 4: create job on blockchain
      setStatus('Creating job on blockchain...');
      const { chainJobId, txHash } = await createJobOnChain(
        signer,
        form.freelancer,
        form.amount
      );

      // step 5: link database job to blockchain job
      setStatus('Linking to database...');
      await axios.post(`${API_URL}/api/jobs/link-chain`, {
        jobId,
        chainJobId,
        txHash
      });

      setSuccess(`Job created successfully! Tx: ${txHash.substring(0, 10)}...`);
      setStatus('');
      setForm({ freelancer: '', amount: '', title: '', description: '', category: 'code' });

    } catch (err) {
      console.error('failed:', err);
      setError(err.message || err.response?.data?.error || 'Job creation failed');
      setStatus('');
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

      {status && (
        <div style={{ padding: '1rem', background: '#dbeafe', color: '#1e40af', borderRadius: '0.375rem', marginBottom: '1rem' }}>
          {status}
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
          {loading ? status || 'Creating...' : 'Create Job & Lock Funds'}
        </button>

        <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#666' }}>
          2% platform fee will be deducted when job completes. Test USDC will be minted automatically if needed.
        </p>
      </form>
    </div>
  );
}

export default CreateJob;
