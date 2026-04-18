import { useState, useCallback, useMemo, useEffect } from 'react';
import type { Address } from 'viem';
import type {
  Contract,
  MarketplaceProfile,
  Milestone,
  ProjectTab,
  Proposal,
  Relationship,
  Reputation,
  UserMode,
} from '../types';
import {
  approveAndPayMilestoneTx,
  connectWallet as connectEscrowWallet,
  createJobTx,
  depositFundsTx,
  fromWei,
  getConnectedAccount,
  getCurrentChainId,
  readJob,
  readJobCounter,
  readJobProgress,
  readMilestones,
  switchToEscrowChain,
} from '../lib/stoneEscrowClient';
import { escrowConfig, hasEscrowConfig } from '../lib/escrowConfig';

const ME_CLIENT_ID = 'me-client';
const ME_FREELANCER_ID = 'me-freelancer';
const ME_CLIENT_WALLET = '0x71C...4f2e';
const ME_FREELANCER_WALLET = '0x890...abcd';

// Initial Mock Data for Demo
const MOCK_REPUTATION: Reputation = {
  score: 98,
  completedProjects: 24,
  totalVolume: 12500,
  averageRating: 4.9,
};

const MOCK_CLIENT_REPUTATION: Reputation = {
  score: 95,
  completedProjects: 19,
  totalVolume: 21000,
  averageRating: 4.8,
};

const MOCK_MARKETPLACE_PROFILES: MarketplaceProfile[] = [
  {
    id: ME_CLIENT_ID,
    name: 'Alex Mercer',
    role: 'Client',
    headline: 'Product founder building fintech and SaaS experiences.',
    skills: ['Product', 'Roadmapping', 'Growth'],
    rating: 4.9,
    completedProjects: 18,
    minBudget: 2000,
    maxBudget: 25000,
    walletAddress: '0x71C...4f2e',
  },
  {
    id: ME_FREELANCER_ID,
    name: 'Alex Mercer',
    role: 'Freelancer',
    headline: 'Senior full-stack engineer focused on web3 and product UX.',
    skills: ['React', 'Solidity', 'Node.js', 'UI Engineering'],
    rating: 4.95,
    completedProjects: 24,
    minBudget: 1500,
    maxBudget: 30000,
    hourlyRate: 75,
    walletAddress: ME_FREELANCER_WALLET,
  },
  {
    id: 'f-olivia',
    name: 'Olivia Chen',
    role: 'Freelancer',
    headline: 'Frontend specialist for dashboards and design systems.',
    skills: ['React', 'TypeScript', 'Design Systems'],
    rating: 4.8,
    completedProjects: 31,
    minBudget: 1000,
    maxBudget: 12000,
    hourlyRate: 65,
    walletAddress: '0xOLI...88cf',
  },
  {
    id: 'f-rafael',
    name: 'Rafael Stone',
    role: 'Freelancer',
    headline: 'Backend and smart-contract delivery for milestone payments.',
    skills: ['Rust', 'Smart Contracts', 'APIs'],
    rating: 4.7,
    completedProjects: 20,
    minBudget: 3000,
    maxBudget: 40000,
    hourlyRate: 90,
    walletAddress: '0xRAF...9b12',
  },
  {
    id: 'c-monad-labs',
    name: 'Monad Labs Startup',
    role: 'Client',
    headline: 'Hiring teams for rapid web3 product experiments.',
    skills: ['B2B SaaS', 'Web3 Product', 'Analytics'],
    rating: 4.9,
    completedProjects: 45,
    minBudget: 5000,
    maxBudget: 50000,
    walletAddress: '0xMLS...7c22',
  },
];

