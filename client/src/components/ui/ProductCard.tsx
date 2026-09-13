import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, MessageCircle, Truck } from 'lucide-react';
import { Product } from '../../types/schema';
import { useCart } from '../../context/CartContext';
import { generateWhatsAppEnquiryLink } from '../../services/whatsappService';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  const mrp = Number(product.mrp);
  const salePrice = Number(product.salePrice);
  const discountPercentage = mrp > salePrice ? Math.round(((mrp - salePrice) / mrp) * 100) : 0;
  const isOutOfStock = product.stock <= 0;

  const imageUrl = Array.isArray(product.images) && product.images.length > 0
    ? product.images[0]
    : 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=600&q=80';

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const link = generateWhatsAppEnquiryLink({
      productName: product.name,
      sku: product.sku,
      salePrice: salePrice,
      productUrl: `${window.location.origin}/product/${product.slug}`,
    });
    window.open(link, '_blank');
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isOutOfStock) {
      addToCart(product);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group">
      
      {/* Image Container */}
      <Link to={`/product/${product.slug}`} className="relative block aspect-square bg-slate-50 overflow-hidden">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Discount Badge */}
        {discountPercentage > 0 && (
          <span className="absolute top-3 left-3 bg-kingPink text-white text-xs font-black px-2.5 py-1 rounded-full shadow-md z-10">
            {discountPercentage}% OFF
          </span>
        )}

        {/* Pan-India Badge */}
        {product.panIndiaEligible && (
          <span className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
            <Truck className="w-3 h-3 text-kingYellow" /> Pan-India
          </span>
        )}

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-red-600 text-white font-extrabold text-xs px-3 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
              OUT OF STOCK
            </span>
          </div>
        )}
      </Link>

      {/* Details */}
      <div className="p-5 flex-grow flex flex-col justify-between">
        <div>
          <div className="text-[11px] font-extrabold tracking-wider uppercase text-slate-400 mb-1">
            {product.category} • SKU: {product.sku}
          </div>
          <Link to={`/product/${product.slug}`} className="block">
            <h3 className="font-bold text-slate-900 text-base line-clamp-2 hover:text-kingBlue transition-colors leading-snug mb-2">
              {product.name}
            </h3>
          </Link>
        </div>

        <div>
          {/* Price Section */}
          <div className="flex items-baseline gap-2 mb-4 mt-2">
            <span className="text-2xl font-black text-slate-900">
              ₹{salePrice.toLocaleString('en-IN')}
            </span>
            {mrp > salePrice && (
              <span className="text-sm text-slate-400 line-through font-medium">
                ₹{mrp.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="flex-1 bg-brand-gradient hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold py-3 px-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5"
            >
              <ShoppingCart className="w-4 h-4" />
              {isOutOfStock ? 'Sold Out' : 'Add to Cart'}
            </button>
            <button
              onClick={handleWhatsAppClick}
              title="Enquire on WhatsApp"
              className="border border-green-500 text-green-600 hover:bg-green-500 hover:text-white p-3 rounded-xl transition-all flex items-center justify-center"
            >
              <MessageCircle className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductCard;
