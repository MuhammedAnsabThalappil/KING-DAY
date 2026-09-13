import React, { useState, useEffect } from 'react';
import { Search, Printer, Filter, CheckCircle2, Clock } from 'lucide-react';
import { Order, OrderStatus } from '../../types/schema';
import { apiClient } from '../../api/client';
import PrintableInvoice from '../../components/admin/PrintableInvoice';

const orderStatuses: OrderStatus[] = [
  'PLACED',
  'PAYMENT_PENDING',
  'PAYMENT_CONFIRMED',
  'PROCESSING',
  'PACKED',
  'SHIPPED',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
  'CANCELLED',
];

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [regionFilter, setRegionFilter] = useState('');
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      if (regionFilter) params.region = regionFilter;

      const res = await apiClient.get('/admin/orders', { params });
      setOrders(res.data);
    } catch (err) {
      console.error('Error fetching admin orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [search, statusFilter, regionFilter]);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await apiClient.put(`/admin/orders/${orderId}/status`, { status: newStatus });
      fetchOrders();
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Order Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage Kerala & Pan-India order dispatches, status lifecycle, and tax invoices</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center text-xs">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search by Order ID, Customer, Phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 font-medium focus:outline-none focus:border-kingBlue"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-semibold text-slate-700 focus:outline-none"
          >
            <option value="">All Regions</option>
            <option value="kerala">Kerala Orders</option>
            <option value="other">Rest of India</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-semibold text-slate-700 focus:outline-none"
          >
            <option value="">All Statuses</option>
            {orderStatuses.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-bold uppercase border-b border-slate-200">
              <tr>
                <th className="p-3.5">Order ID</th>
                <th className="p-3.5">Customer Details</th>
                <th className="p-3.5">Destination</th>
                <th className="p-3.5">Total</th>
                <th className="p-3.5">Payment Method</th>
                <th className="p-3.5">Fulfillment Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">Loading order records...</td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">No matching orders found.</td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-kingBlue">#{o.orderNumber}</td>
                    <td className="p-3.5">
                      <p className="font-bold text-slate-900">{o.customerName}</p>
                      <p className="text-slate-500 text-[11px]">{o.customerPhone}</p>
                    </td>
                    <td className="p-3.5">
                      <p className="font-bold text-slate-800">{o.shippingDistrict}</p>
                      <p className="text-slate-500 text-[11px]">{o.shippingState}</p>
                    </td>
                    <td className="p-3.5 font-black text-slate-900">₹{Number(o.totalAmount).toLocaleString('en-IN')}</td>
                    <td className="p-3.5">
                      <span className="font-bold uppercase text-slate-700">{o.paymentMethod}</span>
                      <p className="text-[10px] font-semibold text-slate-400">{o.paymentStatus}</p>
                    </td>
                    <td className="p-3.5">
                      <select
                        value={o.status}
                        onChange={(e) => handleStatusChange(o.id, e.target.value as OrderStatus)}
                        className="bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1 text-[11px] font-bold text-slate-800 focus:outline-none focus:border-kingBlue"
                      >
                        {orderStatuses.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => setSelectedInvoiceOrder(o)}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 ml-auto text-[11px]"
                      >
                        <Printer className="w-3.5 h-3.5" /> Invoice
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Modal */}
      {selectedInvoiceOrder && (
        <PrintableInvoice order={selectedInvoiceOrder} onClose={() => setSelectedInvoiceOrder(null)} />
      )}

    </div>
  );
};

export default AdminOrders;
