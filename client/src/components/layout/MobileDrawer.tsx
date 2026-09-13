import React from 'react';
import { Link } from 'react-router-dom';
import { X, Home, ShoppingBag, Package, Bike, Sparkles, Truck, PhoneCall } from 'lucide-react';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileDrawer: React.FC<MobileDrawerProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex lg:hidden">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-4/5 max-w-xs bg-white h-full shadow-2xl flex flex-col pt-6 pb-6 overflow-y-auto">
        <div className="px-6 flex items-center justify-between mb-6">
          <span className="text-2xl font-black text-kingBlue uppercase tracking-tight">
            KING<span className="text-kingPink">DAY</span>
          </span>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="px-4 space-y-1">
          <Link
            to="/"
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-3 text-slate-800 font-semibold rounded-xl hover:bg-slate-50 transition-colors"
          >
            <Home className="w-5 h-5 text-kingBlue" /> Home
          </Link>
          <Link
            to="/shop"
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-3 text-slate-800 font-semibold rounded-xl hover:bg-slate-50 transition-colors"
          >
            <ShoppingBag className="w-5 h-5 text-kingPurple" /> Shop Catalog
          </Link>
          <Link
            to="/category/kids-ride-on"
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-3 text-slate-800 font-semibold rounded-xl hover:bg-slate-50 transition-colors"
          >
            <Package className="w-5 h-5 text-kingPink" /> Kids Ride-Ons
          </Link>
          <Link
            to="/category/cycles"
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-3 text-slate-800 font-semibold rounded-xl hover:bg-slate-50 transition-colors"
          >
            <Bike className="w-5 h-5 text-kingYellow" /> Cycles & Bikes
          </Link>
          <Link
            to="/category/toys"
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-3 text-slate-800 font-semibold rounded-xl hover:bg-slate-50 transition-colors"
          >
            <Sparkles className="w-5 h-5 text-kingBlue" /> Toys & Gifts
          </Link>
          <Link
            to="/track-order"
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-3 text-slate-800 font-semibold rounded-xl hover:bg-slate-50 transition-colors"
          >
            <Truck className="w-5 h-5 text-green-600" /> Track Order
          </Link>
        </nav>

        <div className="mt-auto px-6 pt-6 border-t border-slate-100">
          <a
            href="tel:+919495902904"
            className="flex items-center justify-center gap-2 w-full py-3 bg-slate-100 rounded-xl font-bold text-slate-800 hover:bg-kingBlue hover:text-white transition-colors"
          >
            <PhoneCall className="w-4 h-4" /> Call Helpline
          </a>
        </div>
      </div>
    </div>
  );
};

export default MobileDrawer;
