# MonadHackthon Stone Escrow Frontend

This repository now includes the original Stone milestone escrow contract and a minimal on-chain integration layer wired to the UI.

## What Was Added

- Exact Solidity port: `contracts/src/StoneEscrow.sol`
- ABI for frontend reads/writes: `src/lib/StoneEscrow.abi.ts`
- Env-based chain/contract config: `src/lib/escrowConfig.ts`
- Contract read/write helpers using `viem`: `src/lib/stoneEscrowClient.ts`
- UI hook integration for live txs: `src/hooks/useEscrow.ts`

## Required Environment Variables

Copy `.env.example` to `.env.local` and set:

- `VITE_ESCROW_CHAIN_ID`
- `VITE_ESCROW_RPC_URL`
- `VITE_ESCROW_CONTRACT_ADDRESS`
- Optional: `VITE_ESCROW_CHAIN_NAME`, `VITE_ESCROW_NATIVE_SYMBOL`

## Run Locally

1. Install dependencies:
   `npm install`
2. Create `.env.local` from `.env.example` and fill escrow values.
3. Start the app:
   `npm run dev`

## Connected Contract Flows

The app now calls these on-chain functions:

- `createJob(address,string,string,string[],uint256[])`
- `depositFunds(uint256)` (payable)
- `approveAndPayMilestone(uint256,uint256)`
- Reads: `getJob`, `getMilestones`, `getJobProgress`, `jobCounter`

## Basic Usage

1. Click **Connect Wallet** in the header.
2. Ensure your wallet is on the configured chain.
3. In **Relationships**, accept a proposal so contract creation is available.
4. In **Contracts**, create a contract (this writes `createJob`).
5. Client clicks **Deposit Escrow** (this writes `depositFunds` with native token).
6. Freelancer marks a milestone done in UI.
7. Client clicks **Approve & Release** (this writes `approveAndPayMilestone`).

## Notes

- The Solidity logic is preserved exactly from StoneEscrow.
- Payments are native-token only, not ERC-20.
- No dispute/refund/cancel logic exists on-chain in `StoneEscrow`.
