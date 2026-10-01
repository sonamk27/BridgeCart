import { createContext, useContext, useMemo, useState } from 'react';
import { generateAisles, DEFAULT_STORE_CONFIG, initialProducts, initialOrders, initialOffers } from '../data/mockData';
const StoreDataContext = createContext(null);
let idCounter = 1000;
function nextId(prefix) {
  idCounter += 1;
  return `${prefix}-${idCounter}`;
}
export function StoreDataProvider({
  children
}) {
  const [storeConfig, setStoreConfig] = useState(DEFAULT_STORE_CONFIG);
  const [isConfigured, setIsConfigured] = useState(false);
  const [aisles, setAisles] = useState(() => generateAisles(DEFAULT_STORE_CONFIG.rows, DEFAULT_STORE_CONFIG.columns));
  const [products, setProducts] = useState(initialProducts);
  const [stockMovements, setStockMovements] = useState([]);
  const [orders, setOrders] = useState(initialOrders);
  const [offers] = useState(initialOffers);
  function configureLayout(rows, columns) {
    const newAisles = generateAisles(rows, columns);
    const validIds = new Set(newAisles.map(a => a.id));
    const validLevels = new Set(newAisles.flatMap(a => a.levels.map(l => `${a.id}:${l}`)));
    setAisles(newAisles);
    setStoreConfig({
      rows,
      columns
    });
    setIsConfigured(true);

    // drop assignments that no longer exist in the new grid, keep the rest
    setProducts(prev => prev.map(p => {
      if (!p.aisleId) return p;
      const stillValid = validIds.has(p.aisleId) && (!p.shelfLevel || validLevels.has(`${p.aisleId}:${p.shelfLevel}`));
      return stillValid ? p : {
        ...p,
        aisleId: null,
        shelfLevel: null
      };
    }));
  }
  function logMovement(m) {
    setStockMovements(prev => [{
      ...m,
      id: nextId('mv'),
      timestamp: new Date().toLocaleString()
    }, ...prev]);
  }
  function addProduct(input) {
    const product = {
      id: nextId('p'),
      name: input.name,
      category: input.category,
      brand: input.brand,
      sku: input.sku || nextId('SKU'),
      price: input.price,
      stock: input.stock,
      lowStockThreshold: input.lowStockThreshold ?? 10,
      aisleId: input.aisleId,
      shelfLevel: input.shelfLevel,
      createdVia: 'manual'
    };
    setProducts(prev => [product, ...prev]);
    if (input.stock > 0) {
      logMovement({
        productId: product.id,
        productName: product.name,
        type: 'set',
        quantity: input.stock,
        resultingStock: input.stock,
        note: 'Initial stock on product creation'
      });
    }
  }
  function addProductsBulk(inputs) {
    const newProducts = inputs.map(input => ({
      id: nextId('p'),
      name: input.name,
      category: input.category || 'Uncategorized',
      brand: input.brand || '—',
      sku: input.sku || nextId('SKU'),
      price: input.price || 0,
      stock: input.stock || 0,
      lowStockThreshold: input.lowStockThreshold ?? 10,
      aisleId: input.aisleId,
      shelfLevel: input.shelfLevel,
      createdVia: 'excel'
    }));
    setProducts(prev => [...newProducts, ...prev]);
    setStockMovements(prev => [...newProducts.filter(p => p.stock > 0).map(p => ({
      id: nextId('mv'),
      productId: p.id,
      productName: p.name,
      type: 'set',
      quantity: p.stock,
      resultingStock: p.stock,
      note: 'Imported via Excel upload',
      timestamp: new Date().toLocaleString()
    })), ...prev]);
    return newProducts.length;
  }
  function editProduct(id, patch) {
    setProducts(prev => prev.map(p => p.id === id ? {
      ...p,
      ...patch
    } : p));
  }
  function addStock(productId, quantity, note) {
    const targetProduct = products.find(p => p.id === productId);
    if (!targetProduct) return;
    const resultingStock = targetProduct.stock + quantity;

    setProducts(prev => prev.map(p => (p.id === productId ? {
      ...p,
      stock: p.stock + quantity
    } : p)));

    logMovement({
      productId,
      productName: targetProduct.name,
      type: 'add',
      quantity,
      resultingStock,
      note
    });
  }
  function setStock(productId, quantity, note) {
    const targetProduct = products.find(p => p.id === productId);
    if (!targetProduct) return;

    setProducts(prev => prev.map(p => (p.id === productId ? {
      ...p,
      stock: quantity
    } : p)));

    logMovement({
      productId,
      productName: targetProduct.name,
      type: 'set',
      quantity,
      resultingStock: quantity,
      note
    });
  }
  function updateOrderStatus(orderId, status) {
    setOrders(prev => prev.map(o => o.id === orderId ? {
      ...o,
      status
    } : o));
  }
  function productsForAisle(aisleId) {
    return products.filter(p => p.aisleId === aisleId);
  }
  const totalSales = useMemo(() => orders.reduce((sum, o) => sum + o.total, 0), [orders]);
  const totalOrders = orders.length;
  const totalSkus = products.length;
  const lowStockCount = useMemo(() => products.filter(p => p.stock > 0 && p.stock <= p.lowStockThreshold).length, [products]);
  const outOfStockCount = useMemo(() => products.filter(p => p.stock === 0).length, [products]);
  const activeOffersCount = offers.length;
  function placeCustomerOrder({ customer, items, total, paymentMethod = 'UPI', walletAmount = 0, donation = 0, selfPayAmount = 0 }) {
    const newOrderId = `#BC${1043 + orders.length}`;
    const totalItemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const newOrder = {
      id: newOrderId,
      customer: customer || 'Customer',
      items: totalItemCount,
      total: Math.round(total),
      status: 'CONFIRMED',
      paymentMethod,
      walletAmount,
      donation,
      selfPayAmount,
      itemDetails: items.map(i => ({
        id: i.product.id,
        name: i.product.name,
        price: i.product.price,
        quantity: i.quantity,
        subtotal: i.product.price * i.quantity,
        isEssential: !!i.product.isEssential
      })),
      timestamp: new Date().toLocaleString()
    };

    setOrders(prev => [newOrder, ...prev]);

    const qtyMap = new Map();
    items.forEach(item => {
      qtyMap.set(item.product.id, (qtyMap.get(item.product.id) || 0) + item.quantity);
    });

    setProducts(prev => prev.map(p => {
      const qty = qtyMap.get(p.id);
      if (!qty) return p;
      return {
        ...p,
        stock: Math.max(0, p.stock - qty)
      };
    }));

    items.forEach(item => {
      const prod = products.find(p => p.id === item.product.id) || item.product;
      const newStock = Math.max(0, (prod.stock || 0) - item.quantity);
      logMovement({
        productId: item.product.id,
        productName: item.product.name,
        type: 'order',
        quantity: item.quantity,
        resultingStock: newStock,
        note: `Customer Order ${newOrderId}`
      });
    });

    return newOrder;
  }

  const value = {
    aisles,
    storeConfig,
    isConfigured,
    configureLayout,
    products,
    stockMovements,
    orders,
    offers,
    totalSales,
    totalOrders,
    totalSkus,
    lowStockCount,
    outOfStockCount,
    activeOffersCount,
    addProduct,
    addProductsBulk,
    editProduct,
    addStock,
    setStock,
    updateOrderStatus,
    productsForAisle,
    placeCustomerOrder
  };
  return <StoreDataContext.Provider value={value}>{children}</StoreDataContext.Provider>;
}
export function useStoreData() {
  const ctx = useContext(StoreDataContext);
  if (!ctx) throw new Error('useStoreData must be used inside StoreDataProvider');
  return ctx;
}
