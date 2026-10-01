import { useState } from 'react';
import { useCustomer } from './CustomerContext';

export default function CheckoutModal({ onClose, onPaymentSuccess }) {
  const {
    cart,
    cartSubtotal,
    cartItemCount,
    cartEssentialSubtotal,
    cartNonEssentialSubtotal,
    beneficiary,
    walletCoverage,
    donationAmount,
    setDonationAmount,
    handleCompleteCheckout,
    session,
    auth
  } = useCustomer();

  const [useWallet, setUseWallet] = useState(beneficiary.status === 'APPROVED' && walletCoverage > 0);
  const [walletOtp, setWalletOtp] = useState('');
  const [walletOtpVerified, setWalletOtpVerified] = useState(false);
  const [walletOtpError, setWalletOtpError] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('UPI'); // 'UPI' | 'CARD' | 'COUNTER' | 'NETBANKING'
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState('review'); // 'review' | 'paying' | 'success'

  // Calculations
  const walletDeduction = useWallet ? walletCoverage : 0;
  const selfPayItemsAmount = Math.max(0, cartSubtotal - walletDeduction);
  const finalSelfPayTotal = selfPayItemsAmount + donationAmount;

  function handleVerifyWalletOtp(e) {
    e.preventDefault();
    if (walletOtp.trim() === '8849' || walletOtp.trim().length === 4) {
      setWalletOtpVerified(true);
      setWalletOtpError('');
    } else {
      setWalletOtpError('Invalid OTP. Use demo code 8849.');
    }
  }

  function handleProceedPayment() {
    if (useWallet && !walletOtpVerified) {
      setWalletOtpError('Please verify the Wallet Security OTP before proceeding.');
      return;
    }

    setIsProcessing(true);
    setPaymentStep('paying');

    setTimeout(() => {
      setIsProcessing(false);
      const receipt = handleCompleteCheckout({
        paymentMethod: useWallet
          ? (finalSelfPayTotal > 0 ? `Community Wallet + ${selectedPaymentMethod}` : 'Community Wallet')
          : selectedPaymentMethod,
        useWallet,
        donation: donationAmount,
        walletDeduction,
        selfPayAmount: finalSelfPayTotal
      });
      onPaymentSuccess(receipt);
    }, 1800);
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg max-h-[92vh] overflow-hidden shadow-2xl border border-[var(--border)] animate-in fade-in zoom-in-95 duration-200 flex flex-col">
        
        {/* Header */}
        <div className="bg-[var(--navy-deep)] text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[var(--teal)]/20 border border-[var(--teal)]/40 flex items-center justify-center text-xl">
              💳
            </div>
            <div>
              <h3 className="font-extrabold text-[16.5px] leading-tight">Checkout & Payment</h3>
              <p className="text-[12px] text-teal-200">{session.store?.name} • In-Store Pay</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm disabled:opacity-30"
          >
            ✕
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          
          {paymentStep === 'paying' ? (
            /* Processing Screen */
            <div className="py-12 text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-teal-50 border-4 border-teal-200 border-t-[var(--teal)] animate-spin mx-auto" />
              <h4 className="font-extrabold text-[18px] text-[var(--navy-deep)]">
                Securing Payment & Generating Digital Receipt…
              </h4>
              <p className="text-[13px] text-[var(--muted)] max-w-sm mx-auto">
                Processing {selectedPaymentMethod} transaction and synchronizing with Lokmanya Super Market billing counter.
              </p>
            </div>
          ) : (
            <>
              {/* 1. Item-wise order summary */}
              <div>
                <div className="flex items-center justify-between text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                  <span>Order Items ({cartItemCount})</span>
                  <span>Price</span>
                </div>
                <div className="divide-y divide-[var(--border)] border border-[var(--border)] rounded-2xl p-3 bg-gray-50/50 max-h-40 overflow-y-auto text-[13px]">
                  {cart.map(({ product, quantity }) => (
                    <div key={product.id} className="py-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span>{product.image || '📦'}</span>
                        <span className="font-semibold text-gray-800">{product.name}</span>
                        <span className="text-gray-400 text-xs">× {quantity}</span>
                        {product.isEssential && (
                          <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                            Essential
                          </span>
                        )}
                      </div>
                      <span className="font-bold text-gray-900">
                        ₹{product.price * quantity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. Community Wallet Split Section */}
              {beneficiary.status === 'APPROVED' && cartEssentialSubtotal > 0 && (
                <div className="p-4 bg-emerald-50/80 border-2 border-emerald-300/80 rounded-2xl space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={useWallet}
                        onChange={e => setUseWallet(e.target.checked)}
                        className="mt-1 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                      />
                      <div>
                        <div className="font-extrabold text-[14px] text-emerald-950 flex items-center gap-1.5">
                          <span>🌾</span> Apply Community Wallet Credit
                        </div>
                        <div className="text-[11.5px] text-emerald-800 mt-0.5">
                          Available balance: <strong>₹{beneficiary.walletBalance}</strong> • Covers ₹{walletCoverage} essential groceries
                        </div>
                      </div>
                    </label>

                    <span className="font-extrabold text-[15px] text-emerald-800">
                      − ₹{walletCoverage}
                    </span>
                  </div>

                  {/* OTP security verification for Community Wallet */}
                  {useWallet && (
                    <div className="pt-2 border-t border-emerald-200">
                      {walletOtpVerified ? (
                        <div className="flex items-center gap-2 text-emerald-800 font-bold text-[12px] bg-emerald-100/70 p-2.5 rounded-xl">
                          <span>✅</span> Beneficiary Security OTP Verified (Card: {beneficiary.rationCardNumber})
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-[11.5px] text-emerald-900 font-semibold">
                            <span>Beneficiary OTP Authorization:</span>
                            <button
                              type="button"
                              onClick={() => setWalletOtp('8849')}
                              className="text-emerald-700 underline font-bold"
                            >
                              Auto-fill (8849)
                            </button>
                          </div>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              maxLength={4}
                              placeholder="4-digit OTP (8849)"
                              value={walletOtp}
                              onChange={e => setWalletOtp(e.target.value.replace(/\D/g, ''))}
                              className="flex-1 bg-white border border-emerald-300 rounded-xl px-3 py-1.5 text-center font-bold tracking-widest text-[14px] focus:outline-emerald-600"
                            />
                            <button
                              type="button"
                              onClick={handleVerifyWalletOtp}
                              className="bg-emerald-700 hover:bg-emerald-800 text-white text-[12px] font-bold px-4 py-1.5 rounded-xl transition-colors"
                            >
                              Authorize Wallet
                            </button>
                          </div>
                          {walletOtpError && (
                            <div className="text-[11px] text-rose-600 font-semibold">
                              {walletOtpError}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* 3. Section 9: Voluntary Community Donation */}
              <div className="p-3.5 bg-indigo-50/50 border border-indigo-200 rounded-2xl flex items-center justify-between">
                <div>
                  <div className="font-bold text-[13px] text-indigo-950 flex items-center gap-1.5">
                    <span>❤️</span> Voluntary Community Donation
                  </div>
                  <div className="text-[11px] text-indigo-700">
                    Supports local low-income families' grocery wallet
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {[0, 10, 25, 50].map(amt => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setDonationAmount(amt)}
                      className={`px-2.5 py-1 rounded-lg text-[11.5px] font-bold border transition-colors ${
                        donationAmount === amt
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-white text-indigo-900 border-indigo-200 hover:bg-indigo-100'
                      }`}
                    >
                      {amt === 0 ? 'None' : `₹${amt}`}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Self-Payment Method Selector */}
              {finalSelfPayTotal > 0 ? (
                <div>
                  <div className="text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-2.5">
                    Select Payment Method for Remaining ₹{finalSelfPayTotal}
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    {[
                      { id: 'UPI', label: 'UPI (GPay, PhonePe, Paytm)', icon: '📱', desc: 'Instant QR Code Scan' },
                      { id: 'CARD', label: 'Credit / Debit Card', icon: '💳', desc: 'Visa, Mastercard, RuPay' },
                      { id: 'COUNTER', label: 'Cash at Counter #1', icon: '🏪', desc: 'Pay Cashier upon Exit' },
                      { id: 'NETBANKING', label: 'Net Banking', icon: '🏦', desc: 'All Major Indian Banks' }
                    ].map(pm => (
                      <button
                        key={pm.id}
                        type="button"
                        onClick={() => setSelectedPaymentMethod(pm.id)}
                        className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                          selectedPaymentMethod === pm.id
                            ? 'border-[var(--teal)] bg-teal-50/50 shadow-xs'
                            : 'border-[var(--border)] bg-white hover:border-gray-300'
                        }`}
                      >
                        <div className="text-xl mb-1">{pm.icon}</div>
                        <div className="font-bold text-[12.5px] text-gray-900 leading-tight">
                          {pm.label}
                        </div>
                        <div className="text-[10.5px] text-[var(--muted)] mt-0.5">
                          {pm.desc}
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Simulated UPI QR Code preview if UPI selected */}
                  {selectedPaymentMethod === 'UPI' && (
                    <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-3">
                      <div className="w-14 h-14 bg-white border border-slate-300 rounded-xl flex items-center justify-center text-2xl shadow-2xs">
                        🏁
                      </div>
                      <div className="text-[12px]">
                        <div className="font-bold text-gray-800">BridgeCart UPI Dynamic QR</div>
                        <div className="text-[11px] text-[var(--muted)]">
                          UPI ID: <strong>bridgecart.lokmanya@icici</strong>
                        </div>
                        <div className="text-[11px] text-emerald-700 font-bold mt-0.5">
                          Auto-verified upon button tap
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 bg-emerald-100/60 border border-emerald-300 rounded-2xl text-center">
                  <span className="text-2xl">🎉</span>
                  <div className="font-extrabold text-[14px] text-emerald-950 mt-1">
                    100% Fully Covered by Community Wallet
                  </div>
                  <p className="text-[12px] text-emerald-800">
                    No self-pay required. Tap below to complete order and generate digital receipt.
                  </p>
                </div>
              )}

              {/* 5. Cost Breakdown Summary */}
              <div className="p-4 bg-slate-100/70 rounded-2xl space-y-1.5 text-[12.5px]">
                <div className="flex justify-between text-gray-600">
                  <span>Cart Gross Total:</span>
                  <span>₹{cartSubtotal}</span>
                </div>

                {useWallet && walletDeduction > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Community Wallet Deduction:</span>
                    <span>− ₹{walletDeduction}</span>
                  </div>
                )}

                {donationAmount > 0 && (
                  <div className="flex justify-between text-indigo-700 font-semibold">
                    <span>Voluntary Community Donation:</span>
                    <span>+ ₹{donationAmount}</span>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-300 flex justify-between text-[15px] font-extrabold text-[var(--navy-deep)]">
                  <span>Net Amount to Pay:</span>
                  <span>₹{finalSelfPayTotal}</span>
                </div>
              </div>
            </>
          )}

        </div>

        {/* Footer CTA */}
        {paymentStep !== 'paying' && (
          <div className="p-4 bg-white border-t border-[var(--border)] shrink-0 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-3 border border-gray-300 text-gray-700 font-bold text-[13px] rounded-xl hover:bg-gray-50 transition-colors"
            >
              Back to Cart
            </button>

            <button
              type="button"
              onClick={handleProceedPayment}
              disabled={useWallet && !walletOtpVerified}
              className="flex-1 bg-[var(--teal)] hover:bg-[var(--teal-dark)] text-white font-extrabold text-[14px] py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Confirm & Pay ₹{finalSelfPayTotal}</span>
              <span>→</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
