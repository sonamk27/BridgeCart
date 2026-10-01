export default function StatCard({
  label,
  value,
  delta,
  deltaClass = ''
}) {
  return <div className="bg-white border border-[var(--border)] rounded-xl p-[18px]">
      <div className="text-[12px] font-semibold text-[var(--muted)]">{label}</div>
      <div className="text-[24px] font-extrabold mt-1.5">{value}</div>
      {delta && <div className={`text-[11.5px] font-semibold mt-1.5 ${deltaClass}`}>{delta}</div>}
    </div>;
}
