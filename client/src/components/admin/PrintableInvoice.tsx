import React from 'react';
import { Printer, X } from 'lucide-react';
import { Order } from '../../types/schema';

interface PrintableInvoiceProps {
  order: Order;
  onClose: () => void;
}

const PrintableInvoice: React.FC<PrintableInvoiceProps> = ({ order, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden my-8 print:shadow-none print:m-0 print:w-full print:rounded-none">
        
        {/* Modal Action Header (Hidden in Print) */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between print:hidden">
          <span className="font-bold text-sm">Printable Tax Invoice — Order #{order.orderNumber}</span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="bg-kingPink hover:opacity-90 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 transition-all shadow"
            >
              <Printer className="w-4 h-4" /> Print Invoice
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-2 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Area */}
        <div className="p-8 md:p-12 print:p-6 text-slate-800" id="invoice-content">
          
          {/* Invoice Header */}
          <div className="flex justify-between items-start border-b border-slate-200 pb-6 mb-6">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">
                KING<span className="text-kingPink">DAY</span>
              </h1>
              <p className="text-xs text-slate-500 font-bold mt-1">Fun • Quality • Happiness</p>
              <p className="text-xs text-slate-600 mt-2">
                Flagship Retail & Fulfillment Hub<br />
                Kozhikode, Kerala 673001, India<br />
                Helpline: +91 9495902904 | support@king-day.shop
              </p>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-bold uppercase tracking-wider text-slate-700">Tax / Sale Invoice</h2>
              <p className="text-sm font-extrabold text-kingBlue mt-1">#{order.orderNumber}</p>
              <p className="text-xs text-slate-500 mt-1">
                Date: {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
              <div className="mt-2 inline-block px-3 py-1 bg-slate-100 rounded-md text-xs font-bold text-slate-700">
                Payment: <span className="uppercase">{order.paymentMethod}</span> ({order.paymentStatus})
              </div>
            </div>
          </div>

          {/* Customer & Shipping Details */}
          <div className="grid grid-cols-2 gap-6 mb-8 text-xs">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <h3 className="font-bold text-slate-900 uppercase tracking-wider mb-2">Customer Details</h3>
              <p className="font-semibold text-slate-800 text-sm">{order.customerName}</p>
              <p className="text-slate-600">Phone: {order.customerPhone}</p>
              {order.customerEmail && <p className="text-slate-600">Email: {order.customerEmail}</p>}
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <h3 className="font-bold text-slate-900 uppercase tracking-wider mb-2">Shipping Destination</h3>
              <p className="text-slate-700 leading-relaxed">
                {order.shippingAddress}<br />
                {order.shippingCity}, {order.shippingDistrict}<br />
                {order.shippingState} - {order.shippingPin}
              </p>
            </div>
          </div>

          {/* Item Table */}
          <table className="w-full text-xs text-left mb-8 border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 uppercase font-bold border-y border-slate-200">
                <th className="py-3 px-3">SKU</th>
                <th className="py-3 px-3">Item Description</th>
                <th className="py-3 px-3 text-center">Qty</th>
                <th className="py-3 px-3 text-right">Price</th>
                <th className="py-3 px-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {order.orderItems?.map((item) => {
                const price = Number(item.price);
                const itemTotal = price * item.quantity;
                return (
                  <tr key={item.id}>
                    <td className="py-3 px-3 font-mono text-slate-500">{item.product?.sku || 'N/A'}</td>
                    <td className="py-3 px-3 font-bold text-slate-800">{item.product?.name || 'Product'}</td>
                    <td className="py-3 px-3 text-center font-semibold">{item.quantity}</td>
                    <td className="py-3 px-3 text-right">₹{price.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-3 text-right font-bold">₹{itemTotal.toLocaleString('en-IN')}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Financial Summary */}
          <div className="flex justify-end">
            <div className="w-64 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span>₹{Number(order.subtotal).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Delivery Charge:</span>
                <span>{Number(order.deliveryCharge) === 0 ? 'FREE' : `₹${Number(order.deliveryCharge).toLocaleString('en-IN')}`}</span>
              </div>
              <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-300">
                <span>Grand Total:</span>
                <span>₹{Number(order.totalAmount).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Footer Terms */}
          <div className="mt-12 pt-6 border-t border-slate-200 text-[10px] text-slate-500 text-center leading-relaxed">
            <p className="font-semibold text-slate-700">Thank you for shopping with KING DAY!</p>
            <p>For warranty or helpline assistance regarding your order, contact +91 9495902904 or visit king-day.shop</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PrintableInvoice;
