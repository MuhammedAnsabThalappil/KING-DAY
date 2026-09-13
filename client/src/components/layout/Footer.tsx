import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, MapPin, Mail, ShieldCheck, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Brand Info */}
          <div>
            <span className="text-2xl font-black tracking-tight text-white uppercase mb-4 block">
              KING<span className="text-kingPink">DAY</span>
            </span>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              Fun • Quality • Happiness — Premium electric ride-ons, cycles, and toys dispatched directly from our Kozhikode hub across Kerala & India.
            </p>
            <div className="flex items-center gap-2 text-xs text-kingYellow font-semibold bg-slate-800/80 px-3 py-2 rounded-lg w-fit">
              <ShieldCheck className="w-4 h-4 text-green-400" /> Authorized Quality Direct Retail
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Storefront</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/shop" className="hover:text-white transition-colors">Shop All Products</Link></li>
              <li><Link to="/category/kids-ride-on" className="hover:text-white transition-colors">Kids Ride-On Vehicles</Link></li>
              <li><Link to="/category/cycles" className="hover:text-white transition-colors">Bicycles & Tricycles</Link></li>
              <li><Link to="/category/toys" className="hover:text-white transition-colors">Educational Toys</Link></li>
              <li><Link to="/track-order" className="hover:text-white transition-colors">Track Your Order</Link></li>
            </ul>
          </div>

          {/* Customer Service Policies */}
          <div>
            <h4 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Customer Care</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/about" className="hover:text-white transition-colors">About KING DAY</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Support</Link></li>
              <li><Link to="/shipping-policy" className="hover:text-white transition-colors">Shipping & Kerala Delivery</Link></li>
              <li><Link to="/return-policy" className="hover:text-white transition-colors">Returns & Guarantee</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Hub Contact */}
          <div>
            <h4 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Kozhikode Dispatch Hub</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-kingPink flex-shrink-0 mt-0.5" />
                <span>KING DAY Flagship Retail & Fulfillment Hub, Kozhikode, Kerala 673001, India</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-kingYellow flex-shrink-0" />
                <a href="tel:+919495902904" className="hover:text-white text-white font-semibold transition-colors">+91 9495902904</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-kingPurple flex-shrink-0" />
                <a href="mailto:support@king-day.shop" className="hover:text-white transition-colors">support@king-day.shop</a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} KING DAY (king-day.shop). All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-kingPink fill-current" />
            <span>for happy kids in Kerala & India</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
