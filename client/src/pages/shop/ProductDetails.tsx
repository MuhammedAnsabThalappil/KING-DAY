import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MessageCircle, ShoppingCart, Truck, ShieldCheck, ArrowLeft } from 'lucide-react';
import { Product } from '../../types/schema';
import { useCart } from '../../context/CartContext';
import { buildWhatsAppProductUrl, formatINR } from '../../services/whatsappService';
import { apiClient } from '../../api/client';

const ProductDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [addedToast, setAddedToast] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await apiClient.get(`/products/${slug}`);
        setProduct(res.data);
        if (res.data.images && res.data.images.length > 0) {
          setActiveImage(res.data.images[0]);
        }
      } catch (err) {
        console.error('Failed to load product from API, using baseline catalog fallback:', err);
        const baselineProducts: Record<string, Product> = {
          'toyzone-wizard-electric-scooty': {
            id: 'p1',
            slug: 'toyzone-wizard-electric-scooty',
            sku: 'KD-TZ-WIZ-01',
            name: 'Toyzone Wizard Electric Scooty',
            shortDescription: 'Fun, safe, and vibrant electric scooty for kids with headlights and audio.',
            description: 'The Toyzone Wizard Electric Scooty is designed for kids to enjoy a smooth, fun, and safe ride. Equipped with rechargeable batteries, realistic controls, bright LED headlights, and built-in music.',
            category: 'Kids Ride-On',
            brand: 'Toyzone',
            images: [
              'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80',
              'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&w=800&q=80'
            ],
            mrp: 12999,
            salePrice: 6999,
            stock: 15,
            isPublished: true,
            panIndiaEligible: true,
            ageSuitability: '2–5 Years',
            weightCapacity: '25 kg',
          },
          'king-day-alpine-off-road-electric-jeep-12v': {
            id: 'p2',
            slug: 'king-day-alpine-off-road-electric-jeep-12v',
            sku: 'KD-JEEP-ALP-12',
            name: 'KING DAY Alpine Off-Road Electric Jeep 12V',
            shortDescription: 'Heavy-duty 12V dual-motor electric jeep with remote control and suspension.',
            description: 'The KING DAY Alpine Off-Road Electric Jeep 12V brings luxury off-road adventures to kids. Powered by a high-torque 12V battery system with parental remote control, suspension, and rugged tread tires.',
            category: 'Kids Ride-On',
            brand: 'KING DAY',
            images: [
              'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80',
              'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=800&q=80'
            ],
            mrp: 24999,
            salePrice: 17999,
            stock: 4,
            isPublished: true,
            panIndiaEligible: false,
            ageSuitability: '3–8 Years',
            weightCapacity: '40 kg',
          }
        };

        const found = baselineProducts[slug || 'toyzone-wizard-electric-scooty'];
        if (found) {
          setProduct(found);
          setActiveImage(found.images[0]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center pt-24 text-slate-400 font-medium">Loading product details...</div>;
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-24">
        <p className="text-slate-600 font-bold text-lg mb-4">Product not found in KING DAY catalog.</p>
        <Link to="/shop" className="bg-kingBlue text-white font-bold px-6 py-2.5 rounded-xl text-xs">
          Return to Catalog
        </Link>
      </div>
    );
  }

  const mrp = Number(product.mrp);
  const salePrice = Number(product.salePrice);
  const discountPercentage = mrp > salePrice ? Math.round(((mrp - salePrice) / mrp) * 100) : 0;
  const isOutOfStock = product.stock <= 0;

  const handleBuyNowWhatsApp = () => {
    const link = buildWhatsAppProductUrl(product, window.location.href);
    window.open(link, '_blank');
  };

  const handleAddToCartClick = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2500);
  };

  // JSON-LD Schema
  const schemaData = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": product.images,
    "description": product.description,
    "sku": product.sku,
    "brand": {
      "@type": "Brand",
      "name": product.brand || "KING DAY"
    },
    "offers": {
      "@type": "Offer",
      "url": window.location.href,
      "priceCurrency": "INR",
      "price": salePrice,
      "priceValidUntil": new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      "itemCondition": "https://schema.org/NewCondition",
      "availability": isOutOfStock ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "KING DAY"
      }
    }
  };

  return (
    <div className="bg-slate-50 pt-28 pb-20 min-h-screen">
      {/* Schema Injection */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }} />

      <div className="container mx-auto px-4 max-w-6xl">
        
        <Link to="/shop" className="inline-flex items-center gap-1.5 text-xs font-bold text-kingBlue hover:underline mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Catalog
        </Link>

        {addedToast && (
          <div className="mb-6 p-4 bg-green-600 text-white font-extrabold text-sm rounded-2xl shadow-lg flex items-center justify-between animate-fade-in">
            <span>Added {quantity}x "{product.name}" to cart!</span>
            <Link to="/cart" className="underline bg-white/20 px-3 py-1 rounded-lg text-xs">View Cart</Link>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Gallery Switcher */}
          <div className="w-full lg:w-1/2 flex flex-col gap-4">
            <div className="aspect-square bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm relative group">
              <img 
                src={activeImage || (product.images && product.images[0])} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {discountPercentage > 0 && (
                <div className="absolute top-4 left-4 bg-kingPink text-white text-xs font-black px-3 py-1.5 rounded-full shadow-md z-10">
                  {discountPercentage}% OFF
                </div>
              )}
            </div>
            
            {Array.isArray(product.images) && product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {product.images.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`w-20 h-20 flex-shrink-0 rounded-2xl overflow-hidden border-2 transition-all ${
                      activeImage === img ? 'border-kingBlue shadow-md scale-95' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`${product.name} thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="w-full lg:w-1/2 flex flex-col">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-extrabold tracking-wider text-slate-500 bg-slate-200 px-3 py-1 rounded-full uppercase">
                SKU: {product.sku}
              </span>
              {product.panIndiaEligible && (
                <span className="text-xs font-bold tracking-wider text-kingPurple bg-purple-100 px-3 py-1 rounded-full flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5" /> Pan-India Delivery
                </span>
              )}
            </div>

            <h1 className="text-3xl lg:text-4xl font-black text-slate-900 mb-3 leading-tight">
              {product.name}
            </h1>

            {/* Price Display */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-4xl font-black text-slate-900">
                {formatINR(salePrice)}
              </span>
              {mrp > salePrice && (
                <span className="text-xl text-slate-400 line-through font-medium">
                  {formatINR(mrp)}
                </span>
              )}
            </div>

            <p className="text-slate-600 mb-6 leading-relaxed text-sm">
              {product.description}
            </p>

            {/* Specifications Card */}
            {(product.ageSuitability || product.weightCapacity) && (
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm mb-6 grid grid-cols-2 gap-4 text-xs">
                {product.ageSuitability && (
                  <div>
                    <span className="text-slate-400 font-bold uppercase block text-[10px]">Age Suitability</span>
                    <span className="font-extrabold text-slate-800 text-sm">{product.ageSuitability}</span>
                  </div>
                )}
                {product.weightCapacity && (
                  <div>
                    <span className="text-slate-400 font-bold uppercase block text-[10px]">Weight Capacity</span>
                    <span className="font-extrabold text-slate-800 text-sm">{product.weightCapacity}</span>
                  </div>
                )}
              </div>
            )}

            {/* Quantity Selector & Action CTAs */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <span className="font-bold text-xs text-slate-700">Quantity</span>
                <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden">
                  <button 
                    disabled={quantity <= 1 || isOutOfStock}
                    onClick={() => setQuantity((q: number) => q - 1)}
                    className="w-10 h-10 flex items-center justify-center bg-slate-50 hover:bg-slate-100 font-bold text-slate-600 disabled:opacity-50"
                  >
                    -
                  </button>
                  <span className="w-12 h-10 flex items-center justify-center font-black text-sm text-slate-900 border-x border-slate-200">
                    {quantity}
                  </span>
                  <button 
                    disabled={quantity >= product.stock || isOutOfStock}
                    onClick={() => setQuantity((q: number) => q + 1)}
                    className="w-10 h-10 flex items-center justify-center bg-slate-50 hover:bg-slate-100 font-bold text-slate-600 disabled:opacity-50"
                  >
                    +
                  </button>
                </div>
                <span className={`text-xs font-bold ${isOutOfStock ? 'text-red-600' : 'text-green-600'}`}>
                  {isOutOfStock ? 'Out of Stock' : `In Stock (${product.stock} available)`}
                </span>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 mt-2">
                <button 
                  onClick={handleBuyNowWhatsApp}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-black py-4 px-6 rounded-2xl shadow-xl transition-all flex justify-center items-center gap-2 text-sm min-h-[48px] active:scale-95"
                >
                  <MessageCircle className="w-5 h-5 fill-current" />
                  BUY NOW ON WHATSAPP
                </button>
                <button 
                  onClick={handleAddToCartClick}
                  disabled={isOutOfStock}
                  className="flex-1 bg-slate-900 hover:bg-kingBlue text-white font-bold py-4 px-6 rounded-2xl transition-all flex justify-center items-center gap-2 text-sm min-h-[48px] disabled:opacity-50"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </button>
              </div>
            </div>

            {/* Delivery Guarantees */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-200/80">
                <div className="bg-blue-50 p-2.5 rounded-xl text-kingBlue">
                  <Truck className="w-5 h-5" />
                </div>
                <div className="text-xs">
                  <p className="font-extrabold text-slate-900">Kozhikode Hub</p>
                  <p className="text-slate-500">2–7 Days Dispatch</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-200/80">
                <div className="bg-pink-50 p-2.5 rounded-xl text-kingPink">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="text-xs">
                  <p className="font-extrabold text-slate-900">Safety Tested</p>
                  <p className="text-slate-500">100% Guaranteed</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Sticky Mobile Action Bar (Min 48px touch targets) */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 p-3 shadow-2xl z-40 flex gap-3">
        <button 
          onClick={handleBuyNowWhatsApp}
          className="flex-[3] bg-green-600 text-white font-black py-3.5 px-3 rounded-xl flex justify-center items-center gap-1.5 text-xs shadow-md min-h-[48px] active:scale-95"
        >
          <MessageCircle className="w-4 h-4 fill-current" />
          BUY NOW ON WHATSAPP
        </button>
        <button 
          onClick={handleAddToCartClick}
          disabled={isOutOfStock}
          className="flex-[2] bg-slate-900 text-white font-bold py-3.5 px-2 rounded-xl flex justify-center items-center gap-1 text-xs min-h-[48px] disabled:opacity-50"
        >
          <ShoppingCart className="w-4 h-4" />
          Cart
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;
