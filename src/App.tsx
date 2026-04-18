import { Header } from './components/Header';
import { CreateContractForm } from './components/CreateContractForm';
import { ContractCard } from './components/ContractCard';
import { ReputationCard } from './components/ReputationCard';
import { DemoSwitcher } from './components/DemoSwitcher';
import { MarketplaceBoard } from './components/MarketplaceBoard';
import { ProposalBoard } from './components/ProposalBoard';
import { RelationshipBoard } from './components/RelationshipBoard';
import { useEscrow } from './hooks/useEscrow';
import { Layout, History, Sparkles, Globe, Handshake, FolderKanban } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const {
    activeContracts,
    completedContracts,
    activeTab,
    setActiveTab,
    visibleProfiles,
    incomingProposals,
    outgoingProposals,
    freelancerMarketplaceProjects,
    activeRelationships,
    getProfileById,
    freelancerReputation,
    clientReputation,
    userMode,
    setUserMode,
    isPendingTx,
    sendProposal,
    requestToWorkOnProject,
    acceptProposal,
    declineProposal,
    counterProposal,
    createContract,
    fundContract,
    markMilestoneCompleted,
    approveAndPayMilestone,
    totalEarnings,
  } = useEscrow();

  const resolveName = (userId: string) => getProfileById(userId)?.name ?? 'Unknown User';
  const resolveWallet = (userId: string) => getProfileById(userId)?.walletAddress ?? '0x...';
  const sidebarReputation = userMode === 'Client' ? clientReputation : freelancerReputation;
  const sidebarReputationTitle = userMode === 'Client' ? 'Client Reputation' : 'Freelancer Reputation';

  return (
    <div className="min-h-screen bg-bento-bg font-sans text-bento-text-bold selection:bg-bento-primary-soft selection:text-bento-primary tracking-tight">
      <Header />

      <main className="max-w-7xl mx-auto px-6 pt-24 pb-20 grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
        {/* Left Column (Sidebar) - Bento Style */}
        <div className="space-y-6">
          <ReputationCard reputation={sidebarReputation} title={sidebarReputationTitle} />

          {/* Network Status - Bento Mini Card */}
          <div className="p-5 bg-bento-card rounded-bento border border-bento-border shadow-sm">
             <h4 className="text-[11px] font-bold text-bento-text-muted uppercase tracking-widest mb-4">Network Activity</h4>
             <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-bento-text-muted">TPS</span>
                  <span className="text-xs font-mono font-bold text-bento-success">10k+</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-bento-text-muted">Gas Price</span>
                  <span className="text-xs font-mono font-bold text-bento-success">0.01</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-bento-primary h-full w-2/3 animate-pulse"></div>
                </div>
             </div>
          </div>
        </div>

        {/* Right Column (Main Content) */}
        <div className="space-y-6">
          {/* Dashboard Header within Bento layout */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 p-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-bento-primary" />
                <span className="text-[10px] font-black text-bento-primary uppercase tracking-[0.2em]">Escrow Portal</span>
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight">
                Alex's <span className="text-bento-primary">Dashboard</span>
              </h1>
            </div>
            <DemoSwitcher mode={userMode} onChange={setUserMode} />
          </div>

          <div className="p-2 flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab('Marketplace')}
              className={`px-3 py-2 rounded-lg text-xs font-bold border transition-colors ${activeTab === 'Marketplace' ? 'border-bento-primary bg-bento-primary-soft text-bento-primary' : 'border-bento-border bg-bento-card text-bento-text-muted hover:text-bento-text-bold'}`}
            >
              <span className="inline-flex items-center gap-1.5"><Globe className="w-3.5 h-3.5" /> Marketplace</span>
            </button>
            <button
              onClick={() => setActiveTab('Relationships')}
              className={`px-3 py-2 rounded-lg text-xs font-bold border transition-colors ${activeTab === 'Relationships' ? 'border-bento-primary bg-bento-primary-soft text-bento-primary' : 'border-bento-border bg-bento-card text-bento-text-muted hover:text-bento-text-bold'}`}
            >
              <span className="inline-flex items-center gap-1.5"><Handshake className="w-3.5 h-3.5" /> Relationships</span>
            </button>
            <button
              onClick={() => setActiveTab('Contracts')}
              className={`px-3 py-2 rounded-lg text-xs font-bold border transition-colors ${activeTab === 'Contracts' ? 'border-bento-primary bg-bento-primary-soft text-bento-primary' : 'border-bento-border bg-bento-card text-bento-text-muted hover:text-bento-text-bold'}`}
            >
              <span className="inline-flex items-center gap-1.5"><FolderKanban className="w-3.5 h-3.5" /> Contracts</span>
            </button>
          </div>

          {/* Stats Row - Bento Boxes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 bg-bento-card border border-bento-border rounded-bento shadow-sm">
              <span className="text-[10px] font-bold text-bento-text-muted uppercase tracking-[0.5px]">Escrow Balance</span>
              <div className="text-xl font-bold mt-1 tracking-tight text-bento-text-bold">
                {totalEarnings.toLocaleString()} <span className="text-xs text-bento-text-muted font-medium ml-1">MON</span>
              </div>
            </div>
            <div className="p-5 bg-bento-card border border-bento-border rounded-bento shadow-sm">
              <span className="text-[10px] font-bold text-bento-text-muted uppercase tracking-[0.5px]">Released Funds</span>
              <div className="text-xl font-bold mt-1 tracking-tight text-bento-text-bold">
                {[...activeContracts, ...completedContracts].reduce((acc, c) => acc + c.releasedAmount, 0).toLocaleString()} <span className="text-xs text-bento-text-muted font-medium ml-1">MON</span>
              </div>
            </div>
            <div className="p-5 bg-bento-card border border-bento-border rounded-bento shadow-sm">
              <span className="text-[10px] font-bold text-bento-text-muted uppercase tracking-[0.5px]">Active Tasks</span>
              <div className="text-xl font-bold mt-1 tracking-tight text-bento-text-bold">
                {activeContracts.reduce((acc, c) => acc + c.milestones.filter(m => m.status === 'Completed').length, 0)} <span className="text-xs text-bento-text-muted font-medium ml-1">Pending Approval</span>
              </div>
            </div>
          </div>

          {activeTab === 'Marketplace' && (
            <MarketplaceBoard
              userMode={userMode}
              profiles={visibleProfiles}
              freelancerProjects={freelancerMarketplaceProjects}
              resolveName={resolveName}
              isLoading={isPendingTx}
              onRequestToWork={requestToWorkOnProject}
              onSendProposal={sendProposal}
            />
          )}

          {activeTab === 'Relationships' && (
            <>
              <ProposalBoard
                incoming={incomingProposals}
                outgoing={outgoingProposals}
                resolveName={resolveName}
                onAccept={acceptProposal}
                onDecline={declineProposal}
                onCounter={counterProposal}
                isLoading={isPendingTx}
              />
              <RelationshipBoard relationships={activeRelationships} resolveName={resolveName} />
            </>
          )}

          {/* Active Contracts Section */}
          {activeTab === 'Contracts' && (
          <section className="space-y-4">
            {userMode === 'Client' && (
              <CreateContractForm
                userMode={userMode}
                relationships={activeRelationships.filter((rel) => rel.status === 'Active')}
                resolveName={resolveName}
                resolveWallet={resolveWallet}
                onSubmit={createContract}
                isLoading={isPendingTx}
              />
            )}

            <div className="flex items-center justify-between px-2">
              <h2 className="text-xs font-bold text-bento-text-muted uppercase tracking-widest flex items-center gap-2">
                 <Layout className="w-3.5 h-3.5" />
                 Active Contracts
              </h2>
            </div>

            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {activeContracts.map((contract) => (
                  <motion.div
                    key={contract.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="bento-card-container"
                  >
                    <ContractCard
                      contract={contract}
                      userMode={userMode}
                      onFund={fundContract}
                      onApprove={approveAndPayMilestone}
                      onComplete={markMilestoneCompleted}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {activeContracts.length === 0 && (
                 <div className="bg-bento-card rounded-bento border border-dashed border-bento-border p-12 text-center">
                    <History className="w-10 h-10 text-bento-border mx-auto mb-3" />
                    <p className="text-bento-text-muted font-medium text-sm">No active contracts found.</p>
                 </div>
              )}
            </div>

            <div className="pt-2">
              <div className="flex items-center justify-between px-2 mb-3">
                <h2 className="text-xs font-bold text-bento-text-muted uppercase tracking-widest">Completed Contracts</h2>
              </div>
              <div className="space-y-4">
                {completedContracts.map((contract) => (
                  <motion.div
                    key={`done-${contract.id}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bento-card-container"
                  >
                    <ContractCard
                      contract={contract}
                      userMode={userMode}
                      onFund={fundContract}
                      onApprove={approveAndPayMilestone}
                      onComplete={markMilestoneCompleted}
                    />
                  </motion.div>
                ))}
                {completedContracts.length === 0 && (
                  <div className="bg-bento-card rounded-bento border border-dashed border-bento-border p-8 text-center">
                    <p className="text-bento-text-muted font-medium text-sm">No completed contracts yet.</p>
                  </div>
                )}
              </div>
            </div>
          </section>
          )}
        </div>
      </main>

      {/* Transaction Status - Bento Style */}
      <AnimatePresence>
        {isPendingTx && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-100"
          >
            <div className="bg-bento-text-bold text-white px-5 py-3 rounded-bento shadow-2xl flex items-center gap-3 border border-slate-700">
               <div className="w-4 h-4 rounded-full border-2 border-bento-primary border-t-transparent animate-spin"></div>
               <div className="flex flex-col">
                  <p className="text-xs font-bold">Transaction in progress</p>
                  <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest">Awaiting Monad confirmation</p>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
