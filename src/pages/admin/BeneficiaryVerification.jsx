import { useState } from 'react';

export default function BeneficiaryVerification({
  beneficiaries,
  onSelectBeneficiary,
  onAdvanceToDecision
}) {
  const [search, setSearch] = useState('');
  const [govtFilter, setGovtFilter] = useState('ALL');
  const [familyFilter, setFamilyFilter] = useState('ALL');
  const [selectedDoc, setSelectedDoc] = useState(null);

  const filtered = beneficiaries.filter(b => {
    const matchesSearch =
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.phone.includes(search) ||
      b.rationCardNumber.toLowerCase().includes(search.toLowerCase()) ||
      b.id.toLowerCase().includes(search.toLowerCase());

    const matchesGovt =
      govtFilter === 'ALL' ||
      (govtFilter === 'PASSED' && b.govtVerificationStatus === 'PASSED') ||
      (govtFilter === 'FAILED' && b.govtVerificationStatus.includes('FAILED'));

    const matchesFamily =
      familyFilter === 'ALL' ||
      (familyFilter === 'MATCHED' && b.familyMatchStatus === 'MATCHED') ||
      (familyFilter === 'MISMATCH' && b.familyMatchStatus === 'MISMATCH_DETECTED');

    return matchesSearch && matchesGovt && matchesFamily;
  });

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 tracking-wide uppercase">
              MVP Module
            </span>
            <span className="text-xs text-slate-500 font-medium">Stage: Core Verification</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Beneficiary Verification</h2>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Review beneficiary applications after government verification and family matching before activating support.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-center">
            <div className="text-xs font-medium text-slate-500">Under Review</div>
            <div className="text-xl font-bold text-amber-600">
              {beneficiaries.filter(b => b.decisionStatus === 'PENDING').length}
            </div>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-center">
            <div className="text-xs font-medium text-slate-500">Activated</div>
            <div className="text-xl font-bold text-emerald-600">
              {beneficiaries.filter(b => b.decisionStatus === 'APPROVED').length}
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <span className="absolute left-3 top-2.5 text-slate-400">🔍</span>
          <input
            type="text"
            placeholder="Search by Name, Phone, Ration Card, ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Govt Match:</span>
          <select
            value={govtFilter}
            onChange={e => setGovtFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/30"
          >
            <option value="ALL">All Statuses</option>
            <option value="PASSED">Passed (Verified)</option>
            <option value="FAILED">Failed / Discrepancy</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Family Match:</span>
          <select
            value={familyFilter}
            onChange={e => setFamilyFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/30"
          >
            <option value="ALL">All Family Records</option>
            <option value="MATCHED">100% Matched</option>
            <option value="MISMATCH">Mismatch Flagged</option>
          </select>
        </div>
      </div>

      {/* Beneficiaries Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[12px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3.5 px-4">Beneficiary / ID</th>
                <th className="py-3.5 px-4">Ration Card & Category</th>
                <th className="py-3.5 px-4">Govt Verification</th>
                <th className="py-3.5 px-4">Family Matching</th>
                <th className="py-3.5 px-4">Documents</th>
                <th className="py-3.5 px-4">Current Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-500 font-medium">
                    No beneficiary records matching search criteria.
                  </td>
                </tr>
              ) : (
                filtered.map(b => (
                  <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-900">{b.name}</div>
                      <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                        <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-[11px] font-semibold text-slate-700">{b.id}</span>
                        <span>{b.phone}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="font-mono text-xs font-bold text-slate-800">{b.rationCardNumber}</div>
                      <span className={`inline-block mt-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                        b.rationCategory.includes('Yellow')
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}>
                        {b.rationCategory}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      {b.govtVerificationStatus === 'PASSED' ? (
                        <div className="flex items-center gap-1.5 text-emerald-700 font-semibold text-xs">
                          <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-xs">✓</span>
                          Govt Verified (98.4%)
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-red-600 font-semibold text-xs">
                          <span className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center text-xs">✕</span>
                          Failed Income Cap
                        </div>
                      )}
                      <div className="text-[11px] text-slate-500 mt-0.5">Tahsildar Income: ₹{b.annualIncome.toLocaleString('en-IN')}/yr</div>
                    </td>

                    <td className="py-4 px-4">
                      {b.familyMatchStatus === 'MATCHED' ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                          <span>👨‍👩‍👧‍👦</span> {b.familyMembersCount} Members Matched
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                          <span>⚠️</span> Member Discrepancy
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {b.documents.map((doc, idx) => (
                          <button
                            key={idx}
                            onClick={() => setSelectedDoc(doc)}
                            className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-2 py-1 rounded transition-colors"
                            title={`Click to preview: ${doc.name}`}
                          >
                            📄 {doc.name.split(' ')[0]}
                          </button>
                        ))}
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                        b.decisionStatus === 'APPROVED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : b.decisionStatus === 'REJECTED'
                          ? 'bg-rose-100 text-rose-800'
                          : b.decisionStatus === 'RESUBMISSION_REQUIRED'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {b.decisionStatus}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => onAdvanceToDecision(b)}
                        className="bg-slate-900 hover:bg-teal-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                      >
                        Review & Decide →
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Document Preview Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-2xl">📑</span>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{selectedDoc.name}</h3>
                  <p className="text-xs text-slate-500">Verified on {selectedDoc.verifiedAt}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDoc(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="my-6 bg-slate-50 rounded-xl p-5 border border-slate-200 text-center">
              <div className="w-14 h-14 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center text-2xl mx-auto mb-3">
                🏛️
              </div>
              <p className="text-sm font-bold text-slate-800">State Civil Supplies Digital Vault</p>
              <p className="text-xs text-slate-500 mt-1">Cryptographically stamped by National Informatics Centre (NIC) gateway</p>
              <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-xs text-emerald-800 font-medium text-left">
                ✓ Digital Signature: <span className="font-mono">SHA256: 4f88ba02...9c1</span><br />
                ✓ Status: <span className="font-bold">{selectedDoc.status}</span><br />
                ✓ Official Seal: Tahsildar Office Pune Division
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedDoc(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
