import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useStoreData } from '../context/StoreDataContext';

const CustomerContext = createContext(null);

const DEFAULT_STORE = {
  id: 'lokmanya-101',
  name: 'Lokmanya Super Market',
  branch: 'Kothrud, Pune - Store #101',
  openingHours: '8:00 AM - 10:00 PM',
  qrCode: 'BC-STORE-LOKMANYA-101',
  validQrCodes: ['BC-STORE-LOKMANYA-101', 'LOKMANYA-101', 'BC-101']
};

export function CustomerProvider({ children }) {
  const { products, placeCustomerOrder } = useStoreData();

  // Authentication State
  const [auth, setAuth] = useState({
    isAuthenticated: true,
    isGuest: false,
    phone: '+91 98765 43210',
    user: {
      name: 'Priya Sharma',
      phone: '+91 98765 43210',
      email: 'priya.sharma@example.com',
      address: 'Flat 402, Shanti Niketan, Kothrud, Pune',
      preferredLanguage: 'English',
      rationCardNumber: 'MH-PUN-2024-8849'
    }
  });

  // Store Session State
  const [session, setSession] = useState({
    isActive: true,
    store: DEFAULT_STORE,
    startedAt: new Date(),
    expiresAt: new Date(Date.now() + 45 * 60 * 1000), // 45 min default
    minutesRemaining: 45
  });

  // Countdown timer for active session
  useEffect(() => {
    if (!session.isActive || !session.expiresAt) return;
    const interval = setInterval(() => {
      const remainingMs = session.expiresAt.getTime() - Date.now();
      const mins = Math.max(0, Math.ceil(remainingMs / (60 * 1000)));
      setSession(prev => ({
        ...prev,
        minutesRemaining: mins,
        isActive: mins > 0
      }));
    }, 10000);
    return () => clearInterval(interval);
  }, [session.isActive, session.expiresAt]);

  // Cart State: array of { product, quantity }
  const [cart, setCart] = useState(() => {
    const p1 = products?.find(p => p.id === 'p1') || products?.[0];
    const p5 = products?.find(p => p.id === 'p5') || products?.[1];
    const initial = [];
    if (p1) initial.push({ product: p1, quantity: 2 });
    if (p5) initial.push({ product: p5, quantity: 1 });
    return initial;
  });

  // Community Wallet & Beneficiary State
  const [beneficiary, setBeneficiary] = useState({
    status: 'APPROVED', // 'UNAPPLIED' | 'PENDING' | 'APPROVED' | 'REJECTED'
    rationCardNumber: 'MH-PUN-2024-8849',
    category: 'Priority Household (PHH)',
    familyHead: 'Priya Sharma',
    familyMembersCount: 4,
    walletBalance: 1200,
    monthlyLimit: 1500,
    applicationDate: '2026-09-01',
    approvalDate: '2026-09-02'
  });

  // Donation State
  const [donationAmount, setDonationAmount] = useState(20);

  // Active Receipt & Order History
  const [lastReceipt, setLastReceipt] = useState(null);
  const [orderHistory, setOrderHistory] = useState([
    {
      id: '#BC1032',
      customer: 'Priya Sharma',
      date: 'Yesterday, 6:15 PM',
      items: 4,
      total: 345,
      walletAmount: 245,
      selfPayAmount: 100,
      donation: 10,
      paymentMethod: 'Community Wallet + UPI',
      storeName: 'Lokmanya Super Market',
      itemDetails: [
        { name: 'Aashirvaad Shudh Chakki Atta 5kg', price: 245, quantity: 1, isEssential: true },
        { name: 'Real Fruit Power Mixed Fruit 1L', price: 100, quantity: 1, isEssential: false }
      ]
    }
  ]);

  // Modals Controller State
  const [activeModal, setActiveModal] = useState(null); // 'qr_scanner' | 'auth' | 'profile' | 'voice' | 'cart' | 'checkout' | 'receipt' | 'map' | 'product_detail' | 'wallet'
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [mapTargetProduct, setMapTargetProduct] = useState(null);

  // Cart Calculations
  const cartItemCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);

  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [cart]);

  const cartEssentialSubtotal = useMemo(() => {
    return cart
      .filter(item => item.product.isEssential)
      .reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [cart]);

  const cartNonEssentialSubtotal = cartSubtotal - cartEssentialSubtotal;

  // Beneficiary Wallet Coverage calculation
  const walletCoverage = useMemo(() => {
    if (beneficiary.status !== 'APPROVED') return 0;
    return Math.min(beneficiary.walletBalance, cartEssentialSubtotal);
  }, [beneficiary.status, beneficiary.walletBalance, cartEssentialSubtotal]);

  // Actions
  function startStoreSession(qrCode) {
    const cleanCode = qrCode.trim().toUpperCase();
    if (
      cleanCode === 'BC-STORE-LOKMANYA-101' ||
      cleanCode === 'LOKMANYA-101' ||
      cleanCode.includes('LOKMANYA') ||
      cleanCode === 'BC-101'
    ) {
      setSession({
        isActive: true,
        store: DEFAULT_STORE,
        startedAt: new Date(),
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
        minutesRemaining: 60
      });
      return { success: true, store: DEFAULT_STORE };
    } else if (cleanCode.includes('GREEN') || cleanCode === 'BC-102') {
      const greenValley = {
        id: 'green-valley-102',
        name: 'Green Valley Mart',
        branch: 'Baner Main Road - Store #102',
        openingHours: '7:30 AM - 10:30 PM',
        qrCode: 'BC-STORE-GREENVALLEY-102',
        validQrCodes: ['BC-STORE-GREENVALLEY-102', 'GREENVALLEY-102']
      };
      setSession({
        isActive: true,
        store: greenValley,
        startedAt: new Date(),
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
        minutesRemaining: 60
      });
      return { success: true, store: greenValley };
    }
    return { success: false, error: 'Invalid store QR code. Please scan a valid BridgeCart Store QR.' };
  }

  function extendSession(minutes = 30) {
    setSession(prev => {
      const newExpiry = new Date((prev.expiresAt ? prev.expiresAt.getTime() : Date.now()) + minutes * 60 * 1000);
      return {
        ...prev,
        isActive: true,
        expiresAt: newExpiry,
        minutesRemaining: prev.minutesRemaining + minutes
      };
    });
  }

  function endStoreSession() {
    setSession(prev => ({
      ...prev,
      isActive: false,
      minutesRemaining: 0
    }));
  }

  // Cart actions
  function addToCart(product, qty = 1) {
    if (product.stock <= 0) return false;
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        const newQty = Math.min(existing.quantity + qty, product.stock);
        return prev.map(item =>
          item.product.id === product.id ? { ...item, quantity: newQty } : item
        );
      }
      return [...prev, { product, quantity: Math.min(qty, product.stock) }];
    });
    return true;
  }

  function updateCartQty(productId, newQty) {
    if (newQty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item => {
        if (item.product.id === productId) {
          const clamped = Math.min(newQty, item.product.stock);
          return { ...item, quantity: clamped };
        }
        return item;
      })
    );
  }

  function removeFromCart(productId) {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  }

  function clearCart() {
    setCart([]);
  }

  // Beneficiary application
  function submitBeneficiaryApplication(data) {
    setBeneficiary({
      status: 'PENDING',
      rationCardNumber: data.rationCardNumber,
      category: data.category || 'Priority Household (PHH)',
      familyHead: data.familyHead || auth.user?.name || 'Applicant',
      familyMembersCount: data.familyMembersCount || 4,
      walletBalance: 0,
      monthlyLimit: 1500,
      applicationDate: new Date().toISOString().split('T')[0],
      approvalDate: null
    });
  }

  function approveBeneficiary(overrideData = {}) {
    setBeneficiary(prev => ({
      ...prev,
      ...overrideData,
      status: 'APPROVED',
      walletBalance: 1500,
      monthlyLimit: 1500,
      approvalDate: new Date().toISOString().split('T')[0]
    }));
  }

  function rejectBeneficiary(reason = 'Documentation incomplete') {
    setBeneficiary(prev => ({
      ...prev,
      status: 'REJECTED',
      rejectionReason: reason
    }));
  }

  // Auth actions
  function loginWithPhone(phone, name = 'Priya Sharma') {
    setAuth({
      isAuthenticated: true,
      isGuest: false,
      phone,
      user: {
        name,
        phone,
        email: 'user@bridgecart.in',
        address: 'Pune, Maharashtra',
        preferredLanguage: 'English',
        rationCardNumber: beneficiary.rationCardNumber || ''
      }
    });
  }

  function enterGuestMode() {
    setAuth({
      isAuthenticated: true,
      isGuest: true,
      phone: null,
      user: {
        name: 'Guest Shopper',
        phone: '',
        email: '',
        address: '',
        preferredLanguage: 'English',
        rationCardNumber: ''
      }
    });
  }

  function updateProfile(updatedUser) {
    setAuth(prev => ({
      ...prev,
      user: {
        ...prev.user,
        ...updatedUser
      }
    }));
  }

  function logout() {
    setAuth({
      isAuthenticated: false,
      isGuest: false,
      phone: null,
      user: null
    });
  }

  // Complete Checkout & Payment
  function handleCompleteCheckout({ paymentMethod, useWallet, donation, walletDeduction, selfPayAmount }) {
    const finalTotal = cartSubtotal + donation;
    const orderDetails = {
      customer: auth.user?.name || 'Guest Shopper',
      items: cart,
      total: finalTotal,
      paymentMethod,
      walletAmount: useWallet ? walletDeduction : 0,
      donation,
      selfPayAmount
    };

    // Record into StoreDataContext
    const placed = placeCustomerOrder(orderDetails);

    // Update wallet balance if used
    if (useWallet && walletDeduction > 0) {
      setBeneficiary(prev => ({
        ...prev,
        walletBalance: Math.max(0, prev.walletBalance - walletDeduction)
      }));
    }

    // Create Digital Receipt
    const receiptData = {
      ...placed,
      store: session.store,
      date: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      savings: Math.round(cartSubtotal * 0.08), // simulated 8% savings
      beneficiaryVerified: useWallet && walletDeduction > 0
    };

    setLastReceipt(receiptData);
    setOrderHistory(prev => [receiptData, ...prev]);
    clearCart();
    setActiveModal('receipt');

    return receiptData;
  }

  const value = {
    auth,
    session,
    cart,
    cartItemCount,
    cartSubtotal,
    cartEssentialSubtotal,
    cartNonEssentialSubtotal,
    beneficiary,
    walletCoverage,
    donationAmount,
    lastReceipt,
    orderHistory,
    activeModal,
    selectedProduct,
    mapTargetProduct,
    setDonationAmount,
    setActiveModal,
    setSelectedProduct,
    setMapTargetProduct,
    startStoreSession,
    extendSession,
    endStoreSession,
    addToCart,
    updateCartQty,
    removeFromCart,
    clearCart,
    submitBeneficiaryApplication,
    approveBeneficiary,
    rejectBeneficiary,
    loginWithPhone,
    enterGuestMode,
    updateProfile,
    logout,
    handleCompleteCheckout
  };

  return <CustomerContext.Provider value={value}>{children}</CustomerContext.Provider>;
}

export function useCustomer() {
  const ctx = useContext(CustomerContext);
  if (!ctx) throw new Error('useCustomer must be used inside CustomerProvider');
  return ctx;
}
