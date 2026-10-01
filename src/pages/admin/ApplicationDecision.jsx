import { useState } from 'react';

export default function ApplicationDecision({ beneficiaries, onUpdateBeneficiary }) {
  const [selectedAppId, setSelectedAppId] = useState(
    beneficiaries.find(b => b.decisionStatus === 'PENDING')?.id || beneficiaries[0]?.id || ''
  );

  const [decisionType, setDecisionType] = useState('APPROVE'); // 'APPROVE' | 'REJECT' | 'RESUBMISSION'
  const [allowanceAmount, setAllowanceAmount] = useState(1500);
  const [rejectionReason, setRejectionReason] = useState('Income exceeds maximum BPL eligibility criteria');
  const [resubmissionDocs, setResubmissionDocs] = useState(['Clear scan of Ration Card (Both sides)']);
  const [customNotes, setCustomNotes] = useState('');
  const [decisionSuccess, setDecisionSuccess] = useState('');

  const currentApp = beneficiaries.find(b => b.id === selectedAppId) || beneficiaries[0];

  function handleSubmitDecision(e) {
    e.preventDefault();
    if (!currentApp) return;

    let updated;
    const timestamp = new Date().toLocaleString();

    if (decisionType === 'APPROVE') {
      updated = {
        ...currentApp,
        decisionStatus: 'APPROVED',
        decisionReason: customNotes || 'All government records and family biometrics validated successfully.',
        monthlyAllowance: Number(allowanceAmount),
        walletBalance: Number(allowanceAmount),
        decidedBy: 'Super Admin (Govt. Liaison)',
        decidedAt: timestamp,
        reverificationDueDate: '2027-03-01',
        reverificationStatus: 'UP_TO_DATE'
      };
      setDecisionSuccess(`Application for ${currentApp.name} APPROVED! Wallet activated with ₹${allowanceAmount}/mo.`);
    } else if (decisionType === 'REJECT') {
      if (!rejectionReason.trim()) return;
      updated = {
        ...currentApp,
        decisionStatus: 'REJECTED',
        decisionReason: `${rejectionReason}. ${customNotes ? 'Notes: ' + customNotes : ''}`,
        monthlyAllowance: 0,
        walletBalance: 0,
        decidedBy: 'Super Admin (Govt. Liaison)',
        decidedAt: timestamp,
        reverificationStatus: 'INELIGIBLE'
      };
      setDecisionSuccess(`Application for ${currentApp.name} REJECTED. Audit reason recorded.`);
    } else {
      updated = {
        ...currentApp,
        decisionStatus: 'RESUBMISSION_REQUIRED',
        decisionReason: `Resubmission required: ${resubmissionDocs.join(', ')}. ${customNotes}`,
        decidedBy: 'Super Admin (Govt. Liaison)',
        decidedAt: timestamp,
        reverificationStatus: 'ACTION_REQUIRED'
      };
      setDecisionSuccess(`Resubmission request sent to ${currentApp.name}.`);
    }

    onUpdateBeneficiary(updated);
    setTimeout(() => setDecisionSuccess(''), 4000);
  }

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 tracking-wide uppercase">
              MVP Module
            </span>
            <span className="text-xs text-slate-500 font-medium">Stage: Final Adjudication</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Application Decision</h2>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Take the verification decision and record the reason when an application is rejected or requires resubmission.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Active Queue:</span>
          <select
            value={selectedAppId}
            onChange={e => {
              setSelectedAppId(e.target.value);
              const app = beneficiaries.find(b => b.id === e.target.value);
              if (app) {
                setAllowanceAmount(app.monthlyAllowance || 1500);
              }
            }}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
          >
            {beneficiaries.map(b => (
              <option key={b.id} value={b.id}>
                {b.name} [{b.decisionStatus}] - {b.rationCategory.split(' ')[0]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {decisionSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 animate-in fade-in">
          <span>✓</span> {decisionSuccess}
        </div>
      )}

      {currentApp && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Applicant Dossier (Left Column) */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-mono font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                  {currentApp.id}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">{currentApp.name}</h3>
                <p className="text-xs text-slate-500">{currentApp.phone}</p>
              </div>

              <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold ${
                currentApp.decisionStatus === 'APPROVED'
                  ? 'bg-emerald-100 text-emerald-800'
                  : currentApp.decisionStatus === 'REJECTED'
                  ? 'bg-rose-100 text-rose-800'
                  : currentApp.decisionStatus === 'RESUBMISSION_REQUIRED'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {currentApp.decisionStatus}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500">Ration Card No</span>
                <span className="font-mono font-bold text-slate-800">{currentApp.rationCardNumber}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500">Category</span>
                <span className="font-bold text-slate-800">{currentApp.rationCategory}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500">Annual Income Reported</span>
                <span className="font-bold text-slate-800">₹{currentApp.annualIncome.toLocaleString('en-IN')}/yr</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500">Govt DB Verification</span>
                <span className={`font-bold ${currentApp.govtVerificationStatus === 'PASSED' ? 'text-emerald-700' : 'text-rose-600'}`}>
                  {currentApp.govtVerificationStatus}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500">Family Match Status</span>
                <span className={`font-bold ${currentApp.familyMatchStatus === 'MATCHED' ? 'text-teal-700' : 'text-rose-600'}`}>
                  {currentApp.familyMatchStatus}
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Fair Price Shop (FPS)</span>
                <span className="font-mono font-bold text-slate-700">{currentApp.fpsId}</span>
              </div>
            </div>

            {currentApp.decidedBy && (
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs">
                <div className="font-bold text-slate-700 mb-1">Last Recorded Decision:</div>
                <div className="text-slate-600">{currentApp.decisionReason}</div>
                <div className="text-[11px] text-slate-400 mt-2">
                  By {currentApp.decidedBy} • {currentApp.decidedAt}
                </div>
              </div>
            )}
          </div>

          {/* Decision Form Desk (Right Column) */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <span>⚖️</span> Take Adjudication Decision
            </h3>

            {/* 3 Decision Tabs */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setDecisionType('APPROVE')}
                className={`py-3 px-3 rounded-xl text-xs font-extrabold border-2 transition-all cursor-pointer text-center ${
                  decisionType === 'APPROVE'
                    ? 'border-emerald-600 bg-emerald-50/80 text-emerald-900 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600'
                }`}
              >
                <div className="text-base mb-0.5">✅</div>
                APPROVE
              </button>

              <button
                type="button"
                onClick={() => setDecisionType('RESUBMISSION')}
                className={`py-3 px-3 rounded-xl text-xs font-extrabold border-2 transition-all cursor-pointer text-center ${
                  decisionType === 'RESUBMISSION'
                    ? 'border-amber-600 bg-amber-50/80 text-amber-900 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600'
                }`}
              >
                <div className="text-base mb-0.5">🔁</div>
                RESUBMISSION
              </button>

              <button
                type="button"
                onClick={() => setDecisionType('REJECT')}
                className={`py-3 px-3 rounded-xl text-xs font-extrabold border-2 transition-all cursor-pointer text-center ${
                  decisionType === 'REJECT'
                    ? 'border-rose-600 bg-rose-50/80 text-rose-900 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600'
                }`}
              >
                <div className="text-base mb-0.5">❌</div>
                REJECT
              </button>
            </div>

            <form onSubmit={handleSubmitDecision} className="space-y-4 pt-2">
              {decisionType === 'APPROVE' && (
                <div className="space-y-3 animate-in fade-in">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Monthly Community Wallet Allowance (₹ INR)
                    </label>
                    <select
                      value={allowanceAmount}
                      onChange={e => setAllowanceAmount(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                    >
                      <option value={1500}>₹1,500 / month (Standard Antyodaya / Yellow Card Allocation)</option>
                      <option value={1200}>₹1,200 / month (Standard BPL / PHH Allocation)</option>
                      <option value={1800}>₹1,800 / month (Extended Large Family &gt;= 5 members)</option>
                      <option value={1000}>₹1,000 / month (Single Member Household)</option>
                    </select>
                  </div>

                  <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-900">
                    <span className="font-bold">Notice:</span> Approving this application will immediately credit the beneficiary's Community Wallet quota from the escrow pool and activate verified checkout at partner stores.
                  </div>
                </div>
              )}

              {decisionType === 'REJECT' && (
                <div className="space-y-3 animate-in fade-in">
                  <div>
                    <label className="block text-xs font-bold text-rose-800 mb-1">
                      Mandatory Audit Rejection Reason *
                    </label>
                    <select
                      value={rejectionReason}
                      onChange={e => setRejectionReason(e.target.value)}
                      className="w-full bg-rose-50/50 border border-rose-200 rounded-xl px-3 py-2 text-sm font-semibold text-rose-950 focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                      required
                    >
                      <option value="Income exceeds maximum BPL eligibility criteria (> ₹1,00,000)">
                        Income exceeds maximum BPL eligibility criteria (&gt; ₹1,00,000)
                      </option>
                      <option value="Non-eligible category: Card classified as White / APL in NFSA registry">
                        Non-eligible category: Card classified as White / APL in NFSA registry
                      </option>
                      <option value="Forged or tampered income certificate reported by Revenue Authority">
                        Forged or tampered income certificate reported by Revenue Authority
                      </option>
                      <option value="Duplicate primary beneficiary already claiming benefits in another district">
                        Duplicate primary beneficiary already claiming benefits in another district
                      </option>
                      <option value="Applicant does not reside within supermarket service jurisdiction">
                        Applicant does not reside within supermarket service jurisdiction
                      </option>
                    </select>
                  </div>

                  <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-xs text-rose-900">
                    <span className="font-bold">Permanent Audit Record:</span> This rejection reason will be permanently written to the government audit log and sent via SMS to the applicant.
                  </div>
                </div>
              )}

              {decisionType === 'RESUBMISSION' && (
                <div className="space-y-3 animate-in fade-in">
                  <div>
                    <label className="block text-xs font-bold text-amber-800 mb-1">
                      Required Documents / Specific Corrections
                    </label>
                    <div className="space-y-2 text-xs">
                      {[
                        'Clear scan of Ration Card (Both sides showing family members)',
                        'Updated Tahsildar Income Certificate (Issued within last 12 months)',
                        'Aadhaar Biometric Linkage confirmation for dependents',
                        'Address proof corresponding to Fair Price Shop jurisdiction'
                      ].map((item, idx) => (
                        <label key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-amber-50/60 border border-amber-200 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={resubmissionDocs.includes(item)}
                            onChange={e => {
                              if (e.target.checked) {
                                setResubmissionDocs([...resubmissionDocs, item]);
                              } else {
                                setResubmissionDocs(resubmissionDocs.filter(d => d !== item));
                              }
                            }}
                            className="rounded text-amber-600 focus:ring-amber-500"
                          />
                          <span className="text-amber-950 font-medium">{item}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Additional Adjudication Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={customNotes}
                  onChange={e => setCustomNotes(e.target.value)}
                  placeholder="Enter any administrative review notes or instructions..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className={`w-full py-3 rounded-xl text-xs font-extrabold text-white transition-colors cursor-pointer shadow-sm ${
                    decisionType === 'APPROVE'
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : decisionType === 'REJECT'
                      ? 'bg-rose-600 hover:bg-rose-700'
                      : 'bg-amber-600 hover:bg-amber-700'
                  }`}
                >
                  Commit {decisionType} Decision →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
