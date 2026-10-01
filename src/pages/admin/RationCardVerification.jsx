import { useState } from 'react';

export default function RationCardVerification({ beneficiaries, onUpdateBeneficiary }) {
  const [queryCard, setQueryCard] = useState('');
  const [lookupResult, setLookupResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [activeCategoryTab, setActiveCategoryTab] = useState('ALL');

  function handleLiveCardLookup(e) {
    e.preventDefault();
    if (!queryCard.trim()) return;

    setIsSearching(true);
    setLookupResult(null);

    setTimeout(() => {
      setIsSearching(false);
      const clean = queryCard.trim().toUpperCase();
      const existing = beneficiaries.find(b => b.rationCardNumber.toUpperCase() === clean);

      if (existing) {
        setLookupResult({
          found: true,
          cardNo: existing.rationCardNumber,
          holderName: existing.name,
          category: existing.rationCategory,
          fpsId: existing.fpsId,
          district: existing.district,
          state: existing.state,
          familyCount: existing.familyMembersCount,
          annualIncome: existing.annualIncome,
          isEligible: !existing.govtVerificationStatus.includes('FAILED'),
          entitlementGrainsKg: existing.rationCategory.includes('Yellow') ? 35 : 20,
          subsidizedGroceriesMaxMonthlyINR: existing.rationCategory.includes('Yellow') ? 1500 : 1200,
          rawBeneficiary: existing
        });
      } else {
        // Mock query from National Food Security portal
        const isYellow = clean.includes('YEL') || clean.includes('AAY') || clean.endsWith('8') || clean.endsWith('1');
        setLookupResult({
          found: true,
          isNewQuery: true,
          cardNo: clean,
          holderName: 'Registered NFSA Household Record',
          category: isYellow ? 'Yellow (Antyodaya / AAY)' : 'BPL (Priority Household / PHH)',
          fpsId: 'FPS-MAH-0192',
          district: 'Pune',
          state: 'Maharashtra',
          familyCount: 4,
          annualIncome: isYellow ? 36000 : 54000,
          isEligible: true,
          entitlementGrainsKg: isYellow ? 35 : 20,
          subsidizedGroceriesMaxMonthlyINR: isYellow ? 1500 : 1200
        });
      }
    }, 600);
  }

  const categoryFiltered = beneficiaries.filter(b => {
    if (activeCategoryTab === 'YELLOW') return b.rationCategory.includes('Yellow');
    if (activeCategoryTab === 'BPL') return b.rationCategory.includes('BPL');
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 tracking-wide uppercase">
              MVP Module
            </span>
            <span className="text-xs text-slate-500 font-medium">Stage: Eligibility Validation</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Ration Card Verification</h2>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Verify that the beneficiary belongs to the eligible Yellow / BPL / Antyodaya category through the defined verification process.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          RCMS Digital Gateway Online
        </div>
      </div>

      {/* Category Eligibility Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-amber-50 to-orange-50/40 border border-amber-200 rounded-2xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-extrabold uppercase px-2 py-0.5 rounded bg-amber-200 text-amber-900">
              🟡 Yellow Card (AAY)
            </span>
            <span className="text-xs font-bold text-amber-700">100% Eligible</span>
          </div>
          <h3 className="font-bold text-slate-900 text-base">Antyodaya Anna Yojana</h3>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            Reserved for the poorest households (&lt; ₹50,000/yr). BridgeCart wallet covers up to ₹1,500/mo essential groceries.
          </p>
          <div className="mt-3 text-xs font-bold text-amber-900">
            {beneficiaries.filter(b => b.rationCategory.includes('Yellow')).length} Cards Registered
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-teal-50/40 border border-emerald-200 rounded-2xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-200 text-emerald-900">
              🔴 BPL / Priority (PHH)
            </span>
            <span className="text-xs font-bold text-emerald-700">Validated Eligible</span>
          </div>
          <h3 className="font-bold text-slate-900 text-base">Below Poverty Line</h3>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            Identified by state NFSA criteria (&lt; ₹1,00,000/yr). BridgeCart wallet covers up to ₹1,200/mo essential nutrition.
          </p>
          <div className="mt-3 text-xs font-bold text-emerald-900">
            {beneficiaries.filter(b => b.rationCategory.includes('BPL')).length} Cards Registered
          </div>
        </div>

        <div className="bg-gradient-to-br from-rose-50 to-slate-50 border border-rose-200 rounded-2xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-extrabold uppercase px-2 py-0.5 rounded bg-rose-200 text-rose-900">
              ⚪ White / APL
            </span>
            <span className="text-xs font-bold text-rose-700">Ineligible Flag</span>
          </div>
          <h3 className="font-bold text-slate-900 text-base">Above Poverty Line</h3>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            Non-subsidized category. System automatically blocks allocation and records reason if submission is attempted.
          </p>
          <div className="mt-3 text-xs font-bold text-rose-900">
            Auto-screened at Gateway
          </div>
        </div>
      </div>

      {/* Live Card Lookup Tool */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
          <span>🔍</span> National Food Security & State RCMS Live Query
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Query state food & civil supplies database to validate card authenticity, Fair Price Shop allocation, and category status.
        </p>

        <form onSubmit={handleLiveCardLookup} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Enter Ration Card Number (e.g. MH-PUN-2024-8849)"
            value={queryCard}
            onChange={e => setQueryCard(e.target.value)}
            className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal-500/30"
          />
          <button
            type="submit"
            disabled={isSearching}
            className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl transition-colors disabled:opacity-60 cursor-pointer"
          >
            {isSearching ? 'Querying RCMS Gateway...' : 'Query Eligibility'}
          </button>
        </form>

        {lookupResult && (
          <div className="mt-5 p-5 bg-slate-50 rounded-xl border border-slate-200 animate-in fade-in">
            <div className="flex items-start justify-between">
              <div>
                <span className="inline-block px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 mb-2">
                  ✓ Database Match Confirmed
                </span>
                <h4 className="text-lg font-bold text-slate-900">{lookupResult.holderName}</h4>
                <p className="text-xs font-mono text-slate-600">Card: {lookupResult.cardNo} • FPS: {lookupResult.fpsId}</p>
              </div>

              <div className="text-right">
                <span className="text-xs font-semibold text-slate-500">Validation Status</span>
                <div className="text-sm font-bold text-emerald-600">
                  {lookupResult.isEligible ? 'ELIGIBLE (Yellow / BPL)' : 'FAILED CRITERIA'}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-200 text-xs">
              <div>
                <span className="text-slate-500">Category</span>
                <div className="font-bold text-slate-800">{lookupResult.category}</div>
              </div>
              <div>
                <span className="text-slate-500">State / District</span>
                <div className="font-bold text-slate-800">{lookupResult.district}, {lookupResult.state}</div>
              </div>
              <div>
                <span className="text-slate-500">Max Wallet Subsidized</span>
                <div className="font-bold text-teal-700">₹{lookupResult.subsidizedGroceriesMaxMonthlyINR} / month</div>
              </div>
              <div>
                <span className="text-slate-500">Registered Family Size</span>
                <div className="font-bold text-slate-800">{lookupResult.familyCount} Members</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Category Tabs & Filtered Cards Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex gap-2">
            {['ALL', 'YELLOW', 'BPL'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveCategoryTab(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  activeCategoryTab === tab
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab === 'ALL' ? 'All Cards' : tab === 'YELLOW' ? 'Yellow (AAY)' : 'BPL (PHH)'}
              </button>
            ))}
          </div>

          <span className="text-xs font-semibold text-slate-500">
            Showing {categoryFiltered.length} verified records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[12px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3 px-4">Cardholder Name</th>
                <th className="py-3 px-4">Ration Card No</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">FPS Fair Price Code</th>
                <th className="py-3 px-4">Annual Family Income</th>
                <th className="py-3 px-4">Eligibility Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {categoryFiltered.map(b => (
                <tr key={b.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">{b.name}</td>
                  <td className="py-3.5 px-4 font-mono text-xs font-semibold text-slate-700">{b.rationCardNumber}</td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      b.rationCategory.includes('Yellow')
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}>
                      {b.rationCategory}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-xs font-mono text-slate-600">{b.fpsId}</td>
                  <td className="py-3.5 px-4 text-xs font-bold text-slate-800">
                    ₹{b.annualIncome.toLocaleString('en-IN')}/yr
                    {b.annualIncome > 100000 && (
                      <span className="ml-1 text-[10px] text-rose-600 font-bold bg-rose-50 px-1 py-0.5 rounded">Exceeds Cap</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${
                      b.govtVerificationStatus === 'PASSED'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      {b.govtVerificationStatus === 'PASSED' ? '✓ Validated Eligible' : '✕ Ineligible Category'}
                    </span>
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
