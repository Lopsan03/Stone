import { Wallet, ShieldCheck, Activity } from 'lucide-react';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { truncateAddress } from '../lib/utils';

interface HeaderProps {
  userAddress?: string;
  onConnectWallet?: () => Promise<void> | void;
  isWrongChain?: boolean;
  chainId?: number;
}

export function Header({ userAddress = '', onConnectWallet, isWrongChain = false, chainId }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-bento-card h-16 border-b border-bento-border px-6 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-bento-primary flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.3)]">
          <ShieldCheck className="w-5 h-5 text-white" strokeWidth={3} />
        </div>
        <span className="text-lg font-extrabold text-bento-text-bold tracking-tight">Stone</span>
      </div>

      <div className="flex items-center gap-4">
        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${isWrongChain ? 'bg-red-500/10 text-red-300 border-red-500/30' : 'bg-[#1e1b4b] text-[#c7d2fe] border-[#312e81]'}`}>
          {isWrongChain ? 'Wrong Network' : `Chain ${chainId ?? '-'}`}
        </span>

        <div className="flex items-center gap-3">
          {userAddress ? (
            <Button className="h-9 rounded-lg bg-bento-primary px-4 text-xs font-bold text-white border-0 shadow-lg shadow-indigo-500/20">
              {truncateAddress(userAddress)}
            </Button>
          ) : (
            <Button onClick={onConnectWallet} className="h-9 rounded-lg bg-bento-primary px-6 text-xs font-bold text-white shadow-lg shadow-indigo-500/20">
              Connect Wallet
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
