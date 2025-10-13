const hre = require("hardhat");
const ethers = require("ethers");

async function main() {
  console.log("Starting deployment to Polygon Amoy...\n");

  // setup provider and wallet for Amoy
  const provider = new ethers.JsonRpcProvider(process.env.AMOY_RPC);
  const privateKey = process.env.DEPLOYER_PRIVATE_KEY;
  const wallet = new ethers.Wallet(privateKey, provider);

  console.log("Deploying contracts with account:", wallet.address);

  // check balance
  const balance = await provider.getBalance(wallet.address);
  console.log("Account balance:", ethers.formatEther(balance), "POL\n");

  if (parseFloat(ethers.formatEther(balance)) < 0.01) {
    throw new Error("Insufficient POL balance. Need at least 0.01 POL");
  }

  // get contract artifacts
  const usdcArtifact = require("../artifacts/contracts/MockUSDC.sol/MockUSDC.json");
  const escrowArtifact = require("../artifacts/contracts/FreelanceEscrow.sol/FreelanceEscrow.json");

  // deploy mock usdc first
  console.log("Deploying MockUSDC...");
  const USDCFactory = new ethers.ContractFactory(usdcArtifact.abi, usdcArtifact.bytecode, wallet);
  const usdc = await USDCFactory.deploy();
  await usdc.waitForDeployment();
  const usdcAddress = await usdc.getAddress();
  console.log("MockUSDC deployed to:", usdcAddress);

  // wait a bit to ensure transaction is fully processed
  console.log("Waiting for confirmation...");
  await new Promise(resolve => setTimeout(resolve, 3000));

  // deploy escrow contract
  console.log("\nDeploying FreelanceEscrow...");
  const EscrowFactory = new ethers.ContractFactory(escrowArtifact.abi, escrowArtifact.bytecode, wallet);
  const escrow = await EscrowFactory.deploy(usdcAddress);
  await escrow.waitForDeployment();
  const escrowAddress = await escrow.getAddress();
  console.log("FreelanceEscrow deployed to:", escrowAddress);

  console.log("\n✅ Deployment complete!");
  console.log("\n📝 Update your .env files with:");
  console.log("CONTRACT_ADDRESS=" + escrowAddress);
  console.log("\n💰 MockUSDC address (for testing):");
  console.log("USDC_ADDRESS=" + usdcAddress);
  console.log("\n🔍 View on Polygonscan:");
  console.log("Escrow: https://amoy.polygonscan.com/address/" + escrowAddress);
  console.log("USDC: https://amoy.polygonscan.com/address/" + usdcAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
