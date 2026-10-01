import { useStoreData } from '../context/StoreDataContext';
export default function Offers() {
  const {
    offers
  } = useStoreData();
  return <div className="bg-white border border-[var(--border)] rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="text-[14.5px] font-bold">Active Offers</div>
        <button className="bg-[var(--teal)] text-white text-[13px] font-semibold px-4 py-2 rounded-lg">
          + Create Offer
        </button>
      </div>
      <div className="flex flex-col gap-2.5">
        {offers.map(o => <div key={o.id} className="flex items-center justify-between border border-[var(--border)] rounded-lg p-3.5">
            <div>
              <div className="font-bold text-[13.5px]">{o.productName}</div>
              <div className="text-[12px] text-[var(--muted)]">
                Valid {o.startDate} – {o.endDate}
              </div>
            </div>
            <div className="bg-[#FBEAE9] text-[var(--red)] font-bold text-[12px] px-2.5 py-1 rounded-md">
              {o.discountPct}% OFF
            </div>
          </div>)}
      </div>
    </div>;
}
