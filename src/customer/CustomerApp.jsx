import { useState, useMemo } from 'react';
import { useCustomer } from './CustomerContext';
import { useStoreData } from '../context/StoreDataContext';
import ProductCard from './ProductCard';
import ProductDetailModal from './ProductDetailModal';
import CustomerStoreMap from './CustomerStoreMap';
import CartDrawer from './CartDrawer';
import CustomerAuthModal from './CustomerAuthModal';
import QRScannerModal from './QRScannerModal';
import VoiceSearchModal from './VoiceSearchModal';
import CommunityWalletModal from './CommunityWalletModal';
import CheckoutModal from './CheckoutModal';
import DigitalReceiptModal from './DigitalReceiptModal';
import CustomerOrderHistory from './CustomerOrderHistory';

const CATEGORIES = [
  'All',
  'Food Grains',
  'Dairy',
  'Snacks',
  'Beverages',
  'Personal Care',
  'Cleaning',
  'Household',
  'Cosmetics',
  'Baby Care'
];

export default function CustomerApp({ onExitToLanding }) {
  const {
    auth,
    session,
    cartItemCount,
    activeModal,
    setActiveModal,
    selectedProduct,
    setSelectedProduct,
    mapTargetProduct,
    setMapTargetProduct,
    beneficiary,
    lastReceipt
  } = useCustomer();

  const { products, offers } = useStoreData();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filterEssentialsOnly, setFilterEssentialsOnly] = useState(false);
  const [filterInStockOnly, setFilterInStockOnly] = useState(false);

  // Active Bottom Tab: 'home' | 'map' | 'wallet' | 'orders'
  const [activeTab, setActiveTab] = useState('home');

  // Receipt being viewed in history
  const [viewingReceipt, setViewingReceipt] = useState(null);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // Category filter
      if (selectedCategory !== 'All' && p.category !== selectedCategory) {
        return false;
      }
      // Essentials filter
      if (filterEssentialsOnly && !p.isEssential) {
        return false;
      }
      // In stock filter
      if (filterInStockOnly && p.stock <= 0) {
        return false;
      }
      // Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesBrand = p.brand && p.brand.toLowerCase().includes(q);
        const matchesCat = p.category && p.category.toLowerCase().includes(q);
        const matchesAisle = p.aisleId && p.aisleId.toLowerCase().includes(q);
        if (!matchesName && !matchesBrand && !matchesCat && !matchesAisle) {
          return false;
        }
      }
      return true;
    });
  }, [products, selectedCategory, filterEssentialsOnly, filterInStockOnly, searchQuery]);

  function handleLocateOnMap(product) {
    setMapTargetProduct(product);
    setActiveTab('map');
  }

  function handleOpenDetail(product) {
    setSelectedProduct(product);
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] flex flex-col">
      
      {/* ===================== TOP HEADER ===================== */}
      <header className="bg-white border-b border-[var(--border)] sticky top-0 z-30 shadow-xs">
        
        {/* Upper Brand & Session Status Bar */}
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between gap-4">
          
          {/* Logo, Store Name & Exit Button */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={onExitToLanding}
              className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-xl text-xs font-bold transition-colors shrink-0 cursor-pointer"
              title="Return to Home / Owner Dashboard"
            >
              <span>←</span>
              <span className="hidden sm:inline">Exit to Dashboard</span>
            </button>

            <div className="h-6 w-px bg-slate-200 hidden sm:block" />

            <div className="w-10 h-10 rounded-xl bg-[var(--teal)] text-white flex items-center justify-center text-xl shrink-0 shadow-xs">
              🛒
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-[17px] text-[var(--navy-deep)] leading-tight">
                  BridgeCart
                </span>
                <span className="text-[10.5px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-teal-50 text-[var(--teal-dark)] border border-teal-200">
                  Customer Portal
                </span>
              </div>
              <div className="text-[12px] text-[var(--muted)] truncate">
                {session.store?.name} • {session.store?.branch?.split('-')[0]}
              </div>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <div className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-2xl border border-slate-200">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-3.5 py-1.5 rounded-xl text-[12.5px] font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'home'
                  ? 'bg-white text-[var(--teal-dark)] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>🏪</span> Home
            </button>
            <button
              onClick={() => setActiveTab('map')}
              className={`px-3.5 py-1.5 rounded-xl text-[12.5px] font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'map'
                  ? 'bg-white text-[var(--teal-dark)] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>🗺️</span> Store Map
            </button>
            <button
              onClick={() => setActiveTab('wallet')}
              className={`px-3.5 py-1.5 rounded-xl text-[12.5px] font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'wallet'
                  ? 'bg-white text-[var(--teal-dark)] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>🌾</span> Community Wallet
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-3.5 py-1.5 rounded-xl text-[12.5px] font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'orders'
                  ? 'bg-white text-[var(--teal-dark)] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>🧾</span> History
            </button>
          </div>

          {/* Session Timer & Profile & Cart */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* QR Session Pill */}
            <button
              onClick={() => setActiveModal('qr_scanner')}
              className={`px-3.5 py-1.5 rounded-full text-[11.5px] font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
                session.isActive
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 shadow-2xs'
                  : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 animate-pulse'
              }`}
              title="Click to manage store QR session"
            >
              <span>{session.isActive ? '🟢' : '🔴'}</span>
              <span>{session.isActive ? `${session.minutesRemaining}m left` : 'Scan QR'}</span>
            </button>

            {/* Cart trigger button */}
            <button
              onClick={() => setActiveModal('cart')}
              className="relative p-2.5 rounded-xl bg-slate-100 hover:bg-teal-50 hover:text-[var(--teal-dark)] text-slate-700 transition-colors cursor-pointer border border-slate-200"
              title="View cart"
            >
              <span className="text-lg">🛍️</span>
              {cartItemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[var(--teal)] text-white text-[10.5px] font-extrabold flex items-center justify-center shadow-xs">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* Profile Avatar */}
            <button
              onClick={() => setActiveModal('auth')}
              className="flex items-center gap-2 pl-1.5 pr-3 py-1 rounded-xl hover:bg-slate-100 transition-colors border border-slate-200 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-[var(--navy-deep)] text-white font-bold text-xs flex items-center justify-center">
                {auth.isGuest ? 'G' : auth.user?.name?.charAt(0) || 'U'}
              </div>
              <div className="text-left hidden lg:block">
                <div className="text-[12px] font-bold text-slate-800 leading-tight">
                  {auth.isGuest ? 'Guest Shopper' : auth.user?.name}
                </div>
                <div className="text-[10px] text-slate-400">
                  {auth.isGuest ? 'Tap to login' : 'Account'}
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Search Bar & Voice Search Full Width Bar */}
        <div className="w-full bg-slate-50/70 border-t border-slate-100 py-3">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 flex items-center gap-3">
            <div className="flex-1 relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                🔍
              </span>
              <input
                type="text"
                placeholder="Search products in this store (e.g. 'milk', 'atta', 'tata salt')…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-8 py-2.5 bg-white border border-[var(--border)] rounded-xl text-[13.5px] focus:outline-[var(--teal)] shadow-2xs font-medium placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-xs w-5 h-5 flex items-center justify-center rounded-full hover:bg-slate-100 cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Voice Search Button */}
            <button
              onClick={() => setActiveModal('voice')}
              className="px-4 py-2.5 bg-white hover:bg-teal-50 border border-[var(--border)] hover:border-teal-300 text-slate-700 rounded-xl transition-all shadow-2xs flex items-center gap-2 group shrink-0 cursor-pointer"
              title="Voice Search"
            >
              <span className="text-base group-hover:scale-110 transition-transform">🎙️</span>
              <span className="text-[12px] font-bold text-[var(--teal-dark)]">
                Voice Search
              </span>
            </button>
          </div>
        </div>
      </header>

        {/* ===================== INACTIVE SESSION WARNING BANNER ===================== */}
        {!session.isActive && (
          <div className="bg-amber-500 text-white px-4 py-2.5 text-center text-[12.5px] font-bold flex items-center justify-center gap-2">
            <span>⚠️</span>
            <span>Your store session has expired.</span>
            <button
              onClick={() => setActiveModal('qr_scanner')}
              className="underline hover:opacity-90 font-extrabold ml-1 cursor-pointer"
            >
              Scan Store Entrance QR to Reconnect →
            </button>
          </div>
        )}

        {/* ===================== MAIN CONTENT TABS ===================== */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-8 py-6 space-y-6">
          
          {/* TAB 1: HOME & STORE BROWSING */}
          {activeTab === 'home' && (
            <div className="space-y-5">
              
              {/* Quick Actions Shortcuts */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <button
                  onClick={() => setActiveTab('map')}
                  className="p-3 bg-white rounded-2xl border border-[var(--border)] hover:border-[var(--teal)] hover:bg-teal-50/40 text-left transition-all shadow-2xs flex items-center gap-3 cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-xl bg-teal-50 text-[var(--teal-dark)] group-hover:bg-[var(--teal)] group-hover:text-white flex items-center justify-center text-xl transition-colors shrink-0">
                    🗺️
                  </div>
                  <div className="min-w-0">
                    <div className="font-extrabold text-[13px] text-gray-900 leading-tight">Store Map</div>
                    <div className="text-[11px] text-[var(--muted)]">Find row & shelf</div>
                  </div>
                </button>

                <button
                  onClick={() => setActiveModal('wallet')}
                  className="p-3 bg-white rounded-2xl border border-[var(--border)] hover:border-emerald-500 hover:bg-emerald-50/40 text-left transition-all shadow-2xs flex items-center gap-3 cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center text-xl transition-colors shrink-0">
                    🌾
                  </div>
                  <div className="min-w-0">
                    <div className="font-extrabold text-[13px] text-gray-900 leading-tight">Community Wallet</div>
                    <div className="text-[11px] text-emerald-700 font-semibold">
                      {beneficiary.status === 'APPROVED' ? `₹${beneficiary.walletBalance} Grant` : 'Apply / Status'}
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setActiveModal('qr_scanner')}
                  className="p-3 bg-white rounded-2xl border border-[var(--border)] hover:border-blue-500 hover:bg-blue-50/40 text-left transition-all shadow-2xs flex items-center gap-3 cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center text-xl transition-colors shrink-0">
                    📷
                  </div>
                  <div className="min-w-0">
                    <div className="font-extrabold text-[13px] text-gray-900 leading-tight">Store Entry QR</div>
                    <div className="text-[11px] text-[var(--muted)]">Scan & session</div>
                  </div>
                </button>

                <button
                  onClick={() => setActiveModal('history')}
                  className="p-3 bg-white rounded-2xl border border-[var(--border)] hover:border-purple-500 hover:bg-purple-50/40 text-left transition-all shadow-2xs flex items-center gap-3 cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 group-hover:bg-purple-600 group-hover:text-white flex items-center justify-center text-xl transition-colors shrink-0">
                    🧾
                  </div>
                  <div className="min-w-0">
                    <div className="font-extrabold text-[13px] text-gray-900 leading-tight">Shopping History</div>
                    <div className="text-[11px] text-[var(--muted)]">Past receipts & exit pass</div>
                  </div>
                </button>
              </div>

              {/* Active Offers Banner Carousel */}
              {offers && offers.length > 0 && !searchQuery && (
                <div className="bg-gradient-to-r from-[var(--navy-deep)] via-[var(--navy-mid)] to-teal-900 rounded-3xl p-5 text-white shadow-md relative overflow-hidden">
                  <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <span className="bg-amber-400 text-slate-950 text-[10.5px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        Today's In-Store Offers
                      </span>
                      <h3 className="font-extrabold text-[18px] sm:text-[20px] mt-1.5 leading-tight">
                        Save Up to 20% on Daily Staples
                      </h3>
                      <p className="text-[12.5px] text-teal-100/90 mt-1 max-w-md">
                        Discounts automatically applied at billing. Spot offer banners on shelf tags in Row 1 & Row 3.
                      </p>
                    </div>

                    <div className="flex gap-2 shrink-0">
                      {offers.map(offer => (
                        <div
                          key={offer.id}
                          className="bg-white/10 backdrop-blur-md border border-white/20 p-2.5 rounded-2xl text-center min-w-[110px]"
                        >
                          <div className="font-black text-amber-300 text-base">{offer.discountPct}% OFF</div>
                          <div className="text-[11px] font-semibold text-white truncate max-w-[110px]">
                            {offer.productName}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Category Pills & Filters */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-[13.5px] text-[var(--navy-deep)]">
                    Browse Categories
                  </span>
                  
                  {/* Toggle filters */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setFilterEssentialsOnly(!filterEssentialsOnly)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold border transition-all flex items-center gap-1 ${
                        filterEssentialsOnly
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-white text-emerald-800 border-emerald-200 hover:bg-emerald-50'
                      }`}
                    >
                      <span>🌾</span> Essentials Only
                    </button>
                    <button
                      onClick={() => setFilterInStockOnly(!filterInStockOnly)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold border transition-all ${
                        filterInStockOnly
                          ? 'bg-[var(--navy-deep)] text-white border-[var(--navy-deep)] shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      In Stock Only
                    </button>
                  </div>
                </div>

                {/* Horizontal Category Scroll */}
                <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                  {CATEGORIES.map(cat => {
                    const isSelected = selectedCategory === cat;
                    return (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3.5 py-1.5 rounded-xl text-[12px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[var(--teal)] text-white shadow-xs'
                            : 'bg-white border border-[var(--border)] text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Product Catalog Grid */}
              <div>
                <div className="flex items-center justify-between mb-3 text-[12px] text-[var(--muted)]">
                  <div>
                    Showing <strong className="text-gray-900">{filteredProducts.length}</strong> items in{' '}
                    <strong className="text-gray-900">{session.store?.name}</strong>
                    {searchQuery && <span> matching “{searchQuery}”</span>}
                  </div>
                  {(searchQuery || selectedCategory !== 'All' || filterEssentialsOnly || filterInStockOnly) && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('All');
                        setFilterEssentialsOnly(false);
                        setFilterInStockOnly(false);
                      }}
                      className="text-[var(--teal-dark)] font-bold hover:underline"
                    >
                      Reset Filters
                    </button>
                  )}
                </div>

                {filteredProducts.length === 0 ? (
                  <div className="p-12 text-center bg-white rounded-3xl border border-[var(--border)] space-y-3">
                    <div className="text-4xl">🔍</div>
                    <div className="font-extrabold text-[16px] text-gray-800">
                      No products found
                    </div>
                    <p className="text-[12.5px] text-[var(--muted)] max-w-sm mx-auto">
                      We couldn't find any products matching your criteria in this store. Try searching for "Milk", "Atta", or "Salt".
                    </p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('All');
                        setFilterEssentialsOnly(false);
                        setFilterInStockOnly(false);
                      }}
                      className="bg-[var(--teal)] text-white text-[12.5px] font-bold px-4 py-2 rounded-xl"
                    >
                      Clear Search & Show All
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {filteredProducts.map(product => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onOpenDetail={handleOpenDetail}
                        onLocateOnMap={handleLocateOnMap}
                      />
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 2: SMART STORE NAVIGATION MAP */}
          {activeTab === 'map' && (
            <div className="space-y-4">
              <CustomerStoreMap
                targetProduct={mapTargetProduct}
                onSelectProduct={handleOpenDetail}
                onClose={() => setMapTargetProduct(null)}
              />
            </div>
          )}

          {/* TAB 3: COMMUNITY WALLET VIEW */}
          {activeTab === 'wallet' && (
            <div className="space-y-4">
              <div className="bg-white rounded-3xl p-5 border border-[var(--border)] shadow-xs">
                <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
                  <div>
                    <h3 className="font-extrabold text-[17px] text-[var(--navy-deep)] flex items-center gap-2">
                      <span>🌾</span> Community Wallet Overview
                    </h3>
                    <p className="text-[12px] text-[var(--muted)]">
                      Ration card integration and monthly essential grocery benefits
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveModal('wallet')}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[12.5px] px-4 py-2 rounded-xl shadow-xs transition-colors"
                  >
                    Open Full Wallet Portal →
                  </button>
                </div>

                <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl">
                    <span className="text-[11px] font-bold text-emerald-800 uppercase">Available Balance</span>
                    <div className="text-2xl font-black text-emerald-950 mt-1">₹{beneficiary.walletBalance}</div>
                    <div className="text-[11px] text-emerald-700 mt-0.5">Renewed monthly</div>
                  </div>

                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
                    <span className="text-[11px] font-bold text-slate-500 uppercase">Beneficiary Name</span>
                    <div className="text-base font-extrabold text-slate-900 mt-1">{beneficiary.familyHead}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">Card: {beneficiary.rationCardNumber}</div>
                  </div>

                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
                    <span className="text-[11px] font-bold text-slate-500 uppercase">Status</span>
                    <div className="text-base font-extrabold text-emerald-700 mt-1 flex items-center gap-1">
                      <span>✓</span> {beneficiary.status}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">Category: {beneficiary.category}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ORDERS HISTORY */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <CustomerOrderHistory
                onClose={() => setActiveTab('home')}
                onSelectReceipt={receipt => {
                  setViewingReceipt(receipt);
                  setActiveModal('receipt');
                }}
              />
            </div>
          )}

        </main>

        {/* ===================== BOTTOM NAVIGATION BAR (MOBILE ONLY) ===================== */}
        <nav className="md:hidden bg-white border-t border-[var(--border)] px-4 py-2 flex items-center justify-around shrink-0 z-20 shadow-lg sticky bottom-0">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center py-1 px-3 rounded-xl transition-colors cursor-pointer ${
              activeTab === 'home'
                ? 'text-[var(--teal-dark)] font-extrabold'
                : 'text-gray-500 hover:text-gray-900 font-semibold'
            }`}
          >
            <span className="text-lg">🏪</span>
            <span className="text-[10.5px]">Home</span>
          </button>

          <button
            onClick={() => setActiveTab('map')}
            className={`flex flex-col items-center py-1 px-3 rounded-xl transition-colors cursor-pointer ${
              activeTab === 'map'
                ? 'text-[var(--teal-dark)] font-extrabold'
                : 'text-gray-500 hover:text-gray-900 font-semibold'
            }`}
          >
            <span className="text-lg">🗺️</span>
            <span className="text-[10.5px]">Store Map</span>
          </button>

          <button
            onClick={() => setActiveTab('wallet')}
            className={`flex flex-col items-center py-1 px-3 rounded-xl transition-colors cursor-pointer ${
              activeTab === 'wallet'
                ? 'text-[var(--teal-dark)] font-extrabold'
                : 'text-gray-500 hover:text-gray-900 font-semibold'
            }`}
          >
            <span className="text-lg">🌾</span>
            <span className="text-[10.5px]">Wallet</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex flex-col items-center py-1 px-3 rounded-xl transition-colors cursor-pointer ${
              activeTab === 'orders'
                ? 'text-[var(--teal-dark)] font-extrabold'
                : 'text-gray-500 hover:text-gray-900 font-semibold'
            }`}
          >
            <span className="text-lg">🧾</span>
            <span className="text-[10.5px]">Receipts</span>
          </button>

          <button
            onClick={() => setActiveModal('cart')}
            className="relative flex flex-col items-center py-1 px-3 rounded-xl text-gray-500 hover:text-[var(--teal-dark)] transition-colors cursor-pointer font-semibold"
          >
            <span className="text-lg">🛒</span>
            <span className="text-[10.5px]">Cart</span>
            {cartItemCount > 0 && (
              <span className="absolute top-0 right-1 w-4 h-4 rounded-full bg-[var(--teal)] text-white text-[9.5px] font-black flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </button>
        </nav>

      {/* ===================== MODALS ===================== */}

      {/* 1. Auth / Profile Modal */}
      {activeModal === 'auth' && (
        <CustomerAuthModal onClose={() => setActiveModal(null)} />
      )}

      {/* 2. QR Scanner Modal */}
      {activeModal === 'qr_scanner' && (
        <QRScannerModal onClose={() => setActiveModal(null)} />
      )}

      {/* 3. Voice Search Modal */}
      {activeModal === 'voice' && (
        <VoiceSearchModal
          onQuerySelect={query => {
            setSearchQuery(query);
            setActiveTab('home');
          }}
          onClose={() => setActiveModal(null)}
        />
      )}

      {/* 4. Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onLocateOnMap={handleLocateOnMap}
        />
      )}

      {/* 5. Cart Drawer */}
      {activeModal === 'cart' && (
        <CartDrawer
          onClose={() => setActiveModal(null)}
          onProceedToCheckout={() => setActiveModal('checkout')}
        />
      )}

      {/* 6. Checkout Modal */}
      {activeModal === 'checkout' && (
        <CheckoutModal
          onClose={() => setActiveModal(null)}
          onPaymentSuccess={receipt => {
            setViewingReceipt(receipt);
            setActiveModal('receipt');
          }}
        />
      )}

      {/* 7. Community Wallet Modal */}
      {activeModal === 'wallet' && (
        <CommunityWalletModal onClose={() => setActiveModal(null)} />
      )}

      {/* 8. Digital Receipt Modal */}
      {activeModal === 'receipt' && (
        <DigitalReceiptModal
          receipt={viewingReceipt || lastReceipt}
          onClose={() => {
            setViewingReceipt(null);
            setActiveModal(null);
          }}
          onOpenHistory={() => setActiveModal('history')}
        />
      )}

      {/* 9. Order History Modal */}
      {activeModal === 'history' && (
        <CustomerOrderHistory
          onClose={() => setActiveModal(null)}
          onSelectReceipt={receipt => {
            setViewingReceipt(receipt);
            setActiveModal('receipt');
          }}
        />
      )}

    </div>
  );
}
