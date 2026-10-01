import { useState } from 'react';
import { useStoreData } from '../context/StoreDataContext';
const steps = ['NEW', 'CONFIRMED', 'PREPARING', 'READY', 'COMPLETED'];
export default function Orders() {
  const {
    orders,
    updateOrderStatus
  } = useStoreData();
  const [focusedId, setFocusedId] = useState(orders[0]?.id ?? '');
  const focused = orders.find(o => o.id === focusedId) ?? orders[0];
  function statusClasses(status) {
    switch (status) {
      case 'READY':
      case 'COMPLETED':
        return 'bg-[#E6F6EC] text-[var(--green)]';
      case 'PREPARING':
        return 'bg-[#FCF1DE] text-[var(--amber)]';
      default:
        return 'bg-[#E5F1FA] text-[#1B6FA8]';
    }
  }
  return <div>
      {focused && <div className="bg-white border border-[var(--border)] rounded-xl p-5 mb-4">
          <div className="flex items-center justify-between mb-2.5">
            <div className="text-[14.5px] font-bold">
              Order {focused.id} — {focused.customer}
            </div>
            <span className={`text-[11px] font-semibold px-2.5 py-[3px] rounded-full ${statusClasses(focused.status)}`}>
              {focused.status}
            </span>
          </div>
          <div className="flex gap-1.5 mt-2">
            {steps.map(s => {
          const doneIdx = steps.indexOf(focused.status);
          const thisIdx = steps.indexOf(s);
          const done = thisIdx <= doneIdx;
          return <button key={s} onClick={() => updateOrderStatus(focused.id, s)} className={`flex-1 text-center text-[10.5px] font-semibold py-1.5 rounded-md transition-colors ${done ? 'bg-[var(--teal)] text-white' : 'bg-[#EEF2F6] text-[var(--muted)] hover:bg-[#e2e8ef]'}`}>
                  {s}
                </button>;
        })}
          </div>
          <div className="text-[11px] text-[var(--muted)] mt-2">Click a stage to update this order's status.</div>
        </div>}

      <div className="bg-white border border-[var(--border)] rounded-xl p-5">
        <div className="text-[14.5px] font-bold mb-3.5">All Orders</div>
        <table className="w-full text-[13px]">
          <thead>
            <tr className="text-[11.5px] text-[var(--muted)] font-semibold text-left border-b border-[var(--border)]">
              <th className="py-2">Order</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o => <tr key={o.id} className="border-b border-[var(--border)] last:border-0">
                <td className="py-2.5">{o.id}</td>
                <td>{o.customer}</td>
                <td>{o.items}</td>
                <td>₹{o.total}</td>
                <td>
                  <span className={`text-[11px] font-semibold px-2.5 py-[3px] rounded-full ${statusClasses(o.status)}`}>
                    {o.status}
                  </span>
                </td>
                <td>
                  <button onClick={() => setFocusedId(o.id)} className="text-[12px] font-semibold text-[var(--teal-dark)] hover:underline">
                    View
                  </button>
                </td>
              </tr>)}
          </tbody>
        </table>
      </div>
    </div>;
}
