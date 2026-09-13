import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, Truck, Printer, ShoppingBag, MessageCircle } from 'lucide-react';
import { Order } from '../types/schema';
import { apiClient } from '../api/client';
import PrintableInvoice from '../components/admin/PrintableInvoice';
import { generateWhatsAppOrderTrackingLink } from '../services/whatsappService';

const OrderSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [showInvoice, setShowInvoice] = useState(false);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    const fetchOrderDetails = async () => {
      try {
        const res = await apiClient.post('/orders/track', {
          orderId,
          phone: '', // fetch fallback
        });
        setOrder(res.data);
      } catch (error) {
        console.error('Order success fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  return (
    <div className="pt-28 pb-16 min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 max-w-3xl">
        
        {/* Success Header */}
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200/80 shadow-sm text-center mb-8">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">Order Confirmed!</h1>
          <p className="text-slate-600 text-sm max-w-md mx-auto mb-6">
            Thank you for shopping with KING DAY! Your order has been placed successfully and dispatched from our Kozhikode hub.
          </p>

          {order && (
            <div className="inline-block bg-slate-100 px-4 py-2 rounded-xl text-xs font-mono font-extrabold text-slate-800 mb-6">
              ORDER ID: #{order.orderNumber}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/track-order"
              className="bg-kingBlue hover:bg-blue-900 text-white font-extrabold px-6 py-3 rounded-xl text-xs flex items-center gap-2 transition-all shadow"
            >
              <Truck className="w-4 h-4" /> Track Order Status
            </Link>

            {order && (
              <button
                onClick={() => setShowInvoice(true)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold px-6 py-3 rounded-xl text-xs flex items-center gap-2 transition-all border border-slate-200"
              >
                <Printer className="w-4 h-4" /> Printable Invoice
              </button>
            )}

            <Link
              to="/shop"
              className="bg-brand-gradient hover:opacity-90 text-white font-extrabold px-6 py-3 rounded-xl text-xs flex items-center gap-2 transition-all shadow"
            >
              <ShoppingBag className="w-4 h-4" /> Continue Shopping
            </Link>
          </div>
        </div>

        {/* Order Details Summary */}
        {order && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm mb-8">
            <h3 className="font-black text-slate-900 text-lg mb-4">Summary & Destination</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs mb-6 bg-slate-50 p-4 rounded-2xl">
              <div>
                <p className="text-slate-400 font-bold uppercase mb-1">Customer</p>
                <p className="font-extrabold text-slate-800">{order.customerName}</p>
                <p className="text-slate-600">{order.customerPhone}</p>
              </div>
              <div>
                <p className="text-slate-400 font-bold uppercase mb-1">Shipping Address</p>
                <p className="text-slate-700 leading-relaxed">
                  {order.shippingAddress}, {order.shippingCity}, {order.shippingDistrict}, {order.shippingState} - {order.shippingPin}
                </p>
              </div>
            </div>

            <h4 className="font-bold text-slate-900 text-sm mb-3">Items Ordered</h4>
            <div className="divide-y divide-slate-100 mb-6">
              {order.orderItems?.map((item) => (
                <div key={item.id} className="py-3 flex justify-between items-center text-xs">
                  <div>
                    <p className="font-bold text-slate-800">{item.product?.name}</p>
                    <p className="text-slate-400">SKU: {item.product?.sku} • Qty: {item.quantity}</p>
                  </div>
                  <span className="font-black text-slate-900">
                    ₹{(Number(item.price) * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-100 pt-4 text-xs space-y-1.5">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span>₹{Number(order.subtotal).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Delivery Charge:</span>
                <span>{Number(order.deliveryCharge) === 0 ? 'FREE' : `₹${Number(order.deliveryCharge)}`}</span>
              </div>
              <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
                <span>Total Amount Paid:</span>
                <span>₹{Number(order.totalAmount).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        )}

        {/* WhatsApp Helpline Box */}
        <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
          <h4 className="font-bold text-green-900 text-sm mb-1">Need help with your dispatch?</h4>
          <p className="text-xs text-green-700 mb-4">Connect directly with our Kozhikode logistics team on WhatsApp.</p>
          <a
            href={generateWhatsAppOrderTrackingLink(order?.orderNumber || 'KD-ORDER')}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-extrabold px-6 py-2.5 rounded-xl text-xs transition-all"
          >
            <MessageCircle className="w-4 h-4" /> Message Support (+91 9495902904)
          </a>
        </div>

      </div>

      {/* Invoice Modal */}
      {showInvoice && order && (
        <PrintableInvoice order={order} onClose={() => setShowInvoice(false)} />
      )}
    </div>
  );
};

export default OrderSuccess;