const MOCK_PROPOSALS: Proposal[] = [
  {
    id: 'p-1',
    fromUserId: 'f-olivia',
    toUserId: ME_CLIENT_ID,
    projectTitle: 'Landing + Dashboard Revamp',
    projectSummary: 'Redesign user journey and build a conversion-first dashboard stack.',
    proposedBudget: 7800,
    estimatedDays: 21,
    milestoneDraft: [
      { title: 'Discovery + UX maps', amount: 1800 },
      { title: 'UI system + implementation', amount: 3900 },
      { title: 'QA + handoff', amount: 2100 },
    ],
    status: 'Pending',
    createdAt: Date.now() - 1000 * 60 * 60 * 8,
  },
  {
    id: 'p-client-1',
    fromUserId: 'c-monad-labs',
    toUserId: ME_FREELANCER_ID,
    projectTitle: 'Smart Contract Escrow Dashboard',
    projectSummary: 'Need a freelancer to build a client/freelancer escrow dashboard with milestone approvals and payouts.',
    proposedBudget: 12000,
    estimatedDays: 30,
    milestoneDraft: [
      { title: 'Architecture and UX', amount: 2500 },
      { title: 'Contract and frontend implementation', amount: 6500 },
      { title: 'Testing and launch support', amount: 3000 },
    ],
    status: 'Pending',
    createdAt: Date.now() - 1000 * 60 * 60 * 3,
  },
  {
    id: 'p-client-2',
    fromUserId: ME_CLIENT_ID,
    toUserId: ME_FREELANCER_ID,
    projectTitle: 'B2B Onboarding Flow and Admin Panel',
    projectSummary: 'Looking for a freelancer to deliver onboarding workflow, admin permissions, and analytics pages.',
    proposedBudget: 8400,
    estimatedDays: 22,
    milestoneDraft: [
      { title: 'Flow mapping and UI specs', amount: 1700 },
      { title: 'Implementation and integration', amount: 4700 },
      { title: 'QA and handoff', amount: 2000 },
    ],
    status: 'Pending',
    createdAt: Date.now() - 1000 * 60 * 60 * 6,
  },
  {
    id: 'p-client-3',
    fromUserId: 'c-monad-labs',
    toUserId: ME_FREELANCER_ID,
    projectTitle: 'Web3 Payment Widget Integration',
    projectSummary: 'Integrate on-chain payment widget with dispute-ready milestone flow and transaction history screens.',
    proposedBudget: 5600,
    estimatedDays: 16,
    milestoneDraft: [
      { title: 'Wallet and auth plumbing', amount: 1500 },
      { title: 'Milestone payout flows', amount: 2600 },
      { title: 'Monitoring and polish', amount: 1500 },
    ],
    status: 'Pending',
    createdAt: Date.now() - 1000 * 60 * 60 * 10,
  },
];

const MOCK_RELATIONSHIPS: Relationship[] = [
  {
    id: 'r-1',
    proposalId: 'seed-active',
    clientUserId: ME_CLIENT_ID,
    freelancerUserId: ME_FREELANCER_ID,
    status: 'Active',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 6,
  },
];

type CompletedMilestonesMap = Record<string, Record<string, boolean>>;

