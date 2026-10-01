export default function AisleColumn({
  aisle,
  shelves,
  isSelected,
  isDimmed,
  onSelect
}) {
  return <button onClick={() => onSelect(aisle)} className="group relative flex flex-col items-center bg-transparent border-0 p-0 cursor-pointer outline-none" style={{
    transformStyle: 'preserve-3d',
    transform: isSelected ? 'translateZ(120px) scale(1.18) translateY(-10px)' : 'translateZ(0px) scale(1)',
    opacity: isDimmed ? 0.35 : 1,
    filter: isDimmed ? 'saturate(0.5)' : 'none',
    transition: 'transform 0.5s cubic-bezier(.2,.8,.2,1), opacity 0.4s ease, filter 0.4s ease',
    zIndex: isSelected ? 20 : 1
  }}>
      <span className="mb-2 text-[11px] font-bold tracking-wide text-white/90 bg-black/25 px-2.5 py-1 rounded-full backdrop-blur-sm">
        {aisle.name}
      </span>

      <div className="flex flex-col-reverse gap-[3px] rounded-[6px] p-[3px]" style={{
      transformStyle: 'preserve-3d'
    }}>
        {shelves.map((shelf, i) => <div key={shelf.level} className="relative flex items-center justify-center text-[13px] font-bold text-white rounded-[3px]" style={{
        width: 58,
        height: 30,
        background: `linear-gradient(180deg, ${aisle.color}, ${shadeColor(aisle.color, -18)})`,
        boxShadow: `0 ${3 + i}px 0 0 ${shadeColor(aisle.color, -32)}, 0 6px 10px rgba(0,0,0,0.25)`,
        transform: `translateZ(${i * 2}px)`
      }}>
            {shelf.level}
            {shelf.outOfStock > 0 ? <span className="absolute -right-1 -top-1 w-2.5 h-2.5 rounded-full bg-red-600 ring-2 ring-white" /> : shelf.lowStock > 0 ? <span className="absolute -right-1 -top-1 w-2.5 h-2.5 rounded-full bg-amber-500 ring-2 ring-white" /> : null}
          </div>)}
      </div>

      <div className="mt-1 w-[64px] h-[10px] rounded-[50%] bg-black/30 blur-[2px]" style={{
      transform: 'scaleX(1.1)'
    }} />
    </button>;
}
function shadeColor(hex, percent) {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.min(255, Math.max(0, (num >> 16) + amt));
  const G = Math.min(255, Math.max(0, (num >> 8 & 0x00ff) + amt));
  const B = Math.min(255, Math.max(0, (num & 0x0000ff) + amt));
  return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`;
}
