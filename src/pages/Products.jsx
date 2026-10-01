import { useRef, useState } from 'react';
import { useStoreData } from '../context/StoreDataContext';
import Modal from '../components/Modal';
import ProductForm from '../components/ProductForm';
import { parseProductExcel } from '../utils/excelImport';
export default function Products() {
  const {
    products,
    aisles,
    addProduct,
    addProductsBulk,
    editProduct
  } = useStoreData();
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState(null);
  const [importMsg, setImportMsg] = useState(null);
  const fileInputRef = useRef(null);
  function aisleLabel(p) {
    if (!p.aisleId) return '—';
    const aisle = aisles.find(a => a.id === p.aisleId);
    return aisle ? `${aisle.name}${p.shelfLevel ? ' · ' + p.shelfLevel : ''}` : '—';
  }
  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const rows = await parseProductExcel(file, aisles);
      if (rows.length === 0) {
        setImportMsg('No valid rows found. Expecting columns like Name, Category, Brand, SKU, Price, Stock, Aisle, Shelf.');
      } else {
        const count = addProductsBulk(rows);
        setImportMsg(`Imported ${count} product${count === 1 ? '' : 's'} from "${file.name}".`);
      }
    } catch (err) {
      setImportMsg('Could not read that file. Please upload a .xlsx or .csv file.');
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
      setTimeout(() => setImportMsg(null), 6000);
    }
  }
  return <div className="bg-white border border-[var(--border)] rounded-xl p-5">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div>
          <div className="text-[14.5px] font-bold">Products</div>
          <div className="text-[12px] text-[var(--muted)] mt-0.5">{products.length} products in catalog</div>
        </div>
        <div className="flex items-center gap-2">
          <input ref={fileInputRef} type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={handleFile} />
          <button onClick={() => fileInputRef.current?.click()} className="border border-[var(--border)] text-[13px] font-semibold px-4 py-2 rounded-lg hover:bg-gray-50">
            ⬆ Upload Excel
          </button>
          <button onClick={() => setShowAdd(true)} className="bg-[var(--teal)] text-white text-[13px] font-semibold px-4 py-2 rounded-lg hover:bg-[var(--teal-dark)]">
            + Add Product
          </button>
        </div>
      </div>

      {importMsg && <div className="mb-4 text-[12.5px] font-semibold bg-[#E5F1FA] text-[#1B6FA8] px-3.5 py-2.5 rounded-lg">
          {importMsg}
        </div>}

      <div className="mb-4 text-[11.5px] text-[var(--muted)]">
        Excel columns recognized: <b>Name</b>, Category, Brand, SKU, Price, Stock, Aisle (e.g. "Row 1"), Shelf (e.g. "A").
      </div>

      <table className="w-full text-[13px]">
        <thead>
          <tr className="text-[11.5px] text-[var(--muted)] font-semibold text-left border-b border-[var(--border)]">
            <th className="py-2">Product</th>
            <th>Category</th>
            <th>Brand</th>
            <th>SKU</th>
            <th>Price</th>
            <th>Location</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => <tr key={p.id} className="border-b border-[var(--border)] last:border-0">
              <td className="py-2.5 font-medium">{p.name}</td>
              <td>{p.category}</td>
              <td>{p.brand}</td>
              <td>{p.sku}</td>
              <td>₹{p.price}</td>
              <td className="text-[var(--muted)]">{aisleLabel(p)}</td>
              <td>
                <span className={`text-[11px] font-semibold px-2.5 py-[3px] rounded-full ${p.stock === 0 ? 'bg-[#FBEAE9] text-[var(--red)]' : p.stock <= p.lowStockThreshold ? 'bg-[#FCF1DE] text-[var(--amber)]' : 'bg-[#E6F6EC] text-[var(--green)]'}`}>
                  {p.stock === 0 ? 'Out of stock' : p.stock <= p.lowStockThreshold ? 'Low stock' : 'Available'}
                </span>
              </td>
              <td>
                <button onClick={() => setEditing(p)} className="text-[12px] font-semibold text-[var(--teal-dark)] hover:underline">
                  Edit
                </button>
              </td>
            </tr>)}
        </tbody>
      </table>

      {showAdd && <Modal title="Add Product" onClose={() => setShowAdd(false)}>
          <ProductForm submitLabel="Add Product" onSubmit={values => {
        addProduct(values);
        setShowAdd(false);
      }} />
        </Modal>}

      {editing && <Modal title={`Edit — ${editing.name}`} onClose={() => setEditing(null)}>
          <ProductForm initial={editing} submitLabel="Save changes" onSubmit={values => {
        editProduct(editing.id, values);
        setEditing(null);
      }} />
        </Modal>}
    </div>;
}
