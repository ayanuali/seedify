# FreelancePay - AI-Powered Blockchain Escrow

![FreelancePay](https://img.shields.io/badge/blockchain-Polygon-8247E5) ![AI](https://img.shields.io/badge/AI-GPT--4o--mini-00A67E) ![Status](https://img.shields.io/badge/status-live-success)

**Live Demo:** [https://seedify-kohl.vercel.app](https://seedify-kohl.vercel.app)

## Overview

FreelancePay combines AI-powered quality verification with blockchain escrow to create a trustless freelance payment platform. Built for the Seedify Vibe Coins competition.

## Problem

Traditional freelance platforms suffer from:
- Payment disputes between clients and freelancers
- Delayed payment releases
- Lack of objective work quality assessment
- High platform fees (15-20%)

## Solution

FreelancePay provides:
- **AI Verification:** GPT-4o-mini automatically reviews code quality and content originality
- **Blockchain Escrow:** Smart contracts hold payments securely until work is approved
- **Low Fees:** Only 2% platform fee
- **Instant Settlements:** No waiting for manual review processes

## Tech Stack

### Smart Contracts
- Solidity 0.8.28
- Hardhat development framework
- OpenZeppelin security libraries
- Deployed on Polygon Amoy Testnet

### Backend
- Node.js + Express
- OpenAI GPT-4o-mini API
- Supabase PostgreSQL database
- Deployed on Render

### Frontend
- React 18 + Vite
- Thirdweb wallet integration
- Ethers.js v5
- Deployed on Vercel

## Features

✅ Web3 wallet connection (MetaMask, TrustWallet, etc.)
✅ Create jobs with USDC escrow
✅ Automatic test USDC minting (for demo)
✅ AI-powered code review
✅ AI-powered content analysis
✅ On-chain payment release
✅ Dispute resolution system
✅ Role-based job views (Client/Freelancer)

## Smart Contracts

**Polygon Amoy Testnet:**
- Escrow Contract: `0x03d47CbF9a57951Cbd72e5236A70A94C1A038Cb1`
- MockUSDC Token: `0x98525dD5Fd0f11767eAF55a50CD10A3BD66e982E`

[View on PolygonScan](https://amoy.polygonscan.com/address/0x03d47CbF9a57951Cbd72e5236A70A94C1A038Cb1)

## How It Works

1. **Client creates job** → USDC locked in smart contract escrow
2. **Freelancer submits work** → Provides URL to deliverable
3. **AI verifies quality** → GPT-4o-mini reviews code/content
4. **Client releases payment** → Freelancer receives funds (minus 2% fee)

## Live Deployment

- **Frontend:** https://seedify-kohl.vercel.app
- **Backend API:** https://freelancepay-api.onrender.com
- **Blockchain:** Polygon Amoy Testnet (Chain ID: 80002)

## Installation

### Prerequisites
- Node.js 18+
- MetaMask or compatible Web3 wallet
- Polygon Amoy testnet POL (from faucet)

### Clone & Install
```bash
git clone https://github.com/ayanuali/seedify.git
cd seedify

# Install contracts
cd contracts
npm install

# Install backend
cd ../backend
npm install

# Install frontend
cd ../frontend
npm install
```

### Environment Setup

Create `.env` files in each directory:

**contracts/.env:**
```
AMOY_RPC=https://rpc-amoy.polygon.technology
DEPLOYER_PRIVATE_KEY=your_private_key
```

**backend/.env:**
```
OPENAI_API_KEY=your_openai_key
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_key
AMOY_RPC=https://rpc-amoy.polygon.technology
CONTRACT_ADDRESS=0x03d47CbF9a57951Cbd72e5236A70A94C1A038Cb1
PORT=3000
PLATFORM_FEE_PERCENT=2
```

**frontend/.env:**
```
VITE_THIRDWEB_CLIENT_ID=your_thirdweb_id
VITE_API_URL=http://localhost:3000
VITE_CONTRACT_ADDRESS=0x03d47CbF9a57951Cbd72e5236A70A94C1A038Cb1
VITE_CHAIN_ID=80002
```

### Run Locally

```bash
# Terminal 1: Backend
cd backend
node server.js

# Terminal 2: Frontend
cd frontend
npm run dev
```

Visit `http://localhost:5173`

## Testing

1. Connect wallet to Polygon Amoy Testnet
2. Get POL from faucet: https://faucet.polygon.technology
3. Create a job (test USDC will be minted automatically)
4. Submit work as freelancer
5. AI verification runs automatically
6. Approve payment as client

## Architecture

```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│   Frontend  │─────▶│   Backend    │─────▶│   OpenAI    │
│   (React)   │      │   (Express)  │      │  GPT-4o-mini│
└─────┬───────┘      └──────┬───────┘      └─────────────┘
      │                     │
      │                     ▼
      │              ┌──────────────┐
      │              │   Supabase   │
      │              │  PostgreSQL  │
      │              └──────────────┘
      ▼
┌─────────────┐
│  Polygon    │
│  Amoy Net   │
│  (Escrow)   │
└─────────────┘
```

## Security

- ReentrancyGuard on all fund transfers
- Address validation on all inputs
- Environment variables for secrets
- Client-side network verification
- CORS protection on backend

## Revenue Model

- 2% platform fee on completed jobs
- Deducted automatically from escrow releases
- Example: $100 job → Freelancer gets $98, Platform gets $2

## Project Structure

```
seedify/
├── contracts/          # Solidity smart contracts
│   ├── contracts/
│   │   ├── FreelanceEscrow.sol
│   │   └── MockUSDC.sol
│   ├── scripts/
│   │   └── deploy-amoy.js
│   └── hardhat.config.js
├── backend/           # Express API server
│   ├── server.js
│   └── schema.sql
└── frontend/          # React app
    ├── src/
    │   ├── components/
    │   │   ├── CreateJob.jsx
    │   │   └── JobsList.jsx
    │   ├── contracts/
    │   │   └── contract.js
    │   └── App.jsx
    └── vite.config.js
```

## Future Enhancements

- Multi-token support (USDC, DAI, USDT)
- Milestone-based payments
- Reputation system
- Dispute arbitration DAO
- Mobile app (React Native)
- Mainnet deployment

## Team

Built by [@ayanuali](https://github.com/ayanuali) for Seedify Vibe Coins Competition

## License

MIT

## Links

- **Live App:** https://seedify-kohl.vercel.app
- **Backend API:** https://freelancepay-api.onrender.com
- **Contract Explorer:** https://amoy.polygonscan.com/address/0x03d47CbF9a57951Cbd72e5236A70A94C1A038Cb1

---

**Built with ❤️ on Polygon**
