import { useCustomer } from './CustomerContext';

export default function ProductCard({ product, onOpenDetail, onLocateOnMap }) {
  const { cart, addToCart, updateCartQty } = useCustomer();

  const inCartItem = cart.find(item => item.product.id === product.id);
  const cartQty = inCartItem?.quantity || 0;

  // Format physical location tag
  const locationTag = product.aisleId
    ? `${product.aisleId.replace('row-', 'Row ')} · Shelf ${product.shelfLevel || '—'}`
    : 'Location TBD';

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= (product.lowStockThreshold || 10);

  return (
    <div className="bg-white rounded-2xl border border-[var(--border)] p-4 flex flex-col justify-between hover:shadow-md hover:border-teal-300/80 transition-all group">
      
      <div>
        {/* Top Badges */}
        <div className="flex items-start justify-between gap-1.5 mb-2.5">
          {product.isEssential ? (
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1">
              <span>🌾</span> Essential
            </span>
          ) : (
            <span className="text-[11px] text-[var(--muted)] font-medium">
              {product.brand}
            </span>
          )}

          {isOutOfStock ? (
            <span className="bg-rose-50 text-rose-600 border border-rose-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
              Out of stock
            </span>
          ) : isLowStock ? (
            <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
              Only {product.stock} left
            </span>
          ) : (
            <span className="text-emerald-600 text-[10px] font-bold flex items-center gap-0.5">
              ● In stock
            </span>
          )}
        </div>

        {/* Product Emoji / Image & Name */}
        <div
          onClick={() => onOpenDetail(product)}
          className="cursor-pointer group-hover:text-[var(--teal-dark)] transition-colors"
        >
          <div className="w-14 h-14 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-3xl mx-auto mb-2 shadow-xs">
            {product.image || '📦'}
          </div>

          <h4 className="font-bold text-[13.5px] leading-snug line-clamp-2 min-h-[38px] text-gray-900">
            {product.name}
          </h4>
        </div>

        {/* Physical Shelf Location Tag */}
        <button
          type="button"
          onClick={() => onLocateOnMap(product)}
          className="w-full mt-2 bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-300 rounded-xl p-2 text-left transition-colors flex items-center justify-between text-[11px]"
          title="Click to view exact location on supermarket floor map"
        >
          <span className="text-slate-500 font-semibold flex items-center gap-1">
            <span>📍</span> {locationTag}
          </span>
          <span className="text-[var(--teal-dark)] font-bold text-[10.5px]">Map →</span>
        </button>
      </div>

      {/* Price & Add to Cart Controls */}
      <div className="mt-3 pt-3 border-t border-[var(--border)] flex items-center justify-between">
        <div>
          <div className="text-[16px] font-extrabold text-[var(--navy-deep)]">
            ₹{product.price}
          </div>
          {product.unit && (
            <div className="text-[10px] text-[var(--muted)] font-medium">
              per {product.unit}
            </div>
          )}
        </div>

        <div>
          {isOutOfStock ? (
            <button
              disabled
              className="bg-gray-100 text-gray-400 text-[11px] font-bold px-3 py-1.5 rounded-xl cursor-not-allowed"
            >
              Unavailable
            </button>
          ) : cartQty > 0 ? (
            /* Quantity stepper when in cart */
            <div className="flex items-center bg-[var(--teal)]/10 border border-[var(--teal)] rounded-xl overflow-hidden shadow-xs">
              <button
                type="button"
                onClick={() => updateCartQty(product.id, cartQty - 1)}
                className="w-7 h-7 flex items-center justify-center font-extrabold text-xs text-[var(--teal-dark)] hover:bg-[var(--teal)] hover:text-white transition-colors"
              >
                −
              </button>
              <span className="px-2 font-extrabold text-xs text-[var(--navy-deep)]">
                {cartQty}
              </span>
              <button
                type="button"
                onClick={() => updateCartQty(product.id, cartQty + 1)}
                disabled={cartQty >= product.stock}
                className="w-7 h-7 flex items-center justify-center font-extrabold text-xs text-[var(--teal-dark)] hover:bg-[var(--teal)] hover:text-white transition-colors disabled:opacity-40"
              >
                +
              </button>
            </div>
          ) : (
            /* Add button */
            <button
              type="button"
              onClick={() => addToCart(product, 1)}
              className="bg-[var(--teal)] hover:bg-[var(--teal-dark)] text-white text-[12px] font-bold px-3.5 py-1.5 rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1"
            >
              <span>+</span> Add
            </button>
          )}
        </div>
      </div>

    </div>
  );
}
