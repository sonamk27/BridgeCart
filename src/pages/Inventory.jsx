import { useState } from 'react';
import StatCard from '../components/StatCard';
import StockAdjustModal from '../components/StockAdjustModal';
import { useStoreData } from '../context/StoreDataContext';
export default function Inventory() {
  const {
    products,
    aisles,
    totalSales,
    totalOrders,
    totalSkus,
    lowStockCount,
    outOfStockCount,
    addStock,
    setStock
  } = useStoreData();
  const [adjusting, setAdjusting] = useState(null);
  function location(p) {
    if (!p.aisleId) return '—';
    const aisle = aisles.find(a => a.id === p.aisleId);
    return aisle ? `${aisle.name}${p.shelfLevel ? ' · ' + p.shelfLevel : ''}` : '—';
  }
  function status(p) {
    if (p.stock === 0) return {
      label: 'Out',
      tone: 'red'
    };
    if (p.stock <= p.lowStockThreshold) return {
      label: 'Low',
      tone: 'amber'
    };
    return {
      label: 'Healthy',
      tone: 'green'
    };
  }
  return <div>
      <div className="grid grid-cols-5 gap-4 mb-5">
        <StatCard label="Total SKUs" value={String(totalSkus)} />
        <StatCard label="Low Stock" value={String(lowStockCount)} deltaClass="text-[var(--amber)]" />
        <StatCard label="Out of Stock" value={String(outOfStockCount)} deltaClass="text-[var(--red)]" />
        <StatCard label="Total Orders" value={String(totalOrders)} />
        <StatCard label="Total Sales" value={`₹${totalSales.toLocaleString('en-IN')}`} deltaClass="text-[var(--green)]" />
      </div>

      <div className="bg-white border border-[var(--border)] rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-[14.5px] font-bold">Current Stock</div>
            <div className="text-[12px] text-[var(--muted)] mt-0.5">
              Live view — pulls from the same product data used in Products, Store Layout and Analytics
            </div>
          </div>
        </div>
        <table className="w-full text-[13px]">
          <thead>
            <tr className="text-[11.5px] text-[var(--muted)] font-semibold text-left border-b border-[var(--border)]">
              <th className="py-2">Product</th>
              <th>Aisle / Shelf</th>
              <th>Stock</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => {
            const s = status(p);
            return <tr key={p.id} className="border-b border-[var(--border)] last:border-0">
                  <td className="py-2.5 font-medium">{p.name}</td>
                  <td className="text-[var(--muted)]">{location(p)}</td>
                  <td>{p.stock}</td>
                  <td>
                    <span className={`text-[11px] font-semibold px-2.5 py-[3px] rounded-full ${s.tone === 'green' ? 'bg-[#E6F6EC] text-[var(--green)]' : s.tone === 'amber' ? 'bg-[#FCF1DE] text-[var(--amber)]' : 'bg-[#FBEAE9] text-[var(--red)]'}`}>
                      {s.label}
                    </span>
                  </td>
                  <td>
                    <button onClick={() => setAdjusting(p)} className="text-[12px] font-semibold text-[var(--teal-dark)] hover:underline">
                      Edit
                    </button>
                  </td>
                </tr>;
          })}
          </tbody>
        </table>
      </div>

      {adjusting && <StockAdjustModal product={adjusting} onClose={() => setAdjusting(null)} onAdd={addStock} onSet={setStock} />}
    </div>;
}
