import { useState, useCallback, useMemo } from 'react';
import type { Contract, Milestone, Reputation, UserMode } from '../types';

// Initial Mock Data for Demo
const MOCK_REPUTATION: Reputation = {
  score: 98,
  completedProjects: 24,
  totalVolume: 12500,
  averageRating: 4.9,
};

const MOCK_CONTRACTS: Contract[] = [
  {
    id: '1',
    title: 'Mobile App Development (React Native)',
    description: 'Build a production-ready mobile app for a health startup including auth and dashboards.',
    clientAddress: '0x123...4567',
    freelancerAddress: '0x890...abcd',
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
  const [reputation] = useState<Reputation>(MOCK_REPUTATION);
  const [userMode, setUserMode] = useState<UserMode>('Client');
  const [isPendingTx, setIsPendingTx] = useState(false);

  const totalEarnings = useMemo(() => contracts.reduce((acc, c) => acc + c.releasedAmount, 0), [contracts]);

  const createContract = useCallback(async (data: Omit<Contract, 'id' | 'clientAddress' | 'status' | 'depositedAmount' | 'releasedAmount' | 'createdAt'>) => {
    setIsPendingTx(true);
    // Simulate transaction
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newContract: Contract = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      clientAddress: '0xYou', // Current user
      status: 'Active',
      depositedAmount: data.totalBudget,
      releasedAmount: 0,
      createdAt: Date.now(),
    };
    
    setContracts(prev => [newContract, ...prev]);
    setIsPendingTx(false);
  }, []);

  const markMilestoneCompleted = useCallback(async (contractId: string, milestoneId: string) => {
    setIsPendingTx(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setContracts(prev => prev.map(c => {
      if (c.id === contractId) {
        return {
          ...c,
          milestones: c.milestones.map(m => m.id === milestoneId ? { ...m, status: 'Completed' } : m)
        };
      }
      return c;
    }));
    setIsPendingTx(false);
  }, []);

  const approveAndPayMilestone = useCallback(async (contractId: string, milestoneId: string) => {
    setIsPendingTx(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setContracts(prev => prev.map(c => {
      if (c.id === contractId) {
        const milestone = c.milestones.find(m => m.id === milestoneId);
        if (!milestone) return c;
        
        return {
          ...c,
          releasedAmount: c.releasedAmount + milestone.amount,
          milestones: c.milestones.map(m => m.id === milestoneId ? { ...m, status: 'Paid' } : m)
        };
      }
      return c;
    }));
    setIsPendingTx(false);
  }, []);

  return {
    contracts,
    reputation,
    userMode,
    setUserMode,
    isPendingTx,
    createContract,
    markMilestoneCompleted,
    approveAndPayMilestone,
    totalEarnings,
  };
}
