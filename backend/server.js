const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const { OpenAI } = require('openai');
const { ethers } = require('ethers');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// contract interaction setup (will be used after deployment)
let contract = null;
if (process.env.BASE_SEPOLIA_RPC && process.env.CONTRACT_ADDRESS && process.env.DEPLOYER_PRIVATE_KEY) {
  const provider = new ethers.JsonRpcProvider(process.env.BASE_SEPOLIA_RPC);
  const wallet = new ethers.Wallet(process.env.DEPLOYER_PRIVATE_KEY, provider);
  // contract will be initialized after we deploy and have ABI
}

// health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// create new job in database
app.post('/api/jobs/create', async (req, res) => {
  const {
    clientAddress,
    freelancerAddress,
    amount,
    title,
    description,
    category
  } = req.body;

  // basic validation
  if (!ethers.isAddress(clientAddress) || !ethers.isAddress(freelancerAddress)) {
    return res.status(400).json({ error: 'invalid addresses' });
  }

  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'amount must be positive' });
  }

  if (!title || !description) {
    return res.status(400).json({ error: 'title and description required' });
  }

  try {
    // save to database first
    const { data, error } = await supabase
      .from('jobs')
      .insert({
        client_address: clientAddress.toLowerCase(),
        freelancer_address: freelancerAddress.toLowerCase(),
        amount,
        title,
        description,
        category: category || 'other',
        status: 'pending_blockchain',
        created_at: new Date()
      })
      .select()
      .single();

    if (error) throw error;

    res.json({
      jobId: data.id,
      status: 'created',
      message: 'now create the job on blockchain'
    });

  } catch (err) {
    console.error('failed to create job:', err);
    res.status(500).json({ error: 'database error' });
  }
});

// after blockchain transaction, update job with chain id
app.post('/api/jobs/link-chain', async (req, res) => {
  const { jobId, chainJobId, txHash } = req.body;

  if (!jobId || chainJobId === undefined || !txHash) {
    return res.status(400).json({ error: 'missing required fields' });
  }

  try {
    const { error } = await supabase
      .from('jobs')
      .update({
        chain_job_id: chainJobId,
        tx_hash: txHash,
        status: 'active'
      })
      .eq('id', jobId);

    if (error) throw error;

    res.json({ success: true });
  } catch (err) {
    console.error('failed to link job:', err);
    res.status(500).json({ error: 'failed to link' });
  }
});

// freelancer submits work
app.post('/api/jobs/submit', async (req, res) => {
  const { jobId, workUrl, deliverableType } = req.body;

  if (!jobId || !workUrl || !deliverableType) {
    return res.status(400).json({ error: 'missing required fields' });
  }

  try {
    // update database
    const { error } = await supabase
      .from('jobs')
      .update({
        work_url: workUrl,
        deliverable_type: deliverableType,
        status: 'submitted',
        submitted_at: new Date()
      })
      .eq('id', jobId);

    if (error) throw error;

    // trigger ai verification in background
    verifyWork(jobId, workUrl, deliverableType);

    res.json({
      status: 'submitted',
      message: 'ai verification started'
    });

  } catch (err) {
    console.error('submission failed:', err);
    res.status(500).json({ error: 'submission failed' });
  }
});

