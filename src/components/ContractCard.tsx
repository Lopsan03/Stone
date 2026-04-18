import { useState } from 'react';
import { ChevronDown, ChevronUp, User, Layout, Calendar, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { MilestoneItem } from './MilestoneItem';
import { cn, truncateAddress, formatBalance } from '../lib/utils';
import type { Contract, UserMode } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface ContractCardProps {
  contract: Contract;
  userMode: UserMode;
  onApprove: (contractId: string, milestoneId: string) => Promise<void>;
  onComplete: (contractId: string, milestoneId: string) => Promise<void>;
}

export function ContractCard({ contract, userMode, onApprove, onComplete }: ContractCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const progress = (contract.releasedAmount / contract.totalBudget) * 100;
  const isClient = userMode === 'Client';

  return (
    <div className="bg-bento-card rounded-bento border border-bento-border shadow-sm overflow-hidden transition-all">
      <div className="p-5 border-b border-bento-border">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <span className={cn(
               "badge px-3 py-1 rounded-full text-[10px] font-bold",
               contract.status === 'Active' ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20" : "bg-slate-800 text-slate-400 border border-slate-700"
            )}>
              {contract.status === 'Active' ? 'Active Engagement' : 'Completed'}
            </span>
            <h3 className="text-xl font-bold mt-2 text-bento-text-bold tracking-tight">{contract.title}</h3>
            <p className="text-[11px] text-bento-text-muted mt-1 font-medium">
              Engagement ID: #{contract.id.slice(0, 4)} • Freelancer: {truncateAddress(contract.freelancerAddress)}
            </p>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-bento-text-bold">{formatBalance(contract.totalBudget)} MON</div>
            <span className="text-[10px] font-bold text-bento-text-muted uppercase tracking-[0.5px]">Total Escrowed</span>
          </div>
        </div>

        <div className="mt-5">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[11px] font-bold text-bento-text-bold uppercase tracking-wider">Project Progress</span>
            <span className="text-[11px] font-bold text-bento-text-muted uppercase tracking-wider">{Math.round(progress)}% Complete</span>
          </div>
          <div className="h-2 bg-slate-900 border border-bento-border rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-bento-primary rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
            />
          </div>
        </div>
      </div>

      <div className="p-5 bg-bento-card">
        <div className="flex flex-col gap-3">
          {contract.milestones.map((milestone, idx) => (
            <MilestoneItem
              key={milestone.id}
              milestone={milestone}
              isClient={isClient}
              num={idx + 1}
              onApprove={() => onApprove(contract.id, milestone.id)}
              onComplete={() => onComplete(contract.id, milestone.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
