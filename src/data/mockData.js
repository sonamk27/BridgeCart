const COLOR_PALETTE = ['#3FA95C', '#2E8FD6', '#E08A2E', '#8B5FD1', '#1FAFA0', '#D9548A', '#C0862E', '#5C7CD6'];
const CATEGORY_PALETTE = ['Food Grains, Spices', 'Beverages, Juices', 'Snacks, Biscuits', 'Personal Care', 'Cleaning, Household', 'Cosmetics, Baby Care', 'Bakery, Confectionery', 'Frozen Foods'];
function columnLetters(count) {
  return Array.from({
    length: count
  }, (_, i) => String.fromCharCode(65 + i % 26));
}
export function generateAisles(rows, columns) {
  const levels = columnLetters(columns);
  return Array.from({
    length: rows
  }, (_, i) => ({
    id: `row-${i + 1}`,
    name: `Row ${i + 1}`,
    color: COLOR_PALETTE[i % COLOR_PALETTE.length],
    category: CATEGORY_PALETTE[i % CATEGORY_PALETTE.length],
    levels
  }));
}
export const DEFAULT_STORE_CONFIG = {
  rows: 6,
  columns: 5
};
export const aisles = generateAisles(DEFAULT_STORE_CONFIG.rows, DEFAULT_STORE_CONFIG.columns);
export const initialProducts = [{
  id: 'p1',
  name: 'Amul Taaza Toned Milk 500ml',
  category: 'Dairy',
  brand: 'Amul',
  sku: 'SKU-1042',
  price: 28,
  stock: 24,
  lowStockThreshold: 15,
  aisleId: 'row-1',
  shelfLevel: 'A',
  isEssential: true,
  image: '🥛',
  description: 'Fresh toned pasteurized milk, enriched with Vitamin A & D.',
  unit: '500 ml',
  createdVia: 'seed'
}, {
  id: 'p2',
  name: 'Maggi 2-Minute Masala Noodles',
  category: 'Snacks',
  brand: 'Nestle',
  sku: 'SKU-1043',
  price: 14,
  stock: 18,
  lowStockThreshold: 15,
  aisleId: 'row-3',
  shelfLevel: 'B',
  isEssential: false,
  image: '🍜',
  description: 'Classic instant noodles with authentic spices.',
  unit: '70 g',
  createdVia: 'seed'
}, {
  id: 'p3',
  name: 'Tata Salt Vacuum Evaporated 1kg',
  category: 'Food Grains',
  brand: 'Tata',
  sku: 'SKU-1044',
  price: 30,
  stock: 35,
  lowStockThreshold: 10,
  aisleId: 'row-1',
  shelfLevel: 'C',
  isEssential: true,
  image: '🧂',
  description: 'Iodized salt with guaranteed purity and balanced iodine.',
  unit: '1 kg',
  createdVia: 'seed'
}, {
  id: 'p4',
  name: 'Colgate Strong Teeth Toothpaste',
  category: 'Personal Care',
  brand: 'Colgate',
  sku: 'SKU-1045',
  price: 52,
  stock: 47,
  lowStockThreshold: 15,
  aisleId: 'row-4',
  shelfLevel: 'A',
  isEssential: false,
  image: '🪥',
  description: 'Amino Shakti formula for 2X stronger teeth.',
  unit: '150 g',
  createdVia: 'seed'
}, {
  id: 'p5',
  name: 'Aashirvaad Shudh Chakki Atta 5kg',
  category: 'Food Grains',
  brand: 'Aashirvaad',
  sku: 'SKU-1046',
  price: 245,
  stock: 30,
  lowStockThreshold: 10,
  aisleId: 'row-1',
  shelfLevel: 'B',
  isEssential: true,
  image: '🌾',
  description: '100% pure whole wheat flour processed with traditional stone chakki.',
  unit: '5 kg',
  createdVia: 'seed'
}, {
  id: 'p6',
  name: 'Real Fruit Power Mixed Fruit 1L',
  category: 'Beverages',
  brand: 'Real',
  sku: 'SKU-1047',
  price: 110,
  stock: 12,
  lowStockThreshold: 10,
  aisleId: 'row-2',
  shelfLevel: 'A',
  isEssential: false,
  image: '🧃',
  description: 'Refreshing blend of 9 fruits rich in Vitamin C.',
  unit: '1 L',
  createdVia: 'seed'
}, {
  id: 'p7',
  name: 'Coca-Cola Original Taste 750ml',
  category: 'Beverages',
  brand: 'Coca-Cola',
  sku: 'SKU-1048',
  price: 40,
  stock: 60,
  lowStockThreshold: 20,
  aisleId: 'row-2',
  shelfLevel: 'B',
  isEssential: false,
  image: '🥤',
  description: 'Sparkling soft drink served chilled.',
  unit: '750 ml',
  createdVia: 'seed'
}, {
  id: 'p8',
  name: 'Parle-G Glucose Biscuits 250g',
  category: 'Snacks',
  brand: 'Parle',
  sku: 'SKU-1049',
  price: 20,
  stock: 90,
  lowStockThreshold: 25,
  aisleId: 'row-3',
  shelfLevel: 'A',
  isEssential: false,
  image: '🍪',
  description: "India's favorite glucose biscuit filled with energy & taste.",
  unit: '250 g',
  createdVia: 'seed'
}, {
  id: 'p9',
  name: 'Lifebuoy Total Germ Protection Soap',
  category: 'Personal Care',
  brand: 'Lifebuoy',
  sku: 'SKU-1050',
  price: 32,
  stock: 19,
  lowStockThreshold: 12,
  aisleId: 'row-4',
  shelfLevel: 'B',
  isEssential: true,
  image: '🧼',
  description: 'Antibacterial bath soap with Active Silver formula.',
  unit: '125 g',
  createdVia: 'seed'
}, {
  id: 'p10',
  name: 'Vim Dishwash Bar with Lemon',
  category: 'Cleaning',
  brand: 'Vim',
  sku: 'SKU-1051',
  price: 18,
  stock: 22,
  lowStockThreshold: 10,
  aisleId: 'row-5',
  shelfLevel: 'A',
  isEssential: true,
  image: '🍋',
  description: 'Power of 100 lemons removing stubborn grease instantly.',
  unit: '300 g',
  createdVia: 'seed'
}, {
  id: 'p11',
  name: 'Surf Excel Easy Wash Detergent 1kg',
  category: 'Household',
  brand: 'Surf Excel',
  sku: 'SKU-1052',
  price: 130,
  stock: 15,
  lowStockThreshold: 10,
  aisleId: 'row-5',
  shelfLevel: 'B',
  isEssential: false,
  image: '🧺',
  description: 'Superior stain removal powder gentle on hands.',
  unit: '1 kg',
  createdVia: 'seed'
}, {
  id: 'p12',
  name: 'Nivea Body Milk Lotion 200ml',
  category: 'Cosmetics',
  brand: 'Nivea',
  sku: 'SKU-1053',
  price: 180,
  stock: 14,
  lowStockThreshold: 10,
  aisleId: 'row-6',
  shelfLevel: 'A',
  isEssential: false,
  image: '🧴',
  description: 'Deep moisture serum nourishing dry skin for 48 hours.',
  unit: '200 ml',
  createdVia: 'seed'
}, {
  id: 'p13',
  name: "Johnson's Baby Powder 200g",
  category: 'Baby Care',
  brand: "Johnson's",
  sku: 'SKU-1054',
  price: 95,
  stock: 8,
  lowStockThreshold: 10,
  aisleId: 'row-6',
  shelfLevel: 'B',
  isEssential: false,
  image: '👶',
  description: 'Gentle floral fragrance, protects skin against excess moisture.',
  unit: '200 g',
  createdVia: 'seed'
}, {
  id: 'p14',
  name: 'Fortune Sunlite Sunflower Oil 1L',
  category: 'Food Grains',
  brand: 'Fortune',
  sku: 'SKU-1055',
  price: 145,
  stock: 25,
  lowStockThreshold: 10,
  aisleId: 'row-1',
  shelfLevel: 'D',
  isEssential: true,
  image: '🌻',
  description: 'Refined sunflower oil, light and healthy for everyday cooking.',
  unit: '1 L',
  createdVia: 'seed'
}, {
  id: 'p15',
  name: 'Tata Sampann Unpolished Toor Dal 1kg',
  category: 'Food Grains',
  brand: 'Tata Sampann',
  sku: 'SKU-1056',
  price: 165,
  stock: 20,
  lowStockThreshold: 8,
  aisleId: 'row-1',
  shelfLevel: 'E',
  isEssential: true,
  image: '🥣',
  description: 'Natural protein rich unpolished arhar/toor dal.',
  unit: '1 kg',
  createdVia: 'seed'
}, {
  id: 'p16',
  name: 'India Gate Feast Rozzana Basmati Rice 1kg',
  category: 'Food Grains',
  brand: 'India Gate',
  sku: 'SKU-1057',
  price: 88,
  stock: 28,
  lowStockThreshold: 10,
  aisleId: 'row-1',
  shelfLevel: 'C',
  isEssential: true,
  image: '🍚',
  description: 'Aromatic long grain basmati rice perfect for daily meals.',
  unit: '1 kg',
  createdVia: 'seed'
}];
export const initialOrders = [{
  id: '#BC1042',
  customer: 'Anita Desai',
  items: 6,
  total: 640,
  status: 'PREPARING'
}, {
  id: '#BC1041',
  customer: 'Rohan Mehta',
  items: 3,
  total: 210,
  status: 'READY'
}, {
  id: '#BC1040',
  customer: 'Priya Nair',
  items: 9,
  total: 1180,
  status: 'CONFIRMED'
}, {
  id: '#BC1039',
  customer: 'Sameer Khan',
  items: 2,
  total: 95,
  status: 'COMPLETED'
}, {
  id: '#BC1038',
  customer: 'Kavita Joshi',
  items: 5,
  total: 430,
  status: 'COMPLETED'
}, {
  id: '#BC1037',
  customer: 'Vikram Rao',
  items: 4,
  total: 355,
  status: 'COMPLETED'
}, {
  id: '#BC1036',
  customer: 'Neha Kulkarni',
  items: 7,
  total: 720,
  status: 'COMPLETED'
}, {
  id: '#BC1035',
  customer: 'Arjun Patil',
  items: 1,
  total: 52,
  status: 'COMPLETED'
}, {
  id: '#BC1034',
  customer: 'Sneha Iyer',
  items: 8,
  total: 940,
  status: 'COMPLETED'
}, {
  id: '#BC1033',
  customer: 'Manoj Bhosale',
  items: 3,
  total: 268,
  status: 'NEW'
}];
export const initialOffers = [{
  id: 'o1',
  productName: 'Tata Salt 1kg',
  discountPct: 20,
  startDate: '1 Sept',
  endDate: '10 Sept'
}, {
  id: 'o2',
  productName: 'Amul Milk 500ml',
  discountPct: 10,
  startDate: '5 Sept',
  endDate: '15 Sept'
}, {
  id: 'o3',
  productName: 'All Personal Care',
  discountPct: 15,
  startDate: '1 Sept',
  endDate: '30 Sept'
}];
