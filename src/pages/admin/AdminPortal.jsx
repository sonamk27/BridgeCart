import { useState } from 'react';
import { INITIAL_BENEFICIARIES } from '../../data/adminMockData';
import BeneficiaryVerification from './BeneficiaryVerification';
import RationCardVerification from './RationCardVerification';
import FamilyVerification from './FamilyVerification';
import ApplicationDecision from './ApplicationDecision';
import CommunityWallet from './CommunityWallet';
import FraudTrust from './FraudTrust';
import TransparencyLedger from './TransparencyLedger';
import ReVerification from './ReVerification';
import AdminReports from './AdminReports';

export default function AdminPortal({ onExit }) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 9 modules
  const [beneficiaries, setBeneficiaries] = useState(INITIAL_BENEFICIARIES);
  const [targetDecisionBeneficiary, setTargetDecisionBeneficiary] = useState(null);

  function handleUpdateBeneficiary(updated) {
    setBeneficiaries(prev => prev.map(b => (b.id === updated.id ? updated : b)));
  }

  function handleAdvanceToDecision(beneficiary) {
    setTargetDecisionBeneficiary(beneficiary);
    setActiveTab('application-decision');
  }

  const pendingDecisionsCount = beneficiaries.filter(b => b.decisionStatus === 'PENDING').length;
  const highFraudAlertsCount = 1;

  const navItems = [
    { key: 'overview', label: 'Executive Overview', icon: '🏛️', stage: 'Dashboard' },
    // MVP Modules
    { key: 'beneficiary-verification', label: 'Beneficiary Verification', icon: '📋', stage: 'MVP', badge: pendingDecisionsCount > 0 ? pendingDecisionsCount : null },
    { key: 'ration-card', label: 'Ration Card Verification', icon: '🪪', stage: 'MVP' },
    { key: 'family-verification', label: 'Family Verification', icon: '👨‍👩‍👧‍👦', stage: 'MVP' },
    { key: 'application-decision', label: 'Application Decision', icon: '⚖️', stage: 'MVP' },
    { key: 'community-wallet', label: 'Community Wallet', icon: '🛡️', stage: 'MVP' },
    // Secondary Modules
    { key: 'fraud-trust', label: 'Fraud & Trust', icon: '🚨', stage: 'Secondary', badge: highFraudAlertsCount ? '1 High' : null },
    { key: 'transparency-ledger', label: 'Transparency & Ledger', icon: '🔗', stage: 'Secondary' },
    { key: 're-verification', label: 'Re-verification', icon: '🔄', stage: 'Secondary' },
    { key: 'reports', label: 'Reports & Impact', icon: '📊', stage: 'Secondary' }
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Sovereign Admin Topbar */}
      <header className="bg-slate-950/90 backdrop-blur-md border-b border-slate-800 px-6 py-3.5 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-400 flex items-center justify-center text-xl shadow-md shadow-teal-500/20">
            🛒
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-white">BridgeCart</span>
              <span className="bg-teal-500/20 text-teal-300 border border-teal-500/40 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full">
                ADMIN CONSOLE
              </span>
              <span className="bg-slate-800 text-slate-300 text-[10px] font-mono px-2 py-0.5 rounded border border-slate-700">
                /admin route
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Sovereign Beneficiary Verification, Escrow Monitoring & Trust Governance
            </p>
          </div>
        </div>

        {/* Center / Right status badge & actions */}
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-400">Escrow Vault:</span>
            <span className="font-bold text-emerald-300 font-mono">₹4,85,420 (Non-Spendable)</span>
          </div>

          <button
            onClick={onExit}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-3.5 py-2 rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Return to the Store / Customer app"
          >
            <span>←</span> Exit to Store
          </button>

          <div className="flex items-center gap-2 pl-3 border-l border-slate-800">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-teal-400">
              AD
            </div>
            <div className="hidden sm:block text-left text-xs">
              <div className="font-bold text-white leading-tight">Super Admin</div>
              <div className="text-[10px] text-slate-400">Govt. & Trust Liaison</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Admin Body: Sidebar + Dynamic Workspace */}
      <div className="flex-1 flex flex-col md:flex-row min-w-0">
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-64 shrink-0 bg-slate-950/60 border-r border-slate-800 p-3 flex flex-col">
          <div className="text-[10.5px] font-bold text-slate-400 px-3 pt-2 pb-1.5 uppercase tracking-wider">
            Admin Navigation
          </div>

          <div className="space-y-1 overflow-y-auto flex-1">
            {navItems.map(item => {
              const isActive = activeTab === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => setActiveTab(item.key)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-left ${
                    isActive
                      ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className="text-sm">{item.icon}</span>
                    <span className="truncate">{item.label}</span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {item.badge && (
                      <span className="bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full animate-pulse">
                        {item.badge}
                      </span>
                    )}
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                        item.stage === 'MVP'
                          ? isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-blue-500/20 text-blue-300'
                          : item.stage === 'Secondary'
                          ? isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-slate-800 text-slate-400'
                          : 'hidden'
                      }`}
                    >
                      {item.stage}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 px-3">
            <div className="font-semibold text-slate-300">BridgeCart Governance</div>
            <div className="text-[10px] text-slate-400 mt-0.5">National Food Security Act (NFSA) & BPL Subsidy Architecture</div>
          </div>
        </aside>

        {/* Content Workspace */}
        <main className="flex-1 bg-slate-100 text-slate-900 p-6 md:p-8 overflow-y-auto min-w-0">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Executive Cockpit Header */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-900 text-white tracking-wide uppercase">
                      Executive Cockpit
                    </span>
                    <span className="text-xs text-slate-500 font-medium">Full Governance Overview</span>
                  </div>
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight">Admin & Sovereign Operations</h1>
                  <p className="text-sm text-slate-600 mt-1 max-w-2xl">
                    Unified dashboard tracking government verification, family match validation, non-spendable escrow reserves, and fraud integrity across all 9 platform capabilities.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2 text-center">
                    <div className="text-[11px] font-bold text-emerald-800">Escrow Reserve</div>
                    <div className="text-lg font-black text-emerald-700">₹4,85,420</div>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-2 text-center">
                    <div className="text-[11px] font-bold text-blue-800">Nourished Families</div>
                    <div className="text-lg font-black text-blue-700">412</div>
                  </div>
                </div>
              </div>

              {/* Status Banner for Non-Spendable Escrow */}
              <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-slate-900 text-white rounded-2xl p-5 border border-teal-500/30 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-xl shrink-0">
                    🔒
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">Escrow Safeguard Active: Admin Cannot Spend Donations</h3>
                    <p className="text-xs text-slate-300">
                      Platform escrow funds are strictly locked to direct merchant settlement upon verified essential grocery checkouts.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('community-wallet')}
                  className="bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-extrabold px-3.5 py-2 rounded-xl shrink-0 transition-colors cursor-pointer"
                >
                  Monitor Escrow →
                </button>
              </div>

              {/* 9 Modules Matrix Grid */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-slate-900 text-base">Core & Governance Modules Matrix</h3>
                  <span className="text-xs text-slate-500">9 Modules • 5 MVP / 4 Secondary</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Row 1: Beneficiary Verification */}
                  <div
                    onClick={() => setActiveTab('beneficiary-verification')}
                    className="bg-white hover:border-teal-500 border border-slate-200 rounded-2xl p-5 shadow-sm transition-all cursor-pointer hover:shadow-md group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">MVP</span>
                      <span className="text-xs text-teal-600 font-bold group-hover:underline">Open Review →</span>
                    </div>
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <span className="text-xl">📋</span>
                      <h4 className="font-bold text-slate-900 text-sm">Beneficiary Verification</h4>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Review beneficiary applications after government verification and family matching before activating support.
                    </p>
                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-500">Pending Review:</span>
                      <span className="font-bold text-amber-600">{pendingDecisionsCount} Applications</span>
                    </div>
                  </div>

                  {/* Row 2: Ration Card Verification */}
                  <div
                    onClick={() => setActiveTab('ration-card')}
                    className="bg-white hover:border-teal-500 border border-slate-200 rounded-2xl p-5 shadow-sm transition-all cursor-pointer hover:shadow-md group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">MVP</span>
                      <span className="text-xs text-teal-600 font-bold group-hover:underline">Validate Cards →</span>
                    </div>
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <span className="text-xl">🪪</span>
                      <h4 className="font-bold text-slate-900 text-sm">Ration Card Verification</h4>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Verify that the beneficiary belongs to the eligible Yellow / BPL / Antyodaya category through the defined verification process.
                    </p>
                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-500">Eligibility Process:</span>
                      <span className="font-bold text-emerald-600">Yellow (AAY) & BPL (PHH)</span>
                    </div>
                  </div>

                  {/* Row 3: Family Verification */}
                  <div
                    onClick={() => setActiveTab('family-verification')}
                    className="bg-white hover:border-teal-500 border border-slate-200 rounded-2xl p-5 shadow-sm transition-all cursor-pointer hover:shadow-md group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">MVP</span>
                      <span className="text-xs text-teal-600 font-bold group-hover:underline">Inspect Roster →</span>
                    </div>
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <span className="text-xl">👨‍👩‍👧‍👦</span>
                      <h4 className="font-bold text-slate-900 text-sm">Family Verification</h4>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Review the family matching result and ensure the Head of Family and redeeming members match the verified family record.
                    </p>
                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-500">HoF Matching:</span>
                      <span className="font-bold text-teal-700">Biometric & Redeemer Privileges</span>
                    </div>
                  </div>

                  {/* Row 4: Application Decision */}
                  <div
                    onClick={() => setActiveTab('application-decision')}
                    className="bg-white hover:border-teal-500 border border-slate-200 rounded-2xl p-5 shadow-sm transition-all cursor-pointer hover:shadow-md group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">MVP</span>
                      <span className="text-xs text-teal-600 font-bold group-hover:underline">Adjudicate →</span>
                    </div>
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <span className="text-xl">⚖️</span>
                      <h4 className="font-bold text-slate-900 text-sm">Application Decision</h4>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Take the verification decision and record the reason when an application is rejected or requires resubmission.
                    </p>
                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-500">Adjudication Options:</span>
                      <span className="font-bold text-indigo-700">Approve / Reject / Resubmit</span>
                    </div>
                  </div>

                  {/* Row 5: Community Wallet */}
                  <div
                    onClick={() => setActiveTab('community-wallet')}
                    className="bg-white hover:border-teal-500 border border-slate-200 rounded-2xl p-5 shadow-sm transition-all cursor-pointer hover:shadow-md group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">MVP</span>
                      <span className="text-xs text-teal-600 font-bold group-hover:underline">Audit Vault →</span>
                    </div>
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <span className="text-xl">🛡️</span>
                      <h4 className="font-bold text-slate-900 text-sm">Community Wallet & Escrow</h4>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Monitor the platform escrow and wallet-related activity while keeping donation funds non-spendable for the Admin.
                    </p>
                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-500">Escrow Safeguard:</span>
                      <span className="font-bold text-emerald-700 font-mono">100% Non-Spendable Admin</span>
                    </div>
                  </div>

                  {/* Row 6: Fraud & Trust */}
                  <div
                    onClick={() => setActiveTab('fraud-trust')}
                    className="bg-white hover:border-teal-500 border border-slate-200 rounded-2xl p-5 shadow-sm transition-all cursor-pointer hover:shadow-md group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">Secondary</span>
                      <span className="text-xs text-teal-600 font-bold group-hover:underline">Monitor Alerts →</span>
                    </div>
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <span className="text-xl">🚨</span>
                      <h4 className="font-bold text-slate-900 text-sm">Fraud & Trust Monitoring</h4>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Monitor fraud-related concerns and freeze suspected misuse when required by the platform.
                    </p>
                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-500">Active High Alerts:</span>
                      <span className="font-bold text-rose-600">1 Urgent Investigation</span>
                    </div>
                  </div>

                  {/* Row 7: Transparency & Ledger */}
                  <div
                    onClick={() => setActiveTab('transparency-ledger')}
                    className="bg-white hover:border-teal-500 border border-slate-200 rounded-2xl p-5 shadow-sm transition-all cursor-pointer hover:shadow-md group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">Secondary</span>
                      <span className="text-xs text-teal-600 font-bold group-hover:underline">View Ledger →</span>
                    </div>
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <span className="text-xl">🔗</span>
                      <h4 className="font-bold text-slate-900 text-sm">Transparency & Ledger</h4>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Review donation, allocation and redemption records through the public ledger without exposing beneficiary personal information.
                    </p>
                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-500">PII Privacy:</span>
                      <span className="font-bold text-teal-700 font-mono">Zero-PII zk-SNARK</span>
                    </div>
                  </div>

                  {/* Row 8: Re-verification */}
                  <div
                    onClick={() => setActiveTab('re-verification')}
                    className="bg-white hover:border-teal-500 border border-slate-200 shadow-sm rounded-2xl p-5 transition-all cursor-pointer hover:shadow-md group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">Secondary</span>
                      <span className="text-xs text-teal-600 font-bold group-hover:underline">Run Re-checks →</span>
                    </div>
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <span className="text-xl">🔄</span>
                      <h4 className="font-bold text-slate-900 text-sm">Periodic Re-verification</h4>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Re-check beneficiary card eligibility periodically or when an Admin review is triggered.
                    </p>
                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-500">Audit Cycle:</span>
                      <span className="font-bold text-amber-700">6 Months Periodicity</span>
                    </div>
                  </div>

                  {/* Row 9: Reports */}
                  <div
                    onClick={() => setActiveTab('reports')}
                    className="bg-white hover:border-teal-500 border border-slate-200 shadow-sm rounded-2xl p-5 transition-all cursor-pointer hover:shadow-md group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">Secondary</span>
                      <span className="text-xs text-teal-600 font-bold group-hover:underline">Generate CSV →</span>
                    </div>
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <span className="text-xl">📊</span>
                      <h4 className="font-bold text-slate-900 text-sm">Reports & Social Impact</h4>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Review reports related to verification, donations, wallet activity and platform transparency.
                    </p>
                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-500">Fund Efficiency:</span>
                      <span className="font-bold text-emerald-700">100% Direct-to-Food (₹0 Admin Cut)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'beneficiary-verification' && (
            <BeneficiaryVerification
              beneficiaries={beneficiaries}
              onAdvanceToDecision={handleAdvanceToDecision}
            />
          )}

          {activeTab === 'ration-card' && (
            <RationCardVerification
              beneficiaries={beneficiaries}
              onUpdateBeneficiary={handleUpdateBeneficiary}
            />
          )}

          {activeTab === 'family-verification' && (
            <FamilyVerification
              beneficiaries={beneficiaries}
              onUpdateBeneficiary={handleUpdateBeneficiary}
            />
          )}

          {activeTab === 'application-decision' && (
            <ApplicationDecision
              beneficiaries={beneficiaries}
              onUpdateBeneficiary={handleUpdateBeneficiary}
            />
          )}

          {activeTab === 'community-wallet' && (
            <CommunityWallet />
          )}

          {activeTab === 'fraud-trust' && (
            <FraudTrust
              beneficiaries={beneficiaries}
              onUpdateBeneficiary={handleUpdateBeneficiary}
            />
          )}

          {activeTab === 'transparency-ledger' && (
            <TransparencyLedger />
          )}

          {activeTab === 're-verification' && (
            <ReVerification
              beneficiaries={beneficiaries}
              onUpdateBeneficiary={handleUpdateBeneficiary}
            />
          )}

          {activeTab === 'reports' && (
            <AdminReports />
          )}
        </main>
      </div>
    </div>
  );
}