export function useEscrow() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [freelancerReputation] = useState<Reputation>(MOCK_REPUTATION);
  const [clientReputation] = useState<Reputation>(MOCK_CLIENT_REPUTATION);
  const [userMode, setUserMode] = useState<UserMode>('Client');
  const [activeTab, setActiveTab] = useState<ProjectTab>('Marketplace');
  const [marketplaceProfiles] = useState<MarketplaceProfile[]>(MOCK_MARKETPLACE_PROFILES);
  const [proposals, setProposals] = useState<Proposal[]>(MOCK_PROPOSALS);
  const [relationships, setRelationships] = useState<Relationship[]>(MOCK_RELATIONSHIPS);
  const [isPendingTx, setIsPendingTx] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [isWrongChain, setIsWrongChain] = useState(false);
  const [completedMilestones, setCompletedMilestones] = useState<CompletedMilestonesMap>({});

  const currentUserId = userMode === 'Client' ? ME_CLIENT_ID : ME_FREELANCER_ID;
  const normalizedWallet = walletAddress.toLowerCase();

  const syncChainState = useCallback(async () => {
    if (!hasEscrowConfig) {
      setContracts([]);
      return;
    }

    try {
      const connected = await getConnectedAccount();
      setWalletAddress(connected ?? '');

      const chainId = await getCurrentChainId();
      setIsWrongChain(chainId !== null && chainId !== escrowConfig.chainId);

      const counter = await readJobCounter();
      const ids = Array.from({ length: Number(counter) }, (_, index) => BigInt(index + 1));

      const loaded = await Promise.all(
        ids.map(async (jobId): Promise<Contract> => {
          const [job, milestones, progress] = await Promise.all([
            readJob(jobId),
            readMilestones(jobId),
            readJobProgress(jobId),
          ]);

          const paidMilestones = Number(progress.paidMilestones);
          const totalMilestones = Number(progress.totalMilestones);
          const localCompleted = completedMilestones[String(job.id)] ?? {};

          return {
            id: String(job.id),
            title: job.title,
            description: job.description,
            clientAddress: job.client,
            freelancerAddress: job.freelancer,
            totalBudget: fromWei(job.totalAmount),
            depositedAmount: fromWei(job.totalAmount) - fromWei(progress.totalPaid),
            releasedAmount: fromWei(progress.totalPaid),
            status:
              paidMilestones === totalMilestones && totalMilestones > 0
                ? 'Completed'
                : job.fundedAmount > 0n || progress.totalPaid > 0n
                  ? 'Active'
                  : 'Proposed',
            milestones: milestones.map((milestone, index): Milestone => {
              const milestoneId = `${job.id.toString()}-${index}`;
              const isCompletedLocal = Boolean(localCompleted[milestoneId]);
              return {
                id: milestoneId,
                title: milestone.title,
                amount: fromWei(milestone.amount),
                status: milestone.paid ? 'Paid' : isCompletedLocal ? 'Completed' : 'Pending',
              };
            }),
            createdAt: Number(job.createdAt) * 1000,
          };
        })
      );

      setContracts(loaded.sort((a, b) => b.createdAt - a.createdAt));
    } catch (error) {
      console.error(error);
    }
  }, [completedMilestones]);

  useEffect(() => {
    syncChainState();
  }, [syncChainState]);

  const totalEarnings = useMemo(() => contracts.reduce((acc, c) => acc + c.releasedAmount, 0), [contracts]);

  const visibleProfiles = useMemo(
    () => marketplaceProfiles.filter((profile) => profile.role !== userMode),
    [marketplaceProfiles, userMode]
  );

  const incomingProposals = useMemo(
    () => proposals.filter((proposal) => proposal.toUserId === currentUserId),
    [proposals, currentUserId]
  );

  const outgoingProposals = useMemo(
    () => proposals.filter((proposal) => proposal.fromUserId === currentUserId),
    [proposals, currentUserId]
  );

  const freelancerMarketplaceProjects = useMemo(
    () =>
      proposals.filter((proposal) => {
        const sender = marketplaceProfiles.find((profile) => profile.id === proposal.fromUserId);
        return proposal.toUserId === currentUserId && proposal.status === 'Pending' && sender?.role === 'Client';
      }),
    [currentUserId, marketplaceProfiles, proposals]
  );

  const activeRelationships = useMemo(
    () => relationships.filter((rel) => (rel.clientUserId === currentUserId || rel.freelancerUserId === currentUserId) && rel.status !== 'Declined'),
    [relationships, currentUserId]
  );

  const contractsForCurrentUser = useMemo(
    () =>
      contracts.filter((contract) => {
        if (!normalizedWallet) return false;
        if (userMode === 'Client') return contract.clientAddress.toLowerCase() === normalizedWallet;
        return contract.freelancerAddress.toLowerCase() === normalizedWallet;
      }),
    [contracts, normalizedWallet, userMode]
  );

  const activeContracts = useMemo(
    () =>
      contractsForCurrentUser.filter(
        (contract) => contract.status === 'Active' || contract.status === 'Funded' || contract.status === 'Proposed'
      ),
    [contractsForCurrentUser]
  );

  const completedContracts = useMemo(
    () => contractsForCurrentUser.filter((contract) => contract.status === 'Completed'),
    [contractsForCurrentUser]
  );

  const getProfileById = useCallback(
    (id: string) => marketplaceProfiles.find((profile) => profile.id === id),
    [marketplaceProfiles]
  );

  const canProgressMilestone = useCallback((milestones: Milestone[], milestoneId: string) => {
    const milestoneIndex = milestones.findIndex((item) => item.id === milestoneId);
    if (milestoneIndex < 0) return false;

    // Enforce strict phase order: previous milestones must already be paid.
    return milestones.slice(0, milestoneIndex).every((item) => item.status === 'Paid');
  }, []);

  const sendProposal = useCallback(
    async (data: {
      toUserId: string;
      projectTitle: string;
      projectSummary: string;
      proposedBudget: number;
      estimatedDays: number;
      milestoneDraft: Omit<Milestone, 'id' | 'status'>[];
    }) => {
      if (userMode !== 'Client') return;
      setIsPendingTx(true);
      await new Promise((resolve) => setTimeout(resolve, 1200));

      const proposal: Proposal = {
        id: `p-${Date.now()}`,
        fromUserId: currentUserId,
        toUserId: data.toUserId,
        projectTitle: data.projectTitle,
        projectSummary: data.projectSummary,
        proposedBudget: data.proposedBudget,
        estimatedDays: data.estimatedDays,
        milestoneDraft: data.milestoneDraft,
        status: 'Pending',
        createdAt: Date.now(),
      };

      setProposals((prev) => [proposal, ...prev]);
      setIsPendingTx(false);
    },
    [currentUserId, userMode]
  );

  const acceptProposal = useCallback(
    async (proposalId: string) => {
      setIsPendingTx(true);
      await new Promise((resolve) => setTimeout(resolve, 1200));

      const proposal = proposals.find((item) => item.id === proposalId);
      if (!proposal) {
        setIsPendingTx(false);
        return;
      }

      setProposals((prev) => prev.map((item) => (item.id === proposalId ? { ...item, status: 'Accepted' } : item)));

      setRelationships((prev) => {
        const alreadyExists = prev.some((rel) => rel.proposalId === proposalId);
        if (alreadyExists) return prev;

        const fromProfile = getProfileById(proposal.fromUserId);
        const clientUserId = fromProfile?.role === 'Client' ? proposal.fromUserId : proposal.toUserId;
        const freelancerUserId = fromProfile?.role === 'Freelancer' ? proposal.fromUserId : proposal.toUserId;

        return [
          {
            id: `r-${Date.now()}`,
            proposalId,
            clientUserId,
            freelancerUserId,
            status: 'Active',
            createdAt: Date.now(),
          },
          ...prev,
        ];
      });

      setIsPendingTx(false);
    },
    [getProfileById, proposals]
  );

  const declineProposal = useCallback(async (proposalId: string) => {
    setIsPendingTx(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setProposals((prev) => prev.map((item) => (item.id === proposalId ? { ...item, status: 'Declined' } : item)));
    setIsPendingTx(false);
  }, []);

  const counterProposal = useCallback(
    async (proposalId: string, newBudget: number) => {
      setIsPendingTx(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setProposals((prev) => {
        const existing = prev.find((item) => item.id === proposalId);
        if (!existing) return prev;

        const counter: Proposal = {
          ...existing,
          id: `p-${Date.now()}`,
          fromUserId: currentUserId,
          toUserId: existing.fromUserId,
          proposedBudget: newBudget,
          status: 'Pending',
          createdAt: Date.now(),
        };

        return [
          counter,
          ...prev.map((item): Proposal => (item.id === proposalId ? { ...item, status: 'Countered' } : item)),
        ];
      });

      setIsPendingTx(false);
    },
    [currentUserId]
  );

  const requestToWorkOnProject = useCallback(
    async (projectProposalId: string) => {
      if (userMode !== 'Freelancer') return;

      const project = proposals.find((item) => item.id === projectProposalId);
      if (!project) return;

      const sender = getProfileById(project.fromUserId);
      if (sender?.role !== 'Client') return;

      setIsPendingTx(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const interestProposal: Proposal = {
        id: `p-${Date.now()}`,
        fromUserId: currentUserId,
        toUserId: project.fromUserId,
        projectTitle: `Application: ${project.projectTitle}`,
        projectSummary: `Freelancer requested to work on this client-posted project. Original request id: ${project.id}`,
        proposedBudget: project.proposedBudget,
        estimatedDays: project.estimatedDays,
        milestoneDraft: project.milestoneDraft,
        status: 'Pending',
        createdAt: Date.now(),
      };

      setProposals((prev) => [interestProposal, ...prev]);
      setIsPendingTx(false);
    },
    [currentUserId, getProfileById, proposals, userMode]
  );

  const connectWallet = useCallback(async () => {
    const account = await connectEscrowWallet();
    const chainId = await getCurrentChainId();
    setWalletAddress(account);
    setIsWrongChain(chainId !== null && chainId !== escrowConfig.chainId);
  }, []);

  const ensureChain = useCallback(async () => {
    if (!walletAddress) {
      throw new Error('Connect wallet first');
    }
    if (isWrongChain) {
      await switchToEscrowChain();
      const chainId = await getCurrentChainId();
      setIsWrongChain(chainId !== null && chainId !== escrowConfig.chainId);
      if (chainId !== escrowConfig.chainId) {
        throw new Error('Please switch to the configured escrow chain');
      }
    }
  }, [isWrongChain, walletAddress]);

  const createContract = useCallback(async (data: Omit<Contract, 'id' | 'clientAddress' | 'status' | 'depositedAmount' | 'releasedAmount' | 'createdAt'>) => {
    setIsPendingTx(true);
    try {
      await ensureChain();
      await createJobTx({
        account: walletAddress as Address,
        freelancer: data.freelancerAddress as Address,
        title: data.title,
        description: data.description,
        milestoneTitles: data.milestones.map((milestone) => milestone.title),
        milestoneAmountsMon: data.milestones.map((milestone) => milestone.amount),
      });
      await syncChainState();
    } catch (error) {
      console.error(error);
      window.alert(error instanceof Error ? error.message : 'Failed to create contract');
    } finally {
      setIsPendingTx(false);
    }
  }, [ensureChain, syncChainState, walletAddress]);

  const fundContract = useCallback(async (contractId: string) => {
    setIsPendingTx(true);
    try {
      await ensureChain();
      const contract = contracts.find((item) => item.id === contractId);
      if (!contract) throw new Error('Contract not found');

      await depositFundsTx({
        account: walletAddress as Address,
        jobId: BigInt(contractId),
        amountMon: contract.totalBudget,
      });
      await syncChainState();
    } catch (error) {
      console.error(error);
      window.alert(error instanceof Error ? error.message : 'Failed to deposit funds');
    } finally {
      setIsPendingTx(false);
    }
  }, [contracts, ensureChain, syncChainState, walletAddress]);

  const markMilestoneCompleted = useCallback(async (contractId: string, milestoneId: string) => {
    setContracts((prev) =>
      prev.map((contract) => {
        if (contract.id !== contractId) return contract;
        const milestone = contract.milestones.find((item) => item.id === milestoneId);
        if (!milestone) return contract;

        const isContractFunded = contract.status === 'Active' && contract.depositedAmount > 0;
        if (!isContractFunded || milestone.status !== 'Pending' || !canProgressMilestone(contract.milestones, milestoneId)) {
          return contract;
        }

        return {
          ...contract,
          milestones: contract.milestones.map((item): Milestone =>
            item.id === milestoneId ? { ...item, status: 'Completed' } : item
          ),
        };
      })
    );

    setCompletedMilestones((prev) => ({
      ...prev,
      [contractId]: {
        ...(prev[contractId] ?? {}),
        [milestoneId]: true,
      },
    }));
  }, [canProgressMilestone]);

  const approveAndPayMilestone = useCallback(async (contractId: string, milestoneId: string) => {
    setIsPendingTx(true);
    try {
      await ensureChain();

      const contract = contracts.find((item) => item.id === contractId);
      if (!contract) throw new Error('Contract not found');

      const milestoneIndex = contract.milestones.findIndex((item) => item.id === milestoneId);
      if (milestoneIndex < 0) throw new Error('Milestone not found');

      const milestone = contract.milestones[milestoneIndex];
      if (milestone.status !== 'Completed') {
        throw new Error('Freelancer must mark milestone done before approval');
      }

      await approveAndPayMilestoneTx({
        account: walletAddress as Address,
        jobId: BigInt(contractId),
        milestoneIndex,
      });

      setCompletedMilestones((prev) => ({
        ...prev,
        [contractId]: {
          ...(prev[contractId] ?? {}),
          [milestoneId]: false,
        },
      }));

      await syncChainState();
    } catch (error) {
      console.error(error);
      window.alert(error instanceof Error ? error.message : 'Failed to approve and pay milestone');
    } finally {
      setIsPendingTx(false);
    }
  }, [contracts, ensureChain, syncChainState, walletAddress]);

  const initiateDispute = useCallback(async (contractId: string, reason: string) => {
    setIsPendingTx(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setContracts(prev => prev.map(c => {
      if (c.id !== contractId) return c;
      return {
        ...c,
        status: 'Disputed',
        disputeStatus: 'Pending' as const,
        disputeReason: reason,
        disputedAt: Date.now(),
      };
    }));
    setIsPendingTx(false);
  }, []);

  const resolveDispute = useCallback(async (contractId: string, resolution: 'refund' | 'release') => {
    setIsPendingTx(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setContracts(prev => prev.map(c => {
      if (c.id !== contractId) return c;
      
      if (resolution === 'refund') {
        // Refund all deposited funds to client
        return {
          ...c,
          status: 'Completed',
          disputeStatus: 'Refunded' as const,
          depositedAmount: 0,
          releasedAmount: 0,
          milestones: c.milestones.map(m => ({ ...m, status: 'Pending' as const }))
        };
      } else {
        // Release remaining locked funds to freelancer
        return {
          ...c,
          status: 'Completed',
          disputeStatus: 'Resolved' as const,
          releasedAmount: c.depositedAmount,
          milestones: c.milestones.map(m => ({ ...m, status: 'Paid' as const }))
        };
      }
    }));
    setIsPendingTx(false);
  }, []);

  return {
    contracts,
    contractsForCurrentUser,
    completedContracts,
    activeContracts,
    activeTab,
    setActiveTab,
    marketplaceProfiles,
    visibleProfiles,
    proposals,
    incomingProposals,
    outgoingProposals,
    freelancerMarketplaceProjects,
    relationships,
    activeRelationships,
    getProfileById,
    freelancerReputation,
    clientReputation,
    userMode,
    setUserMode,
    walletAddress,
    connectWallet,
    isWrongChain,
    chainId: escrowConfig.chainId,
    refreshContracts: syncChainState,
    isPendingTx,
    sendProposal,
    acceptProposal,
    declineProposal,
    counterProposal,
    requestToWorkOnProject,
    createContract,
    fundContract,
    markMilestoneCompleted,
    approveAndPayMilestone,
    initiateDispute,
    resolveDispute,
    totalEarnings,
  };
}
