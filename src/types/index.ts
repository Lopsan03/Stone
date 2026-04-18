export type MilestoneStatus = 'Pending' | 'Completed' | 'Paid';

export interface Milestone {
  id: string;
  title: string;
  amount: number;
  status: MilestoneStatus;
}

export type ContractStatus = 'Active' | 'Completed' | 'Disputed';

export interface Contract {
  id: string;
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
