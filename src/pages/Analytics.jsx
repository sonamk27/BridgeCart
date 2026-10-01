import StatCard from '../components/StatCard';
import { useStoreData } from '../context/StoreDataContext';
export default function Analytics() {
  const {
    totalSales,
    totalOrders,
    products,
    offers
  } = useStoreData();
  const avgOrderValue = totalOrders > 0 ? Math.round(totalSales / totalOrders) : 0;
  const totalStockUnits = products.reduce((sum, p) => sum + p.stock, 0);
  return <div>
      <div className="grid grid-cols-4 gap-4 mb-5">
        <StatCard label="Total Sales" value={`₹${totalSales.toLocaleString('en-IN')}`} />
        <StatCard label="Total Orders" value={String(totalOrders)} />
        <StatCard label="Avg. Order Value" value={`₹${avgOrderValue}`} />
        <StatCard label="Active Offers" value={String(offers.length)} />
      </div>
      <div className="bg-white border border-[var(--border)] rounded-xl p-5 mb-4">
        <div className="text-[14.5px] font-bold mb-1">Catalog Overview</div>
        <div className="text-[12.5px] text-[var(--muted)] mb-3">Pulled live from Products + Inventory</div>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="border border-[var(--border)] rounded-lg py-3">
            <div className="text-lg font-extrabold">{products.length}</div>
            <div className="text-[11px] text-[var(--muted)]">SKUs</div>
          </div>
          <div className="border border-[var(--border)] rounded-lg py-3">
            <div className="text-lg font-extrabold">{totalStockUnits}</div>
            <div className="text-[11px] text-[var(--muted)]">Units in stock</div>
          </div>
          <div className="border border-[var(--border)] rounded-lg py-3">
            <div className="text-lg font-extrabold">{products.filter(p => p.stock === 0).length}</div>
            <div className="text-[11px] text-[var(--muted)]">Out of stock</div>
          </div>
        </div>
      </div>
      <div className="bg-white border border-[var(--border)] rounded-xl p-10 text-center text-[var(--muted)]">
        <div className="text-3xl mb-2.5">📈</div>
        <div className="font-bold text-[14.5px] text-[var(--text)] mb-1">Trend charts render here</div>
        <div className="text-[12.5px] max-w-[340px] mx-auto">
          Sales-over-time and category breakdown charts plug in once the Analytics API returns
          time-series order data.
        </div>
      </div>
    </div>;
}
