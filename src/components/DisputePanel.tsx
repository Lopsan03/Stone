import { AlertTriangle, MessageSquare, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/Button';
import type { Contract } from '../types';

interface DisputePanelProps {
  contract: Contract;
  userMode: 'Client' | 'Freelancer';
  onInitiateDispute?: (reason: string) => void;
  onResolveDispute?: (resolution: 'refund' | 'release') => void;
  isLoading?: boolean;
}

export function DisputePanel({ contract, userMode, onInitiateDispute, onResolveDispute, isLoading }: DisputePanelProps) {
  const isClient = userMode === 'Client';
  const canInitiateDispute = contract.status === 'Active' && !contract.disputeStatus;
  
  return (
    <div className="bg-rose-500/5 border border-rose-500/30 rounded-bento p-5 space-y-4">
      {/* Dispute Status Indicator */}
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle className="w-5 h-5 text-rose-400" />
        <h3 className="text-sm font-bold text-bento-text-bold">Milestone Verification & Disputes</h3>
      </div>

      {/* If dispute is active */}
      {contract.disputeStatus && contract.disputeStatus !== 'None' && (
        <div className="bg-rose-500/10 border border-rose-500/40 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-rose-300 uppercase tracking-wide">Dispute Status: {contract.disputeStatus}</p>
            {contract.disputedAt && (
              <p className="text-[10px] text-rose-200">
                Reported {new Date(contract.disputedAt).toLocaleDateString()}
              </p>
            )}
          </div>
          
          {contract.disputeReason && (
            <div className="bg-slate-900 rounded-lg p-3 border border-rose-500/20">
              <p className="text-[11px] font-semibold text-rose-300 mb-1">Reason:</p>
              <p className="text-[10px] text-bento-text-muted">{contract.disputeReason}</p>
            </div>
          )}

          {contract.disputeStatus === 'UnderReview' && (
            <div className="bg-amber-500/5 border border-amber-500/30 rounded-lg p-3 space-y-2">
              <p className="text-[10px] font-semibold text-amber-300">⏳ Awaiting Platform Review</p>
              <p className="text-[9px] text-amber-200">
                Locked funds remain secure while arbitrators review the evidence. Decision expected within 3-5 business days.
              </p>
            </div>
          )}

          {contract.disputeStatus === 'Resolved' && (
            <div className="bg-emerald-500/5 border border-emerald-500/30 rounded-lg p-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <p className="text-[10px] text-emerald-300">Dispute resolved. Funds have been processed.</p>
            </div>
          )}
        </div>
      )}

      {/* Dispute Info */}
      {!contract.disputeStatus || contract.disputeStatus === 'None' && (
        <div className="space-y-3">
          <div className="bg-slate-900/50 rounded-lg p-3 border border-bento-border space-y-2">
            <p className="text-[11px] font-bold text-bento-text-muted">How Disputes Are Handled:</p>
            <ul className="text-[10px] space-y-1.5 text-bento-text-muted">
              <li className="flex gap-2">
                <span className="text-rose-400 font-bold">→</span>
                <span>Either party can escalate to dispute if milestone quality is disputed</span>
              </li>
              <li className="flex gap-2">
                <span className="text-rose-400 font-bold">→</span>
                <span>Platform arbitrators review evidence and communication</span>
              </li>
              <li className="flex gap-2">
                <span className="text-rose-400 font-bold">→</span>
                <span>Locked funds remain frozen until resolution</span>
              </li>
              <li className="flex gap-2">
                <span className="text-rose-400 font-bold">→</span>
                <span>Resolution: either release payment or refund client</span>
              </li>
            </ul>
          </div>

          {/* Initiate Dispute Button (for client only) */}
          {canInitiateDispute && isClient && (
            <div className="p-3 bg-rose-500/5 border border-rose-500/30 rounded-lg">
              <p className="text-[10px] text-rose-300 mb-2 font-semibold">
                Not satisfied with the work? Flag the milestone for review.
              </p>
              <Button 
                size="sm" 
                variant="outline"
                className="w-full text-rose-400 border-rose-500/30 hover:bg-rose-500/10"
                onClick={() => {
                  const reason = prompt('Describe the issue with this milestone:');
                  if (reason && onInitiateDispute) {
                    onInitiateDispute(reason);
                  }
                }}
                disabled={isLoading}
              >
                <MessageSquare className="w-3.5 h-3.5 mr-1" />
                Flag for Review
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
