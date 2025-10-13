# FreelancePay - Quick Start Guide

## What You Have Now

A complete AI-powered freelance payment platform:
- ✅ Smart contracts (compiled and ready)
- ✅ Backend API with AI verification
- ✅ React frontend with wallet integration
- ✅ Database schema ready for Supabase

## What You Still Need (Takes 10 Minutes)

### 1. Alchemy Base Sepolia (2 min)
```
1. Go to: https://dashboard.alchemy.com
2. Sign in
3. Click "Create new app"
4. Name: FreelancePay-Testnet
5. Chain: Base
6. Network: Base Sepolia (testnet)
7. Copy API Key
8. Copy HTTPS endpoint URL
```

**Add to both files:**
- `contracts/.env` → `BASE_SEPOLIA_RPC=<your-url>`
- `backend/.env` → `BASE_SEPOLIA_RPC=<your-url>`

### 2. Wallet Private Key (1 min)
```
Trust Wallet:
  Settings → Wallets → [Your Wallet] → ... → Show Private Key

MetaMask:
  Three dots → Account Details → Export Private Key
```

**Add to both files:**
- `contracts/.env` → `DEPLOYER_PRIVATE_KEY=0x...`
- `backend/.env` → `DEPLOYER_PRIVATE_KEY=0x...`

**WARNING: Never share or commit this key!**

### 3. Get Testnet ETH (2 min)
```
1. Go to: https://www.alchemy.com/faucets/base-sepolia
2. Enter your wallet address
3. Complete captcha
4. Receive free testnet ETH
```

### 4. Set Up Supabase Database (3 min)
```
1. Go to: https://supabase.com/dashboard
2. Click your project: cdzdrlldltfijpfdaqkf
3. Left sidebar → SQL Editor
4. New Query
5. Copy all from: backend/schema.sql
6. Paste and Run
7. Verify tables created in Table Editor
```

## Test It Works

### Start Backend
```bash
cd backend
npm start
```
Should see:
```
freelancepay api running on port 3000
supabase: connected
openai: connected
```

### Start Frontend
```bash
cd frontend
npm run dev
```
Should open browser at http://localhost:5173

### Test Wallet Connection
1. Click "Connect Wallet"
2. Approve in Trust Wallet/MetaMask
3. See your address in top right

### Create Test Job
1. Click "Create Job"
2. Fill form (use any wallet address for freelancer)
3. Submit
4. Check "My Jobs" - should see it there

## Deploy Smart Contracts (After Above Steps)

```bash
cd contracts

# create deployment script first
echo 'const hre = require("hardhat");

async function main() {
  console.log("deploying mock usdc...");
  const USDC = await hre.ethers.getContractFactory("MockUSDC");
  const usdc = await USDC.deploy();
  await usdc.waitForDeployment();
  console.log("mock usdc deployed to:", await usdc.getAddress());

  console.log("deploying escrow...");
  const Escrow = await hre.ethers.getContractFactory("FreelanceEscrow");
  const escrow = await Escrow.deploy(await usdc.getAddress());
  await escrow.waitForDeployment();
  console.log("escrow deployed to:", await escrow.getAddress());

  console.log("\nUpdate your .env files with:");
  console.log("CONTRACT_ADDRESS=" + await escrow.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});' > scripts/deploy.js

# deploy
npx hardhat run scripts/deploy.js --network baseSepolia
```

Copy the contract address and update:
- `backend/.env` → `CONTRACT_ADDRESS=0x...`
- `frontend/.env` → `VITE_CONTRACT_ADDRESS=0x...`

## Troubleshooting

**Backend won't start:**
- Check .env file exists in backend/
- Verify all API keys are set
- Make sure port 3000 is free

**Frontend won't start:**
- Check .env file exists in frontend/
- Try: `rm -rf node_modules && npm install`
- Check Node.js version (should be 18+)

**Wallet won't connect:**
- Make sure you're on Base Sepolia network
- Try refreshing page
- Check browser console for errors

**Contract deployment fails:**
- Verify you have testnet ETH
- Check private key is correct in .env
- Make sure RPC URL is correct

## What's Next

Once everything is running:
1. Test creating jobs
2. Test viewing jobs
3. Add smart contract integration to frontend
4. Implement work submission with IPFS
5. Test AI verification
6. Deploy to production

## Need Help?

Check these files:
- `README.md` - Full documentation
- `backend/SUPABASE_SETUP.md` - Database setup
- `.env.example` files - Environment variable reference

## Success Checklist

- [ ] Backend running on port 3000
- [ ] Frontend running on port 5173
- [ ] Wallet connects successfully
- [ ] Can create jobs in database
- [ ] Jobs appear in "My Jobs"
- [ ] Supabase tables exist
- [ ] Smart contracts deployed
- [ ] Contract address in .env files

If all checked, you're ready to go!
