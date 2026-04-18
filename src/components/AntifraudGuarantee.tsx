import { ShieldCheck, Lock, Zap, User2 } from 'lucide-react';

export function AntifraudGuarantee() {
  return (
    <div className="bg-linear-to-r from-indigo-500/10 via-purple-500/10 to-blue-500/10 border border-indigo-500/20 rounded-bento p-6 mb-6">
      <div className="grid md:grid-cols-4 gap-4">
        {/* How it works card 1 */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-indigo-500/20 p-2.5 rounded-lg">
              <User2 className="w-4 h-4 text-indigo-400" />
            </div>
            <span className="text-[11px] font-bold text-indigo-300 uppercase">1. Deposit</span>
          </div>
          <p className="text-[10px] text-bento-text-muted leading-relaxed">
            Client deposits full project amount at contract start
          </p>
        </div>

        {/* How it works card 2 */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-amber-500/20 p-2.5 rounded-lg">
              <Lock className="w-4 h-4 text-amber-400" />
            </div>
            <span className="text-[11px] font-bold text-amber-300 uppercase">2. Locked</span>
          </div>
          <p className="text-[10px] text-bento-text-muted leading-relaxed">
            Funds are locked on-chain, neither party can access
          </p>
        </div>

        {/* How it works card 3 */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-emerald-500/20 p-2.5 rounded-lg">
              <Zap className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-[11px] font-bold text-emerald-300 uppercase">3. Phases</span>
          </div>
          <p className="text-[10px] text-bento-text-muted leading-relaxed">
            Project divided into milestones with clear deliverables
          </p>
        </div>

        {/* How it works card 4 */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-blue-500/20 p-2.5 rounded-lg">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
            </div>
            <span className="text-[11px] font-bold text-blue-300 uppercase">4. Release</span>
          </div>
          <p className="text-[10px] text-bento-text-muted leading-relaxed">
            Payment releases only when milestone approved & completed
          </p>
        </div>
      </div>

      {/* Guarantees */}
      <div className="mt-6 pt-6 border-t border-bento-border grid md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <h4 className="text-[11px] font-bold text-green-300 flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            Nobody Can Escape
          </h4>
          <p className="text-[10px] text-bento-text-muted ml-5">
            Funds are locked until deliverables are complete. Neither party can withdraw arbitrarily.
          </p>
        </div>
        <div className="space-y-1">
          <h4 className="text-[11px] font-bold text-green-300 flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            Nobody Can Cheat
          </h4>
          <p className="text-[10px] text-bento-text-muted ml-5">
            Sequential phases, client approval required, and dispute arbitration prevent fraud on both sides.
          </p>
        </div>
      </div>
    </div>
  );
}
