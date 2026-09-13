import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, MessageCircle, ShieldCheck, Truck, Award, Sparkles, Star, ChevronRight } from 'lucide-react';
import ProductCard from '../components/ui/ProductCard';
import { Product } from '../types/schema';
import { apiClient } from '../api/client';
import { generateWhatsAppGeneralSupportLink } from '../services/whatsappService';

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await apiClient.get('/products');
        setProducts(res.data);
      } catch (error) {
        console.error('Failed to load home products:', error);
        // Baseline catalog fallback
        setProducts([
          {
            id: 'p1',
            sku: 'KD-TZ-WIZ-01',
            slug: 'toyzone-wizard-electric-scooty',
            name: 'Toyzone Wizard Electric Scooty',
            description: 'Fun and safe electric scooty for kids.',
            category: 'Kids Ride-On',
            images: ['https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80'],
            mrp: 12999,
            salePrice: 6999,
            stock: 15,
            isPublished: true,
            panIndiaEligible: true,
          },
          {
            id: 'p2',
            sku: 'KD-JEEP-ALP-12',
            slug: 'king-day-alpine-off-road-electric-jeep-12v',
            name: 'KING DAY Alpine Off-Road Electric Jeep 12V',
            description: 'Heavy duty 12V electric jeep.',
            category: 'Kids Ride-On',
            images: ['https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80'],
            mrp: 24999,
            salePrice: 17999,
            stock: 6,
            isPublished: true,
            panIndiaEligible: false,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categories = [
    { name: 'Kids Ride-On', slug: 'kids-ride-on', count: 'Electric Jeeps & Scooties', color: 'from-blue-600 to-indigo-700' },
    { name: 'Cycles', slug: 'cycles', count: 'Bicycles & Tricycles', color: 'from-purple-600 to-pink-600' },
    { name: 'Toys', slug: 'toys', count: 'Educational & Fun', color: 'from-amber-500 to-orange-600' },
    { name: 'Stationery', slug: 'stationery', count: 'School & Creative', color: 'from-emerald-500 to-teal-700' },
    { name: 'Baby Products', slug: 'baby-products', count: 'Care & Comfort', color: 'from-pink-500 to-rose-600' },
    { name: 'Gifts', slug: 'gifts', count: 'Special Occasions', color: 'from-cyan-600 to-blue-700' },
  ];

  return (
    <div className="pt-24 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-kingBlue to-slate-900 text-white rounded-3xl mx-4 lg:mx-8 p-8 lg:p-16 mb-16 shadow-2xl">
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-kingPink/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-kingYellow/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-kingYellow mb-6 border border-white/20">
            <Sparkles className="w-4 h-4" /> KOZHIKODE HUB FLAGSHIP STORE
          </span>

          <h1 className="text-4xl lg:text-6xl font-black tracking-tight leading-tight mb-6">
            Fun • Quality • <span className="text-transparent bg-clip-text bg-gradient-to-r from-kingPink to-kingYellow">Happiness</span>
          </h1>

          <p className="text-slate-300 text-base lg:text-lg mb-8 leading-relaxed">
            Kerala's premier destination for high-performance electric ride-on jeeps, scooties, cycles, and toys. Direct 2–7 day delivery from Kozhikode!
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/shop"
              className="bg-brand-gradient hover:opacity-95 text-white font-extrabold px-8 py-4 rounded-2xl shadow-xl flex items-center justify-center gap-2 transition-all hover:scale-105"
            >
              <ShoppingBag className="w-5 h-5" /> SHOP NOW
            </Link>
            <a
              href={generateWhatsAppGeneralSupportLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 font-bold px-8 py-4 rounded-2xl flex items-center justify-center gap-2 transition-all"
            >
              <MessageCircle className="w-5 h-5 text-green-400" /> CHAT ON WHATSAPP
            </a>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="container mx-auto px-4 max-w-6xl mb-16">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl lg:text-3xl font-black text-slate-900">Shop by Category</h2>
            <p className="text-slate-500 text-sm mt-1">Explore our wide selection of kids products</p>
          </div>
          <Link to="/shop" className="text-kingBlue font-bold text-sm hover:underline flex items-center gap-1">
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              to={`/category/${cat.slug}`}
              className={`bg-gradient-to-br ${cat.color} text-white p-5 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between h-36 group`}
            >
              <div>
                <h3 className="font-extrabold text-base leading-tight group-hover:underline">{cat.name}</h3>
                <p className="text-[11px] text-white/80 mt-1">{cat.count}</p>
              </div>
              <ChevronRight className="w-5 h-5 self-end opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products Catalog */}
      <section className="container mx-auto px-4 max-w-6xl mb-16">
        <div className="flex justify-between items-end mb-8">
          <div>
            <span className="text-xs font-black text-kingPink uppercase tracking-widest">REAL CATALOG BASELINE</span>
            <h2 className="text-2xl lg:text-3xl font-black text-slate-900 mt-1">Featured Ride-Ons & Best Sellers</h2>
          </div>
          <Link to="/shop" className="text-kingBlue font-bold text-sm hover:underline flex items-center gap-1">
            Browse All Products <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-400 font-medium">Loading KING DAY catalog...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Why Choose KING DAY */}
      <section className="bg-slate-100 py-16 mb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-black text-slate-900">Why Choose KING DAY?</h2>
            <p className="text-slate-600 text-sm mt-2">Kozhikode's most trusted kids luxury storefront</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200/60 text-center">
              <div className="w-14 h-14 bg-blue-100 text-kingBlue rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Truck className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">Fast Kozhikode Dispatch</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Direct dispatch from our Kozhikode hub. 2–7 working days delivery across Kerala.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200/60 text-center">
              <div className="w-14 h-14 bg-pink-100 text-kingPink rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">100% Quality Guaranteed</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Every electric jeep, scooty, and toy undergoes safety and battery testing before packing.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200/60 text-center">
              <div className="w-14 h-14 bg-yellow-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Award className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">Instant WhatsApp Support</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Have questions before ordering? Connect directly with our Kozhikode staff at +91 9495902904.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="container mx-auto px-4 max-w-6xl mb-16">
        <div className="text-center mb-10">
          <div className="flex justify-center text-amber-400 gap-1 mb-2">
            {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
          </div>
          <h2 className="text-3xl font-black text-slate-900">Loved by Parents Across Kerala</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-slate-700 text-sm italic mb-4">
              "Ordered the Alpine Off-Road Jeep for my son's 4th birthday in Calicut. Delivered in 2 days safely packed! Best quality jeep in Kozhikode."
            </p>
            <div className="font-bold text-slate-900 text-xs">— Anoop K., Kozhikode</div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-slate-700 text-sm italic mb-4">
              "The Toyzone Wizard Scooty was at an amazing discount. WhatsApp helpline answered all battery questions immediately. Great service!"
            </p>
            <div className="font-bold text-slate-900 text-xs">— Fatima R., Kochi</div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-slate-700 text-sm italic mb-4">
              "Authentic product with clear invoice and smooth delivery to Malappuram. Highly recommend KING DAY for ride-on toys!"
            </p>
            <div className="font-bold text-slate-900 text-xs">— Rahul Nair, Malappuram</div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
