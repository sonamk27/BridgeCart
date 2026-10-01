import { useState, useMemo } from 'react';
import { useStoreData } from '../context/StoreDataContext';
import { useCustomer } from './CustomerContext';

export default function CustomerStoreMap({ targetProduct, onClose, onSelectProduct }) {
  const { aisles, products, storeConfig } = useStoreData();
  const { addToCart } = useCustomer();

  const [selectedAisleId, setSelectedAisleId] = useState(
    targetProduct?.aisleId || aisles[0]?.id || 'row-1'
  );
  const [selectedShelf, setSelectedShelf] = useState(
    targetProduct?.shelfLevel || null
  );

  const activeAisle = useMemo(() => {
    return aisles.find(a => a.id === selectedAisleId) || aisles[0];
  }, [aisles, selectedAisleId]);

  // Products on the current aisle
  const aisleProducts = useMemo(() => {
    return products.filter(p => p.aisleId === selectedAisleId);
  }, [products, selectedAisleId]);

  // Products on the selected shelf
  const shelfProducts = useMemo(() => {
    if (!selectedShelf) return aisleProducts;
    return aisleProducts.filter(p => p.shelfLevel === selectedShelf);
  }, [aisleProducts, selectedShelf]);

  // If a target product was passed, calculate directions from entrance
  const directions = useMemo(() => {
    if (!targetProduct || !targetProduct.aisleId) return null;
    const aisleNum = targetProduct.aisleId.replace('row-', 'Row ');
    const shelfName = targetProduct.shelfLevel ? `Shelf ${targetProduct.shelfLevel}` : 'Shelf Section';
    return {
      steps: [
        'Enter through Main Entrance',
        `Walk along central walkway to ${aisleNum}`,
        `Find ${shelfName} (eye/chest level rack)`,
        `Look for "${targetProduct.name}" by ${targetProduct.brand}`
      ],
      aisleNum,
      shelfName
    };
  }, [targetProduct]);

  return (
    <div className="bg-white rounded-3xl border border-[var(--border)] overflow-hidden shadow-sm">
      {/* Map Header */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 to-[var(--navy-deep)] text-white flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[var(--teal)]/20 border border-teal-400/40 flex items-center justify-center text-xl">
            🗺️
          </div>
          <div>
            <h3 className="font-extrabold text-[16px] leading-tight">Supermarket Navigation Map</h3>
            <p className="text-[12px] text-teal-200">
              Live in-store floor plan • {storeConfig.rows} Rows & Shelves
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {targetProduct && (
            <span className="bg-amber-400/20 border border-amber-400/50 text-amber-300 text-[11.5px] font-bold px-3 py-1 rounded-full animate-pulse">
              🎯 Pinpoint: {targetProduct.name}
            </span>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Target product pinpoint callout banner */}
      {targetProduct && directions && (
        <div className="bg-amber-50 border-b border-amber-200 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex gap-3">
              <span className="text-2xl mt-0.5">{targetProduct.image || '📦'}</span>
              <div>
                <div className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">
                  Selected Target Location
                </div>
                <div className="text-[15px] font-extrabold text-amber-950">
                  {targetProduct.name}
                </div>
                <div className="text-[12.5px] text-amber-900 mt-0.5 font-medium flex items-center gap-2">
                  <span className="bg-amber-200/80 px-2 py-0.5 rounded-md font-bold">
                    📍 {directions.aisleNum}
                  </span>
                  <span className="bg-amber-200/80 px-2 py-0.5 rounded-md font-bold">
                    🗄️ {directions.shelfName}
                  </span>
                  <span className="text-amber-800 font-semibold">₹{targetProduct.price}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => addToCart(targetProduct, 1)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[12px] px-3.5 py-2 rounded-xl shadow-sm transition-colors shrink-0"
            >
              + Add to Cart
            </button>
          </div>

          {/* Quick Route steps */}
          <div className="mt-3 pt-2.5 border-t border-amber-200/70 text-[11.5px] text-amber-900 flex flex-wrap items-center gap-2">
            <span className="font-bold text-amber-950">🚶 Walking Route:</span>
            {directions.steps.map((step, idx) => (
              <span key={idx} className="flex items-center gap-1.5">
                <span>{step}</span>
                {idx < directions.steps.length - 1 && <span className="text-amber-500 font-bold">➔</span>}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Main Floor Plan & Aisle Selector Grid */}
      <div className="p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3 text-[12px]">
          <span className="font-bold text-[var(--navy-deep)]">Tap an aisle to zoom in:</span>
          <span className="text-[var(--muted)]">Entrance at bottom</span>
        </div>

        {/* 2D / Perspective Floor Plan Overview */}
        <div className="relative bg-gradient-to-b from-slate-50 via-slate-100 to-slate-200 rounded-2xl p-4 sm:p-6 border border-slate-300 shadow-inner">
          {/* Top Departments */}
          <div className="flex justify-between items-center text-[10.5px] font-bold text-slate-500 mb-4 px-2">
            <span className="bg-white/80 px-2.5 py-1 rounded-md shadow-xs border border-slate-200">❄️ Dairy & Frozen</span>
            <span className="bg-white/80 px-2.5 py-1 rounded-md shadow-xs border border-slate-200">🥖 Bakery & Fresh</span>
            <span className="bg-white/80 px-2.5 py-1 rounded-md shadow-xs border border-slate-200">🧼 Household Supplies</span>
          </div>

          {/* Aisles Parallel Layout */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4 my-3">
            {aisles.map((aisle, index) => {
              const isTargetAisle = targetProduct?.aisleId === aisle.id;
              const isSelected = selectedAisleId === aisle.id;
              const aisleProductCount = products.filter(p => p.aisleId === aisle.id).length;

              return (
                <button
                  key={aisle.id}
                  onClick={() => {
                    setSelectedAisleId(aisle.id);
                    setSelectedShelf(null);
                  }}
                  className={`group relative flex flex-col items-center rounded-2xl p-3 border-2 text-center transition-all cursor-pointer ${
                    isTargetAisle
                      ? 'border-amber-400 bg-amber-50 shadow-md shadow-amber-200 ring-2 ring-amber-400/40'
                      : isSelected
                      ? 'border-[var(--teal)] bg-teal-50/60 shadow-md ring-2 ring-teal-500/20'
                      : 'border-slate-300 bg-white hover:border-slate-400 hover:shadow-xs'
                  }`}
                >
                  {/* Pin badge if target product is here */}
                  {isTargetAisle && (
                    <div className="absolute -top-2.5 -right-1 bg-amber-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-sm animate-bounce">
                      HERE
                    </div>
                  )}

                  {/* Aisle Color Stripe */}
                  <div
                    className="w-full h-1.5 rounded-full mb-2"
                    style={{ backgroundColor: aisle.color || '#15a99b' }}
                  />

                  <div className="font-extrabold text-[13px] text-[var(--navy-deep)]">
                    {aisle.name}
                  </div>
                  <div className="text-[10px] text-[var(--muted)] font-semibold truncate w-full mt-0.5">
                    {aisle.category || `Category ${index + 1}`}
                  </div>

                  {/* Shelf levels preview pill */}
                  <div className="flex gap-1 mt-2.5 mb-1">
                    {(aisle.levels || ['A', 'B', 'C', 'D']).map(lvl => {
                      const isTargetShelf = isTargetAisle && targetProduct?.shelfLevel === lvl;
                      return (
                        <span
                          key={lvl}
                          className={`w-5 h-5 rounded-md text-[9px] font-bold flex items-center justify-center transition-colors ${
                            isTargetShelf
                              ? 'bg-amber-500 text-white animate-pulse'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {lvl}
                        </span>
                      );
                    })}
                  </div>

                  <div className="text-[10px] font-semibold text-slate-400 mt-1">
                    {aisleProductCount} items
                  </div>
                </button>
              );
            })}
          </div>

          {/* Bottom Store Exit / Checkout & Entrance Bar */}
          <div className="mt-5 pt-3 border-t border-slate-300 flex items-center justify-between text-[11px] font-bold">
            <div className="bg-[var(--navy-deep)] text-white px-3 py-1.5 rounded-lg shadow-xs flex items-center gap-1.5">
              <span>💳</span> Billing Counters
            </div>
            <div className="bg-emerald-600 text-white px-4 py-1.5 rounded-lg shadow-xs flex items-center gap-1.5">
              <span>🚪</span> Main Entrance / Exit
            </div>
          </div>
        </div>

        {/* Selected Aisle Detail & Shelf Level Zoom */}
        {activeAisle && (
          <div className="mt-5 border border-[var(--border)] rounded-2xl p-4 bg-white">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)] flex-wrap gap-2">
              <div>
                <h4 className="font-extrabold text-[14.5px] text-[var(--navy-deep)] flex items-center gap-2">
                  <span>{activeAisle.name} Details</span>
                  <span className="text-[11.5px] font-bold text-[var(--teal-dark)] bg-teal-50 px-2.5 py-0.5 rounded-full">
                    {activeAisle.category}
                  </span>
                </h4>
                <p className="text-[11.5px] text-[var(--muted)] mt-0.5">
                  Click a shelf to filter products on that specific rack level
                </p>
              </div>

              {/* Shelf Level Selector Tabs */}
              <div className="flex gap-1.5">
                <button
                  onClick={() => setSelectedShelf(null)}
                  className={`px-3 py-1 text-[11.5px] font-bold rounded-lg transition-colors ${
                    selectedShelf === null
                      ? 'bg-[var(--navy-deep)] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All Shelves
                </button>
                {(activeAisle.levels || ['A', 'B', 'C', 'D', 'E']).map(lvl => {
                  const isTarget = targetProduct?.aisleId === activeAisle.id && targetProduct?.shelfLevel === lvl;
                  return (
                    <button
                      key={lvl}
                      onClick={() => setSelectedShelf(lvl)}
                      className={`px-3 py-1 text-[11.5px] font-bold rounded-lg transition-colors flex items-center gap-1 ${
                        selectedShelf === lvl
                          ? 'bg-[var(--teal)] text-white shadow-xs'
                          : isTarget
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Shelf {lvl}
                      {isTarget && <span>🎯</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* List of Products located here */}
            <div className="pt-3">
              <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                Products located in {activeAisle.name} {selectedShelf ? `• Shelf ${selectedShelf}` : ''} ({shelfProducts.length}):
              </div>

              {shelfProducts.length === 0 ? (
                <div className="text-[12.5px] text-[var(--muted)] italic py-3 text-center">
                  No products assigned to this shelf level currently.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {shelfProducts.map(p => {
                    const isTarget = targetProduct?.id === p.id;
                    return (
                      <div
                        key={p.id}
                        className={`p-3 rounded-xl border flex items-center justify-between gap-2 transition-all ${
                          isTarget
                            ? 'border-amber-400 bg-amber-50/70 shadow-sm'
                            : 'border-[var(--border)] bg-gray-50/50 hover:bg-white hover:border-teal-200'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="text-xl shrink-0">{p.image || '📦'}</span>
                          <div className="min-w-0">
                            <div className="font-bold text-[12.5px] text-gray-900 truncate">
                              {p.name}
                            </div>
                            <div className="text-[11px] text-[var(--muted)] flex items-center gap-1.5">
                              <span>Shelf {p.shelfLevel || '—'}</span>
                              <span>•</span>
                              <span className="font-bold text-[var(--teal-dark)]">₹{p.price}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          {onSelectProduct && (
                            <button
                              onClick={() => onSelectProduct(p)}
                              className="text-[11px] font-semibold text-[var(--teal-dark)] hover:underline px-1.5 py-1"
                            >
                              Info
                            </button>
                          )}
                          <button
                            onClick={() => addToCart(p, 1)}
                            disabled={p.stock <= 0}
                            className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs transition-colors ${
                              p.stock > 0
                                ? 'bg-[var(--teal)] text-white hover:bg-[var(--teal-dark)]'
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                            title={p.stock > 0 ? 'Add to cart' : 'Out of stock'}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
