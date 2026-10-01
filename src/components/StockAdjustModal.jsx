import { useState } from 'react';
import Modal from './Modal';
export default function StockAdjustModal({
  product,
  onClose,
  onAdd,
  onSet
}) {
  const [mode, setMode] = useState('add');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  function handleSubmit(e) {
    e.preventDefault();
    const val = Number(amount);
    if (!val && val !== 0) return;
    if (mode === 'add') onAdd(product.id, val, note || undefined);else onSet(product.id, val, note || undefined);
    onClose();
  }
  return <Modal title={`Adjust stock — ${product.name}`} onClose={onClose} width={420}>
      <div className="text-[12.5px] text-[var(--muted)] mb-3">
        Current stock: <span className="font-bold text-[var(--text)]">{product.stock}</span>
      </div>
      <div className="flex gap-2 mb-4">
        <button type="button" onClick={() => setMode('add')} className={`flex-1 text-[12.5px] font-semibold py-2 rounded-lg border ${mode === 'add' ? 'bg-[var(--navy-deep)] text-white border-[var(--navy-deep)]' : 'border-[var(--border)]'}`}>
          Add Stock
        </button>
        <button type="button" onClick={() => setMode('set')} className={`flex-1 text-[12.5px] font-semibold py-2 rounded-lg border ${mode === 'set' ? 'bg-[var(--navy-deep)] text-white border-[var(--navy-deep)]' : 'border-[var(--border)]'}`}>
          Set Exact Stock
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-[12px] font-semibold text-[var(--muted)] mb-1.5">
            {mode === 'add' ? 'Quantity to add' : 'New total quantity'}
          </label>
          <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="w-full border border-[var(--border)] rounded-lg px-3 py-2.5 text-[13px]" required />
        </div>
        <div>
          <label className="block text-[12px] font-semibold text-[var(--muted)] mb-1.5">Note (optional)</label>
          <input value={note} onChange={e => setNote(e.target.value)} placeholder="e.g. Purchase order #221" className="w-full border border-[var(--border)] rounded-lg px-3 py-2.5 text-[13px]" />
        </div>
        <button type="submit" className="w-full bg-[var(--teal)] text-white font-semibold text-[13px] py-2.5 rounded-lg hover:bg-[var(--teal-dark)] mt-1">
          Save
        </button>
      </form>
    </Modal>;
}
