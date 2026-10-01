import { useState } from 'react';
import { useStoreData } from '../context/StoreDataContext';
export default function ProductForm({
  initial,
  submitLabel,
  onSubmit
}) {
  const {
    aisles
  } = useStoreData();
  const [name, setName] = useState(initial?.name ?? '');
  const [category, setCategory] = useState(initial?.category ?? '');
  const [brand, setBrand] = useState(initial?.brand ?? '');
  const [sku, setSku] = useState(initial?.sku ?? '');
  const [price, setPrice] = useState(String(initial?.price ?? ''));
  const [stock, setStock] = useState(String(initial?.stock ?? ''));
  const [lowStockThreshold, setLowStockThreshold] = useState(String(initial?.lowStockThreshold ?? 10));
  const [aisleId, setAisleId] = useState(initial?.aisleId ?? '');
  const [shelfLevel, setShelfLevel] = useState(initial?.shelfLevel ?? '');
  const activeAisle = aisles.find(a => a.id === aisleId);
  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({
      name: name.trim(),
      category: category.trim() || 'Uncategorized',
      brand: brand.trim() || '—',
      sku: sku.trim(),
      price: Number(price) || 0,
      stock: Number(stock) || 0,
      aisleId: aisleId || null,
      shelfLevel: shelfLevel || null,
      lowStockThreshold: Number(lowStockThreshold) || 10
    });
  }
  return <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <TextField label="Product Name" value={name} onChange={setName} required />
        <TextField label="Brand" value={brand} onChange={setBrand} />
        <TextField label="Category" value={category} onChange={setCategory} />
        <TextField label="SKU (optional)" value={sku} onChange={setSku} placeholder="auto-generated if blank" />
        <TextField label="Price (₹)" value={price} onChange={setPrice} type="number" />
        <TextField label="Stock" value={stock} onChange={setStock} type="number" />
        <TextField label="Low stock threshold" value={lowStockThreshold} onChange={setLowStockThreshold} type="number" />
        <div>
          <label className="block text-[12px] font-semibold text-[var(--muted)] mb-1.5">Aisle</label>
          <select value={aisleId} onChange={e => {
          setAisleId(e.target.value);
          setShelfLevel('');
        }} className="w-full border border-[var(--border)] rounded-lg px-3 py-2.5 text-[13px] bg-white">
            <option value="">Unassigned</option>
            {aisles.map(a => <option key={a.id} value={a.id}>
                {a.name} — {a.category}
              </option>)}
          </select>
        </div>
        <div>
          <label className="block text-[12px] font-semibold text-[var(--muted)] mb-1.5">Shelf</label>
          <select value={shelfLevel} onChange={e => setShelfLevel(e.target.value)} disabled={!activeAisle} className="w-full border border-[var(--border)] rounded-lg px-3 py-2.5 text-[13px] bg-white disabled:opacity-50">
            <option value="">Unassigned</option>
            {activeAisle?.levels.map(lvl => <option key={lvl} value={lvl}>
                Shelf {lvl}
              </option>)}
          </select>
        </div>
      </div>
      <button type="submit" className="w-full bg-[var(--teal)] text-white font-semibold text-[13px] py-2.5 rounded-lg hover:bg-[var(--teal-dark)] transition-colors mt-2">
        {submitLabel}
      </button>
    </form>;
}
function TextField({
  label,
  value,
  onChange,
  type = 'text',
  required,
  placeholder
}) {
  return <div>
      <label className="block text-[12px] font-semibold text-[var(--muted)] mb-1.5">{label}</label>
      <input type={type} value={value} required={required} placeholder={placeholder} onChange={e => onChange(e.target.value)} className="w-full border border-[var(--border)] rounded-lg px-3 py-2.5 text-[13px]" />
    </div>;
}
