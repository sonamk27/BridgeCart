import { useState } from 'react';

export default function FamilyVerification({ beneficiaries, onUpdateBeneficiary }) {
  const [selectedBeneficiaryId, setSelectedBeneficiaryId] = useState(beneficiaries[0]?.id || '');
  const [successNote, setSuccessNote] = useState('');

  const currentBeneficiary = beneficiaries.find(b => b.id === selectedBeneficiaryId) || beneficiaries[0];

  function toggleRedeemer(memberId) {
    if (!currentBeneficiary) return;
    const updatedMembers = currentBeneficiary.familyMembers.map(m =>
      m.id === memberId ? { ...m, isRedeemer: !m.isRedeemer } : m
    );
    const updatedBeneficiary = {
      ...currentBeneficiary,
      familyMembers: updatedMembers
    };
    onUpdateBeneficiary(updatedBeneficiary);
    setSuccessNote('Updated authorized redeeming members successfully.');
    setTimeout(() => setSuccessNote(''), 2500);
  }

  function handleConfirmFamilyMatch() {
    if (!currentBeneficiary) return;
    const updated = {
      ...currentBeneficiary,
      familyMatchStatus: 'MATCHED'
    };
    onUpdateBeneficiary(updated);
    setSuccessNote(`Family match verified for ${currentBeneficiary.name}!`);
    setTimeout(() => setSuccessNote(''), 3000);
  }

  function handleFlagDiscrepancy() {
    if (!currentBeneficiary) return;
    const updated = {
      ...currentBeneficiary,
      familyMatchStatus: 'MISMATCH_DETECTED',
      decisionStatus: 'RESUBMISSION_REQUIRED',
      decisionReason: 'Family record mismatch detected during admin review. Additional proof required.'
    };
    onUpdateBeneficiary(updated);
    setSuccessNote(`Flagged discrepancy for ${currentBeneficiary.name} and mandated resubmission.`);
    setTimeout(() => setSuccessNote(''), 3000);
  }

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800 tracking-wide uppercase">
              MVP Module
            </span>
            <span className="text-xs text-slate-500 font-medium">Stage: Family Match Review</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Family Verification</h2>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Review the family matching result and ensure the Head of Family and redeeming members match the verified family record.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Select Household:</span>
          <select
            value={selectedBeneficiaryId}
            onChange={e => setSelectedBeneficiaryId(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
          >
            {beneficiaries.map(b => (
              <option key={b.id} value={b.id}>
                {b.name} ({b.familyMembersCount} members) - {b.familyMatchStatus}
              </option>
            ))}
          </select>
        </div>
      </div>

      {successNote && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 animate-in fade-in">
          <span>✓</span> {successNote}
        </div>
      )}

      {currentBeneficiary && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Head of Family & Matching Overview Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-base">Head of Family (HoF)</h3>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                currentBeneficiary.familyMatchStatus === 'MATCHED'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-rose-100 text-rose-800'
              }`}>
                {currentBeneficiary.familyMatchStatus}
              </span>
            </div>

            <div className="space-y-3 text-sm">
              <div>
                <span className="text-xs text-slate-500">HoF Full Name</span>
                <div className="font-bold text-slate-900 text-base">{currentBeneficiary.familyHead}</div>
              </div>

              <div>
                <span className="text-xs text-slate-500">Ration Card Linkage</span>
                <div className="font-mono text-xs font-bold text-slate-700">{currentBeneficiary.rationCardNumber}</div>
              </div>

              <div>
                <span className="text-xs text-slate-500">Aadhaar Last 4 / Biometric Link</span>
                <div className="font-mono text-xs font-bold text-emerald-700 flex items-center gap-1 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  XXXX-XXXX-{currentBeneficiary.aadhaarLast4} (Biometric Verified)
                </div>
              </div>

              <div>
                <span className="text-xs text-slate-500">Tahsildar Income Certificate</span>
                <div className="font-mono text-xs font-bold text-slate-700">{currentBeneficiary.incomeCertNo}</div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-2">
              <div className="text-xs font-bold text-slate-600 uppercase tracking-wider">Family Match Rules</div>
              <div className="bg-slate-50 p-3 rounded-xl space-y-2 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>HoF matches State Civil Supplies Record</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={currentBeneficiary.familyMatchStatus === 'MATCHED' ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'}>
                    {currentBeneficiary.familyMatchStatus === 'MATCHED' ? '✓' : '✕'}
                  </span>
                  <span>Zero cross-card dependent duplication</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Redeeming members minimum age &gt;= 18</span>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={handleConfirmFamilyMatch}
                className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Confirm Family Match ✓
              </button>
              <button
                onClick={handleFlagDiscrepancy}
                className="w-full py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Flag Discrepancy ⚠️
              </button>
            </div>
          </div>

          {/* Members Table & Redeemer Management */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">Verified Family Roster & Authorized Redeemers</h3>
                <p className="text-xs text-slate-500">
                  Only authorized redeemers can collect subsidized food essentials at supermarket checkout counters.
                </p>
              </div>

              <span className="text-xs font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded-full">
                {currentBeneficiary.familyMembers.length} Members Listed
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-[11px] font-bold text-slate-600 uppercase tracking-wider border-b border-slate-200">
                    <th className="py-2.5 px-3">Member Name</th>
                    <th className="py-2.5 px-3">Relation</th>
                    <th className="py-2.5 px-3">Age / Gender</th>
                    <th className="py-2.5 px-3">Aadhaar Linked</th>
                    <th className="py-2.5 px-3 text-center">Authorized Redeemer</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {currentBeneficiary.familyMembers.map(member => (
                    <tr key={member.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900">{member.name}</div>
                        {member.relation === 'Head of Family' && (
                          <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded">Primary HoF</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-slate-600 font-medium">{member.relation}</td>
                      <td className="py-3 px-3 text-slate-600">{member.age} yrs • {member.gender}</td>
                      <td className="py-3 px-3">
                        {member.aadhaarLinked ? (
                          <span className="text-emerald-700 font-bold text-[11px] flex items-center gap-1">
                            <span>✓</span> Linked
                          </span>
                        ) : (
                          <span className="text-rose-600 font-bold text-[11px]">Pending</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => toggleRedeemer(member.id)}
                          disabled={member.age < 18}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                            member.age < 18
                              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                              : member.isRedeemer
                              ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                          title={member.age < 18 ? 'Minors cannot be designated redeemers' : 'Toggle counter redemption privilege'}
                        >
                          {member.age < 18 ? 'Minor (Ineligible)' : member.isRedeemer ? '✓ Authorized' : '+ Authorize'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-900 flex items-start gap-2.5">
              <span className="text-base shrink-0">🛡️</span>
              <div>
                <span className="font-bold">Family Verification Guardrail:</span> When an authorized redeemer arrives at the store checkout, BridgeCart prompts for OTP sent to the registered Head of Family mobile number (+91 {currentBeneficiary.phone.slice(-10)}).
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
