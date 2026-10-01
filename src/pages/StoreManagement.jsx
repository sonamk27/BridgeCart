export default function StoreManagement() {
  return <div className="bg-white border border-[var(--border)] rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="text-[14.5px] font-bold">Store Information</div>
        <button className="bg-[var(--teal)] text-white text-[13px] font-semibold px-4 py-2 rounded-lg">
          Save changes
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3.5">
        <Field label="Store Name" defaultValue="Lokmanya Super Market" />
        <Field label="Contact Number" defaultValue="+91 98220 XXXXX" />
        <Field label="Address" defaultValue="Shop 4, Lokmanya Nagar, Sholapur, Maharashtra" full />
        <Field label="Opening Time" defaultValue="08:00 AM" />
        <Field label="Closing Time" defaultValue="10:00 PM" />
        <div className="col-span-2">
          <label className="block text-[12px] font-semibold text-[var(--muted)] mb-1.5">Description</label>
          <textarea className="w-full border border-[var(--border)] rounded-lg px-3 py-2.5 text-[13px]" rows={3} defaultValue="Your neighborhood supermarket for daily essentials, groceries, and household needs." />
        </div>
        <div>
          <label className="block text-[12px] font-semibold text-[var(--muted)] mb-1.5">Status</label>
          <div className="flex gap-2">
            <span className="border border-[var(--navy-deep)] bg-[var(--navy-deep)] text-white text-[12.5px] font-semibold px-3 py-1.5 rounded-full">
              Active
            </span>
            <span className="border border-[var(--border)] text-[12.5px] font-semibold px-3 py-1.5 rounded-full">
              Inactive
            </span>
          </div>
        </div>
      </div>
    </div>;
}
function Field({
  label,
  defaultValue,
  full
}) {
  return <div className={full ? 'col-span-2' : ''}>
      <label className="block text-[12px] font-semibold text-[var(--muted)] mb-1.5">{label}</label>
      <input className="w-full border border-[var(--border)] rounded-lg px-3 py-2.5 text-[13px]" defaultValue={defaultValue} />
    </div>;
}
