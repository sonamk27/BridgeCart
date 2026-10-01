import { useState } from 'react';
import { useCustomer } from './CustomerContext';

export default function ProductDetailModal({ product, onClose, onLocateOnMap }) {
  const { cart, addToCart, updateCartQty } = useCustomer();
  const [qty, setQty] = useState(1);

  if (!product) return null;

  const inCart = cart.find(item => item.product.id === product.id);
  const isOutOfStock = product.stock <= 0;
  const aisleText = product.aisleId ? product.aisleId.replace('row-', 'Row ') : 'Unassigned';
  const shelfText = product.shelfLevel ? `Shelf ${product.shelfLevel}` : 'Section Level';

  function handleAddToCart() {
    if (isOutOfStock) return;
    addToCart(product, qty);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-[var(--border)] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header with image */}
        <div className="relative bg-gradient-to-b from-slate-100 to-slate-50 p-6 flex flex-col items-center justify-center border-b border-[var(--border)]">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-gray-700 flex items-center justify-center text-sm shadow-xs transition-colors"
          >
            ✕
          </button>

          <div className="w-24 h-24 rounded-2xl bg-white border border-slate-200/80 shadow-md flex items-center justify-center text-5xl mb-3">
            {product.image || '📦'}
          </div>

          <div className="text-[12px] font-bold text-[var(--teal-dark)] uppercase tracking-wider">
            {product.brand} • {product.category}
          </div>

          <h3 className="text-[18px] font-extrabold text-[var(--navy-deep)] text-center mt-1 px-4 leading-snug">
            {product.name}
          </h3>

          <div className="mt-2 flex items-center gap-2">
            <span className="text-[20px] font-extrabold text-[var(--navy-deep)]">
              ₹{product.price}
            </span>
            {product.unit && (
              <span className="text-[12px] text-[var(--muted)]">/ {product.unit}</span>
            )}
          </div>
        </div>

        {/* Body content */}
        <div className="p-6 space-y-4">
          {/* Description */}
          {product.description && (
            <p className="text-[13px] text-gray-600 leading-relaxed">
              {product.description}
            </p>
          )}

          {/* Essential grocery notice */}
          {product.isEssential ? (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2.5">
              <span className="text-xl">🌾</span>
              <div>
                <div className="font-extrabold text-[12.5px] text-emerald-900">
                  Community Wallet Eligible Product
                </div>
                <div className="text-[11.5px] text-emerald-700">
                  This staple item is 100% covered by the Community Wallet for verified ration-card families.
                </div>
              </div>
            </div>
          ) : null}

          {/* Physical In-Store Location Box */}
          <div className="p-3.5 bg-slate-50 border-2 border-slate-200 rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11.5px] font-bold text-[var(--navy-deep)] uppercase tracking-wider flex items-center gap-1.5">
                <span>📍</span> Exact In-Store Shelf Location
              </span>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded-md">
                Verified
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <div className="text-[10.5px] text-[var(--muted)] font-semibold">AISLE / ROW</div>
                <div className="text-[14px] font-extrabold text-[var(--teal-dark)]">{aisleText}</div>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <div className="text-[10.5px] text-[var(--muted)] font-semibold">RACK LEVEL</div>
                <div className="text-[14px] font-extrabold text-[var(--teal-dark)]">{shelfText}</div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                onClose();
                onLocateOnMap(product);
              }}
              className="w-full bg-[var(--navy-deep)] hover:opacity-95 text-white font-bold text-[12.5px] py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs"
            >
              <span>🗺️</span> View Pinpointed on Store Map →
            </button>
          </div>

          {/* Stock status */}
          <div className="flex items-center justify-between text-[12px] px-1">
            <span className="text-[var(--muted)]">Stock Availability:</span>
            {isOutOfStock ? (
              <span className="text-rose-600 font-bold bg-rose-50 px-2.5 py-1 rounded-full">
                Currently Out of Stock
              </span>
            ) : (
              <span className="text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-full">
                ✓ {product.stock} units available on shelf
              </span>
            )}
          </div>

          {/* Add to Cart Actions */}
          {!isOutOfStock && (
            <div className="pt-2 flex items-center gap-3">
              {/* Stepper */}
              <div className="flex items-center border border-[var(--border)] rounded-xl overflow-hidden bg-gray-50">
                <button
                  type="button"
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-9 h-10 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-200 transition-colors"
                >
                  −
                </button>
                <span className="w-9 text-center font-extrabold text-sm text-[var(--navy-deep)]">
                  {qty}
                </span>
                <button
                  type="button"
                  onClick={() => setQty(Math.min(product.stock, qty + 1))}
                  className="w-9 h-10 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-200 transition-colors"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 bg-[var(--teal)] hover:bg-[var(--teal-dark)] text-white font-bold text-[13.5px] py-2.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>🛒</span> Add to Cart • ₹{product.price * qty}
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
