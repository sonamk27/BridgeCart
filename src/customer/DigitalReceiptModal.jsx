export default function DigitalReceiptModal({ receipt, onClose, onOpenHistory }) {
  if (!receipt) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md max-h-[92vh] overflow-hidden shadow-2xl border border-[var(--border)] animate-in fade-in zoom-in-95 duration-200 flex flex-col">
        
        {/* Receipt Header Badge */}
        <div className="bg-emerald-600 text-white p-4 text-center shrink-0">
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl mx-auto mb-1.5 shadow-inner">
            ✓
          </div>
          <h3 className="font-extrabold text-[17px]">Payment Successful!</h3>
          <p className="text-[12px] text-emerald-100">Digital Tax Invoice & Store Exit Pass</p>
        </div>

        {/* Paper Receipt Simulation */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4 font-sans text-gray-800">
            
            {/* Store & Order Details */}
            <div className="text-center pb-3 border-b border-dashed border-slate-300">
              <div className="text-2xl mb-1">🛒</div>
              <h4 className="font-black text-[16px] text-[var(--navy-deep)] uppercase tracking-wide">
                {receipt.store?.name || 'Lokmanya Super Market'}
              </h4>
              <div className="text-[11.5px] text-slate-500 mt-0.5">
                {receipt.store?.branch || 'Kothrud, Pune - Store #101'}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                GSTIN: 27AABCL9012K1ZZ • Ph: +91 20 2544 9100
              </div>
            </div>

            {/* Receipt Meta */}
            <div className="flex justify-between text-[11.5px] text-slate-600 pb-2 border-b border-dashed border-slate-300">
              <div>
                <span className="block font-semibold">INVOICE:</span>
                <span className="font-mono font-bold text-gray-900">{receipt.id}</span>
              </div>
              <div className="text-right">
                <span className="block font-semibold">DATE & TIME:</span>
                <span className="font-bold text-gray-900">{receipt.date || 'Today'}</span>
              </div>
            </div>

            {/* Customer Info */}
            <div className="text-[12px] flex justify-between">
              <span className="text-slate-500">Customer:</span>
              <span className="font-bold text-gray-900">{receipt.customer}</span>
            </div>

            {/* Itemized Table */}
            <div className="space-y-2 py-2 border-y border-dashed border-slate-300">
              <div className="flex justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <span>Item</span>
                <span>Qty</span>
                <span>Total</span>
              </div>

              {(receipt.itemDetails || []).map((item, idx) => (
                <div key={idx} className="flex justify-between text-[12.5px] py-1">
                  <div className="min-w-0 max-w-[65%]">
                    <span className="font-semibold text-gray-900 block truncate">
                      {item.name}
                    </span>
                    <span className="text-[10.5px] text-slate-500">
                      @ ₹{item.price} each {item.isEssential ? '• [Essential]' : ''}
                    </span>
                  </div>
                  <div className="font-semibold text-slate-600">
                    {item.quantity}
                  </div>
                  <div className="font-bold text-gray-900">
                    ₹{item.subtotal || item.price * item.quantity}
                  </div>
                </div>
              ))}
            </div>

            {/* Financial Summary */}
            <div className="space-y-1.5 text-[12px] pt-1">
              <div className="flex justify-between text-slate-600">
                <span>Gross Amount:</span>
                <span className="font-semibold">₹{receipt.total}</span>
              </div>

              {receipt.walletAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Community Wallet Grant Applied:</span>
                  <span>− ₹{receipt.walletAmount}</span>
                </div>
              )}

              {receipt.donation > 0 && (
                <div className="flex justify-between text-indigo-700 font-semibold">
                  <span>Voluntary Community Donation:</span>
                  <span>+ ₹{receipt.donation}</span>
                </div>
              )}

              <div className="pt-2 border-t border-slate-300 flex justify-between text-[15px] font-black text-[var(--navy-deep)]">
                <span>Paid via {receipt.paymentMethod || 'Self-Pay'}:</span>
                <span>₹{receipt.selfPayAmount !== undefined ? receipt.selfPayAmount : receipt.total}</span>
              </div>
            </div>

            {/* Simulated Exit Barcode */}
            <div className="pt-3 border-t border-dashed border-slate-300 text-center">
              <div className="font-mono text-xl tracking-[0.25em] text-slate-800 bg-slate-100 py-2.5 rounded-xl border border-slate-200 select-none">
                ||| | |||| | ||||| || |||
              </div>
              <div className="text-[10px] text-slate-400 mt-1 font-mono tracking-wider">
                EXIT PASS CODE: {receipt.id}-SCAN-VALID
              </div>
              <div className="text-[11px] text-emerald-700 font-bold mt-1">
                Show this digital exit pass to the security counter upon leaving.
              </div>
            </div>

          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-white border-t border-[var(--border)] shrink-0 flex gap-3">
          {onOpenHistory && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenHistory();
              }}
              className="px-4 py-2.5 border border-slate-300 text-slate-700 font-bold text-[12.5px] rounded-xl hover:bg-slate-50 transition-colors"
            >
              Order History
            </button>
          )}

          <button
            type="button"
            onClick={() => window.print()}
            className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[12.5px] rounded-xl transition-colors flex items-center gap-1.5"
          >
            <span>🖨️</span> Print / PDF
          </button>

          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-[var(--teal)] hover:bg-[var(--teal-dark)] text-white font-bold text-[13px] py-2.5 rounded-xl shadow-md transition-all"
          >
            Done Shopping
          </button>
        </div>

      </div>
    </div>
  );
}
