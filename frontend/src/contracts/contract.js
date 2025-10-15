import { ethers } from 'ethers';
import FreelanceEscrowABI from './FreelanceEscrow.json';

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;
const USDC_ADDRESS = '0x98525dD5Fd0f11767eAF55a50CD10A3BD66e982E'; // MockUSDC on Polygon Amoy

// simple erc20 abi for approve
const ERC20_ABI = [
  "function approve(address spender, uint256 amount) public returns (bool)",
  "function allowance(address owner, address spender) public view returns (uint256)",
  "function balanceOf(address account) public view returns (uint256)",
  "function mint(address to, uint256 amount) public"
];

export async function getContract(signer) {
  return new ethers.Contract(CONTRACT_ADDRESS, FreelanceEscrowABI.abi, signer);
}

export async function getUSDCContract(signer) {
  return new ethers.Contract(USDC_ADDRESS, ERC20_ABI, signer);
}

export async function approveUSDC(signer, amount) {
  const usdc = await getUSDCContract(signer);
  const amountInWei = ethers.utils.parseUnits(amount.toString(), 6); // usdc has 6 decimals

  const tx = await usdc.approve(CONTRACT_ADDRESS, amountInWei);
  await tx.wait();
  return tx;
}

export async function createJobOnChain(signer, freelancerAddress, amount) {
  const contract = await getContract(signer);
  const amountInWei = ethers.utils.parseUnits(amount.toString(), 6);

  const tx = await contract.createJob(freelancerAddress, amountInWei);
  const receipt = await tx.wait();

  // extract job id from event
  const event = receipt.logs.find(log => {
    try {
      const parsed = contract.interface.parseLog(log);
      return parsed.name === 'JobCreated';
    } catch {
      return false;
    }
  });

  if (event) {
    const parsed = contract.interface.parseLog(event);
    return {
      chainJobId: parsed.args.jobId.toString(),
      txHash: receipt.hash
    };
  }

  return { chainJobId: null, txHash: receipt.hash };
}

export async function mintTestUSDC(signer, amount) {
  const usdc = await getUSDCContract(signer);
  const amountInWei = ethers.utils.parseUnits(amount.toString(), 6);

  const tx = await usdc.mint(await signer.getAddress(), amountInWei);
  await tx.wait();
  return tx;
}

export async function checkUSDCBalance(signer) {
  const usdc = await getUSDCContract(signer);
  const balance = await usdc.balanceOf(await signer.getAddress());
  return ethers.utils.formatUnits(balance, 6);
}
