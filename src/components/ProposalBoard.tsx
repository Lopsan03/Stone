import { useState } from 'react';
import { ArrowRightLeft, Clock3 } from 'lucide-react';
import { Button } from './ui/Button';
import { formatBalance } from '../lib/utils';
import type { Proposal } from '../types';

interface ProposalBoardProps {
  incoming: Proposal[];
  outgoing: Proposal[];
  isLoading: boolean;
  resolveName: (userId: string) => string;
  onAccept: (proposalId: string) => Promise<void>;
  onDecline: (proposalId: string) => Promise<void>;
  onCounter: (proposalId: string, newBudget: number) => Promise<void>;
}

export function ProposalBoard({
  incoming,
  outgoing,
  isLoading,
  resolveName,
  onAccept,
  onDecline,
  onCounter,
}: ProposalBoardProps) {
  const [counterByProposalId, setCounterByProposalId] = useState<Record<string, number>>({});

  return (
    <section className="bg-bento-card rounded-bento border border-bento-border p-5 shadow-sm space-y-4">
      <div className="flex items-center gap-2">
        <ArrowRightLeft className="w-4 h-4 text-bento-primary" />
        <h2 className="text-sm font-bold">Proposal Inbox</h2>
      </div>

      <div>
        <h3 className="text-xs uppercase tracking-wider text-bento-text-muted mb-2">Incoming</h3>
        <div className="space-y-3">
          {incoming.length === 0 && (
            <p className="text-xs text-bento-text-muted">No incoming proposals.</p>
          )}
          {incoming.map((proposal) => (
            <div key={proposal.id} className="rounded-xl border border-bento-border p-3 bg-slate-900/40">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-bold">{proposal.projectTitle}</p>
                  <p className="text-[11px] text-bento-text-muted">From {resolveName(proposal.fromUserId)}</p>
                </div>
                <span className="text-xs font-bold text-bento-text-bold">{formatBalance(proposal.proposedBudget)} MON</span>
              </div>

              <p className="text-xs text-bento-text-muted mt-2">{proposal.projectSummary}</p>
              <p className="text-[11px] text-bento-text-muted mt-2 flex items-center gap-1">
                <Clock3 className="w-3 h-3" /> {proposal.estimatedDays} days estimate
              </p>

              <div className="mt-3 grid grid-cols-1 md:grid-cols-[1fr_auto_auto_auto] gap-2">
                <input
                  type="number"
                  min={1}
                  value={counterByProposalId[proposal.id] ?? proposal.proposedBudget}
                  onChange={(e) =>
                    setCounterByProposalId((prev) => ({
                      ...prev,
                      [proposal.id]: Number(e.target.value) || proposal.proposedBudget,
                    }))
                  }
                  className="p-2 border border-bento-border rounded-lg text-sm bg-slate-900 focus:ring-1 focus:ring-bento-primary outline-none"
                  disabled={proposal.status !== 'Pending'}
                />
                <Button size="sm" onClick={() => onAccept(proposal.id)} disabled={proposal.status !== 'Pending'} isLoading={isLoading}>
                  Accept
                </Button>
                <Button size="sm" variant="outline" onClick={() => onCounter(proposal.id, counterByProposalId[proposal.id] ?? proposal.proposedBudget)} disabled={proposal.status !== 'Pending' || isLoading}>
                  Counter
                </Button>
                <Button size="sm" variant="destructive" onClick={() => onDecline(proposal.id)} disabled={proposal.status !== 'Pending'} isLoading={isLoading}>
                  Decline
                </Button>
              </div>
              <p className="text-[10px] uppercase tracking-wider text-bento-text-muted mt-2">Status: {proposal.status}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xs uppercase tracking-wider text-bento-text-muted mb-2">Outgoing</h3>
        <div className="space-y-2">
          {outgoing.length === 0 && <p className="text-xs text-bento-text-muted">No outgoing proposals.</p>}
          {outgoing.map((proposal) => (
            <div key={proposal.id} className="rounded-xl border border-bento-border p-3 bg-slate-900/30 flex items-center justify-between gap-2">
              <div>
                <p className="text-sm font-semibold">{proposal.projectTitle}</p>
                <p className="text-[11px] text-bento-text-muted">To {resolveName(proposal.toUserId)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold">{formatBalance(proposal.proposedBudget)} MON</p>
                <p className="text-[10px] uppercase tracking-wider text-bento-text-muted">{proposal.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
