# FreelancePay - AI-Powered Freelance Payment Router

AI verification + blockchain escrow for instant, secure freelance payments.

## What We Built

A complete freelance payment platform with:
- Smart contracts for USDC escrow on Base network
- Express backend with OpenAI code/content verification
- React frontend with Thirdweb wallet integration
- Supabase database for job tracking
- 2% platform fee vs 10-20% on traditional platforms

## Project Structure

```
seedify/
├── contracts/          # Solidity smart contracts (FreelanceEscrow, MockUSDC)
│   ├── contracts/      # Contract source files
│   ├── hardhat.config.js
│   └── .env           # Blockchain config (gitignored)
├── backend/           # Express API server
│   ├── server.js      # Main API with AI verification
│   ├── schema.sql     # Database schema
│   └── .env          # API keys (gitignored)
├── frontend/          # React + Vite app
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/
│   │   │   ├── CreateJob.jsx
│   │   │   └── JobsList.jsx
│   └── .env          # Frontend config (gitignored)
└── README.md
```

## Build Status

### ✅ Completed
- [x] Smart contracts written and compiled
- [x] Backend API with AI verification
- [x] React frontend with wallet connection
- [x] Supabase database schema
- [x] Git repository with proper .gitignore
- [x] All environment files configured

### ⏳ Still Need (Before Deployment)

1. **Alchemy Base Sepolia App**
   - Go to https://dashboard.alchemy.com
   - Create new app → Select "Base Sepolia" network
   - Copy API key and RPC URL
   - Update in `contracts/.env` and `backend/.env`:
     ```
     ALCHEMY_API_KEY=your-key-here
     BASE_SEPOLIA_RPC=https://base-sepolia.g.alchemy.com/v2/your-key
     ```

2. **Wallet Private Key** (for contract deployment)
   - **Trust Wallet:**
     - Settings → Wallets → [Your Wallet] → ... → Show Private Key
   - **MetaMask:**
     - Click three dots → Account Details → Export Private Key
   - Add to `contracts/.env` and `backend/.env`:
     ```
     DEPLOYER_PRIVATE_KEY=0x...
     ```

3. **Testnet ETH** (for gas fees)
   - Visit https://www.alchemy.com/faucets/base-sepolia
   - Enter your wallet address
   - Request testnet ETH (free)

4. **Set Up Supabase Database**
   - Go to https://supabase.com/dashboard
   - Open your project SQL Editor
   - Copy contents from `backend/schema.sql`
   - Run the SQL to create tables
   - See `backend/SUPABASE_SETUP.md` for detailed instructions

## API Keys Status

- ✅ OpenAI (AI verification) - configured
- ✅ Thirdweb (wallet connection) - configured
- ✅ Supabase (database) - configured
- ✅ Pinata (IPFS storage) - configured
- ⏳ Alchemy Base Sepolia - **need to create**
- ⏳ Wallet private key - **need to export**

## Quick Start (After Getting Missing Keys)

### 1. Set Up Supabase
```bash
# Go to backend/SUPABASE_SETUP.md and follow instructions
# Takes 2 minutes
```

### 2. Deploy Smart Contracts
```bash
cd contracts
# make sure .env has DEPLOYER_PRIVATE_KEY and BASE_SEPOLIA_RPC
npx hardhat run scripts/deploy.js --network baseSepolia
# copy deployed contract address to backend/.env and frontend/.env
```

### 3. Start Backend
```bash
cd backend
npm start
# runs on http://localhost:3000
```

### 4. Start Frontend
```bash
cd frontend
npm run dev
# opens http://localhost:5173
```

## Testing the App

1. **Connect Wallet**
   - Open http://localhost:5173
   - Click "Connect Wallet"
   - Select MetaMask or Trust Wallet
   - Approve connection

2. **Create a Job** (as client)
   - Click "Create Job" tab
   - Fill in job details
   - Enter freelancer wallet address
   - Set amount in USDC
   - Submit (creates in database)
   - In production, next step would call smart contract

3. **View Jobs**
   - Click "My Jobs" tab
   - Toggle between "As Client" and "As Freelancer"
   - See all your jobs with status

4. **Submit Work** (as freelancer)
   - See jobs assigned to you
   - Click "Submit Work"
   - Upload deliverable
   - AI automatically verifies
   - Payment releases if approved

## Environment Variables

All secrets are in `.env` files (gitignored). Here's what you have:

### contracts/.env
```
BASE_SEPOLIA_RPC=       # NEED: from Alchemy
DEPLOYER_PRIVATE_KEY=   # NEED: from your wallet
```

### backend/.env
```
OPENAI_API_KEY=         # ✅ CONFIGURED
BASE_SEPOLIA_RPC=       # NEED: from Alchemy
SUPABASE_URL=          # ✅ CONFIGURED
SUPABASE_ANON_KEY=     # ✅ CONFIGURED
PINATA_API_KEY=        # ✅ CONFIGURED
PINATA_SECRET=         # ✅ CONFIGURED
CONTRACT_ADDRESS=       # Will be set after deployment
DEPLOYER_PRIVATE_KEY=   # NEED: from your wallet
PORT=3000
PLATFORM_FEE_PERCENT=2
```

### frontend/.env
```
VITE_THIRDWEB_CLIENT_ID=  # ✅ CONFIGURED
VITE_API_URL=http://localhost:3000
VITE_CONTRACT_ADDRESS=    # Will be set after deployment
VITE_CHAIN_ID=84532      # Base Sepolia
```

## What Works Right Now

- ✅ Backend API accepts job creation requests
- ✅ OpenAI verifies code and content quality
- ✅ Frontend creates jobs and displays them
- ✅ Wallet connection via Thirdweb
- ✅ Smart contracts compiled successfully
- ⏳ Contract deployment (waiting for Alchemy + private key)
- ⏳ On-chain transactions (waiting for deployment)

## Next Steps

1. **Get missing API keys** (Alchemy Base Sepolia + wallet private key)
2. **Deploy contracts** to Base Sepolia testnet
3. **Update contract address** in backend and frontend .env
4. **Test full flow** from job creation to payment
5. **Add blockchain integration** to frontend (contract calls)
6. **Deploy to production** (Vercel for frontend, Render for backend)

## Security Notes

- All `.env` files are gitignored
- Private keys never committed to git
- Database credentials protected
- Contract uses ReentrancyGuard for safety
- Platform fee limited to max 10%

## Tech Stack

- **Blockchain:** Solidity 0.8.20, Hardhat, Base Sepolia
- **Backend:** Node.js, Express, OpenAI GPT-4o-mini
- **Frontend:** React 19, Vite, Thirdweb SDK
- **Database:** Supabase (PostgreSQL)
- **Storage:** Pinata (IPFS)

## Commands Reference

```bash
# Contracts
cd contracts
npx hardhat compile           # compile contracts
npx hardhat test             # run tests (when written)
npx hardhat run scripts/deploy.js --network baseSepolia

# Backend
cd backend
npm start                    # start API server
npm run dev                  # same as start

# Frontend
cd frontend
npm run dev                  # development server
npm run build               # production build
npm run preview             # preview production build
```

## Support

If you hit issues:
1. Check all .env files have correct values
2. Make sure you have testnet ETH
3. Verify Supabase tables are created
4. Check backend is running on port 3000
5. Check browser console for errors

## What To Do Next

**Immediate next steps:**
1. Create Alchemy Base Sepolia app
2. Export private key from Trust Wallet
3. Get testnet ETH
4. Run Supabase SQL schema
5. Deploy contracts
6. Test the full flow

Once deployed, you'll have a working freelance payment platform with AI verification!
