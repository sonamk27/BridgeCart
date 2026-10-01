import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import { StoreDataProvider } from './context/StoreDataContext';
import Landing from './flow/Landing';
import Login from './flow/Login';
import RackSetup from './flow/RackSetup';
import CustomerPreview from './flow/CustomerPreview';
import Dashboard from './pages/Dashboard';
import StoreManagement from './pages/StoreManagement';
import StoreLayout from './pages/StoreLayout';
import Products from './pages/Products';
import Inventory from './pages/Inventory';
import StockManagement from './pages/StockManagement';
import Offers from './pages/Offers';
import Orders from './pages/Orders';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import AdminPortal from './pages/admin/AdminPortal';
import { useStoreData } from './context/StoreDataContext';

function isAdminRoute() {
  if (typeof window === 'undefined') return false;
  const path = window.location.pathname.toLowerCase().replace(/\/$/, '');
  const hash = window.location.hash.toLowerCase();
  return path === '/admin' || hash === '#/admin' || hash === '#admin';
}

const titles = {
  layout: ['Store Layout', 'Aisles, shelves and product locations — click a row to zoom in'],
  dashboard: ['Dashboard', "Overview of today's store performance"],
  store: ['Store Management', "Manage your store's basic information"],
  products: ['Products', 'Manage your product catalog — add manually or import from Excel'],
  inventory: ['Inventory', 'Live stock levels, sales and order totals'],
  stock: ['Stock Management', 'Add stock, update stock, and review stock history'],
  offers: ['Offers', 'Create and manage discounts'],
  orders: ['Orders', 'Track customer orders in real time'],
  analytics: ['Analytics', 'Sales, revenue and performance insights'],
  settings: ['Settings', 'Manage your account preferences']
};

function OwnerDashboard({
  onReconfigure
}) {
  const [view, setView] = useState('layout');
  const [title, subtitle] = titles[view];
  return <div className="flex min-h-screen bg-[var(--bg)]">
      <Sidebar active={view} onNavigate={setView} />
      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar title={title} subtitle={subtitle} />
        <div className="p-7 overflow-y-auto">
          {view === 'layout' && <StoreLayout onNavigate={setView} onReconfigure={onReconfigure} />}
          {view === 'dashboard' && <Dashboard onNavigate={setView} />}
          {view === 'store' && <StoreManagement />}
          {view === 'products' && <Products />}
          {view === 'inventory' && <Inventory />}
          {view === 'stock' && <StockManagement />}
          {view === 'offers' && <Offers />}
          {view === 'orders' && <Orders />}
          {view === 'analytics' && <Analytics />}
          {view === 'settings' && <Settings />}
        </div>
      </div>
    </div>;
}

function RootRouter() {
  const [isAdmin, setIsAdmin] = useState(() => isAdminRoute());
  const [screen, setScreen] = useState('landing');
  const {
    isConfigured
  } = useStoreData();

  useEffect(() => {
    function handleLocation() {
      setIsAdmin(isAdminRoute());
    }
    window.addEventListener('popstate', handleLocation);
    window.addEventListener('hashchange', handleLocation);
    return () => {
      window.removeEventListener('popstate', handleLocation);
      window.removeEventListener('hashchange', handleLocation);
    };
  }, []);

  if (isAdmin) {
    return (
      <AdminPortal
        onExit={() => {
          window.history.pushState(null, '', '/');
          setIsAdmin(false);
        }}
      />
    );
  }

  if (screen === 'landing') {
    return <Landing onGetStarted={() => setScreen('login')} />;
  }
  if (screen === 'login') {
    return <Login onBack={() => setScreen('landing')} onOwnerLogin={() => setScreen(isConfigured ? 'dashboard' : 'setup')} onCustomerLogin={() => setScreen('customer')} />;
  }
  if (screen === 'setup') {
    return <RackSetup onDone={() => setScreen('dashboard')} />;
  }
  if (screen === 'customer') {
    return <CustomerPreview onLogout={() => setScreen('landing')} />;
  }
  return <OwnerDashboard onReconfigure={() => setScreen('setup')} />;
}

export default function App() {
  return <StoreDataProvider>
      <RootRouter />
    </StoreDataProvider>;
}
