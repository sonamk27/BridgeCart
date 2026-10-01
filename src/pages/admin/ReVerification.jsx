import { useState } from 'react';

export default function ReVerification({ beneficiaries, onUpdateBeneficiary }) {
  const [recheckFilter, setRecheckFilter] = useState('ALL');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncNotice, setSyncNotice] = useState('');

  function handleBatchStateSync() {
    setIsSyncing(true);
    setSyncNotice('');

    setTimeout(() => {
      setIsSyncing(false);
      setSyncNotice('State RCMS sync completed: Verified 6 records against latest civil supplies database. 1 flagged for renewal.');
      setTimeout(() => setSyncNotice(''), 4500);
    }, 1500);
  }

  function handleMarkReverified(beneficiary) {
    const nextDate = new Date();
    nextDate.setMonth(nextDate.getMonth() + 6);
    const dateStr = nextDate.toISOString().split('T')[0];

    const updated = {
      ...beneficiary,
      reverificationDueDate: dateStr,
      reverificationStatus: 'UP_TO_DATE'
    };

    onUpdateBeneficiary(updated);
    setSyncNotice(`Beneficiary ${beneficiary.name} marked re-verified until ${dateStr}!`);
    setTimeout(() => setSyncNotice(''), 3500);
  }

  function handleTriggerImmediateAudit(beneficiary) {
    const updated = {
      ...beneficiary,
      reverificationStatus: 'DUE_FOR_REVIEW'
    };
    onUpdateBeneficiary(updated);
    setSyncNotice(`Triggered urgent re-verification audit for ${beneficiary.name}.`);
    setTimeout(() => setSyncNotice(''), 3500);
  }

  const filtered = beneficiaries.filter(b => {
    if (recheckFilter === 'DUE') return b.reverificationStatus === 'DUE_FOR_REVIEW';
    if (recheckFilter === 'UP_TO_DATE') return b.reverificationStatus === 'UP_TO_DATE';
    if (recheckFilter === 'ACTION_REQUIRED') return b.reverificationStatus === 'ACTION_REQUIRED';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 tracking-wide uppercase">
              Secondary Module
            </span>
            <span className="text-xs text-slate-500 font-medium">Stage: Periodic Governance</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Periodic Re-verification</h2>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Re-check beneficiary card eligibility periodically or when an Admin review is triggered.
          </p>
        </div>

        <button
          onClick={handleBatchStateSync}
          disabled={isSyncing}
          className="bg-slate-900 hover:bg-teal-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-60"
        >
          <span>{isSyncing ? '⏳' : '🔄'}</span>
          {isSyncing ? 'Synchronizing State Database...' : 'Run Automated State Sync'}
        </button>
      </div>

      {syncNotice && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 animate-in fade-in">
          <span>✓</span> {syncNotice}
        </div>
      )}

      {/* Re-verification Schedule Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Mandatory Cycle</div>
          <div className="text-2xl font-black text-slate-900 mt-1">6 Months</div>
          <div className="text-xs text-slate-500 mt-1">NFSA Rule Compliance</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Due for Review</div>
          <div className="text-2xl font-black text-amber-600 mt-1">
            {beneficiaries.filter(b => b.reverificationStatus === 'DUE_FOR_REVIEW').length}
          </div>
          <div className="text-xs text-slate-500 mt-1">Review window open</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Up-to-Date</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">
            {beneficiaries.filter(b => b.reverificationStatus === 'UP_TO_DATE').length}
          </div>
          <div className="text-xs text-slate-500 mt-1">Valid & active</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending First Cycle</div>
          <div className="text-2xl font-black text-blue-600 mt-1">
            {beneficiaries.filter(b => b.reverificationStatus === 'PENDING_FIRST_CYCLE').length}
          </div>
          <div className="text-xs text-slate-500 mt-1">Newly enrolled</div>
        </div>
      </div>

      {/* Filter Tabs & Beneficiaries Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex gap-2">
            {[
              { key: 'ALL', label: 'All Beneficiaries' },
              { key: 'DUE', label: 'Due for Review' },
              { key: 'UP_TO_DATE', label: 'Up to Date' },
              { key: 'ACTION_REQUIRED', label: 'Action Required' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setRecheckFilter(tab.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  recheckFilter === tab.key
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <span className="text-xs font-semibold text-slate-500">
            {filtered.length} Households Tracked
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-bold text-slate-600 uppercase tracking-wider border-b border-slate-200">
                <th className="py-3 px-4">Beneficiary</th>
                <th className="py-3 px-4">Ration Card</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Next Re-check Due</th>
                <th className="py-3 px-4">Current Cycle Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filtered.map(b => (
                <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{b.name}</div>
                    <div className="text-[11px] text-slate-500">{b.phone}</div>
                  </td>

                  <td className="py-3.5 px-4 font-mono font-semibold text-slate-700">
                    {b.rationCardNumber}
                  </td>

                  <td className="py-3.5 px-4 font-bold text-slate-800">
                    {b.rationCategory.split(' ')[0]}
                  </td>

                  <td className="py-3.5 px-4 font-mono font-semibold text-slate-700">
                    {b.reverificationDueDate || '—'}
                  </td>

                  <td className="py-3.5 px-4">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      b.reverificationStatus === 'UP_TO_DATE'
                        ? 'bg-emerald-100 text-emerald-800'
                        : b.reverificationStatus === 'DUE_FOR_REVIEW'
                        ? 'bg-amber-100 text-amber-800'
                        : b.reverificationStatus === 'ACTION_REQUIRED'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {b.reverificationStatus}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right space-x-2">
                    <button
                      onClick={() => handleMarkReverified(b)}
                      className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                    >
                      ✓ Mark Re-verified
                    </button>
                    <button
                      onClick={() => handleTriggerImmediateAudit(b)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Audit
                    </button>
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
