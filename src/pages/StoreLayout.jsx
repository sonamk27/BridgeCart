import { useState } from 'react';
import { useStoreData } from '../context/StoreDataContext';
import AisleColumn from '../components/AisleColumn';
import AisleDetailPanel from '../components/AisleDetailPanel';
import { fetchAisleDetail, sendLayoutSelection } from '../api/layoutApi';
const STORE_ID = 'lokmanya-101';
export default function StoreLayout({
  onNavigate,
  onReconfigure
}) {
  const {
    aisles,
    products,
    storeConfig
  } = useStoreData();
  const [selectedAisle, setSelectedAisle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [synced, setSynced] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  function shelvesFor(aisle) {
    return aisle.levels.map(level => {
      const here = products.filter(p => p.aisleId === aisle.id && p.shelfLevel === level);
      return {
        level,
        itemCount: here.length,
        lowStock: here.filter(p => p.stock > 0 && p.stock <= p.lowStockThreshold).length,
        outOfStock: here.filter(p => p.stock === 0).length
      };
    });
  }
  function productsFor(aisle) {
    return products.filter(p => p.aisleId === aisle.id);
  }
  async function handleSelect(aisle) {
    setSelectedAisle(aisle);
    setZoomed(true);
    setSynced(false);
    setLoading(true);
    await Promise.all([fetchAisleDetail(aisle), sendLayoutSelection(STORE_ID, aisle.id)]);
    setLoading(false);
    setSynced(true);
  }
  function handleClose() {
    setZoomed(false);
    setSelectedAisle(null);
    setSynced(false);
  }
  return <div className="flex gap-5 items-start">
      <div className="flex-1 min-w-0">
        <div className="bg-white border border-[var(--border)] rounded-xl p-5 mb-4 flex items-center justify-between flex-wrap gap-3">
          <div>
            <div className="text-[14.5px] font-bold">Lokmanya Super Market — Floor Plan</div>
            <div className="text-[12px] text-[var(--muted)] mt-0.5">
              Click a row to zoom in and view its shelf-level detail
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-bold text-[var(--navy-deep)] bg-[#EAF1F8] px-3 py-1.5 rounded-full">
              {storeConfig.rows} rows × {storeConfig.columns} shelves
            </span>
            {zoomed && <button onClick={handleClose} className="text-[12.5px] font-semibold border border-[var(--border)] rounded-lg px-3 py-2 hover:bg-gray-50">
                ↺ Zoom out
              </button>}
            <button onClick={onReconfigure} className="text-[12.5px] font-semibold border border-[var(--border)] rounded-lg px-3 py-2 hover:bg-gray-50">
              ⚙ Reconfigure
            </button>
          </div>
        </div>

        <div className="relative rounded-2xl overflow-hidden border border-[var(--border)]" style={{
        background: 'linear-gradient(160deg,#EAF1EC,#DCE8E0)',
        minHeight: 560
      }}>
          <Zone label="Dairy & Frozen" className="top-4 left-6" />
          <Zone label="Bakery" className="top-4 left-1/2 -translate-x-1/2" />
          <Zone label="Household" className="top-4 right-6" />
          <Zone label="Snacks & Beverages" className="top-1/2 left-3 -translate-y-1/2 -rotate-90 origin-left" />
          <Zone label="Personal Care" className="top-1/2 right-3 -translate-y-1/2 rotate-90 origin-right" />
          <Zone label="Fruits & Vegetables" className="bottom-5 left-6" />
          <div className="absolute bottom-5 right-6 text-[11px] font-bold bg-[var(--navy-deep)] text-white px-3 py-1.5 rounded-md">
            Billing Counter
          </div>

          <div className="perspective-scene flex items-center justify-center overflow-x-auto" style={{
          minHeight: 560
        }}>
            <div className="flex gap-8 px-16" style={{
            transformStyle: 'preserve-3d',
            transform: 'rotateX(38deg)',
            transition: 'transform 0.5s ease'
          }}>
              {aisles.map(aisle => <AisleColumn key={aisle.id} aisle={aisle} shelves={shelvesFor(aisle)} isSelected={selectedAisle?.id === aisle.id} isDimmed={zoomed && selectedAisle?.id !== aisle.id} onSelect={handleSelect} />)}
            </div>
          </div>

          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 text-[11px] font-semibold text-[var(--navy-deep)]">
            <span className="text-base">↑</span> Entrance / Exit
          </div>
        </div>

        <div className="mt-3 text-[11.5px] text-[var(--muted)] flex items-center gap-1.5">
          <span>ⓘ</span> Shelf counts and low/out-of-stock dots come live from your Product data — add or edit
          products to see this floor plan update.
        </div>
      </div>

      <AisleDetailPanel aisle={selectedAisle} shelves={selectedAisle ? shelvesFor(selectedAisle) : []} aisleProducts={selectedAisle ? productsFor(selectedAisle) : []} loading={loading} synced={synced} onClose={handleClose} onEditAisle={() => onNavigate('products')} />
    </div>;
}
function Zone({
  label,
  className
}) {
  return <div className={`absolute text-[11px] font-bold text-[var(--navy-deep)] bg-white/70 backdrop-blur-sm px-2.5 py-1 rounded-md ${className}`}>
      {label}
    </div>;
}
