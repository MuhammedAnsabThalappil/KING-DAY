import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0); // This would come from global state/context

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/80 backdrop-blur-md shadow-md py-3' : 'bg-white py-5'
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Mobile menu trigger */}
        <button 
          className="lg:hidden text-gray-800 p-2"
          onClick={() => setMobileMenuOpen(true)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Logo */}
        <Link to="/" className="text-2xl font-black tracking-tighter text-blue-900 uppercase">
          King<span className="text-orange-500">Day</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex space-x-8">
          <Link to="/" className="text-gray-800 hover:text-blue-600 font-medium transition-colors">Home</Link>
          <Link to="/shop" className="text-gray-800 hover:text-blue-600 font-medium transition-colors">Shop All</Link>
          <Link to="/category/kids-ride-on" className="text-gray-800 hover:text-blue-600 font-medium transition-colors">Ride-Ons</Link>
          <Link to="/category/cycles" className="text-gray-800 hover:text-blue-600 font-medium transition-colors">Cycles</Link>
          <Link to="/track-order" className="text-gray-800 hover:text-blue-600 font-medium transition-colors">Track Order</Link>
        </nav>

        {/* Search & Cart */}
        <div className="flex items-center space-x-4">
          <button className="text-gray-600 hover:text-blue-600 hidden sm:block">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          
          <Link to="/cart" className="relative text-gray-800 hover:text-blue-600 p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-orange-500 rounded-full">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile Drawer (simplified) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)}></div>
          <div className="relative w-64 bg-white h-full shadow-xl flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="px-4 flex items-center justify-between mb-8">
              <span className="text-xl font-black text-blue-900">KING<span className="text-orange-500">DAY</span></span>
              <button onClick={() => setMobileMenuOpen(false)} className="text-gray-500">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            <nav className="px-2 space-y-1 flex flex-col">
              <Link to="/" className="px-3 py-2 text-base font-medium text-gray-900 rounded-md hover:bg-gray-50" onClick={() => setMobileMenuOpen(false)}>Home</Link>
              <Link to="/shop" className="px-3 py-2 text-base font-medium text-gray-900 rounded-md hover:bg-gray-50" onClick={() => setMobileMenuOpen(false)}>Shop All</Link>
              <Link to="/category/kids-ride-on" className="px-3 py-2 text-base font-medium text-gray-900 rounded-md hover:bg-gray-50" onClick={() => setMobileMenuOpen(false)}>Kids Ride-Ons</Link>
              <Link to="/track-order" className="px-3 py-2 text-base font-medium text-gray-900 rounded-md hover:bg-gray-50" onClick={() => setMobileMenuOpen(false)}>Track Order</Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
