import { useCustomer } from './CustomerContext';

export default function CustomerOrderHistory({ onClose, onSelectReceipt }) {
  const { orderHistory, auth } = useCustomer();

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg max-h-[92vh] overflow-hidden shadow-2xl border border-[var(--border)] animate-in fade-in zoom-in-95 duration-200 flex flex-col">
        
        {/* Header */}
        <div className="bg-[var(--navy-deep)] text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[var(--teal)]/20 border border-[var(--teal)]/40 flex items-center justify-center text-xl">
              🧾
            </div>
            <div>
              <h3 className="font-extrabold text-[16.5px] leading-tight">Shopping History</h3>
              <p className="text-[12px] text-teal-200">
                {auth.isGuest ? 'Guest Session Purchases' : `Orders for ${auth.user?.name}`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
          {orderHistory.length === 0 ? (
            <div className="py-12 text-center text-[var(--muted)]">
              <div className="text-3xl mb-2">🛍️</div>
              <div className="font-bold text-[15px] text-gray-800">No previous orders yet</div>
              <p className="text-[12.5px] mt-1">
                Completed purchases during in-store sessions will appear here with digital receipts.
              </p>
            </div>
          ) : (
            orderHistory.map(order => (
              <div
                key={order.id}
                className="p-4 bg-slate-50 border border-slate-200 rounded-2xl hover:border-teal-300 transition-all hover:bg-white hover:shadow-xs space-y-2.5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-[14.5px] text-[var(--navy-deep)]">
                        {order.id}
                      </span>
                      <span className="text-[10.5px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                        COMPLETED
                      </span>
                    </div>
                    <div className="text-[11.5px] text-[var(--muted)] mt-0.5">
                      {order.date} • {order.store?.name || 'Lokmanya Super Market'}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-extrabold text-[16px] text-gray-900">
                      ₹{order.total}
                    </div>
                    <div className="text-[10.5px] text-[var(--muted)]">
                      {order.items} items
                    </div>
                  </div>
                </div>

                {/* Breakdown tags */}
                <div className="flex flex-wrap items-center gap-2 text-[11px] pt-1">
                  <span className="bg-white border border-slate-200 px-2 py-0.5 rounded-md text-slate-700 font-semibold">
                    Payment: {order.paymentMethod || 'UPI'}
                  </span>
                  {order.walletAmount > 0 && (
                    <span className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-2 py-0.5 rounded-md font-bold">
                      🌾 Wallet: ₹{order.walletAmount}
                    </span>
                  )}
                  {order.donation > 0 && (
                    <span className="bg-indigo-50 border border-indigo-200 text-indigo-800 px-2 py-0.5 rounded-md font-bold">
                      ❤️ Donation: ₹{order.donation}
                    </span>
                  )}
                </div>

                {/* Items preview snippet */}
                {order.itemDetails && order.itemDetails.length > 0 && (
                  <div className="text-[11.5px] text-gray-600 line-clamp-1 italic">
                    Includes: {order.itemDetails.map(i => `${i.name} (x${i.quantity})`).join(', ')}
                  </div>
                )}

                <div className="pt-2 border-t border-slate-200 flex justify-end">
                  <button
                    type="button"
                    onClick={() => onSelectReceipt(order)}
                    className="text-[12px] font-bold text-[var(--teal-dark)] hover:underline flex items-center gap-1"
                  >
                    <span>🧾</span> View Digital Receipt & Exit Pass →
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-[var(--border)] text-center">
          <button
            type="button"
            onClick={onClose}
            className="w-full bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-[13px] py-2.5 rounded-xl transition-colors"
          >
            Close History
          </button>
        </div>

      </div>
    </div>
  );
}
