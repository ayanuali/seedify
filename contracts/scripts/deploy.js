const hre = require("hardhat");
const ethers = require("ethers");

async function main() {
  console.log("Starting deployment...\n");

  // setup provider and wallet
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

  // use hardhat test account #0 for local deployment (has 10000 ETH pre-funded)
  const privateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
  const wallet = new ethers.Wallet(privateKey, provider);

  console.log("Deploying contracts with account:", wallet.address);

  // check balance
  const balance = await provider.getBalance(wallet.address);
  console.log("Account balance:", ethers.formatEther(balance), "ETH\n");

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
  await new Promise(resolve => setTimeout(resolve, 2000));

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
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
