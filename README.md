# FreelancePay

**Live Demo:** https://seedify-kohl.vercel.app

## What's This About?

I built FreelancePay for the Seedify competition because freelance payments are honestly kind of broken. Clients worry about paying for bad work, freelancers worry about not getting paid at all. It's a trust problem.

So I combined AI and blockchain to fix it:
- **Smart contracts hold the money** - no one can run off with it
- **AI checks the work** - using GPT-4o to review code and content
- **Fast payments** - no waiting weeks for manual approval
- **2% fee** - way cheaper than Upwork's 20%

## How It Works

1. **Client creates a job** - USDC gets locked in the smart contract
2. **Freelancer does the work** - submits a link when done
3. **AI reviews it automatically** - checks code quality or content originality
4. **Client approves** - payment releases instantly (minus 2% platform fee)

That's it. No middleman holding your money for weeks.

## The Problem I'm Solving

Every freelancer has been there:
- "I'll pay you when I feel like it"
- "This work isn't good enough" (even when it is)
- Waiting 30 days for payment processors

Every client has been there too:
- "Here's my terrible code, pay me anyway"
- No way to verify quality before paying
- Disputes that take forever to resolve

FreelancePay fixes both sides.

## Tech I Used

### Smart Contracts
- Solidity on Polygon Amoy testnet
- Hardhat for development
- OpenZeppelin for security (ReentrancyGuard and stuff)

**Live contracts:**
- Escrow: `0x03d47CbF9a57951Cbd72e5236A70A94C1A038Cb1`
- Test USDC: `0x98525dD5Fd0f11767eAF55a50CD10A3BD66e982E`

[Check them on PolygonScan](https://amoy.polygonscan.com/address/0x03d47CbF9a57951Cbd72e5236A70A94C1A038Cb1)

### Backend
- Node.js + Express API
- OpenAI GPT-4o-mini for verification
- Supabase for the database
- Deployed on Render: https://freelancepay-api.onrender.com

### Frontend
- React + Vite (because it's fast)
- Thirdweb for wallet stuff
- Deployed on Vercel

## What Works Right Now

✅ Connect your wallet (MetaMask, TrustWallet, whatever)
✅ Create jobs and lock USDC in escrow
✅ Submit work as a freelancer
✅ AI automatically reviews code and content
✅ Approve payments or open disputes
✅ Everything happens on-chain

## Try It Out

**You'll need:**
- A Web3 wallet
- Polygon Amoy testnet selected
- Some POL for gas (free from faucet)

**Steps:**
1. Go to https://seedify-kohl.vercel.app
2. Connect your wallet
3. Get free POL from https://faucet.polygon.technology if you need it
4. Create a job (test USDC mints automatically)
5. Submit some work
6. Watch AI verify it
7. Release payment

The whole flow works end-to-end.

## Running It Locally

If you want to mess with the code:

```bash
git clone https://github.com/ayanuali/seedify.git
cd seedify

# Backend
cd backend
npm install
node server.js

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

You'll need to set up your own `.env` files with API keys and stuff. Check the env examples in each folder.

## The Business Model

2% platform fee on completed jobs. That's it.

If you complete a $100 job:
- Freelancer gets $98
- Platform gets $2
- Client paid $100

Way better than the 10-20% most platforms charge.

## What's Next

If this gets traction, I'd add:
- More payment tokens (DAI, USDT, etc.)
- Milestone-based payments for big projects
- Reputation scores for freelancers
- Maybe a DAO for dispute resolution
- Mobile app

But for now, it's a working MVP that solves a real problem.

## Project Structure

```
seedify/
├── contracts/       # Smart contracts (Solidity)
├── backend/        # API server (Express)
└── frontend/       # Web app (React)
```

Pretty straightforward.

## Security Stuff

- ReentrancyGuard prevents reentrancy attacks
- All addresses get validated
- Secrets in `.env` files (gitignored)
- Network verification on frontend
- CORS protection on backend

Not perfect, but it's a testnet demo. For mainnet I'd get it audited.

## Links

- **Live App:** https://seedify-kohl.vercel.app
- **Backend API:** https://freelancepay-api.onrender.com
- **Smart Contracts:** https://amoy.polygonscan.com/address/0x03d47CbF9a57951Cbd72e5236A70A94C1A038Cb1
- **My GitHub:** https://github.com/ayanuali

## Why I Built This

I've done freelance work before and payment disputes suck. Either you're waiting forever to get paid, or arguing about whether the work is good enough.

AI can handle the initial quality check objectively. Blockchain handles the money trustlessly. Seemed like an obvious combo.

Built this for Seedify in a few days. If you find bugs or have ideas, open an issue.

---

Built by [@ayanuali](https://github.com/ayanuali) for Seedify Vibe Coins Competition
