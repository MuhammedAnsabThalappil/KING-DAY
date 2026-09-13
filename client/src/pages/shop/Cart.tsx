import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const Cart: React.FC = () => {
  const { cartItems, removeFromCart, updateQuantity, subtotal, cartCount } = useCart();
  const navigate = useNavigate();

  const freeDeliveryThreshold = 3000;
  const progressToFreeDelivery = Math.min((subtotal / freeDeliveryThreshold) * 100, 100);
  const remainingForFreeDelivery = freeDeliveryThreshold - subtotal;

  if (cartItems.length === 0) {
    return (
      <div className="pt-28 pb-16 min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="bg-white p-12 rounded-3xl border border-slate-200/80 shadow-sm text-center max-w-md mx-auto">
          <div className="w-20 h-20 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">Your Cart is Empty</h2>
          <p className="text-slate-500 text-sm mb-6">Explore our ride-ons and toys to add items to your cart.</p>
          <Link
            to="/shop"
            className="inline-flex items-center justify-center gap-2 bg-brand-gradient text-white font-extrabold px-8 py-3.5 rounded-2xl shadow-lg hover:opacity-90 transition-all"
          >
            Explore Catalog <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-16 min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl lg:text-4xl font-black text-slate-900 mb-2">Shopping Cart ({cartCount})</h1>
        <p className="text-slate-500 text-sm mb-8">Review items in your cart before proceeding to checkout</p>

        {/* Free Delivery Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm mb-8">
          <div className="flex items-center justify-between text-xs font-bold mb-2">
            <span className="flex items-center gap-1 text-slate-700">
              <Truck className="w-4 h-4 text-kingBlue" /> Free Kerala Delivery Tracker
            </span>
            <span>
              {remainingForFreeDelivery <= 0 ? (
                <span className="text-green-600 font-extrabold">🎉 You unlocked FREE Delivery!</span>
              ) : (
                `Add ₹${remainingForFreeDelivery.toLocaleString('en-IN')} more for FREE delivery`
              )}
            </span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-brand-gradient h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressToFreeDelivery}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => {
              const salePrice = Number(item.product.salePrice);
              const itemTotal = salePrice * item.quantity;
              const imageUrl = Array.isArray(item.product.images) && item.product.images.length > 0
                ? item.product.images[0]
                : 'https://via.placeholder.com/150';

              return (
                <div
                  key={item.product.id}
                  className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/80 shadow-sm flex gap-4 items-center"
                >
                  <img
                    src={imageUrl}
                    alt={item.product.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl bg-slate-100 flex-shrink-0"
                  />

                  <div className="flex-grow">
                    <span className="text-[10px] font-extrabold uppercase text-slate-400">SKU: {item.product.sku}</span>
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base line-clamp-1">{item.product.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">₹{salePrice.toLocaleString('en-IN')} each</p>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold"
                        >
                          -
                        </button>
                        <span className="w-10 h-8 flex items-center justify-center font-bold text-xs text-slate-900 border-x border-slate-200">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock}
                          className="w-8 h-8 flex items-center justify-center bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold disabled:opacity-40"
                        >
                          +
                        </button>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="font-black text-slate-900 text-base">
                          ₹{itemTotal.toLocaleString('en-IN')}
                        </span>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-slate-400 hover:text-red-600 p-1.5 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cart Summary Sidebar */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm h-fit">
            <h3 className="font-black text-slate-900 text-lg mb-4">Order Summary</h3>

            <div className="space-y-3 text-sm border-b border-slate-100 pb-4 mb-4">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal ({cartCount} items)</span>
                <span className="font-bold text-slate-900">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Estimated Shipping</span>
                <span className="text-xs font-semibold text-slate-500">Calculated at Checkout</span>
              </div>
            </div>

            <div className="flex justify-between text-lg font-black text-slate-900 mb-6">
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString('en-IN')}</span>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-brand-gradient hover:opacity-95 text-white font-extrabold py-4 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
              Proceed to Checkout <ArrowRight className="w-4 h-4" />
            </button>

            <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-slate-500 font-medium">
              <ShieldCheck className="w-4 h-4 text-green-600" /> Secure 256-bit Encrypted Checkout
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Cart;
