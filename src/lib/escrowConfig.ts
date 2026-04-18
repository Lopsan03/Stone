import type { Address } from 'viem';

const chainIdRaw = import.meta.env.VITE_ESCROW_CHAIN_ID?.trim() || '10143';
const rpcUrl = import.meta.env.VITE_ESCROW_RPC_URL?.trim() || '';
const contractAddress = import.meta.env.VITE_ESCROW_CONTRACT_ADDRESS?.trim() || '';

export const escrowConfig = {
  chainId: Number(chainIdRaw),
  rpcUrl,
  contractAddress: contractAddress as Address,
  chainName: import.meta.env.VITE_ESCROW_CHAIN_NAME?.trim() || 'Escrow Chain',
  nativeCurrencySymbol: import.meta.env.VITE_ESCROW_NATIVE_SYMBOL?.trim() || 'MON',
};

if (!Number.isInteger(escrowConfig.chainId) || escrowConfig.chainId <= 0) {
  throw new Error('VITE_ESCROW_CHAIN_ID must be a positive integer');
}

export const hasEscrowConfig = Boolean(escrowConfig.rpcUrl && escrowConfig.contractAddress);
