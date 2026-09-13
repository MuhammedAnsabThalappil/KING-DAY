import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ShieldCheck, CreditCard, Banknote, MapPin, User, Truck, ArrowLeft } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { apiClient } from '../../api/client';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const keralaDistricts = [
  'Kozhikode', 'Malappuram', 'Wayanad', 'Kannur', 'Kasaragod',
  'Palakkad', 'Thrissur', 'Ernakulam', 'Idukki', 'Kottayam',
  'Alappuzha', 'Pathanamthitta', 'Kollam', 'Thiruvananthapuram'
];

const Checkout: React.FC = () => {
  const { cartItems, subtotal, getDeliveryCharge, getGrandTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');

  const [shippingAddress, setShippingAddress] = useState('');
  const [shippingCity, setShippingCity] = useState('Kozhikode');
  const [shippingDistrict, setShippingDistrict] = useState('Kozhikode');
  const [shippingState, setShippingState] = useState('Kerala');
  const [shippingPin, setShippingPin] = useState('');

  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'RAZORPAY'>('COD');

  const deliveryCharge = getDeliveryCharge(shippingState);
  const grandTotal = getGrandTotal(shippingState);

  // Validation functions
  const validateStep1 = () => {
    if (!customerName.trim()) return 'Please enter your full name.';
    if (!/^[6-9]\d{9}$/.test(customerPhone.trim())) return 'Please enter a valid 10-digit Indian mobile number.';
    return null;
  };

  const validateStep2 = () => {
    if (!shippingAddress.trim()) return 'Please enter your delivery street address.';
    if (!shippingState.trim()) return 'Please select or enter your state.';
    if (!/^\d{6}$/.test(shippingPin.trim())) return 'Please enter a valid 6-digit Indian PIN code.';
    return null;
  };

  const handleNextStep = () => {
    setErrorMessage(null);
    if (step === 1) {
      const err = validateStep1();
      if (err) { setErrorMessage(err); return; }
    }
    if (step === 2) {
      const err = validateStep2();
      if (err) { setErrorMessage(err); return; }
    }
    setStep((prev) => Math.min(prev + 1, 4));
  };

  const handleOrderSubmission = async () => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const orderPayload = {
        customerName,
        customerEmail,
        customerPhone,
        shippingAddress,
        shippingCity,
        shippingDistrict,
        shippingState,
        shippingPin,
        paymentMethod,
        items: cartItems.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
      };

      const response = await apiClient.post('/orders', orderPayload);
      const { order, razorpayOrder } = response.data;

      if (paymentMethod === 'COD') {
        clearCart();
        navigate(`/order-success?orderId=${order.id}`);
        return;
      }

      if (paymentMethod === 'RAZORPAY') {
        // Load Razorpay script dynamically if missing
        if (!window.Razorpay) {
          const script = document.createElement('script');
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          script.async = true;
          document.body.appendChild(script);
          await new Promise((resolve) => (script.onload = resolve));
        }

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_stub_key_id',
          amount: razorpayOrder ? razorpayOrder.amount : grandTotal * 100,
          currency: 'INR',
          name: 'KING DAY Store',
          description: `Order #${order.orderNumber}`,
          order_id: razorpayOrder ? razorpayOrder.id : undefined,
          handler: async (rzpRes: any) => {
            try {
              await apiClient.post('/payments/verify', {
                razorpayOrderId: rzpRes.razorpay_order_id || razorpayOrder?.id,
                razorpayPaymentId: rzpRes.razorpay_payment_id || `pay_mock_${Date.now()}`,
                razorpaySignature: rzpRes.razorpay_signature || 'signature_mock',
                orderId: order.id,
              });

              clearCart();
              navigate(`/order-success?orderId=${order.id}`);
            } catch (err: any) {
              setErrorMessage('Payment verification failed. Please contact support.');
            }
          },
          prefill: {
            name: customerName,
            email: customerEmail,
            contact: customerPhone,
          },
          theme: {
            color: '#0B2D6B',
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    } catch (error: any) {
      console.error('Checkout failed:', error);
      setErrorMessage(error.response?.data?.message || 'Failed to process order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="pt-28 pb-16 min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl text-center shadow-sm max-w-sm">
          <p className="text-slate-600 font-medium mb-4">Your cart is empty. Add items before checking out.</p>
          <button onClick={() => navigate('/shop')} className="bg-kingBlue text-white font-bold px-6 py-2.5 rounded-xl text-xs">
            Return to Shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-16 min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* Step Indicator Bar */}
        <div className="mb-8 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex justify-between items-center text-xs font-extrabold text-slate-400">
            <span className={`flex items-center gap-1.5 ${step >= 1 ? 'text-kingBlue' : ''}`}>
              <User className="w-4 h-4" /> 1. Customer
            </span>
            <span className={`flex items-center gap-1.5 ${step >= 2 ? 'text-kingBlue' : ''}`}>
              <MapPin className="w-4 h-4" /> 2. Address
            </span>
            <span className={`flex items-center gap-1.5 ${step >= 3 ? 'text-kingBlue' : ''}`}>
              <Truck className="w-4 h-4" /> 3. Delivery
            </span>
            <span className={`flex items-center gap-1.5 ${step >= 4 ? 'text-kingBlue' : ''}`}>
              <CreditCard className="w-4 h-4" /> 4. Payment
            </span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-brand-gradient h-1.5 transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm font-semibold rounded-2xl">
            {errorMessage}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Wizard Form */}
          <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
            
            {/* STEP 1: CUSTOMER DETAILS */}
            {step === 1 && (
              <div>
                <h2 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-kingBlue" /> Step 1: Customer Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Muhammed Ansab"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-kingBlue focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Phone (WhatsApp Notifications) *</label>
                    <input
                      type="tel"
                      placeholder="10-digit Indian Mobile Number"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-kingBlue focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Email Address (Optional for Invoice)</label>
                    <input
                      type="email"
                      placeholder="ansab@example.com"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-kingBlue focus:bg-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: ADDRESS */}
            {step === 2 && (
              <div>
                <h2 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-kingBlue" /> Step 2: Shipping Destination
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Street Address / House / Building *</label>
                    <textarea
                      rows={2}
                      placeholder="House No., Building Name, Street"
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-kingBlue focus:bg-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">City / Town *</label>
                      <input
                        type="text"
                        value={shippingCity}
                        onChange={(e) => setShippingCity(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-kingBlue focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">District</label>
                      <select
                        value={shippingDistrict}
                        onChange={(e) => setShippingDistrict(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-kingBlue focus:bg-white"
                      >
                        {keralaDistricts.map((d) => <option key={d} value={d}>{d}</option>)}
                        <option value="Other">Other / Non-Kerala</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">State *</label>
                      <input
                        type="text"
                        value={shippingState}
                        onChange={(e) => setShippingState(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-kingBlue focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">PIN Code *</label>
                      <input
                        type="text"
                        maxLength={6}
                        placeholder="673001"
                        value={shippingPin}
                        onChange={(e) => setShippingPin(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-kingBlue focus:bg-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: DELIVERY METHOD */}
            {step === 3 && (
              <div>
                <h2 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-kingBlue" /> Step 3: Fulfillment & Delivery
                </h2>
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl border-2 border-kingBlue bg-blue-50/50 flex items-start gap-4">
                    <CheckCircle2 className="w-6 h-6 text-kingBlue flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm">
                        {shippingState.toLowerCase().includes('kerala') ? 'Kerala Direct Hub Dispatch (2–7 Working Days)' : 'Pan-India Freight Service (5–9 Days)'}
                      </h4>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        Dispatched directly from KING DAY Kozhikode Flagship Hub. Full tracking provided via Mobile + Order ID.
                      </p>
                      <div className="mt-2 text-xs font-bold text-kingBlue">
                        Shipping Fee: {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: PAYMENT METHOD */}
            {step === 4 && (
              <div>
                <h2 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-kingBlue" /> Step 4: Select Payment Method
                </h2>
                <div className="space-y-4">
                  
                  {/* COD */}
                  <label
                    className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      paymentMethod === 'COD' ? 'border-kingBlue bg-blue-50/50' : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'COD'}
                        onChange={() => setPaymentMethod('COD')}
                        className="w-4 h-4 text-kingBlue"
                      />
                      <div>
                        <span className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                          <Banknote className="w-4 h-4 text-green-600" /> Cash on Delivery (COD)
                        </span>
                        <p className="text-xs text-slate-500 mt-0.5">Pay in cash when order arrives at your address</p>
                      </div>
                    </div>
                  </label>

                  {/* Razorpay */}
                  <label
                    className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      paymentMethod === 'RAZORPAY' ? 'border-kingBlue bg-blue-50/50' : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'RAZORPAY'}
                        onChange={() => setPaymentMethod('RAZORPAY')}
                        className="w-4 h-4 text-kingBlue"
                      />
                      <div>
                        <span className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-kingPurple" /> Online Payment (UPI / Razorpay / Cards)
                        </span>
                        <p className="text-xs text-slate-500 mt-0.5">Instant confirmation via GPay, PhonePe, Paytm, or Credit Card</p>
                      </div>
                    </div>
                  </label>

                </div>
              </div>
            )}

            {/* Navigation Controls */}
            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep((s) => s - 1)}
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900"
                >
                  <ArrowLeft className="w-4 h-4" /> Previous Step
                </button>
              ) : <div />}

              {step < 4 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="bg-kingBlue text-white font-extrabold px-6 py-3 rounded-xl text-xs shadow hover:bg-blue-900 transition-all"
                >
                  Continue
                </button>
              ) : (
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleOrderSubmission}
                  className="bg-brand-gradient hover:opacity-95 text-white font-extrabold px-8 py-3.5 rounded-xl text-sm shadow-xl disabled:opacity-50 transition-all"
                >
                  {loading ? 'Processing Order...' : `Place Order (₹${grandTotal.toLocaleString('en-IN')})`}
                </button>
              )}
            </div>

          </div>

          {/* Mini Summary Sidebar */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm h-fit">
            <h3 className="font-black text-slate-900 text-base mb-4">Cart Summary</h3>
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2 mb-4 scrollbar-hide">
              {cartItems.map((item) => (
                <div key={item.product.id} className="flex justify-between text-xs py-1 border-b border-slate-100">
                  <span className="font-semibold text-slate-700 line-clamp-1 flex-1 pr-2">
                    {item.quantity}x {item.product.name}
                  </span>
                  <span className="font-bold text-slate-900">
                    ₹{(Number(item.product.salePrice) * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-xs border-t border-slate-100 pt-3">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Delivery Charge:</span>
                <span>{deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}</span>
              </div>
              <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
                <span>Grand Total:</span>
                <span>₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-center gap-1 text-[11px] text-slate-400 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-green-600" /> Authorized Kozhikode Dispatch
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;
