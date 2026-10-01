import StatCard from '../components/StatCard';
import { useStoreData } from '../context/StoreDataContext';
export default function Dashboard({
  onNavigate
}) {
  const {
    orders,
    products,
    totalSales,
    totalOrders,
    lowStockCount,
    activeOffersCount
  } = useStoreData();
  const recentOrders = orders.slice(0, 4);
  const lowStockProducts = products.filter(p => p.stock <= p.lowStockThreshold).sort((a, b) => a.stock - b.stock).slice(0, 4);
  return <div>
      <div className="grid grid-cols-4 gap-4 mb-5">
        <StatCard label="Total Sales" value={`₹${totalSales.toLocaleString('en-IN')}`} delta="From all recorded orders" deltaClass="text-[var(--green)]" />
        <StatCard label="Total Orders" value={String(totalOrders)} delta={`${orders.filter(o => o.status !== 'COMPLETED').length} in progress`} deltaClass="text-[var(--green)]" />
        <StatCard label="Low Stock Items" value={String(lowStockCount)} delta="Needs restock" deltaClass="text-[var(--amber)]" />
        <StatCard label="Active Offers" value={String(activeOffersCount)} delta="Currently running" />
      </div>

      <div className="grid grid-cols-[1.4fr_1fr] gap-4 mb-5">
        <div className="bg-white border border-[var(--border)] rounded-xl p-5">
          <div className="flex items-center justify-between mb-3.5">
            <div className="text-[14.5px] font-bold">Recent Orders</div>
            <div onClick={() => onNavigate('orders')} className="text-[12.5px] font-semibold text-[var(--teal-dark)] cursor-pointer">
              View all
            </div>
          </div>
          <table className="w-full text-[13px]">
            <thead>
              <tr className="text-[11.5px] text-[var(--muted)] font-semibold text-left border-b border-[var(--border)]">
                <th className="py-2">Order</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(o => <tr key={o.id} className="border-b border-[var(--border)] last:border-0">
                  <td className="py-2.5">{o.id}</td>
                  <td>{o.customer}</td>
                  <td>{o.items}</td>
                  <td>₹{o.total}</td>
                  <td>
                    <StatusBadge status={o.status} />
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>

        <div className="bg-white border border-[var(--border)] rounded-xl p-5">
          <div className="flex items-center justify-between mb-3.5">
            <div className="text-[14.5px] font-bold">Low Stock Alerts</div>
            <div onClick={() => onNavigate('inventory')} className="text-[12.5px] font-semibold text-[var(--teal-dark)] cursor-pointer">
              Manage
            </div>
          </div>
          {lowStockProducts.length === 0 ? <div className="text-[13px] text-[var(--muted)] py-6 text-center">All products are well stocked.</div> : <table className="w-full text-[13px]">
              <tbody>
                {lowStockProducts.map(p => <tr key={p.id} className="border-b border-[var(--border)] last:border-0">
                    <td className="py-2.5">{p.name}</td>
                    <td className="text-right">
                      <span className={`text-[11px] font-semibold px-2.5 py-[3px] rounded-full ${p.stock === 0 ? 'bg-[#FBEAE9] text-[var(--red)]' : 'bg-[#FCF1DE] text-[var(--amber)]'}`}>
                        {p.stock} units
                      </span>
                    </td>
                  </tr>)}
              </tbody>
            </table>}
        </div>
      </div>

      <div className="bg-white border border-[var(--border)] rounded-xl p-5">
        <div className="text-[14.5px] font-bold mb-3.5">Product Catalog Snapshot</div>
        <table className="w-full text-[13px]">
          <thead>
            <tr className="text-[11.5px] text-[var(--muted)] font-semibold text-left border-b border-[var(--border)]">
              <th className="py-2">Product</th>
              <th>Category</th>
              <th>Stock</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {products.slice(0, 5).map(p => <tr key={p.id} className="border-b border-[var(--border)] last:border-0">
                <td className="py-2.5">{p.name}</td>
                <td>{p.category}</td>
                <td>{p.stock}</td>
                <td>₹{p.price}</td>
              </tr>)}
          </tbody>
        </table>
      </div>
    </div>;
}
function StatusBadge({
  status
}) {
  const map = {
    NEW: 'bg-[#E5F1FA] text-[#1B6FA8]',
    CONFIRMED: 'bg-[#E5F1FA] text-[#1B6FA8]',
    PREPARING: 'bg-[#FCF1DE] text-[var(--amber)]',
    READY: 'bg-[#E6F6EC] text-[var(--green)]',
    COMPLETED: 'bg-[#E6F6EC] text-[var(--green)]'
  };
  return <span className={`text-[11px] font-semibold px-2.5 py-[3px] rounded-full ${map[status] || ''}`}>
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>;
}
