export default function Modal({
  title,
  onClose,
  children,
  width = 480
}) {
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px]" onClick={onClose}>
      <div className="bg-white rounded-xl p-5 max-h-[85vh] overflow-y-auto" style={{
      width
    }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <div className="text-[15px] font-bold">{title}</div>
          <button onClick={onClose} className="text-[var(--muted)] hover:text-[var(--text)] text-sm w-7 h-7 rounded-full hover:bg-gray-100 flex items-center justify-center">
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>;
}
