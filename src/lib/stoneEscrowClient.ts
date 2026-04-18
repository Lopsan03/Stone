import {
  createPublicClient,
  createWalletClient,
  custom,
  formatUnits,
  http,
  parseEventLogs,
  parseUnits,
  type Address,
} from 'viem';
import { stoneEscrowAbi } from './StoneEscrow.abi';
import { escrowConfig, hasEscrowConfig } from './escrowConfig';

const escrowChain = {
  id: escrowConfig.chainId,
  name: escrowConfig.chainName,
  nativeCurrency: {
    name: escrowConfig.nativeCurrencySymbol,
    symbol: escrowConfig.nativeCurrencySymbol,
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: [escrowConfig.rpcUrl],
    },
    public: {
      http: [escrowConfig.rpcUrl],
    },
  },
} as const;

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] | Record<string, unknown> }) => Promise<unknown>;
    };
  }
}

export type ChainMilestone = {
  title: string;
  amount: bigint;
  approved: boolean;
  paid: boolean;
};

export type ChainJob = {
  id: bigint;
  client: Address;
  freelancer: Address;
  title: string;
  description: string;
  totalAmount: bigint;
  fundedAmount: bigint;
  createdAt: bigint;
  exists: boolean;
  milestoneCount: bigint;
};

export type ChainJobProgress = {
  totalMilestones: bigint;
  paidMilestones: bigint;
  totalPaid: bigint;
  remainingEscrow: bigint;
};

const publicClient = createPublicClient({
  chain: escrowChain,
  transport: http(escrowConfig.rpcUrl || 'http://localhost:8545'),
});

function assertEscrowConfigured() {
  if (!hasEscrowConfig) {
    const missing: string[] = [];
    if (!escrowConfig.rpcUrl) missing.push('VITE_ESCROW_RPC_URL');
    if (!escrowConfig.contractAddress) missing.push('VITE_ESCROW_CONTRACT_ADDRESS');
    throw new Error(`Missing escrow config: ${missing.join(', ')}`);
  }
}

function getInjectedProvider() {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('No injected wallet found. Install MetaMask or a compatible wallet.');
  }
  return window.ethereum;
}

async function getWalletClient() {
  const provider = getInjectedProvider();
  return createWalletClient({
    chain: escrowChain,
    transport: custom(provider),
  });
}

export async function connectWallet(): Promise<Address> {
  const provider = getInjectedProvider();
  const accounts = (await provider.request({ method: 'eth_requestAccounts' })) as string[];
  if (!accounts.length) {
    throw new Error('Wallet did not return any accounts');
  }
  return accounts[0] as Address;
}

export async function getConnectedAccount(): Promise<Address | null> {
  if (typeof window === 'undefined' || !window.ethereum) return null;
  const accounts = (await window.ethereum.request({ method: 'eth_accounts' })) as string[];
  return accounts.length ? (accounts[0] as Address) : null;
}

export async function getCurrentChainId(): Promise<number | null> {
  if (typeof window === 'undefined' || !window.ethereum) return null;
  const idHex = (await window.ethereum.request({ method: 'eth_chainId' })) as string;
  return Number.parseInt(idHex, 16);
}

export async function switchToEscrowChain() {
  const provider = getInjectedProvider();
  try {
    await provider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${escrowConfig.chainId.toString(16)}` }],
    });
  } catch {
    await provider.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: `0x${escrowConfig.chainId.toString(16)}`,
          chainName: escrowConfig.chainName,
          nativeCurrency: {
            name: escrowConfig.nativeCurrencySymbol,
            symbol: escrowConfig.nativeCurrencySymbol,
            decimals: 18,
          },
          rpcUrls: [escrowConfig.rpcUrl],
        },
      ],
    });
  }
}

export async function readJob(jobId: bigint): Promise<ChainJob> {
  assertEscrowConfigured();
  return publicClient.readContract({
    address: escrowConfig.contractAddress,
    abi: stoneEscrowAbi,
    functionName: 'getJob',
    args: [jobId],
  } as any) as Promise<ChainJob>;
}

export async function readMilestones(jobId: bigint): Promise<ChainMilestone[]> {
  assertEscrowConfigured();
  return publicClient.readContract({
    address: escrowConfig.contractAddress,
    abi: stoneEscrowAbi,
    functionName: 'getMilestones',
    args: [jobId],
  } as any) as Promise<ChainMilestone[]>;
}

export async function readJobProgress(jobId: bigint): Promise<ChainJobProgress> {
  assertEscrowConfigured();
  const [totalMilestones, paidMilestones, totalPaid, remainingEscrow] = await publicClient.readContract({
    address: escrowConfig.contractAddress,
    abi: stoneEscrowAbi,
    functionName: 'getJobProgress',
    args: [jobId],
  } as any) as [bigint, bigint, bigint, bigint];

  return { totalMilestones, paidMilestones, totalPaid, remainingEscrow };
}

export async function readJobCounter(): Promise<bigint> {
  assertEscrowConfigured();
  return publicClient.readContract({
    address: escrowConfig.contractAddress,
    abi: stoneEscrowAbi,
    functionName: 'jobCounter',
  } as any) as Promise<bigint>;
}

export async function createJobTx(args: {
  account: Address;
  freelancer: Address;
  title: string;
  description: string;
  milestoneTitles: string[];
  milestoneAmountsMon: number[];
}): Promise<bigint> {
  assertEscrowConfigured();
  const walletClient = await getWalletClient();

  const hash = await walletClient.writeContract({
    address: escrowConfig.contractAddress,
    abi: stoneEscrowAbi,
    functionName: 'createJob',
    args: [
      args.freelancer,
      args.title,
      args.description,
      args.milestoneTitles,
      args.milestoneAmountsMon.map((amount) => parseUnits(String(amount), 18)),
    ],
    account: args.account,
    chain: escrowChain,
  });

  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  const logs = parseEventLogs({ abi: stoneEscrowAbi, logs: receipt.logs, eventName: 'JobCreated' });
  const createdLog = logs[0];

  if (!createdLog || !createdLog.args.jobId) {
    throw new Error('Unable to read JobCreated event from transaction receipt');
  }

  return createdLog.args.jobId;
}

export async function depositFundsTx(args: { account: Address; jobId: bigint; amountMon: number }) {
  assertEscrowConfigured();
  const walletClient = await getWalletClient();
  const hash = await walletClient.writeContract({
    address: escrowConfig.contractAddress,
    abi: stoneEscrowAbi,
    functionName: 'depositFunds',
    args: [args.jobId],
    value: parseUnits(String(args.amountMon), 18),
    account: args.account,
    chain: escrowChain,
  });
  await publicClient.waitForTransactionReceipt({ hash });
}

export async function approveAndPayMilestoneTx(args: { account: Address; jobId: bigint; milestoneIndex: number }) {
  assertEscrowConfigured();
  const walletClient = await getWalletClient();
  const hash = await walletClient.writeContract({
    address: escrowConfig.contractAddress,
    abi: stoneEscrowAbi,
    functionName: 'approveAndPayMilestone',
    args: [args.jobId, BigInt(args.milestoneIndex)],
    account: args.account,
    chain: escrowChain,
  });
  await publicClient.waitForTransactionReceipt({ hash });
}

export function fromWei(value: bigint): number {
  return Number(formatUnits(value, 18));
}
