import React from 'react';
import { useLocation } from 'react-router-dom';

const LegalPages: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;

  let title = 'Policy & Terms';
  let content = <p>Default policy information.</p>;

  if (path === '/shipping-policy') {
    title = 'Shipping & Delivery Policy';
    content = (
      <div className="space-y-4">
        <p><strong>Kozhikode Dispatch Hub:</strong> All orders are dispatched directly from our Kozhikode fulfillment hub in Kerala, India.</p>
        <p><strong>Kerala Delivery Timeline:</strong> Deliveries to Kozhikode, Malappuram, Wayanad, Kannur, Ernakulam, and all Kerala districts are delivered within 2–7 working days via our local logistics network.</p>
        <p><strong>Pan-India Shipping:</strong> Pan-India shipping is available for products flagged as eligible. Typical Pan-India transit takes 5–9 working days.</p>
        <p><strong>Tracking:</strong> Once dispatched, order tracking is available on our storefront using your Order ID and registered mobile phone number.</p>
      </div>
    );
  } else if (path === '/return-policy') {
    title = 'Returns & Guarantee Policy';
    content = (
      <div className="space-y-4">
        <p><strong>Inspection Guarantee:</strong> Every electric ride-on jeep, scooty, and toy is tested for battery performance and motor integrity before packaging.</p>
        <p><strong>Transit Damage Protection:</strong> In the unlikely event of transit damage, notify our helpline (+91 9495902904) within 48 hours of delivery with unboxing footage for instant replacement.</p>
        <p><strong>Return Eligibility:</strong> Items must be returned in original packaging with accessories and tax invoice.</p>
      </div>
    );
  } else if (path === '/privacy-policy') {
    title = 'Privacy Policy';
    content = (
      <div className="space-y-4">
        <p><strong>Data Privacy:</strong> KING DAY values your privacy. We collect customer names, shipping addresses, phone numbers, and email addresses exclusively to fulfill orders and send tracking updates.</p>
        <p><strong>Secure Payments:</strong> We do not store financial credentials or credit card numbers. Payments are processed securely via Razorpay payment gateway.</p>
      </div>
    );
  } else if (path === '/terms') {
    title = 'Terms of Service';
    content = (
      <div className="space-y-4">
        <p><strong>Storefront Terms:</strong> By placing an order on king-day.shop, you agree to our shipping terms, product usage instructions, and pricing policies.</p>
        <p><strong>Pricing:</strong> All prices are displayed in INR (₹). KING DAY reserves the right to modify promotional pricing or stock availability.</p>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-16 min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200/80 shadow-sm">
          <span className="text-xs font-black text-kingPink uppercase tracking-widest">KING DAY LEGAL</span>
          <h1 className="text-3xl lg:text-4xl font-black text-slate-900 mt-1 mb-6">{title}</h1>
          <div className="text-slate-700 text-sm leading-relaxed">{content}</div>
        </div>
      </div>
    </div>
  );
};

export default LegalPages;
