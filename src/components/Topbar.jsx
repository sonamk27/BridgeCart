export default function Topbar({
  title,
  subtitle
}) {
  return <div className="bg-white border-b border-[var(--border)] px-7 py-4 flex items-center justify-between">
      <div>
        <div className="text-[19px] font-bold">{title}</div>
        <div className="text-[12.5px] text-[var(--muted)] mt-0.5">{subtitle}</div>
      </div>
      <div className="flex items-center gap-2 border border-[var(--border)] px-3 py-1.5 rounded-lg text-[13px] font-semibold bg-white">
        🏪 Lokmanya Super Market ▾
      </div>
    </div>;
}
