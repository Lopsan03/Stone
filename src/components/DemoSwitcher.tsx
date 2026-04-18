import { User, Briefcase } from 'lucide-react';
import { cn } from '../lib/utils';
import type { UserMode } from '../types';

interface DemoSwitcherProps {
  mode: UserMode;
  onChange: (mode: UserMode) => void;
}

export function DemoSwitcher({ mode, onChange }: DemoSwitcherProps) {
  return (
    <div className="inline-flex p-1 bg-slate-900 rounded-2xl border border-bento-border shadow-inner">
      <button
        onClick={() => onChange('Client')}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all",
          mode === 'Client' ? "bg-bento-card text-bento-primary shadow-lg ring-1 ring-bento-border/50" : "text-bento-text-muted hover:text-bento-text-bold"
        )}
      >
        <Briefcase className="w-3.5 h-3.5" />
        CLIENT MODE
      </button>
      <button
        onClick={() => onChange('Freelancer')}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all",
          mode === 'Freelancer' ? "bg-bento-card text-bento-primary shadow-lg ring-1 ring-bento-border/50" : "text-bento-text-muted hover:text-bento-text-bold"
        )}
      >
        <User className="w-3.5 h-3.5" />
        FREELANCER MODE
      </button>
    </div>
  );
}
