import { useCustomer } from './CustomerContext';

export default function CartDrawer({ onClose, onProceedToCheckout }) {
  const {
    cart,
    cartSubtotal,
    cartItemCount,
    cartEssentialSubtotal,
    cartNonEssentialSubtotal,
    updateCartQty,
    removeFromCart,
    clearCart,
    donationAmount,
    setDonationAmount,
    beneficiary,
    walletCoverage
  } = useCustomer();

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end">
      {/* Drawer Panel */}
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-250">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[var(--navy-deep)] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🛒</span>
            <div>
              <h3 className="font-extrabold text-[16px] leading-tight">Your In-Store Cart</h3>
              <p className="text-[12px] text-teal-200">{cartItemCount} items selected</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-[11px] font-semibold text-rose-300 hover:text-rose-100 hover:underline px-2 py-1"
              >
                Clear Cart
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-4xl mb-3">
                🛍️
              </div>
              <h4 className="font-extrabold text-[16px] text-[var(--navy-deep)]">Your cart is empty</h4>
              <p className="text-[12.5px] text-[var(--muted)] max-w-xs mt-1 mb-5">
                Browse products, search items, or locate them on the store map and add them to your cart.
              </p>
              <button
                onClick={onClose}
                className="bg-[var(--teal)] text-white font-bold text-[13px] px-6 py-2.5 rounded-xl shadow-xs hover:bg-[var(--teal-dark)]"
              >
                Start In-Store Shopping
              </button>
            </div>
          ) : (
            <>
              {/* Product items */}
              {cart.map(({ product, quantity }) => {
                const itemTotal = product.price * quantity;
                const isMax = quantity >= product.stock;

                return (
                  <div
                    key={product.id}
                    className="p-3.5 bg-gray-50/70 rounded-2xl border border-[var(--border)] flex items-center justify-between gap-3 hover:border-teal-200 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-2xl shrink-0 shadow-2xs">
                        {product.image || '📦'}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold text-[13.5px] text-gray-900 truncate">
                            {product.name}
                          </span>
                          {product.isEssential && (
                            <span className="bg-emerald-100 text-emerald-800 text-[9.5px] font-extrabold px-1.5 py-0.2 rounded-md">
                              Essential
                            </span>
                          )}
                        </div>

                        <div className="text-[11.5px] text-[var(--muted)] mt-0.5">
                          ₹{product.price} each • {product.aisleId ? product.aisleId.replace('row-', 'Row ') : 'Aisle'} · Shelf {product.shelfLevel || '—'}
                        </div>

                        <div className="text-[13px] font-extrabold text-[var(--navy-deep)] mt-0.5">
                          ₹{itemTotal}
                        </div>
                      </div>
                    </div>

                    {/* Stepper & remove */}
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <div className="flex items-center bg-white border border-[var(--border)] rounded-xl overflow-hidden shadow-2xs">
                        <button
                          type="button"
                          onClick={() => updateCartQty(product.id, quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-100 text-xs"
                        >
                          −
                        </button>
                        <span className="px-2 font-extrabold text-xs text-[var(--navy-deep)]">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateCartQty(product.id, quantity + 1)}
                          disabled={isMax}
                          className="w-7 h-7 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-100 text-xs disabled:opacity-40"
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(product.id)}
                        className="text-[10.5px] text-rose-500 hover:text-rose-700 font-semibold hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Community Wallet Benefit Card if beneficiary is approved */}
              {beneficiary.status === 'APPROVED' && cartEssentialSubtotal > 0 && (
                <div className="p-3.5 bg-emerald-50/80 border border-emerald-200 rounded-2xl">
                  <div className="flex items-center justify-between text-[12px] font-bold text-emerald-950 mb-1">
                    <span className="flex items-center gap-1.5">
                      <span>🌾</span> Community Wallet Coverage
                    </span>
                    <span className="text-emerald-700">− ₹{walletCoverage}</span>
                  </div>
                  <p className="text-[11px] text-emerald-800 leading-snug">
                    {cartEssentialSubtotal <= beneficiary.walletBalance
                      ? '100% of your essential groceries are covered by your Community Wallet!'
                      : `₹${walletCoverage} covered by wallet. Remaining balance is self-pay.`}
                  </p>
                </div>
              )}

              {/* Section 9: Optional Community Wallet Donation */}
              <div className="p-3.5 bg-indigo-50/60 border border-indigo-200/70 rounded-2xl">
                <div className="flex items-center justify-between text-[12.5px] font-extrabold text-indigo-950 mb-1">
                  <span className="flex items-center gap-1.5">
                    <span>❤️</span> Donate to Community Wallet
                  </span>
                  <span className="text-indigo-800 font-bold">
                    {donationAmount > 0 ? `+ ₹${donationAmount}` : 'None'}
                  </span>
                </div>
                <p className="text-[11px] text-indigo-800/90 mb-2.5">
                  Help local families access essential flour, milk, and lentils through voluntary contribution.
                </p>

                <div className="flex gap-2">
                  {[0, 10, 25, 50, 100].map(amt => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setDonationAmount(amt)}
                      className={`flex-1 py-1.5 rounded-lg text-[11.5px] font-bold border transition-all ${
                        donationAmount === amt
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                          : 'bg-white text-indigo-900 border-indigo-200 hover:bg-indigo-100/50'
                      }`}
                    >
                      {amt === 0 ? 'No' : `₹${amt}`}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer with Summary & Checkout CTA */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 bg-gray-50 border-t border-[var(--border)] space-y-3">
            {/* Breakdown */}
            <div className="space-y-1.5 text-[12.5px]">
              <div className="flex justify-between text-gray-600">
                <span>Items Subtotal:</span>
                <span className="font-semibold text-gray-900">₹{cartSubtotal}</span>
              </div>

              {donationAmount > 0 && (
                <div className="flex justify-between text-indigo-800">
                  <span>Community Donation:</span>
                  <span className="font-semibold">+ ₹{donationAmount}</span>
                </div>
              )}

              {beneficiary.status === 'APPROVED' && walletCoverage > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Wallet Covered (Essentials):</span>
                  <span>− ₹{walletCoverage}</span>
                </div>
              )}

              <div className="pt-2 border-t border-[var(--border)] flex justify-between text-[15px] font-extrabold text-[var(--navy-deep)]">
                <span>Total Amount:</span>
                <span>₹{cartSubtotal + donationAmount}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                onClose();
                onProceedToCheckout();
              }}
              className="w-full bg-[var(--teal)] hover:bg-[var(--teal-dark)] text-white font-extrabold text-[14px] py-3.5 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <span>•</span>
              <span>₹{cartSubtotal + donationAmount}</span>
              <span>→</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
