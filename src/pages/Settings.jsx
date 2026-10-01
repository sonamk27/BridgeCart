export default function Settings() {
  return <div className="bg-white border border-[var(--border)] rounded-xl p-5">
      <div className="text-[14.5px] font-bold mb-4">Account Settings</div>
      <div className="grid grid-cols-2 gap-3.5">
        <Field label="Owner Name" defaultValue="Ramesh Sharma" />
        <Field label="Email" defaultValue="ramesh@lokmanya.in" />
        <Field label="Change Password" type="password" placeholder="••••••••" />
        <Field label="Confirm Password" type="password" placeholder="••••••••" />
      </div>
    </div>;
}
function Field({
  label,
  defaultValue,
  type = 'text',
  placeholder
}) {
  return <div>
      <label className="block text-[12px] font-semibold text-[var(--muted)] mb-1.5">{label}</label>
      <input type={type} defaultValue={defaultValue} placeholder={placeholder} className="w-full border border-[var(--border)] rounded-lg px-3 py-2.5 text-[13px]" />
    </div>;
}
