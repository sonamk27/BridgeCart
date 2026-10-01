import { useState } from 'react';
import { INITIAL_LEDGER_BLOCKS } from '../../data/adminMockData';

export default function TransparencyLedger() {
  const [ledgerBlocks] = useState(INITIAL_LEDGER_BLOCKS);
  const [filterType, setFilterType] = useState('ALL');
  const [searchHash, setSearchHash] = useState('');
  const [inspectBlock, setInspectBlock] = useState(null);

  const filteredBlocks = ledgerBlocks.filter(b => {
    const matchesFilter = filterType === 'ALL' || b.eventType === filterType;
    const matchesSearch =
      !searchHash ||
      b.blockHash.toLowerCase().includes(searchHash.toLowerCase()) ||
      b.anonymizedBeneficiaryHash.toLowerCase().includes(searchHash.toLowerCase()) ||
      b.merchantId.toLowerCase().includes(searchHash.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-100 text-cyan-800 tracking-wide uppercase">
              Secondary Module
            </span>
            <span className="text-xs text-slate-500 font-medium">Stage: Public Transparency</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Transparency & Public Ledger</h2>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Review donation, allocation and redemption records through the public ledger without exposing beneficiary personal information.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-xl text-xs font-bold text-emerald-800">
          <span>🛡️</span> Zero-PII Protected (GDPR/DPDP Compliant)
        </div>
      </div>

      {/* Privacy-Preserving Explainer Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 flex items-start gap-4 shadow-sm">
        <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center text-xl shrink-0 font-mono">
          #
        </div>
        <div className="space-y-1 text-xs">
          <div className="font-bold text-sm text-slate-100">Cryptographic Anonymization Protocol</div>
          <p className="text-slate-400 leading-relaxed max-w-3xl">
            All ledger entries record mathematical proofs of fund origin and essential grocery disbursement. No real beneficiary names, ration card identifiers, Aadhaar numbers, or personal phone contacts are ever written to the public ledger. Each participant is protected by a rotating one-way salted hash.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <span className="absolute left-3 top-2.5 text-slate-400">🔍</span>
          <input
            type="text"
            placeholder="Search by Block Hash, Anonymized Token, Merchant..."
            value={searchHash}
            onChange={e => setSearchHash(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-teal-500/30"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Event Type:</span>
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
          >
            <option value="ALL">All Ledger Events</option>
            <option value="REDEMPTION_SETTLEMENT">Redemption Settlement</option>
            <option value="COMMUNITY_DONATION">Community Donation</option>
            <option value="ESCROW_ALLOCATION">Escrow Allocation</option>
          </select>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-bold text-slate-600 uppercase tracking-wider border-b border-slate-200">
                <th className="py-3 px-4">Height</th>
                <th className="py-3 px-4">Timestamp (UTC)</th>
                <th className="py-3 px-4">Event Type</th>
                <th className="py-3 px-4">Anonymized Token</th>
                <th className="py-3 px-4">Merchant / Vault</th>
                <th className="py-3 px-4 text-right">Amount (₹)</th>
                <th className="py-3 px-4 text-center">Zero-Knowledge Proof</th>
                <th className="py-3 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredBlocks.map(block => (
                <tr key={block.blockHeight} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-teal-700">
                    #{block.blockHeight}
                  </td>

                  <td className="py-3.5 px-4 font-mono text-slate-500">
                    {block.timestamp}
                  </td>

                  <td className="py-3.5 px-4">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      block.eventType === 'REDEMPTION_SETTLEMENT'
                        ? 'bg-blue-100 text-blue-800'
                        : block.eventType === 'COMMUNITY_DONATION'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {block.eventType}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-mono text-slate-700 font-semibold truncate max-w-[140px]" title={block.anonymizedBeneficiaryHash}>
                    {block.anonymizedBeneficiaryHash}
                  </td>

                  <td className="py-3.5 px-4 font-semibold text-slate-800">
                    {block.merchantId}
                  </td>

                  <td className="py-3.5 px-4 text-right font-black text-slate-900">
                    ₹{block.amount.toFixed(2)}
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                      ✓ zk-SNARK Verified
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setInspectBlock(block)}
                      className="text-xs text-teal-600 font-bold hover:underline cursor-pointer"
                    >
                      Inspect →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Block Inspection Modal */}
      {inspectBlock && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-xl">⛓️</span>
                <div>
                  <h3 className="font-black text-slate-900 text-base">Block #{inspectBlock.blockHeight} Ledger Proof</h3>
                  <p className="text-xs text-slate-500 font-mono">{inspectBlock.timestamp}</p>
                </div>
              </div>
              <button
                onClick={() => setInspectBlock(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-500">Block Hash:</span>
                <div className="font-mono text-[11px] font-bold text-slate-800 break-all">{inspectBlock.blockHash}</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-500">Previous Block Hash:</span>
                <div className="font-mono text-[11px] font-bold text-slate-600 break-all">{inspectBlock.prevHash}</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-500">Anonymized Token:</span>
                  <div className="font-mono text-[11px] font-bold text-slate-800">{inspectBlock.anonymizedBeneficiaryHash}</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-500">Settled Amount:</span>
                  <div className="text-base font-black text-emerald-700">₹{inspectBlock.amount.toFixed(2)}</div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-500">Zero-Knowledge SNARK Proof:</span>
                <div className="font-mono text-[11px] text-teal-700 font-bold break-all">{inspectBlock.zkProof}</div>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs">
                ✓ Verified that goods purchased belong strictly to subsidized essential grains (Atta/Rice/Pulses). Zero personal data leaked.
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setInspectBlock(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
