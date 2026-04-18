import { useState, useCallback, useMemo } from 'react';
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

const MOCK_CONTRACTS: Contract[] = [
  {
    id: '1',
    relationshipId: 'r-1',
    title: 'Mobile App Development (React Native)',
    description: 'Build a production-ready mobile app for a health startup including auth and dashboards.',
    clientAddress: ME_CLIENT_WALLET,
    freelancerAddress: ME_FREELANCER_WALLET,
    totalBudget: 5000,
    depositedAmount: 5000,
    releasedAmount: 2000,
    status: 'Active',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 5,
    milestones: [
      { id: 'm1', title: 'UI Design & Wireframes', amount: 1000, status: 'Paid' },
      { id: 'm2', title: 'Backend API Integration', amount: 1000, status: 'Paid' },
      { id: 'm3', title: 'Main Dashboards Phase 1', amount: 1500, status: 'Completed' },
      { id: 'm4', title: 'Final QA & App Store Submission', amount: 1500, status: 'Pending' },
    ],
  },
];

export function useEscrow() {
  const [contracts, setContracts] = useState<Contract[]>(MOCK_CONTRACTS);
  const [freelancerReputation] = useState<Reputation>(MOCK_REPUTATION);
  const [clientReputation] = useState<Reputation>(MOCK_CLIENT_REPUTATION);
  const [userMode, setUserMode] = useState<UserMode>('Client');
  const [activeTab, setActiveTab] = useState<ProjectTab>('Marketplace');
  const [marketplaceProfiles] = useState<MarketplaceProfile[]>(MOCK_MARKETPLACE_PROFILES);
  const [proposals, setProposals] = useState<Proposal[]>(MOCK_PROPOSALS);
  const [relationships, setRelationships] = useState<Relationship[]>(MOCK_RELATIONSHIPS);
  const [isPendingTx, setIsPendingTx] = useState(false);

  const currentUserId = userMode === 'Client' ? ME_CLIENT_ID : ME_FREELANCER_ID;
  const currentWallet = userMode === 'Client' ? ME_CLIENT_WALLET : ME_FREELANCER_WALLET;

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
        if (userMode === 'Client') return contract.clientAddress === currentWallet;
        return contract.freelancerAddress === currentWallet;
      }),
    [contracts, currentWallet, userMode]
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

  const createContract = useCallback(async (data: Omit<Contract, 'id' | 'clientAddress' | 'status' | 'depositedAmount' | 'releasedAmount' | 'createdAt'>) => {
    setIsPendingTx(true);
    // Simulate transaction
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newContract: Contract = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      clientAddress: ME_CLIENT_WALLET,
      status: 'Proposed',
      depositedAmount: 0,
      releasedAmount: 0,
      createdAt: Date.now(),
    };
    
    setContracts(prev => [newContract, ...prev]);
    setIsPendingTx(false);
  }, []);

  const fundContract = useCallback(async (contractId: string) => {
    setIsPendingTx(true);
    await new Promise((resolve) => setTimeout(resolve, 1600));

    setContracts((prev) =>
      prev.map((contract) => {
        if (contract.id !== contractId) return contract;

        // Escrow can only be funded once, from proposed state.
        if (contract.status !== 'Proposed' || contract.depositedAmount > 0) {
          return contract;
        }

        return {
          ...contract,
          status: 'Active',
          depositedAmount: contract.totalBudget,
        };
      })
    );
    setIsPendingTx(false);
  }, []);

  const markMilestoneCompleted = useCallback(async (contractId: string, milestoneId: string) => {
    setIsPendingTx(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setContracts(prev => prev.map(c => {
      if (c.id !== contractId) return c;

      const milestone = c.milestones.find((m) => m.id === milestoneId);
      if (!milestone) return c;

      const isContractFunded = c.status === 'Active' && c.depositedAmount >= c.totalBudget;
      if (!isContractFunded || milestone.status !== 'Pending' || !canProgressMilestone(c.milestones, milestoneId)) {
        return c;
      }

      return {
        ...c,
        milestones: c.milestones.map((m): Milestone =>
          m.id === milestoneId ? { ...m, status: 'Completed' } : m
        )
      };
    }));
    setIsPendingTx(false);
  }, [canProgressMilestone]);

  const approveAndPayMilestone = useCallback(async (contractId: string, milestoneId: string) => {
    setIsPendingTx(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setContracts(prev => prev.map(c => {
      if (c.id !== contractId) return c;

      const milestone = c.milestones.find((m) => m.id === milestoneId);
      if (!milestone) return c;

      const escrowAvailable = c.depositedAmount - c.releasedAmount;
      const canPay =
        c.status === 'Active' &&
        milestone.status === 'Completed' &&
        canProgressMilestone(c.milestones, milestoneId) &&
        escrowAvailable >= milestone.amount;

      if (!canPay) return c;

      const updatedMilestones = c.milestones.map((m): Milestone =>
        m.id === milestoneId ? { ...m, status: 'Paid' } : m
      );
      const isFullyPaid = updatedMilestones.every((m) => m.status === 'Paid');

      return {
        ...c,
        releasedAmount: c.releasedAmount + milestone.amount,
        status: isFullyPaid ? 'Completed' : 'Active',
        milestones: updatedMilestones
      };
    }));
    setIsPendingTx(false);
  }, [canProgressMilestone]);

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
    totalEarnings,
  };
}
