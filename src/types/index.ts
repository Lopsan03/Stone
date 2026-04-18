export type MilestoneStatus = 'Pending' | 'Completed' | 'Paid';

export type UserRole = 'Client' | 'Freelancer';

export type ProposalStatus = 'Pending' | 'Accepted' | 'Declined' | 'Countered';

export type RelationshipStatus = 'PendingAcceptance' | 'Active' | 'Declined';

export type ProjectTab = 'Marketplace' | 'Relationships' | 'Contracts';

export interface MarketplaceProfile {
  id: string;
  name: string;
  role: UserRole;
  headline: string;
  skills: string[];
  rating: number;
  completedProjects: number;
  minBudget: number;
  maxBudget: number;
  hourlyRate?: number;
  walletAddress: string;
}

export interface Proposal {
  id: string;
  fromUserId: string;
  toUserId: string;
  projectTitle: string;
  projectSummary: string;
  proposedBudget: number;
  estimatedDays: number;
  milestoneDraft: Omit<Milestone, 'id' | 'status'>[];
  status: ProposalStatus;
  createdAt: number;
}

export interface Relationship {
  id: string;
  proposalId: string;
  clientUserId: string;
  freelancerUserId: string;
  status: RelationshipStatus;
  createdAt: number;
}

export interface Milestone {
  id: string;
  title: string;
  amount: number;
  status: MilestoneStatus;
}

export type ContractStatus = 'Draft' | 'Proposed' | 'Funded' | 'Active' | 'Completed' | 'Disputed';

export interface Contract {
  id: string;
  relationshipId?: string;
  title: string;
  description: string;
  clientAddress: string;
  freelancerAddress: string;
  totalBudget: number;
  depositedAmount: number;
  releasedAmount: number;
  status: ContractStatus;
  milestones: Milestone[];
  createdAt: number;
}

export interface Reputation {
  score: number;
  completedProjects: number;
  totalVolume: number;
  averageRating: number;
}

export type UserMode = 'Client' | 'Freelancer';
