import * as XLSX from 'xlsx';
// Accepts common header variants so owners don't have to match an exact template.
const HEADER_MAP = {
  name: 'name',
  product: 'name',
  productname: 'name',
  'product name': 'name',
  category: 'category',
  brand: 'brand',
  sku: 'sku',
  price: 'price',
  sellingprice: 'price',
  'selling price': 'price',
  stock: 'stock',
  quantity: 'stock',
  qty: 'stock',
  aisle: 'aisle',
  row: 'aisle',
  shelf: 'shelf'
};
export async function parseProductExcel(file, aisles) {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, {
    type: 'array'
  });
  const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(firstSheet, {
    defval: ''
  });
  return rows.map(row => {
    const normalized = {};
    for (const key of Object.keys(row)) {
      const mapped = HEADER_MAP[key.trim().toLowerCase()];
      if (mapped) normalized[mapped] = row[key];
    }
    const aisleRaw = String(normalized['aisle'] ?? '').trim();
    const shelfRaw = String(normalized['shelf'] ?? '').trim().toUpperCase();
    const matchedAisle = aisles.find(a => a.name.toLowerCase() === aisleRaw.toLowerCase()) || aisles.find(a => a.id === aisleRaw.toLowerCase()) || aisles.find(a => a.name.toLowerCase() === `row ${aisleRaw}`.toLowerCase());
    return {
      name: String(normalized.name ?? '').trim(),
      category: String(normalized.category ?? '').trim(),
      brand: String(normalized.brand ?? '').trim(),
      sku: String(normalized.sku ?? '').trim(),
      price: Number(normalized.price) || 0,
      stock: Number(normalized.stock) || 0,
      aisleId: matchedAisle ? matchedAisle.id : null,
      shelfLevel: matchedAisle && shelfRaw ? shelfRaw : null
    };
  }).filter(r => r.name.length > 0);
}
