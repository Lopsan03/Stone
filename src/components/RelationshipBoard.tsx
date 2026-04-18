import { Handshake, Link } from 'lucide-react';
import type { Relationship } from '../types';

interface RelationshipBoardProps {
  relationships: Relationship[];
  resolveName: (userId: string) => string;
}

export function RelationshipBoard({ relationships, resolveName }: RelationshipBoardProps) {
  return (
    <section className="bg-bento-card rounded-bento border border-bento-border p-5 shadow-sm space-y-4">
      <div className="flex items-center gap-2">
        <Handshake className="w-4 h-4 text-bento-primary" />
        <h2 className="text-sm font-bold">Relationships</h2>
      </div>

      {relationships.length === 0 && (
        <p className="text-xs text-bento-text-muted">No active relationships yet. Accept a proposal to start one.</p>
      )}

      <div className="space-y-3">
        {relationships.map((relationship) => (
          <div key={relationship.id} className="rounded-xl border border-bento-border p-3 bg-slate-900/40">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-sm font-bold">{resolveName(relationship.clientUserId)} and {resolveName(relationship.freelancerUserId)}</p>
                <p className="text-[11px] text-bento-text-muted">Create and manage contracts from this relationship.</p>
              </div>
              <span className="text-[10px] uppercase tracking-widest text-bento-primary">{relationship.status}</span>
            </div>

            <p className="text-[11px] text-bento-text-muted mt-2 flex items-center gap-1">
              <Link className="w-3 h-3" /> Relationship ID: {relationship.id}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
