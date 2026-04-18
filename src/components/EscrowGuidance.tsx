import { BookOpen, Shield, Lock, AlertCircle, CheckCircle2, DollarSign } from 'lucide-react';

export function EscrowGuidance() {
  return (
    <div className="bg-bento-card rounded-bento border border-bento-border p-6 space-y-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-bento-border">
        <BookOpen className="w-6 h-6 text-bento-primary" />
        <h2 className="text-lg font-bold text-bento-text-bold">Understanding Escrow Security</h2>
      </div>

      {/* How It Works */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-bento-text-bold flex items-center gap-2">
          <Shield className="w-4 h-4 text-indigo-400" />
          How the Escrow System Works
        </h3>

        <div className="space-y-3">
          {/* Step 1 */}
          <div className="bg-slate-900/50 rounded-lg p-4 border border-bento-border">
            <div className="flex gap-3">
              <div className="shrink-0">
                <span className="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-500/20 text-indigo-400 font-bold text-sm">1</span>
              </div>
              <div>
                <h4 className="font-bold text-sm text-bento-text-bold">Client Deposits Funds</h4>
                <p className="text-xs text-bento-text-muted mt-1">
                  The client deposits the full project amount at contract creation. This is the only time money enters the escrow.
                </p>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-slate-900/50 rounded-lg p-4 border border-bento-border">
            <div className="flex gap-3">
              <div className="shrink-0">
                <span className="flex items-center justify-center h-8 w-8 rounded-full bg-amber-500/20 text-amber-400 font-bold text-sm">2</span>
              </div>
              <div>
                <h4 className="font-bold text-sm text-bento-text-bold">Funds Are Locked</h4>
                <p className="text-xs text-bento-text-muted mt-1">
                  All funds are locked on-chain. Neither the client nor freelancer can access them arbitrarily.
                </p>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-slate-900/50 rounded-lg p-4 border border-bento-border">
            <div className="flex gap-3">
              <div className="shrink-0">
                <span className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-500/20 text-blue-400 font-bold text-sm">3</span>
              </div>
              <div>
                <h4 className="font-bold text-sm text-bento-text-bold">Work in Phases</h4>
                <p className="text-xs text-bento-text-muted mt-1">
                  The project is divided into milestones. Phases must be completed sequentially—no skipping or jumping ahead.
                </p>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-slate-900/50 rounded-lg p-4 border border-bento-border">
            <div className="flex gap-3">
              <div className="shrink-0">
                <span className="flex items-center justify-center h-8 w-8 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-sm">4</span>
              </div>
              <div>
                <h4 className="font-bold text-sm text-bento-text-bold">Approve & Release</h4>
                <p className="text-xs text-bento-text-muted mt-1">
                  When a milestone is complete, the freelancer marks it done. The client reviews and approves. Payment releases only then.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why This Matters */}
      <div className="space-y-4 pt-4 border-t border-bento-border">
        <h3 className="text-sm font-bold text-bento-text-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          Why This Protects Both Parties
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Client Protection */}
          <div className="bg-blue-500/5 border border-blue-500/30 rounded-lg p-4">
            <h4 className="font-bold text-sm text-blue-300 mb-2">Protects the Client</h4>
            <ul className="text-xs space-y-2 text-bento-text-muted">
              <li className="flex gap-2">
                <span className="text-blue-400">✓</span>
                <span>Money doesn't leave escrow until work is approved</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-400">✓</span>
                <span>Can dispute low-quality work before paying</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-400">✓</span>
                <span>Freelancer can't ghost or abandon project</span>
              </li>
            </ul>
          </div>

          {/* Freelancer Protection */}
          <div className="bg-emerald-500/5 border border-emerald-500/30 rounded-lg p-4">
            <h4 className="font-bold text-sm text-emerald-300 mb-2">Protects the Freelancer</h4>
            <ul className="text-xs space-y-2 text-bento-text-muted">
              <li className="flex gap-2">
                <span className="text-emerald-400">✓</span>
                <span>Money is guaranteed upfront (no payment delays)</span>
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-400">✓</span>
                <span>Client can't steal work and refuse payment</span>
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-400">✓</span>
                <span>Payment disputes are resolved fairly by arbitrators</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Safety Features */}
      <div className="space-y-4 pt-4 border-t border-bento-border">
        <h3 className="text-sm font-bold text-bento-text-bold flex items-center gap-2">
          <Lock className="w-4 h-4 text-amber-400" />
          Security Features
        </h3>

        <div className="space-y-2 text-xs text-bento-text-muted">
          <div className="flex gap-2">
            <span className="text-amber-400 font-bold">→</span>
            <span><span className="font-bold">Sequential Enforcement:</span> Cannot skip phases. Must complete Phase 1 before Phase 2 payment.</span>
          </div>
          <div className="flex gap-2">
            <span className="text-amber-400 font-bold">→</span>
            <span><span className="font-bold">Dual Approval:</span> Freelancer marks done, client approves. Both confirmations needed.</span>
          </div>
          <div className="flex gap-2">
            <span className="text-amber-400 font-bold">→</span>
            <span><span className="font-bold">Dispute Arbitration:</span> Either party can escalate. Platform arbitrators make final decision.</span>
          </div>
          <div className="flex gap-2">
            <span className="text-amber-400 font-bold">→</span>
            <span><span className="font-bold">Locked Funds:</span> Money stays in escrow contract until released. Not held in personal wallets.</span>
          </div>
        </div>
      </div>

      {/* What This Prevents */}
      <div className="space-y-4 pt-4 border-t border-bento-border">
        <h3 className="text-sm font-bold text-bento-text-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400" />
          What This Prevents
        </h3>

        <div className="bg-red-500/5 border border-red-500/30 rounded-lg p-4 space-y-2">
          <div className="flex gap-2 text-xs">
            <span className="text-red-400 font-bold">✗</span>
            <span>Client paying upfront then the freelancer ghosting</span>
          </div>
          <div className="flex gap-2 text-xs">
            <span className="text-red-400 font-bold">✗</span>
            <span>Freelancer doing work but client refusing to pay</span>
          </div>
          <div className="flex gap-2 text-xs">
            <span className="text-red-400 font-bold">✗</span>
            <span>Client/freelancer withdrawing money mid-project</span>
          </div>
          <div className="flex gap-2 text-xs">
            <span className="text-red-400 font-bold">✗</span>
            <span>Ambiguous payments without clear deliverables</span>
          </div>
          <div className="flex gap-2 text-xs">
            <span className="text-red-400 font-bold">✗</span>
            <span>One party disappearing after collecting payment</span>
          </div>
        </div>
      </div>
    </div>
  );
}
