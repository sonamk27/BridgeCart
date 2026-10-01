import { useState } from 'react';
import { INITIAL_COMMUNITY_WALLET_DATA } from '../../data/adminMockData';

export default function CommunityWallet() {
  const [walletData, setWalletData] = useState(INITIAL_COMMUNITY_WALLET_DATA);
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState(null);

  function handleTriggerAudit() {
    setIsAuditing(true);
    setAuditResult(null);

    setTimeout(() => {
      setIsAuditing(false);
      setAuditResult({
        timestamp: new Date().toLocaleTimeString(),
        solvencyRatio: '100.00%',
        escrowReserveMatched: true,
        nonSpendableEnforcement: 'ENFORCED (Admin Keys Blocked from Fund Exfiltration)',
        merkleRoot: '0x94fba8204e1bc2990a184fdd28bca771092e01',
        totalDonationsAuditedINR: walletData.escrowPoolBalance,
        totalFoodDeliveredINR: walletData.totalRedeemedToDate
      });
    }, 1200);
  }

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-100 text-teal-800 tracking-wide uppercase">
              MVP Module
            </span>
            <span className="text-xs text-slate-500 font-medium">Stage: Escrow Monitoring</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Community Wallet & Escrow</h2>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Monitor the platform escrow and wallet-related activity while keeping donation funds non-spendable for the Admin.
          </p>
        </div>

        <button
          onClick={handleTriggerAudit}
          disabled={isAuditing}
          className="bg-slate-900 hover:bg-teal-700 text-white text-xs font-extrabold px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <span>{isAuditing ? '⏳' : '🛡️'}</span>
          {isAuditing ? 'Auditing Vault Proofs...' : 'Run Escrow Solvency Audit'}
        </button>
      </div>

      {/* Non-Spendable Safeguard Banner (Crucial Requirement) */}
      <div className="bg-gradient-to-r from-emerald-900 to-slate-900 text-white rounded-2xl p-6 shadow-md border border-emerald-500/30 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-44 h-44 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />
        
        <div className="flex items-start gap-4 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-2xl shrink-0">
            🔒
          </div>
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-400/30">
                Non-Spendable Protocol Active
              </span>
              <span className="text-xs text-slate-400">Zero Admin Custody</span>
            </div>
            <h3 className="text-lg font-bold text-white">
              Strict Escrow Policy: Donation Funds Are Non-Spendable By Admin
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
              Platform policy and cryptographic multi-sig constraints prohibit any administrative withdrawal, fee diversion, or unauthorized transfer of community donations. Funds are programmatically restricted to settle directly to partner supermarket merchant accounts only upon verified beneficiary checkout of essential food grains.
            </p>
            <div className="pt-2 flex items-center gap-6 text-[11px] text-slate-400 font-mono">
              <div>Contract: <span className="text-emerald-400">{walletData.escrowSmartContractAddress.slice(0, 16)}...</span></div>
              <div>Escrow Bank: <span className="text-slate-300">SBI Dedicated Food Trust</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Audit Result Banner if run */}
      {auditResult && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-5 text-emerald-950 animate-in fade-in space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
              <span>✓</span> Cryptographic Solvency Proof Verified • {auditResult.timestamp}
            </span>
            <span className="text-xs font-mono bg-emerald-200/70 text-emerald-900 px-2 py-0.5 rounded font-bold">
              100% Solvency Ratio
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
            <div>
              <span className="text-emerald-700">Non-Spendable Guarantee:</span>
              <div className="font-bold">{auditResult.nonSpendableEnforcement}</div>
            </div>
            <div>
              <span className="text-emerald-700">Total Donated vs Delivered:</span>
              <div className="font-bold">₹{auditResult.totalDonationsAuditedINR.toLocaleString()} Pool / ₹{auditResult.totalFoodDeliveredINR.toLocaleString()} Redeemed</div>
            </div>
            <div>
              <span className="text-emerald-700">ZK Merkle Root Hash:</span>
              <div className="font-mono font-bold text-[11px] truncate">{auditResult.merkleRoot}</div>
            </div>
          </div>
        </div>
      )}

      {/* Vault KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Platform Escrow</div>
          <div className="text-2xl font-black text-slate-900 mt-1">
            ₹{walletData.escrowPoolBalance.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            <span className="text-emerald-600 font-bold">1,420</span> public donations
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Allocated to Families</div>
          <div className="text-2xl font-black text-teal-700 mt-1">
            ₹{walletData.activeAllocatedBeneficiaryFunds.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Active monthly food quotas
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Redeemed In-Store</div>
          <div className="text-2xl font-black text-emerald-700 mt-1">
            ₹{walletData.totalRedeemedToDate.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Settled to supermarkets
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Unallocated Buffer</div>
          <div className="text-2xl font-black text-indigo-700 mt-1">
            ₹{walletData.unallocatedBuffer.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Ready for new applicants
          </div>
        </div>
      </div>

      {/* Escrow Settlement Stream Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm">Escrow Transaction & Settlement Ledger</h3>
            <p className="text-xs text-slate-500">Real-time escrow movements, checkout round-ups, and merchant disbursements.</p>
          </div>
          <span className="text-xs font-mono bg-slate-100 px-2.5 py-1 rounded text-slate-600 font-bold">
            Live Stream
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-bold text-slate-600 uppercase tracking-wider border-b border-slate-200">
                <th className="py-3 px-4">Tx ID / Date</th>
                <th className="py-3 px-4">Event Type</th>
                <th className="py-3 px-4">Counterparty / Store</th>
                <th className="py-3 px-4">Beneficiary Ref</th>
                <th className="py-3 px-4 text-right">Amount (₹)</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4">Ledger Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {walletData.recentEscrowTransactions.map(tx => (
                <tr key={tx.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-mono font-bold text-slate-900">{tx.id}</div>
                    <div className="text-[11px] text-slate-500">{tx.date}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      tx.type === 'MERCHANT_SETTLEMENT'
                        ? 'bg-blue-100 text-blue-800'
                        : tx.type === 'PUBLIC_DONATION'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {tx.type}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-semibold text-slate-800">
                    {tx.recipientStore || tx.donorName}
                  </td>

                  <td className="py-3.5 px-4 font-mono text-slate-600">
                    {tx.beneficiaryToken}
                  </td>

                  <td className="py-3.5 px-4 text-right font-bold text-slate-900">
                    ₹{tx.amount.toFixed(2)}
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full text-[10px]">
                      <span>✓</span> {tx.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500 truncate max-w-[140px]" title={tx.txHash}>
                    {tx.txHash.slice(0, 14)}...
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