// ai verification logic
async function verifyWork(jobId, workUrl, type) {
  try {
    // fetch work content from ipfs or url
    const workContent = await fetchWorkContent(workUrl);

    let aiApproved = false;
    let analysis = '';

    if (type === 'code') {
      // code review with ai
      const review = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{
          role: 'user',
          content: `Review this code for quality. Check:
1. Does it work? (no obvious syntax errors)
2. Is it reasonably clean? (not spaghetti)
3. Does it match basic requirements?

Code:
${workContent.substring(0, 8000)}

Respond with JSON: {"approved": true/false, "reason": "brief explanation"}`
        }],
        response_format: { type: 'json_object' }
      });

      const result = JSON.parse(review.choices[0].message.content);
      aiApproved = result.approved;
      analysis = result.reason;

    } else if (type === 'content') {
      // check for plagiarism and quality
      const check = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{
          role: 'user',
          content: `Analyze this content for quality:
1. Is it original? (not clearly plagiarized)
2. Is it well-written? (proper grammar, coherent)
3. Is it substantial? (not just filler)

Content:
${workContent.substring(0, 8000)}

JSON: {"approved": true/false, "reason": "why"}`
        }],
        response_format: { type: 'json_object' }
      });

      const result = JSON.parse(check.choices[0].message.content);
      aiApproved = result.approved;
      analysis = result.reason;

    } else {
      // for other types, basic completeness check
      aiApproved = workContent.length > 100;
      analysis = aiApproved ? 'deliverable provided' : 'deliverable too short';
    }

    // save verification result
    const { data: job } = await supabase
      .from('jobs')
      .update({
        ai_approved: aiApproved,
        ai_analysis: analysis,
        verified_at: new Date(),
        status: aiApproved ? 'verified' : 'needs_review'
      })
      .eq('id', jobId)
      .select('chain_job_id')
      .single();

    // submit result to blockchain
    // this will be enabled after contract deployment
    // if (contract && job && job.chain_job_id !== null) {
    //   const tx = await contract.setAIApproval(job.chain_job_id, aiApproved);
    //   await tx.wait();
    // }

    console.log(`job ${jobId} verified: ${aiApproved ? 'approved' : 'rejected'}`);

  } catch (err) {
    console.error('ai verification failed:', err);
    // mark as needs manual review
    await supabase
      .from('jobs')
      .update({ status: 'needs_review', ai_analysis: 'verification error: ' + err.message })
      .eq('id', jobId);
  }
}

// helper to fetch work content
async function fetchWorkContent(url) {
  try {
    // if its an ipfs hash, fetch from gateway
    if (url.startsWith('Qm') || url.startsWith('bafy')) {
      const response = await fetch(`https://gateway.pinata.cloud/ipfs/${url}`);
      return await response.text();
    }

    // if its a full url, fetch directly
    if (url.startsWith('http')) {
      const response = await fetch(url);
      return await response.text();
    }

    // otherwise treat as raw content
    return url;
  } catch (err) {
    console.error('failed to fetch work:', err);
    return '';
  }
}

// get job details
app.get('/api/jobs/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) throw error;

    res.json(data);
  } catch (err) {
    console.error('failed to get job:', err);
    res.status(404).json({ error: 'job not found' });
  }
});

// list jobs for user
app.get('/api/jobs/user/:address', async (req, res) => {
  const { address } = req.params;
  const { role } = req.query; // 'client' or 'freelancer'

  if (!ethers.isAddress(address)) {
    return res.status(400).json({ error: 'invalid address' });
  }

  try {
    let query = supabase.from('jobs').select('*');

    const lowerAddress = address.toLowerCase();

    if (role === 'client') {
      query = query.eq('client_address', lowerAddress);
    } else if (role === 'freelancer') {
      query = query.eq('freelancer_address', lowerAddress);
    } else {
      // return both
      query = query.or(`client_address.eq.${lowerAddress},freelancer_address.eq.${lowerAddress}`);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (err) {
    console.error('failed to fetch jobs:', err);
    res.status(500).json({ error: 'failed to fetch jobs' });
  }
});

// platform stats
app.get('/api/stats', async (req, res) => {
  try {
    const { data: jobs } = await supabase
      .from('jobs')
      .select('amount, status');

    if (!jobs) {
      return res.json({
        totalJobs: 0,
        totalVolume: '0.00',
        completed: 0,
        active: 0,
        platformRevenue: '0.00'
      });
    }

    const totalVolume = jobs.reduce((sum, j) => sum + parseFloat(j.amount || 0), 0);
    const completed = jobs.filter(j => j.status === 'completed').length;
    const active = jobs.filter(j => j.status === 'active').length;

    // platform earned 2% of completed volume
    const platformRevenue = jobs
      .filter(j => j.status === 'completed')
      .reduce((sum, j) => sum + (parseFloat(j.amount || 0) * 0.02), 0);

    res.json({
      totalJobs: jobs.length,
      totalVolume: totalVolume.toFixed(2),
      completed,
      active,
      platformRevenue: platformRevenue.toFixed(2)
    });
  } catch (err) {
    console.error('stats error:', err);
    res.status(500).json({ error: 'stats error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`freelancepay api running on port ${PORT}`);
  console.log(`supabase: ${process.env.SUPABASE_URL ? 'connected' : 'not configured'}`);
  console.log(`openai: ${process.env.OPENAI_API_KEY ? 'connected' : 'not configured'}`);
});
