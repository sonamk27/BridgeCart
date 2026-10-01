import { useState } from 'react';
import { useCustomer } from './CustomerContext';
import { useStoreData } from '../context/StoreDataContext';

export default function CommunityWalletModal({ onClose }) {
  const {
    beneficiary,
    submitBeneficiaryApplication,
    approveBeneficiary,
    rejectBeneficiary,
    auth
  } = useCustomer();
  const { products } = useStoreData();

  const [activeSubTab, setActiveSubTab] = useState('wallet'); // 'wallet' | 'apply' | 'essentials'

  // Application form state
  const [formData, setFormData] = useState({
    rationCardNumber: beneficiary.rationCardNumber || 'MH-PUN-2024-8849',
    category: beneficiary.category || 'Priority Household (PHH)',
    familyHead: beneficiary.familyHead || auth.user?.name || 'Priya Sharma',
    familyMembersCount: beneficiary.familyMembersCount || 4,
    annualIncome: 'Below ₹1,00,000',
    consent: true
  });

  const [submittedMessage, setSubmittedMessage] = useState(false);

  // List of store products that are eligible essentials
  const essentialProducts = products.filter(p => p.isEssential);

  function handleSubmitApplication(e) {
    e.preventDefault();
    if (!formData.rationCardNumber.trim()) return;
    submitBeneficiaryApplication(formData);
    setSubmittedMessage(true);
    setTimeout(() => {
      setSubmittedMessage(false);
      setActiveSubTab('wallet');
    }, 1500);
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-xl max-h-[92vh] overflow-hidden shadow-2xl border border-[var(--border)] animate-in fade-in zoom-in-95 duration-200 flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-[var(--teal-dark)] text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/15 border border-white/30 flex items-center justify-center text-2xl shadow-inner">
              🌾
            </div>
            <div>
              <h3 className="font-extrabold text-[17px] leading-tight">
                BridgeCart Community Wallet
              </h3>
              <p className="text-[12px] text-emerald-100">
                Essential grocery support for verified ration card families
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-sm"
          >
            ✕
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-[var(--border)] bg-gray-50 shrink-0 text-[13px] font-bold">
          <button
            onClick={() => setActiveSubTab('wallet')}
            className={`flex-1 py-3 border-b-2 transition-colors ${
              activeSubTab === 'wallet'
                ? 'border-emerald-600 text-emerald-800 bg-white'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            My Wallet & Status
          </button>
          <button
            onClick={() => setActiveSubTab('apply')}
            className={`flex-1 py-3 border-b-2 transition-colors ${
              activeSubTab === 'apply'
                ? 'border-emerald-600 text-emerald-800 bg-white'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            {beneficiary.status === 'APPROVED' ? 'Verification Details' : 'Apply for Verification'}
          </button>
          <button
            onClick={() => setActiveSubTab('essentials')}
            className={`flex-1 py-3 border-b-2 transition-colors ${
              activeSubTab === 'essentials'
                ? 'border-emerald-600 text-emerald-800 bg-white'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            Eligible Groceries ({essentialProducts.length})
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          
          {/* TAB 1: WALLET & STATUS */}
          {activeSubTab === 'wallet' && (
            <div className="space-y-4">
              
              {/* Status Banner */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl border bg-slate-50">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">
                    {beneficiary.status === 'APPROVED' ? '✅' : beneficiary.status === 'PENDING' ? '⏳' : 'ℹ️'}
                  </span>
                  <div>
                    <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                      Verification Status
                    </div>
                    <div className="font-extrabold text-[14px] text-gray-900">
                      {beneficiary.status === 'APPROVED' && 'Approved Beneficiary — Active'}
                      {beneficiary.status === 'PENDING' && 'Application Under Review'}
                      {beneficiary.status === 'REJECTED' && 'Verification Needs Resubmission'}
                      {beneficiary.status === 'UNAPPLIED' && 'Not Yet Registered for Wallet'}
                    </div>
                  </div>
                </div>

                {/* Quick test state toggles for reviewer */}
                <div className="flex gap-1.5">
                  {beneficiary.status !== 'APPROVED' ? (
                    <button
                      type="button"
                      onClick={() => approveBeneficiary()}
                      className="text-[11.5px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-xl shadow-xs transition-colors"
                    >
                      Instant Approve (Demo)
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => submitBeneficiaryApplication(formData)}
                      className="text-[11.5px] font-semibold text-slate-600 bg-white border border-slate-300 hover:bg-slate-100 px-3 py-1.5 rounded-xl transition-colors"
                    >
                      Reset to Pending
                    </button>
                  )}
                </div>
              </div>

              {/* Wallet Card if Approved */}
              {beneficiary.status === 'APPROVED' ? (
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-700 via-emerald-800 to-teal-950 text-white p-6 shadow-xl">
                  {/* Decorative grain backdrop */}
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10" />

                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <span className="text-[11px] font-bold tracking-widest text-emerald-200 uppercase">
                        BridgeCart Community Credit
                      </span>
                      <div className="text-[28px] font-black tracking-tight mt-1">
                        ₹{beneficiary.walletBalance}
                      </div>
                      <div className="text-[11.5px] text-emerald-200 mt-0.5">
                        Monthly entitlement: ₹{beneficiary.monthlyLimit} • Renews on 1st of month
                      </div>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-2xl">
                      🌾
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/15 flex justify-between items-center text-[12px]">
                    <div>
                      <span className="text-emerald-300 text-[10.5px] block font-medium">BENEFICIARY</span>
                      <span className="font-extrabold text-white">{beneficiary.familyHead}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-emerald-300 text-[10.5px] block font-medium">RATION CARD #</span>
                      <span className="font-mono font-bold text-white tracking-wider">
                        {beneficiary.rationCardNumber}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6 bg-amber-50/70 border border-amber-200 rounded-3xl text-center space-y-2">
                  <div className="text-3xl">📋</div>
                  <h4 className="font-extrabold text-[16px] text-amber-950">
                    Verify Your Ration Card to Activate ₹1,500 Grocery Grant
                  </h4>
                  <p className="text-[12.5px] text-amber-800 max-w-md mx-auto">
                    The Community Wallet covers 100% of essential pantry items like whole wheat atta, iodized salt, milk, and cooking oil at checkout.
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={() => setActiveSubTab('apply')}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[13px] px-5 py-2.5 rounded-xl shadow-sm transition-colors"
                    >
                      Fill Verification Details →
                    </button>
                  </div>
                </div>
              )}

              {/* How it Works / Split Payment Info */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                <h4 className="font-extrabold text-[13px] text-gray-900 mb-2 flex items-center gap-1.5">
                  <span>💡</span> How Community Wallet & Split Payment Works
                </h4>
                <ul className="text-[12px] text-gray-600 space-y-1.5">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">1.</span>
                    <span><strong>100% Covered for Essentials:</strong> Only products tagged as "Essential" (Flour, Salt, Milk, Dal, Soap) qualify for wallet redemption.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">2.</span>
                    <span><strong>Secure In-Store OTP:</strong> A security OTP is required at checkout before the wallet balance is debited.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">3.</span>
                    <span><strong>Automatic Split Payment:</strong> If your cart includes non-essential treats or exceeds your balance, the system pays essentials via wallet and remaining via UPI / Card / Cash.</span>
                  </li>
                </ul>
              </div>

            </div>
          )}

          {/* TAB 2: APPLY / DETAILS */}
          {activeSubTab === 'apply' && (
            <form onSubmit={handleSubmitApplication} className="space-y-3.5">
              {submittedMessage && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-[12px] font-semibold flex items-center gap-2">
                  <span>✓</span> Application submitted successfully! Verification pending.
                </div>
              )}

              <div>
                <label className="block text-[12px] font-semibold text-[var(--muted)] mb-1">
                  Ration Card Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. MH-PUN-2024-8849"
                  value={formData.rationCardNumber}
                  onChange={e => setFormData({ ...formData, rationCardNumber: e.target.value })}
                  className="w-full border border-[var(--border)] rounded-xl px-3.5 py-2.5 text-[13.5px] font-mono focus:outline-emerald-600 uppercase"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-semibold text-[var(--muted)] mb-1">
                    Card Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full border border-[var(--border)] rounded-xl px-3 py-2.5 text-[12.5px] focus:outline-emerald-600"
                  >
                    <option>Priority Household (PHH)</option>
                    <option>Antyodaya Anna Yojana (AAY)</option>
                    <option>Below Poverty Line (BPL)</option>
                    <option>State Food Security Scheme</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[12px] font-semibold text-[var(--muted)] mb-1">
                    Family Members
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={12}
                    value={formData.familyMembersCount}
                    onChange={e => setFormData({ ...formData, familyMembersCount: Number(e.target.value) })}
                    className="w-full border border-[var(--border)] rounded-xl px-3.5 py-2.5 text-[13.5px] focus:outline-emerald-600"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[var(--muted)] mb-1">
                  Family Head Name (as per ration card)
                </label>
                <input
                  type="text"
                  value={formData.familyHead}
                  onChange={e => setFormData({ ...formData, familyHead: e.target.value })}
                  className="w-full border border-[var(--border)] rounded-xl px-3.5 py-2.5 text-[13.5px] focus:outline-emerald-600"
                  required
                />
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[12px] text-gray-600">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.consent}
                    onChange={e => setFormData({ ...formData, consent: e.target.checked })}
                    className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                    required
                  />
                  <span>
                    I confirm that the ration card details provided are true and accurate. I consent to verification under the BridgeCart Community Support guidelines.
                  </span>
                </label>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[13.5px] py-3 rounded-xl shadow-md transition-colors"
                >
                  Submit Application for Verification
                </button>
                <button
                  type="button"
                  onClick={() => approveBeneficiary(formData)}
                  className="px-4 bg-emerald-100 text-emerald-900 hover:bg-emerald-200 font-bold text-[12px] rounded-xl transition-colors"
                >
                  Fast-Track Demo Approve
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: ESSENTIAL PRODUCTS LIST */}
          {activeSubTab === 'essentials' && (
            <div className="space-y-3">
              <div className="text-[12px] text-gray-600">
                The following products in <strong>Lokmanya Super Market</strong> are recognized as essential food & hygiene staples eligible for 100% wallet coverage:
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {essentialProducts.map(p => (
                  <div
                    key={p.id}
                    className="p-3 bg-emerald-50/50 border border-emerald-200/80 rounded-2xl flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-2xl">{p.image || '🌾'}</span>
                      <div className="min-w-0">
                        <div className="font-bold text-[13px] text-gray-900 truncate">{p.name}</div>
                        <div className="text-[11px] text-[var(--muted)]">
                          {p.aisleId ? p.aisleId.replace('row-', 'Row ') : 'Row'} · Shelf {p.shelfLevel || 'A'}
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-extrabold text-[13.5px] text-emerald-800">₹{p.price}</div>
                      <span className="text-[9.5px] font-bold bg-emerald-200/80 text-emerald-900 px-1.5 py-0.5 rounded-md">
                        100% Covered
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
