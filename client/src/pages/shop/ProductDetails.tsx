import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { generateWhatsAppEnquiryLink } from '../../services/whatsappService';

// Interfaces for our product model
interface Product {
  id: string;
  slug: string;
  sku: string;
  name: string;
  description: string;
  mrp: number;
  salePrice: number;
  stock: number;
  isPublished: boolean;
  images: string[];
  panIndiaEligible: boolean;
}

const ProductDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    // Stub: Fetch product by slug. 
    // In production, this would be an API call: axios.get(`/api/products/${slug}`)
    setTimeout(() => {
      // Mocking the real catalog baseline from specs
      const mockData: Record<string, Product> = {
        'toyzone-wizard-electric-scooty': {
          id: 'p1',
          slug: 'toyzone-wizard-electric-scooty',
          sku: 'KD-TZ-WIZ-01',
          name: 'Toyzone Wizard Electric Scooty',
          description: 'Fun and safe electric scooty for kids with authentic design.',
          mrp: 12999,
          salePrice: 6999,
          stock: 15,
          isPublished: true,
          images: [
            'https://via.placeholder.com/600x600?text=Wizard+Scooty+1',
            'https://via.placeholder.com/600x600?text=Wizard+Scooty+2',
            'https://via.placeholder.com/600x600?text=Wizard+Scooty+3'
          ],
          panIndiaEligible: true
        },
        'king-day-alpine-off-road-electric-jeep-12v': {
          id: 'p2',
          slug: 'king-day-alpine-off-road-electric-jeep-12v',
          sku: 'KD-JEEP-ALP-12',
          name: 'KING DAY Alpine Off-Road Electric Jeep 12V',
          description: 'Ultimate off-road experience for your little adventurer with 12V power.',
          mrp: 24999,
          salePrice: 17999,
          stock: 4,
          isPublished: true,
          images: [
            'https://via.placeholder.com/600x600?text=Alpine+Jeep+1',
            'https://via.placeholder.com/600x600?text=Alpine+Jeep+2'
          ],
          panIndiaEligible: false
        }
      };

      const found = mockData[slug || 'toyzone-wizard-electric-scooty'];
      if (found) {
        setProduct(found);
        setActiveImage(found.images[0]);
      }
      setLoading(false);
    }, 600);
  }, [slug]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center pt-20">Loading...</div>;
  }

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center pt-20">Product not found.</div>;
  }

  const discountPercentage = Math.round(((product.mrp - product.salePrice) / product.mrp) * 100);
  const isOutOfStock = product.stock <= 0;

  const handleWhatsAppClick = () => {
    const url = generateWhatsAppEnquiryLink({
      productName: product.name,
      sku: product.sku,
      salePrice: product.salePrice,
      productUrl: window.location.href,
    });
    window.open(url, '_blank');
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    setIsAddingToCart(true);
    // Stub: Dispatch to CartContext
    setTimeout(() => {
      setIsAddingToCart(false);
      // Optional: navigate to cart or show success toast
    }, 500);
  };

  // JSON-LD Schema Generation
  const schemaData = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": product.images,
    "description": product.description,
    "sku": product.sku,
    "brand": {
      "@type": "Brand",
      "name": "KING DAY"
    },
    "offers": {
      "@type": "Offer",
      "url": window.location.href,
      "priceCurrency": "INR",
      "price": product.salePrice,
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
    <div className="bg-gray-50 pt-24 pb-16 min-h-screen">
      {/* Schema Injection */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }} />

      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Gallery Switcher */}
          <div className="w-full lg:w-1/2 flex flex-col gap-4">
            <div className="aspect-square bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm relative group">
              <img 
                src={activeImage} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {discountPercentage > 0 && (
                <div className="absolute top-4 left-4 bg-kingPink text-white text-sm font-bold px-3 py-1 rounded-full shadow-md z-10">
                  {discountPercentage}% OFF
                </div>
              )}
            </div>
            
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {product.images.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                    activeImage === img ? 'border-kingBlue shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`${product.name} thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="w-full lg:w-1/2 flex flex-col pt-2 lg:pt-8">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-bold tracking-wider text-gray-500 bg-gray-200 px-3 py-1 rounded-full uppercase">
                SKU: {product.sku}
              </span>
              {product.panIndiaEligible && (
                <span className="text-sm font-bold tracking-wider text-kingPurple bg-purple-100 px-3 py-1 rounded-full flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  Pan-India Delivery
                </span>
              )}
            </div>

            <h1 className="text-3xl lg:text-4xl font-black text-gray-900 mb-4 leading-tight">
              {product.name}
            </h1>

            <div className="flex items-end gap-3 mb-6">
              <span className="text-4xl font-bold text-gray-900">
                ₹{product.salePrice.toLocaleString('en-IN')}
              </span>
              {product.mrp > product.salePrice && (
                <span className="text-lg text-gray-400 line-through font-medium mb-1">
                  ₹{product.mrp.toLocaleString('en-IN')}
                </span>
              )}
            </div>

            <p className="text-gray-600 mb-8 leading-relaxed text-lg">
              {product.description}
            </p>

            {/* Actions */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <span className="font-semibold text-gray-700">Quantity</span>
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                  <button 
                    disabled={quantity <= 1 || isOutOfStock}
                    onClick={() => setQuantity(q => q - 1)}
                    className="w-10 h-10 flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-600 disabled:opacity-50 transition-colors"
                  >
                    -
                  </button>
                  <span className="w-12 h-10 flex items-center justify-center font-semibold text-gray-900 border-x border-gray-200">
                    {quantity}
                  </span>
                  <button 
                    disabled={quantity >= product.stock || isOutOfStock}
                    onClick={() => setQuantity(q => q + 1)}
                    className="w-10 h-10 flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-600 disabled:opacity-50 transition-colors"
                  >
                    +
                  </button>
                </div>
                <span className={`text-sm font-medium ${isOutOfStock ? 'text-red-500' : 'text-green-600'}`}>
                  {isOutOfStock ? 'Out of Stock' : `In Stock (${product.stock} available)`}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-2">
                <button 
                  onClick={handleAddToCart}
                  disabled={isOutOfStock || isAddingToCart}
                  className="flex-1 bg-brand-gradient text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex justify-center items-center gap-2"
                >
                  {isAddingToCart ? 'Adding...' : 'Add to Cart'}
                </button>
                <button 
                  onClick={handleWhatsAppClick}
                  className="flex-1 border-2 border-green-500 text-green-600 bg-green-50 hover:bg-green-500 hover:text-white font-bold py-4 px-6 rounded-xl transition-all flex justify-center items-center gap-2"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                  </svg>
                  Enquire via WhatsApp
                </button>
              </div>
            </div>

            {/* Delivery Promises */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100">
                <div className="bg-blue-50 p-2 rounded-md text-kingBlue">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <div className="text-sm">
                  <p className="font-semibold text-gray-900">Fast Dispatch</p>
                  <p className="text-gray-500">From Kozhikode Hub</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100">
                <div className="bg-pink-50 p-2 rounded-md text-kingPink">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                </div>
                <div className="text-sm">
                  <p className="font-semibold text-gray-900">Secure Payment</p>
                  <p className="text-gray-500">100% Protected</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Sticky Mobile Action Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-40 flex gap-3">
        <button 
          onClick={handleWhatsAppClick}
          className="flex-1 border-2 border-green-500 text-green-600 bg-white font-bold py-3 px-2 rounded-xl flex justify-center items-center"
        >
          <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
          </svg>
          Enquire
        </button>
        <button 
          onClick={handleAddToCart}
          disabled={isOutOfStock || isAddingToCart}
          className="flex-[2] bg-brand-gradient text-white font-bold py-3 px-2 rounded-xl shadow-lg disabled:opacity-50"
        >
          {isAddingToCart ? 'Adding...' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;
