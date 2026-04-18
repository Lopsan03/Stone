import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from './ui/Button';
import type { Milestone, Relationship } from '../types';

interface CreateContractFormProps {
  userMode: 'Client' | 'Freelancer';
  relationships: Relationship[];
  resolveName: (userId: string) => string;
  resolveWallet: (userId: string) => string;
  onSubmit: (contractData: {
    relationshipId?: string;
    title: string;
    description: string;
    freelancerAddress: string;
    totalBudget: number;
    milestones: Milestone[];
  }) => Promise<void>;
  isLoading: boolean;
}

export function CreateContractForm({ userMode, relationships, resolveName, resolveWallet, onSubmit, isLoading }: CreateContractFormProps) {
  const [selectedRelationshipId, setSelectedRelationshipId] = useState<string>('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [freelancerAddress, setFreelancerAddress] = useState('');
  const [milestones, setMilestones] = useState<Omit<Milestone, 'id' | 'status'>[]>([
    { title: 'Initial Phase', amount: 0 }
  ]);

  const addMilestone = () => {
    setMilestones([...milestones, { title: '', amount: 0 }]);
  };

  const removeMilestone = (index: number) => {
    if (milestones.length > 1) {
      setMilestones(milestones.filter((_, i) => i !== index));
    }
  };

  const updateMilestone = (index: number, field: string, value: string | number) => {
    const newMilestones = [...milestones];
    newMilestones[index] = { ...newMilestones[index], [field]: value };
    setMilestones(newMilestones);
  };

  const totalBudget = milestones.reduce((acc, m) => acc + (Number(m.amount) || 0), 0);

  const canCreateContract = userMode === 'Client' && relationships.length > 0;

  const selectedRelationship = relationships.find((rel) => rel.id === selectedRelationshipId);

  const selectedFreelancerAddress = selectedRelationship
    ? resolveWallet(selectedRelationship.freelancerUserId)
    : freelancerAddress;

  const selectedFreelancerName = selectedRelationship
    ? resolveName(selectedRelationship.freelancerUserId)
    : '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !selectedFreelancerAddress || milestones.some(m => !m.title || m.amount <= 0)) return;

    await onSubmit({
      relationshipId: selectedRelationshipId || undefined,
      title,
      description,
      freelancerAddress: selectedFreelancerAddress,
      totalBudget,
      milestones: milestones.map((m, i) => ({
        ...m,
        id: `m-${Date.now()}-${i}`,
        status: 'Pending'
      }))
    });

    setTitle('');
    setDescription('');
    setFreelancerAddress('');
    setSelectedRelationshipId('');
    setMilestones([{ title: 'Initial Phase', amount: 0 }]);
  };

  if (!canCreateContract) {
    return (
      <div className="bg-bento-card rounded-bento border border-bento-border p-5 shadow-sm">
        <h2 className="text-sm font-bold text-bento-text-bold mb-3">Create New Contract</h2>
        <p className="text-xs text-bento-text-muted">
          Accept a proposal in Relationships first. Contracts can only be created after both parties agree.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-bento-card rounded-bento border border-bento-border p-5 shadow-sm">
      <h2 className="text-sm font-bold text-bento-text-bold mb-4 flex items-center justify-between">
        Create New Contract
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-[12px] font-bold text-bento-text-muted">Relationship</label>
          <select
            value={selectedRelationshipId}
            onChange={(e) => setSelectedRelationshipId(e.target.value)}
            className="w-full p-2 border border-bento-border rounded-lg text-sm bg-slate-900 focus:ring-1 focus:ring-bento-primary outline-none text-bento-text-bold"
          >
            <option value="">Manual freelancer address</option>
            {relationships.map((relationship) => (
              <option key={relationship.id} value={relationship.id}>
                {resolveName(relationship.freelancerUserId)} - {relationship.id.slice(0, 6)}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-[12px] font-bold text-bento-text-muted">Freelancer Address</label>
          <input
            type="text"
            value={selectedFreelancerAddress}
            onChange={(e) => setFreelancerAddress(e.target.value)}
            placeholder="0x..."
            className="w-full p-2 border border-bento-border rounded-lg text-sm bg-slate-900 focus:ring-1 focus:ring-bento-primary outline-none text-bento-text-bold"
            readOnly={Boolean(selectedRelationship)}
            required
          />
          {selectedFreelancerName && (
            <p className="text-[10px] text-bento-text-muted">Selected freelancer: {selectedFreelancerName}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-[12px] font-bold text-bento-text-muted">Project Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Website Redesign"
            className="w-full p-2 border border-bento-border rounded-lg text-sm bg-slate-900 focus:ring-1 focus:ring-bento-primary outline-none text-bento-text-bold"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-[12px] font-bold text-bento-text-muted">Requirements</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Define scope, acceptance criteria, and deliverables"
            className="w-full p-2 border border-bento-border rounded-lg text-sm bg-slate-900 focus:ring-1 focus:ring-bento-primary outline-none text-bento-text-bold min-h-20"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[12px] font-bold text-bento-text-muted">Total Budget (MON)</label>
          <input
            type="number"
            value={totalBudget}
            readOnly
            className="w-full p-2 border border-bento-border rounded-lg text-sm bg-slate-950/50 font-mono text-bento-text-bold"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[12px] font-bold text-bento-text-muted">Milestones</label>
          <div className="max-h-40 overflow-y-auto space-y-2 pr-1">
            {milestones.map((milestone, index) => (
              <div key={index} className="bg-slate-900 border border-bento-border rounded-lg p-2 space-y-2">
                <div className="flex justify-between items-center">
                  <input
                    type="text"
                    value={milestone.title}
                    onChange={(e) => updateMilestone(index, 'title', e.target.value)}
                    placeholder="Phase title"
                    className="bg-transparent border-none text-[12px] font-medium focus:ring-0 w-2/3 p-0 text-bento-text-bold"
                  />
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={milestone.amount}
                      onChange={(e) => updateMilestone(index, 'amount', Number(e.target.value))}
                      className="bg-transparent border-none text-[12px] font-bold text-right focus:ring-0 w-16 p-0 text-bento-text-bold"
                    />
                    <span className="text-[10px] text-bento-text-muted">MON</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <button
            type="button"
            onClick={addMilestone}
            className="w-full p-2 border border-dashed border-bento-border bg-transparent rounded-lg text-xs text-bento-text-muted hover:bg-slate-900/50 transition-colors font-bold"
          >
            + Add Milestone
          </button>
        </div>

        <Button
          type="submit"
          isLoading={isLoading}
          className="w-full p-3 bg-bento-primary text-white font-bold rounded-lg text-sm shadow-lg shadow-indigo-500/20 mt-4"
        >
          Create Contract
        </Button>
      </form>
    </div>
  );
}
