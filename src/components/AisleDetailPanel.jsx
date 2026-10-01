export default function AisleDetailPanel({
  aisle,
  shelves,
  aisleProducts,
  loading,
  synced,
  onClose,
  onEditAisle
}) {
  if (!aisle) return null;
  return <div className="w-[320px] shrink-0 bg-white border border-[var(--border)] rounded-xl p-5 h-fit sticky top-4">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wide">
            Aisle details
          </div>
          <div className="text-lg font-extrabold">{aisle.name}</div>
        </div>
        <button onClick={onClose} className="text-[var(--muted)] hover:text-[var(--text)] text-sm w-7 h-7 rounded-full hover:bg-gray-100 flex items-center justify-center">
          ✕
        </button>
      </div>

      <div className="flex items-center gap-2 text-[12px] mb-4">
        {loading ? <span className="text-amber-600 font-semibold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            Sending layout info to LayoutService…
          </span> : synced ? <span className="text-[var(--green)] font-semibold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--green)]" />
            Synced with backend
          </span> : null}
      </div>

      <div className="text-[13px] mb-4">
        <span className="text-[var(--muted)]">Category — </span>
        <span className="font-semibold">{aisle.category}</span>
      </div>

      <div className="space-y-2 mb-5">
        {shelves.map(s => <div key={s.level} className="flex items-center justify-between border border-[var(--border)] rounded-lg px-3 py-2 text-[13px]">
            <span className="font-semibold">Shelf {s.level}</span>
            <span className="text-[var(--muted)]">{s.itemCount} products</span>
            {s.outOfStock > 0 ? <span className="text-[11px] font-semibold text-[var(--red)] bg-red-50 px-2 py-0.5 rounded-full">
                {s.outOfStock} out
              </span> : s.lowStock > 0 ? <span className="text-[11px] font-semibold text-[var(--amber)] bg-amber-50 px-2 py-0.5 rounded-full">
                {s.lowStock} low
              </span> : <span className="text-[11px] font-semibold text-[var(--green)] bg-green-50 px-2 py-0.5 rounded-full">
                OK
              </span>}
          </div>)}
      </div>

      <div className="grid grid-cols-2 gap-2 mb-5 text-center">
        <div className="border border-[var(--border)] rounded-lg py-2.5">
          <div className="text-lg font-extrabold">{shelves.length}</div>
          <div className="text-[11px] text-[var(--muted)]">Shelves</div>
        </div>
        <div className="border border-[var(--border)] rounded-lg py-2.5">
          <div className="text-lg font-extrabold">{aisleProducts.length}</div>
          <div className="text-[11px] text-[var(--muted)]">Products</div>
        </div>
      </div>

      {aisleProducts.length > 0 && <div className="mb-5">
          <div className="text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wide mb-2">
            Products here
          </div>
          <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
            {aisleProducts.map(p => <div key={p.id} className="flex items-center justify-between text-[12.5px]">
                <span className="truncate pr-2">{p.name}</span>
                <span className="text-[var(--muted)] shrink-0">{p.stock} in stock</span>
              </div>)}
          </div>
        </div>}

      <button onClick={onEditAisle} className="w-full bg-[var(--teal)] text-white font-semibold text-[13px] py-2.5 rounded-lg hover:bg-[var(--teal-dark)] transition-colors">
        Manage products in this aisle
      </button>
    </div>;
}
