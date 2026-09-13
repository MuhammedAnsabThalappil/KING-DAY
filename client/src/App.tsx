import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';

// Layouts
import Header from './components/layout/Header';
import AdminSidebar from './components/admin/AdminSidebar';

// User Pages (Stubs for full app)
const Home = () => <div className="pt-24 min-h-screen text-center"><h1 className="text-4xl font-bold mt-10">Welcome to KING DAY Storefront</h1></div>;
const Shop = () => <div className="pt-24 min-h-screen text-center"><h1 className="text-4xl font-bold mt-10">Shop All Products</h1></div>;
const Category = () => <div className="pt-24 min-h-screen text-center"><h1 className="text-4xl font-bold mt-10">Category Page</h1></div>;
const ProductDetail = () => <div className="pt-24 min-h-screen text-center"><h1 className="text-4xl font-bold mt-10">Product Detail</h1></div>;
const Cart = () => <div className="pt-24 min-h-screen text-center"><h1 className="text-4xl font-bold mt-10">Shopping Cart</h1></div>;
const Checkout = () => <div className="pt-24 min-h-screen text-center"><h1 className="text-4xl font-bold mt-10">Checkout</h1></div>;
const OrderSuccess = () => <div className="pt-24 min-h-screen text-center"><h1 className="text-4xl font-bold mt-10">Order Successful!</h1></div>;
const TrackOrder = () => <div className="pt-24 min-h-screen text-center"><h1 className="text-4xl font-bold mt-10">Track Order</h1></div>;

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
const AdminLogin = () => <div className="flex h-screen items-center justify-center bg-gray-100"><div className="p-8 bg-white rounded-lg shadow-md w-96"><h2 className="text-2xl font-bold text-center mb-6">Admin Login</h2><button className="w-full bg-blue-600 text-white p-2 rounded">Login (Stub)</button></div></div>;
const AdminProducts = () => <div className="p-6"><h1 className="text-2xl font-bold mb-4">Product Management</h1></div>;
const AdminOrders = () => <div className="p-6"><h1 className="text-2xl font-bold mb-4">Order Management</h1></div>;
const AdminInventory = () => <div className="p-6"><h1 className="text-2xl font-bold mb-4">Inventory Audit</h1></div>;

// Layout wrappers
const StoreLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      {/* Footer would go here */}
      <footer className="bg-gray-900 text-white py-12 text-center">
        <p>© {new Date().getFullYear()} KING DAY Kozhikode Hub. All rights reserved.</p>
        <p className="mt-2 text-gray-400">Support: +91 9495902904</p>
      </footer>
    </div>
  );
};

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-6 lg:hidden">
          <h1 className="text-xl font-bold text-blue-900">KINGDAY Admin</h1>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

// Route Guards
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Basic auth check stub (in real app verify token with backend)
    const token = localStorage.getItem('adminToken');
    // For demonstration, we'll auto-authenticate if this is a development preview
    // or set to true for the sake of the output code working directly
    setIsAuthenticated(true); 
  }, []);

  if (isAuthenticated === null) return <div>Loading...</div>;
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/admin/login" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* REALM A: USER STOREFRONT */}
        <Route element={<StoreLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/category/:slug" element={<Category />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/track-order" element={<TrackOrder />} />
          
          {/* Static Pages */}
          <Route path="/about" element={<div className="pt-24 text-center">About Us</div>} />
          <Route path="/contact" element={<div className="pt-24 text-center">Contact</div>} />
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
