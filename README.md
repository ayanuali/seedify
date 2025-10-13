# FreelancePay - AI-Powered Freelance Payment Router

AI verification + blockchain escrow for instant, secure freelance payments.

## Project Structure

```
seedify/
├── contracts/       # Solidity smart contracts
├── backend/         # Express API + AI verification
├── frontend/        # React app with Thirdweb
└── README.md
```

## Setup Status

### ✅ Completed
- Project structure created
- Environment files configured
- Git ignore set up (secrets protected)

### ⏳ Still Need
1. **Alchemy Base Sepolia App**
   - Go to https://dashboard.alchemy.com
   - Create new app → Select "Base Sepolia"
   - Copy API key and RPC URL
   - Update `contracts/.env` and `backend/.env`

2. **Trust Wallet Private Key**
   - Open Trust Wallet
   - Settings → Wallets → [Your Wallet] → ... → Show Private Key
   - Copy key (starts with 0x)
   - Add to `contracts/.env` and `backend/.env`

3. **Get Testnet ETH**
   - Visit https://www.alchemy.com/faucets/base-sepolia
   - Enter your wallet address
   - Get free testnet ETH for gas

## API Keys Configured

- ✅ OpenAI (AI verification)
- ✅ Thirdweb (wallet connection)
- ✅ Supabase (database)
- ✅ Pinata (IPFS storage)
- ⏳ Alchemy Base Sepolia (need to create)
- ⏳ Wallet private key (need to export)

## Next Steps

1. Finish API key setup (Alchemy + wallet)
2. Install dependencies
3. Write smart contracts
4. Build backend API
5. Create frontend
6. Deploy to testnet
7. Test full flow

## Security

All secrets are in `.env` files that are gitignored. Never commit:
- Private keys
- API keys
- Passwords

The `.gitignore` is already configured to protect these files.
