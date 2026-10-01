const coreItems = [{
  key: 'layout',
  label: 'Store Layout',
  icon: '▦'
}, {
  key: 'dashboard',
  label: 'Dashboard',
  icon: '◱'
}, {
  key: 'store',
  label: 'Store Management',
  icon: '🏬'
}, {
  key: 'products',
  label: 'Products',
  icon: '📦'
}, {
  key: 'inventory',
  label: 'Inventory',
  icon: '📊'
}, {
  key: 'stock',
  label: 'Stock Management',
  icon: '🔄'
}, {
  key: 'offers',
  label: 'Offers',
  icon: '🏷️'
}, {
  key: 'orders',
  label: 'Orders',
  icon: '🧾'
}, {
  key: 'analytics',
  label: 'Analytics',
  icon: '📈'
}];
export default function Sidebar({
  active,
  onNavigate
}) {
  return <aside className="w-[240px] shrink-0 h-screen sticky top-0 flex flex-col text-[#DCE7F2]" style={{
    background: 'linear-gradient(180deg,var(--navy-deep),var(--navy-mid))'
  }}>
      <div className="flex items-center gap-2.5 px-[18px] py-5 border-b border-white/10">
        <div className="w-8 h-8 rounded-lg bg-[var(--teal)] flex items-center justify-center text-base">🛒</div>
        <div>
          <div className="font-extrabold text-white text-[16px] leading-tight">BridgeCart</div>
          <div className="text-[10.5px] text-[#8FAAC4] leading-tight">Owner Dashboard</div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2.5 py-3.5">
        <div className="text-[10.5px] font-semibold text-[#7593AF] px-3 pt-2 pb-1.5 tracking-wide">CORE</div>
        {coreItems.map(item => <div key={item.key} onClick={() => onNavigate(item.key)} className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13.5px] font-medium mb-0.5 cursor-pointer transition-colors ${active === item.key ? 'bg-[var(--teal)] text-white' : 'text-[#C4D5E5] hover:bg-white/10 hover:text-white'}`}>
            <span className="w-[18px] text-center text-sm opacity-90">{item.icon}</span>
            {item.label}
          </div>)}

        <div className="text-[10.5px] font-semibold text-[#7593AF] px-3 pt-4 pb-1.5 tracking-wide">MORE</div>
        {[{
        label: 'Customers',
        icon: '👥'
      }, {
        label: 'Reviews',
        icon: '⭐'
      }, {
        label: 'Notifications',
        icon: '🔔'
      }].map(item => <div key={item.label} className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13.5px] font-medium mb-0.5 text-[#C4D5E5] opacity-40">
            <span className="w-[18px] text-center text-sm">{item.icon}</span>
            {item.label}
            <span className="ml-auto text-[9px] bg-white/10 px-1.5 py-0.5 rounded-full font-semibold">Later</span>
          </div>)}
        <div onClick={() => onNavigate('settings')} className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13.5px] font-medium mb-0.5 cursor-pointer transition-colors ${active === 'settings' ? 'bg-[var(--teal)] text-white' : 'text-[#C4D5E5] hover:bg-white/10 hover:text-white'}`}>
          <span className="w-[18px] text-center text-sm opacity-90">⚙️</span>
          Settings
        </div>
      </div>

      <div className="flex items-center gap-2.5 px-[18px] py-3.5 border-t border-white/10">
        <div className="w-8 h-8 rounded-full bg-[var(--teal)] flex items-center justify-center text-white font-bold text-[12.5px]">
          RS
        </div>
        <div>
          <div className="text-[12.5px] font-semibold text-white leading-tight">Ramesh Sharma</div>
          <div className="text-[10.5px] text-[#8FAAC4] leading-tight">Lokmanya Super Market</div>
        </div>
      </div>
    </aside>;
}
