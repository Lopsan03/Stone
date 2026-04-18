import { Shield, Lock, CheckCircle2, AlertCircle, TrendingUp } from 'lucide-react';
import { formatBalance } from '../lib/utils';
import type { Contract } from '../types';

interface EscrowSecurityProps {
  contract: Contract;
}

export function EscrowSecurity({ contract }: EscrowSecurityProps) {
  const lockedAmount = contract.depositedAmount - contract.releasedAmount;
  const isFullyFunded = contract.depositedAmount === contract.totalBudget;
  const progressPercent = (contract.releasedAmount / contract.totalBudget) * 100;

  return (
    <div className="bg-linear-to-br from-indigo-500/5 to-blue-500/5 border border-indigo-500/30 rounded-xl p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <Shield className="w-5 h-5 text-indigo-400" />
        <h3 className="text-sm font-bold text-bento-text-bold">Escrow Security Guarantee</h3>
      </div>

      {/* Locked Funds Status */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs font-semibold text-bento-text-muted flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            Funds Locked in Escrow
          </span>
          <span className="text-sm font-bold text-amber-300">{formatBalance(lockedAmount)} MON</span>
        </div>
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden border border-bento-border">
          <div 
            className="h-full bg-linear-to-r from-amber-500 to-amber-400 transition-all duration-500"
            style={{ width: `${100 - progressPercent}%` }}
          />
        </div>
        <p className="text-[10px] text-amber-200">
          {lockedAmount > 0 
            ? `${formatBalance(lockedAmount)} cannot be withdrawn until milestones are completed and approved`
            : 'All funds have been released upon milestone completion'
          }
        </p>
      </div>

      {/* Released Amount */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs font-semibold text-bento-text-muted flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            Funds Released
          </span>
          <span className="text-sm font-bold text-emerald-300">{formatBalance(contract.releasedAmount)} MON</span>
        </div>
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden border border-bento-border">
          <div 
            className="h-full bg-linear-to-r from-emerald-500 to-emerald-400 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="text-[10px] text-emerald-200">Released only after approval of completed phases</p>
      </div>

      {/* Security Features */}
      <div className="border-t border-bento-border pt-4 mt-4 space-y-2">
        <p className="text-[11px] font-bold text-bento-text-muted uppercase tracking-wider">How It's Secured</p>
        
        <div className="space-y-2">
          <div className="flex items-start gap-2.5 text-[10px]">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span className="text-bento-text-muted">
              <span className="font-bold text-bento-text-bold">Locked Deposit:</span> Client funds are locked on-chain at contract creation
            </span>
          </div>
          
          <div className="flex items-start gap-2.5 text-[10px]">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span className="text-bento-text-muted">
              <span className="font-bold text-bento-text-bold">Phase Enforcement:</span> Payments only release when freelancer marks milestone complete AND client approves
            </span>
          </div>
          
          <div className="flex items-start gap-2.5 text-[10px]">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span className="text-bento-text-muted">
              <span className="font-bold text-bento-text-bold">Sequential Milestones:</span> Cannot skip phases—previous milestones must be paid before moving forward
            </span>
          </div>
          
          <div className="flex items-start gap-2.5 text-[10px]">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span className="text-bento-text-muted">
              <span className="font-bold text-bento-text-bold">No Early Withdrawal:</span> Neither party can access locked funds—they remain secure until earned
            </span>
          </div>
        </div>
      </div>

      {/* Warning for disputes */}
      {contract.status === 'Disputed' && (
        <div className="border-t border-red-500/30 pt-4 mt-4 bg-red-500/10 rounded-lg p-3">
          <div className="flex items-start gap-2 text-[10px]">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-red-300">Dispute Active</p>
              <p className="text-red-200 mt-1">{contract.disputeReason}</p>
              <p className="text-red-300 mt-2 text-[9px]">Locked funds held in arbitration. Subject to resolution by platform arbitrators.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
