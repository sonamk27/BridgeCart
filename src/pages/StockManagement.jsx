import { useState } from 'react';
import { useStoreData } from '../context/StoreDataContext';
export default function StockManagement() {
  const {
    products,
    addStock,
    setStock,
    stockMovements
  } = useStoreData();
  const [productId, setProductId] = useState('');
  const [mode, setMode] = useState('add');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [confirmMsg, setConfirmMsg] = useState(null);
  const selected = products.find(p => p.id === productId);
  function handleSubmit(e) {
    e.preventDefault();
    if (!selected) return;
    const val = Number(amount);
    if (!val && val !== 0) return;
    if (mode === 'add') addStock(selected.id, val, note || undefined);else setStock(selected.id, val, note || undefined);
    setConfirmMsg(mode === 'add' ? `Added ${val} units to ${selected.name}. New stock: ${selected.stock + val}.` : `${selected.name} stock set to ${val}.`);
    setAmount('');
    setNote('');
    setTimeout(() => setConfirmMsg(null), 5000);
  }
  return <div className="grid grid-cols-[1fr_1.3fr] gap-4 items-start">
      <div className="bg-white border border-[var(--border)] rounded-xl p-5">
        <div className="text-[14.5px] font-bold mb-1">Add / Update Stock</div>
        <div className="text-[12px] text-[var(--muted)] mb-4">
          Changes here update Inventory, Products and Store Layout immediately.
        </div>

        {confirmMsg && <div className="mb-4 text-[12.5px] font-semibold bg-[#E6F6EC] text-[var(--green)] px-3.5 py-2.5 rounded-lg">
            {confirmMsg}
          </div>}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-[12px] font-semibold text-[var(--muted)] mb-1.5">Product</label>
            <select value={productId} onChange={e => setProductId(e.target.value)} required className="w-full border border-[var(--border)] rounded-lg px-3 py-2.5 text-[13px] bg-white">
              <option value="">Select a product…</option>
              {products.map(p => <option key={p.id} value={p.id}>
                  {p.name} — current: {p.stock}
                </option>)}
            </select>
          </div>

          <div className="flex gap-2">
            <button type="button" onClick={() => setMode('add')} className={`flex-1 text-[12.5px] font-semibold py-2 rounded-lg border ${mode === 'add' ? 'bg-[var(--navy-deep)] text-white border-[var(--navy-deep)]' : 'border-[var(--border)]'}`}>
              Add Stock
            </button>
            <button type="button" onClick={() => setMode('set')} className={`flex-1 text-[12.5px] font-semibold py-2 rounded-lg border ${mode === 'set' ? 'bg-[var(--navy-deep)] text-white border-[var(--navy-deep)]' : 'border-[var(--border)]'}`}>
              Update Stock
            </button>
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-[var(--muted)] mb-1.5">
              {mode === 'add' ? 'Quantity to add' : 'New total quantity'}
            </label>
            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} required className="w-full border border-[var(--border)] rounded-lg px-3 py-2.5 text-[13px]" />
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-[var(--muted)] mb-1.5">Note (optional)</label>
            <input value={note} onChange={e => setNote(e.target.value)} placeholder="e.g. Purchase order #221" className="w-full border border-[var(--border)] rounded-lg px-3 py-2.5 text-[13px]" />
          </div>

          <button type="submit" disabled={!selected} className="w-full bg-[var(--teal)] text-white font-semibold text-[13px] py-2.5 rounded-lg hover:bg-[var(--teal-dark)] disabled:opacity-50">
            Save
          </button>
        </form>
      </div>

      <div className="bg-white border border-[var(--border)] rounded-xl p-5">
        <div className="text-[14.5px] font-bold mb-4">Stock History</div>
        {stockMovements.length === 0 ? <div className="text-center text-[var(--muted)] py-10 text-[13px]">
            No stock changes yet. Add or update stock on the left to see it logged here.
          </div> : <table className="w-full text-[13px]">
            <thead>
              <tr className="text-[11.5px] text-[var(--muted)] font-semibold text-left border-b border-[var(--border)]">
                <th className="py-2">Product</th>
                <th>Action</th>
                <th>Qty</th>
                <th>New Stock</th>
                <th>Note</th>
                <th>When</th>
              </tr>
            </thead>
            <tbody>
              {stockMovements.map(m => <tr key={m.id} className="border-b border-[var(--border)] last:border-0">
                  <td className="py-2.5 font-medium">{m.productName}</td>
                  <td className="capitalize">{m.type === 'add' ? 'Added' : m.type === 'set' ? 'Set' : 'Sale'}</td>
                  <td>{m.quantity}</td>
                  <td>{m.resultingStock}</td>
                  <td className="text-[var(--muted)]">{m.note || '—'}</td>
                  <td className="text-[var(--muted)] whitespace-nowrap">{m.timestamp}</td>
                </tr>)}
            </tbody>
          </table>}
      </div>
    </div>;
}
