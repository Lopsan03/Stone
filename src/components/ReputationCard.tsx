import { Trophy, Star, TrendingUp, DollarSign } from 'lucide-react';
import type { Reputation } from '../types';
import { formatBalance } from '../lib/utils';

export function ReputationCard({ reputation }: { reputation: Reputation }) {
  return (
    <div className="bg-bento-card rounded-bento border border-bento-border p-5 shadow-sm">
      <h2 className="text-sm font-bold text-bento-text-bold mb-5 flex items-center justify-between">
        Freelancer Reputation
        <Trophy className="w-4 h-4 text-bento-primary" />
      </h2>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col">
          <span className="text-xl font-bold text-bento-text-bold">{reputation.score / 20}</span>
          <span className="text-[10px] font-bold text-bento-text-muted uppercase tracking-[0.5px]">Global Score</span>
        </div>

        <div className="flex flex-col">
          <span className="text-xl font-bold text-bento-text-bold">{reputation.completedProjects}</span>
          <span className="text-[10px] font-bold text-bento-text-muted uppercase tracking-[0.5px]">Contracts</span>
        </div>

        <div className="flex flex-col">
          <span className="text-xl font-bold text-bento-text-bold">{formatBalance(reputation.totalVolume / 1000)}k</span>
          <span className="text-[10px] font-bold text-bento-text-muted uppercase tracking-[0.5px]">Volume MON</span>
        </div>

        <div className="flex flex-col">
          <span className="text-xl font-bold text-bento-text-bold">100%</span>
          <span className="text-[10px] font-bold text-bento-text-muted uppercase tracking-[0.5px]">Success Rate</span>
        </div>
      </div>
    </div>
  );
}
