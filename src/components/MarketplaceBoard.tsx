import { useMemo, useState } from 'react';
import { Search, Send } from 'lucide-react';
import { Button } from './ui/Button';
import type { MarketplaceProfile, Milestone, Proposal, UserMode } from '../types';
import { formatBalance, truncateAddress } from '../lib/utils';

interface MarketplaceBoardProps {
  userMode: UserMode;
  profiles: MarketplaceProfile[];
  freelancerProjects: Proposal[];
  resolveName: (userId: string) => string;
  isLoading: boolean;
  onRequestToWork: (projectProposalId: string) => Promise<void>;
  onSendProposal: (data: {
    toUserId: string;
    projectTitle: string;
    projectSummary: string;
    proposedBudget: number;
    estimatedDays: number;
    milestoneDraft: Omit<Milestone, 'id' | 'status'>[];
  }) => Promise<void>;
}

const DEFAULT_MILESTONES: Omit<Milestone, 'id' | 'status'>[] = [
  { title: 'Discovery and planning', amount: 0 },
  { title: 'Implementation and delivery', amount: 0 },
];

export function MarketplaceBoard({
  userMode,
  profiles,
  freelancerProjects,
  resolveName,
  isLoading,
  onRequestToWork,
  onSendProposal,
}: MarketplaceBoardProps) {
  const [targetUserId, setTargetUserId] = useState('');
  const [projectTitle, setProjectTitle] = useState('');
  const [projectSummary, setProjectSummary] = useState('');
  const [estimatedDays, setEstimatedDays] = useState(14);
  const [milestones, setMilestones] = useState<Omit<Milestone, 'id' | 'status'>[]>(DEFAULT_MILESTONES);

  const totalBudget = useMemo(
    () => milestones.reduce((sum, item) => sum + (Number(item.amount) || 0), 0),
    [milestones]
  );

  const updateMilestone = (index: number, key: 'title' | 'amount', value: string | number) => {
    setMilestones((prev) => prev.map((item, i) => (i === index ? { ...item, [key]: value } : item)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUserId || !projectTitle || milestones.some((item) => !item.title || Number(item.amount) <= 0)) return;

    await onSendProposal({
      toUserId: targetUserId,
      projectTitle,
      projectSummary,
      proposedBudget: totalBudget,
      estimatedDays,
      milestoneDraft: milestones,
    });

    setTargetUserId('');
    setProjectTitle('');
    setProjectSummary('');
    setEstimatedDays(14);
    setMilestones(DEFAULT_MILESTONES);
  };

  if (userMode === 'Freelancer') {
    return (
      <section className="bg-bento-card rounded-bento border border-bento-border p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-bento-primary" />
          <h2 className="text-sm font-bold">Client Proposed Projects</h2>
        </div>

        {freelancerProjects.length === 0 && (
          <p className="text-xs text-bento-text-muted">
            No client proposals available for you right now.
          </p>
        )}

        <div className="space-y-3">
          {freelancerProjects.map((project) => (
            <div key={project.id} className="rounded-xl border border-bento-border bg-slate-900/40 p-4">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-bold">{project.projectTitle}</p>
                  <p className="text-[11px] text-bento-text-muted">By {resolveName(project.fromUserId)}</p>
                </div>
                <span className="text-xs font-bold">{formatBalance(project.proposedBudget)} MON</span>
              </div>
              <p className="text-xs text-bento-text-muted mt-2">{project.projectSummary}</p>
              <div className="mt-3 text-[11px] text-bento-text-muted">
                ETA: {project.estimatedDays} days • Milestones: {project.milestoneDraft.length}
              </div>
              <Button
                type="button"
                size="sm"
                className="mt-3"
                onClick={() => onRequestToWork(project.id)}
                isLoading={isLoading}
              >
                Ask To Work On This
              </Button>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <div className="bg-bento-card rounded-bento border border-bento-border p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Search className="w-4 h-4 text-bento-primary" />
          <h2 className="text-sm font-bold">Marketplace Discovery</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {profiles.map((profile) => (
            <div key={profile.id} className="rounded-xl border border-bento-border bg-slate-900/50 p-4">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-bold text-bento-text-bold">{profile.name}</p>
                  <p className="text-[11px] text-bento-text-muted">{profile.headline}</p>
                </div>
                <span className="text-[10px] font-bold uppercase text-bento-primary">{profile.role}</span>
              </div>

              <div className="mt-3 text-[11px] text-bento-text-muted space-y-1">
                <p>Rating: {profile.rating.toFixed(1)} / 5</p>
                <p>
                  Budget: {formatBalance(profile.minBudget)} - {formatBalance(profile.maxBudget)} MON
                </p>
                <p>Wallet: {truncateAddress(profile.walletAddress)}</p>
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {profile.skills.slice(0, 4).map((skill) => (
                  <span key={skill} className="text-[10px] px-2 py-1 rounded-full border border-bento-border text-bento-text-muted">
                    {skill}
                  </span>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setTargetUserId(profile.id)}
                className="mt-4 w-full rounded-lg border border-bento-border bg-bento-card p-2 text-xs font-bold hover:bg-slate-800 transition-colors"
              >
                Propose Collaboration
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-bento-card rounded-bento border border-bento-border p-5 shadow-sm">
        <h3 className="text-sm font-bold mb-3">Create Proposal</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <select
              value={targetUserId}
              onChange={(e) => setTargetUserId(e.target.value)}
              className="w-full p-2 border border-bento-border rounded-lg text-sm bg-slate-900 focus:ring-1 focus:ring-bento-primary outline-none"
              required
            >
              <option value="">Choose {userMode === 'Client' ? 'freelancer' : 'client'}</option>
              {profiles.map((profile) => (
                <option key={profile.id} value={profile.id}>
                  {profile.name}
                </option>
              ))}
            </select>

            <input
              type="number"
              min={1}
              value={estimatedDays}
              onChange={(e) => setEstimatedDays(Number(e.target.value) || 1)}
              className="w-full p-2 border border-bento-border rounded-lg text-sm bg-slate-900 focus:ring-1 focus:ring-bento-primary outline-none"
              placeholder="Estimated days"
            />
          </div>

          <input
            type="text"
            value={projectTitle}
            onChange={(e) => setProjectTitle(e.target.value)}
            placeholder="Project title"
            className="w-full p-2 border border-bento-border rounded-lg text-sm bg-slate-900 focus:ring-1 focus:ring-bento-primary outline-none"
            required
          />

          <textarea
            value={projectSummary}
            onChange={(e) => setProjectSummary(e.target.value)}
            placeholder="Proposal summary"
            className="w-full p-2 border border-bento-border rounded-lg text-sm bg-slate-900 focus:ring-1 focus:ring-bento-primary outline-none min-h-20"
          />

          <div className="space-y-2">
            {milestones.map((milestone, index) => (
              <div key={`${index}-${milestone.title}`} className="grid grid-cols-[1fr_120px] gap-2">
                <input
                  type="text"
                  value={milestone.title}
                  onChange={(e) => updateMilestone(index, 'title', e.target.value)}
                  placeholder={`Phase ${index + 1}`}
                  className="p-2 border border-bento-border rounded-lg text-sm bg-slate-900 focus:ring-1 focus:ring-bento-primary outline-none"
                />
                <input
                  type="number"
                  min={1}
                  value={milestone.amount}
                  onChange={(e) => updateMilestone(index, 'amount', Number(e.target.value) || 0)}
                  placeholder="MON"
                  className="p-2 border border-bento-border rounded-lg text-sm bg-slate-900 focus:ring-1 focus:ring-bento-primary outline-none"
                />
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-bento-text-muted">
            <span>Total proposal budget</span>
            <span className="font-bold text-bento-text-bold">{formatBalance(totalBudget)} MON</span>
          </div>

          <Button type="submit" isLoading={isLoading} className="w-full">
            <Send className="w-3.5 h-3.5 mr-2" />
            Send Proposal
          </Button>
        </form>
      </div>
    </section>
  );
}
