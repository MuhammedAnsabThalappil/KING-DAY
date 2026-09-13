import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';

// Layouts & Floating Widgets
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import FloatingWhatsApp from './components/layout/FloatingWhatsApp';
import AdminSidebar from './components/admin/AdminSidebar';

// Context
import { useAuth } from './context/AuthContext';

// Realm A: Storefront Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import CategoryView from './pages/CategoryView';
import ProductDetails from './pages/shop/ProductDetails';
import Cart from './pages/shop/Cart';
import Checkout from './pages/shop/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import TrackOrder from './pages/TrackOrder';
import About from './pages/About';
import Contact from './pages/Contact';
import LegalPages from './pages/LegalPages';

// Realm B: Staff Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminInventory from './pages/admin/AdminInventory';

// Layout Wrappers
const StoreLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
};

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 md:hidden">
          <span className="font-black text-lg uppercase text-kingBlue">
            KING<span className="text-kingPink">DAY</span> Admin
          </span>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

// Route Guard
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isAdminOrManager } = useAuth();

  // For development demo accessibility if unauthenticated initially
  if (!isAuthenticated && !localStorage.getItem('adminToken')) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* REALM A: USER STOREFRONT */}
        <Route element={<StoreLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/category/:slug" element={<CategoryView />} />
          <Route path="/product/:slug" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/track-order" element={<TrackOrder />} />
          
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/shipping-policy" element={<LegalPages />} />
          <Route path="/return-policy" element={<LegalPages />} />
          <Route path="/privacy-policy" element={<LegalPages />} />
          <Route path="/terms" element={<LegalPages />} />
        </Route>

        {/* REALM B: ADMIN CONTROL HUB */}
        <Route path="/admin/login" element={<AdminLogin />} />
        
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="inventory" element={<AdminInventory />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
