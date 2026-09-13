import React, { useState } from 'react';
import { Search, Truck, CheckCircle2, Clock, PackageCheck, AlertCircle } from 'lucide-react';
import { Order, OrderStatus } from '../types/schema';
import { apiClient } from '../api/client';

const timelineStages: { key: OrderStatus; label: string; desc: string }[] = [
  { key: 'PLACED', label: 'Order Placed', desc: 'Received at Kozhikode Hub' },
  { key: 'PAYMENT_CONFIRMED', label: 'Payment Confirmed', desc: 'Payment verified' },
  { key: 'PROCESSING', label: 'Processing', desc: 'Testing & inspection' },
  { key: 'PACKED', label: 'Packed', desc: 'Boxed with protective foam' },
  { key: 'SHIPPED', label: 'Shipped', desc: 'In transit with logistics' },
  { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', desc: 'Courier agent assigned' },
  { key: 'DELIVERED', label: 'Delivered', desc: 'Handed over safely' },
];

const getStageIndex = (status: OrderStatus) => {
  switch (status) {
    case 'PLACED': return 0;
    case 'PAYMENT_PENDING': return 0;
    case 'PAYMENT_CONFIRMED': return 1;
    case 'PROCESSING': return 2;
    case 'PACKED': return 3;
    case 'SHIPPED': return 4;
    case 'OUT_FOR_DELIVERY': return 5;
    case 'DELIVERED': return 6;
    case 'CANCELLED': return -1;
    default: return 0;
  }
};

const TrackOrder: React.FC = () => {
  const [orderIdInput, setOrderIdInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleTrackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderIdInput.trim() || !phoneInput.trim()) {
      setErrorMsg('Please enter both Order ID and Mobile Phone Number.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setOrder(null);

    try {
      const res = await apiClient.post('/orders/track', {
        orderId: orderIdInput.trim(),
        phone: phoneInput.trim(),
      });
      setOrder(res.data);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'No matching order found with provided details.');
    } finally {
      setLoading(false);
    }
  };

  const currentStageIdx = order ? getStageIndex(order.status) : -1;

  return (
    <div className="pt-28 pb-16 min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* Title */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="w-14 h-14 bg-blue-100 text-kingBlue rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Truck className="w-7 h-7" />
          </div>
          <h1 className="text-3xl lg:text-4xl font-black text-slate-900">Track Order Status</h1>
          <p className="text-slate-500 text-sm mt-1">
            Enter your Order ID (e.g. KD-123456-7890) and Mobile Phone to view live Kozhikode dispatch status.
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleTrackSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm mb-10 max-w-xl mx-auto">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Order ID *</label>
              <input
                type="text"
                placeholder="KD-123456-7890"
                value={orderIdInput}
                onChange={(e) => setOrderIdInput(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-kingBlue focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Phone Number *</label>
              <input
                type="tel"
                placeholder="10-digit Indian Mobile Number"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-kingBlue focus:bg-white"
              />
            </div>

            {errorMsg && (
              <p className="text-red-600 text-xs font-semibold flex items-center gap-1">
                <AlertCircle className="w-4 h-4" /> {errorMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-gradient hover:opacity-95 text-white font-extrabold py-3.5 px-6 rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" /> {loading ? 'Searching...' : 'Track Dispatch'}
            </button>
          </div>
        </form>

        {/* 7-Stage Fulfillment Timeline */}
        {order && (
          <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/80 shadow-sm max-w-3xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-6 mb-8 gap-2">
              <div>
                <span className="text-xs font-extrabold uppercase text-slate-400">ORDER NO</span>
                <h3 className="text-xl font-black text-slate-900">#{order.orderNumber}</h3>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-xs font-extrabold uppercase text-slate-400">DESTINATION</span>
                <p className="text-xs font-bold text-slate-800">{order.shippingCity}, {order.shippingState}</p>
              </div>
            </div>

            {order.status === 'CANCELLED' ? (
              <div className="p-6 bg-red-50 border border-red-200 text-red-700 font-bold rounded-2xl text-center">
                This order has been CANCELLED. Please contact support at +91 9495902904.
              </div>
            ) : (
              <div className="relative pl-6 border-l-2 border-slate-200 space-y-8 my-4">
                {timelineStages.map((stage, idx) => {
                  const isPassed = idx <= currentStageIdx;
                  const isCurrent = idx === currentStageIdx;

                  return (
                    <div key={stage.key} className="relative group">
                      {/* Timeline Circle */}
                      <div
                        className={`absolute -left-[31px] top-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                          isPassed
                            ? 'bg-green-600 text-white ring-4 ring-green-100'
                            : 'bg-slate-200 text-slate-500'
                        }`}
                      >
                        {isPassed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                      </div>

                      <div>
                        <h4 className={`text-sm font-extrabold ${isCurrent ? 'text-kingBlue' : isPassed ? 'text-slate-900' : 'text-slate-400'}`}>
                          {stage.label} {isCurrent && <span className="ml-2 text-[10px] bg-blue-100 text-kingBlue px-2 py-0.5 rounded-full uppercase">CURRENT STATUS</span>}
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">{stage.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default TrackOrder;
