import { CheckCircle2, Circle, Clock, DollarSign, ArrowRight, Lock } from 'lucide-react';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { cn, formatBalance } from '../lib/utils';
import type { Milestone } from '../types';

interface MilestoneItemProps {
  milestone: Milestone;
  isClient: boolean;
  contractIsFunded: boolean;
  num: number;
  onApprove: () => Promise<void>;
  onComplete: () => Promise<void>;
}

export function MilestoneItem({ milestone, isClient, contractIsFunded, num, onApprove, onComplete }: MilestoneItemProps) {
  const isPending = milestone.status === 'Pending';
  const isCompleted = milestone.status === 'Completed';
  const isPaid = milestone.status === 'Paid';

  return (
    <div className={cn(
      "flex items-center justify-between p-4 border rounded-xl transition-all",
      isPaid ? "bg-slate-900 border-bento-border" : 
      isCompleted ? "border-bento-primary bg-bento-primary-soft shadow-[0_0_15px_rgba(99,102,241,0.1)]" : 
      "bg-slate-900/40 border-bento-border"
    )}>
      <div className="flex items-center gap-4 flex-1">
        <div className="flex items-center gap-3">
          {isPaid ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : isCompleted ? (
            <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0" />
          ) : (
            <Circle className="w-5 h-5 text-bento-text-muted shrink-0" />
          )}
        </div>
        <div>
          <div className="text-[13px] font-bold text-bento-text-bold">{milestone.title}</div>
          <div className="text-[11px] font-bold text-bento-text-muted uppercase tracking-wider flex items-center gap-2">
            {!isPaid && (
              <>
                <Lock className="w-3 h-3 text-amber-400" />
                <span>Locked:</span>
              </>
            )}
            {formatBalance(milestone.amount)} MON
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {isPaid && (
          <span className="badge badge-green px-3 py-1 rounded-full text-[10px] font-bold">✓ Paid</span>
        )}
        
        {isCompleted && isClient && (
          <div className="flex items-center gap-3">
            <span className="badge badge-blue px-3 py-1 rounded-full text-[10px] font-bold">Review</span>
            <button 
              onClick={onApprove}
              className="bg-bento-primary text-white text-[11px] font-bold px-4 py-1.5 rounded-lg shadow-lg shadow-indigo-500/20 hover:opacity-90 transition-opacity"
            >
              Approve & Release
            </button>
          </div>
        )}

        {isCompleted && !isClient && (
          <span className="badge badge-blue px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight">Awaiting Approval</span>
        )}

        {isPending && (
          <div className="flex items-center gap-3">
            <span className="badge badge-yellow px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5">
              <Lock className="w-3 h-3" />
              {contractIsFunded ? 'In Progress' : 'Escrow Locked'}
            </span>
            {!isClient && (
              <button 
                onClick={onComplete}
                disabled={!contractIsFunded}
                className="bg-bento-card border border-bento-border text-bento-text-bold text-[11px] font-bold px-4 py-1.5 rounded-lg shadow-sm hover:bg-slate-800 transition-colors disabled:opacity-50"
              >
                Mark Done
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
