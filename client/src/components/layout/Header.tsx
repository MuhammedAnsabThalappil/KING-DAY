import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, Menu, Phone, ShieldCheck } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import MobileDrawer from './MobileDrawer';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { cartCount } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      {/* Top Banner */}
      <div className="bg-brand-gradient text-white text-xs font-semibold py-2 px-4 text-center flex items-center justify-center gap-4">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5" /> Direct Kozhikode Dispatch | 2–7 Days Express Delivery
        </span>
        <span className="hidden md:inline">|</span>
        <a href="tel:+919495902904" className="hidden md:flex items-center gap-1 hover:underline">
          <Phone className="w-3.5 h-3.5" /> Helpline: +91 9495902904
        </a>
      </div>

      {/* Main Header */}
      <header
        className={`fixed top-8 left-0 w-full z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/90 backdrop-blur-md shadow-md py-3'
            : 'bg-white border-b border-gray-100 py-4'
        }`}
      >
        <div className="container mx-auto px-4 flex items-center justify-between gap-4">
          {/* Mobile Drawer Trigger */}
          <button
            onClick={() => setIsMobileOpen(true)}
            className="lg:hidden p-2 text-slate-700 hover:text-kingBlue transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl lg:text-3xl font-black tracking-tight text-kingBlue uppercase">
              KING<span className="text-kingPink">DAY</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-8 font-medium text-slate-700">
            <Link to="/" className="hover:text-kingBlue transition-colors">Home</Link>
            <Link to="/shop" className="hover:text-kingBlue transition-colors">Shop All</Link>
            <Link to="/category/kids-ride-on" className="hover:text-kingBlue transition-colors">Ride-Ons</Link>
            <Link to="/category/cycles" className="hover:text-kingBlue transition-colors">Cycles</Link>
            <Link to="/category/toys" className="hover:text-kingBlue transition-colors">Toys</Link>
            <Link to="/track-order" className="hover:text-kingBlue transition-colors">Track Order</Link>
          </nav>

          {/* Search Bar & Cart */}
          <div className="flex items-center gap-4">
            <form onSubmit={handleSearchSubmit} className="hidden md:flex relative w-48 lg:w-64">
              <input
                type="text"
                placeholder="Search toys, ride-ons..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-100 text-sm pl-9 pr-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-kingBlue transition-all"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </form>

            <Link
              to="/cart"
              className="relative p-2.5 bg-slate-100 rounded-full text-slate-800 hover:bg-kingBlue hover:text-white transition-all"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-kingPink text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <MobileDrawer isOpen={isMobileOpen} onClose={() => setIsMobileOpen(false)} />
    </>
  );
};

export default Header;
