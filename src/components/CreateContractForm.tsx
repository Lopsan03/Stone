import { useState } from 'react';
import { Plus, AlertCircle } from 'lucide-react';
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

// Demo contract template
const DEMO_CONTRACT = {
  title: 'Smart Contract Dashboard - Phase 1',
  description: 'Build a secure escrow dashboard with milestone tracking and fund management. Includes UI, backend integration, and testing.',
  milestones: [
    { title: 'Architecture & Design Specs', amount: 2500 },
    { title: 'Frontend Components & Logic', amount: 3500 },
    { title: 'Testing & Launch Support', amount: 2000 },
  ],
};

export function CreateContractForm({ userMode, relationships, resolveName, resolveWallet, onSubmit, isLoading }: CreateContractFormProps) {
  const [selectedRelationshipId, setSelectedRelationshipId] = useState<string>('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [freelancerAddress, setFreelancerAddress] = useState('');
  const [milestones, setMilestones] = useState<Omit<Milestone, 'id' | 'status'>[]>([
    { title: '', amount: 0 }
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

  // Validation
  const hasTitle = title.trim().length > 0;
  const hasFreelancerAddress = freelancerAddress.trim().length > 0;
  const hasValidMilestones = milestones.length > 0 && milestones.every(m => m.title.trim().length > 0 && Number(m.amount) > 0);
  const isFormValid = hasTitle && hasFreelancerAddress && hasValidMilestones;

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
    if (!isFormValid) return;

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

    // Reset form
    setTitle('');
    setDescription('');
    setFreelancerAddress('');
    setSelectedRelationshipId('');
    setMilestones([{ title: '', amount: 0 }]);
  };

  const loadDemoData = () => {
    setTitle(DEMO_CONTRACT.title);
    setDescription(DEMO_CONTRACT.description);
    setMilestones(DEMO_CONTRACT.milestones);
    if (relationships.length > 0) {
      setSelectedRelationshipId(relationships[0].id);
    }
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
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-bento-text-bold">Create New Contract</h2>
        <button
          type="button"
          onClick={loadDemoData}
          className="text-[10px] px-2 py-1 bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 rounded hover:bg-indigo-500/20 transition-colors font-bold"
        >
          Quick Demo
        </button>
      </div>

      {/* Validation Feedback */}
      {!isFormValid && (
        <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg space-y-2">
          <div className="flex items-start gap-2 text-[10px] text-amber-200">
            <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <div className="space-y-1">
              {!hasTitle && <p>• Add a project title</p>}
              {!hasFreelancerAddress && <p>• Select or enter freelancer address</p>}
              {!hasValidMilestones && <p>• Add milestones with title and amount (must be greater than 0)</p>}
            </div>
          </div>
        </div>
      )}

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
              <div key={index} className="bg-slate-900 border border-bento-border rounded-lg p-3 space-y-2">
                <div className="flex justify-between items-center gap-2">
                  <input
                    type="text"
                    value={milestone.title}
                    onChange={(e) => updateMilestone(index, 'title', e.target.value)}
                    placeholder="Phase title (e.g., Design Phase)"
                    className="bg-transparent border-b border-bento-border text-[12px] font-medium focus:ring-0 flex-1 p-1 text-bento-text-bold placeholder:text-bento-text-muted/50 outline-none"
                  />
                  <div className="flex items-center gap-1 shrink-0">
                    <input
                      type="number"
                      min="1"
                      value={milestone.amount || ''}
                      onChange={(e) => updateMilestone(index, 'amount', Number(e.target.value))}
                      placeholder="0"
                      className="bg-transparent border-b border-bento-border text-[12px] font-bold text-right focus:ring-0 w-20 p-1 text-bento-text-bold placeholder:text-bento-text-muted/50 outline-none"
                    />
                    <span className="text-[10px] text-bento-text-muted">MON</span>
                  </div>
                </div>
                {milestones.length > 1 && (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => removeMilestone(index)}
                      className="text-[10px] text-red-400 hover:text-red-300 font-bold"
                    >
                      Remove
                    </button>
                  </div>
                )}
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
          disabled={!isFormValid || isLoading}
          className="w-full p-3 bg-bento-primary text-white font-bold rounded-lg text-sm shadow-lg shadow-indigo-500/20 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Create Contract
        </Button>
      </form>
    </div>
  );
}
