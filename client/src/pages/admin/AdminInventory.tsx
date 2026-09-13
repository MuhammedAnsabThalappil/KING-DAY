import React, { useState, useEffect } from 'react';
import { AlertTriangle, PackageCheck, Plus, Minus, Search } from 'lucide-react';
import { Product } from '../../types/schema';
import { apiClient } from '../../api/client';

const AdminInventory: React.FC = () => {
  const [inventory, setInventory] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/admin/inventory');
      setInventory(res.data);
    } catch (err) {
      console.error('Error fetching inventory:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const updateStock = async (productId: string, currentStock: number, delta: number) => {
    const newStock = Math.max(0, currentStock + delta);
    try {
      await apiClient.put(`/admin/products/${productId}`, { stock: newStock });
      setInventory((prev) =>
        prev.map((item) => (item.id === productId ? { ...item, stock: newStock } : item))
      );
    } catch (err) {
      console.error('Failed to update stock:', err);
    }
  };

  const filteredInventory = inventory.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.sku.toLowerCase().includes(search.toLowerCase())
  );

  const lowStockCount = inventory.filter((item) => item.stock > 0 && item.stock <= 5).length;
  const outOfStockCount = inventory.filter((item) => item.stock <= 0).length;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Inventory & Stock Audit</h1>
          <p className="text-xs text-slate-500 mt-0.5">Real-time stock tracking for Kozhikode warehouse SKUs</p>
        </div>
      </div>

      {/* KPI Highlight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-amber-50 border border-amber-200 p-5 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-amber-500 text-white rounded-xl">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-amber-950 text-sm">Low Stock Warnings</h4>
            <p className="text-2xl font-black text-amber-900 mt-0.5">{lowStockCount} SKUs</p>
            <p className="text-[11px] text-amber-700">Stock count between 1 and 5 units</p>
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 p-5 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-red-600 text-white rounded-xl">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-red-950 text-sm">Out of Stock SKUs</h4>
            <p className="text-2xl font-black text-red-900 mt-0.5">{outOfStockCount} SKUs</p>
            <p className="text-[11px] text-red-700">Add stock immediately to unlock storefront cart</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm mb-6 flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search inventory by SKU or product name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-xs font-medium text-slate-800 focus:outline-none"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-bold uppercase border-b border-slate-200">
              <tr>
                <th className="p-3.5">SKU</th>
                <th className="p-3.5">Product Name</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Stock Status</th>
                <th className="p-3.5">Current Stock</th>
                <th className="p-3.5 text-right">Quick Adjust</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">Loading inventory data...</td>
                </tr>
              ) : filteredInventory.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">No matching inventory items.</td>
                </tr>
              ) : (
                filteredInventory.map((item) => {
                  const isOut = item.stock <= 0;
                  const isLow = item.stock > 0 && item.stock <= 5;

                  return (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3.5 font-mono font-bold text-slate-700">{item.sku}</td>
                      <td className="p-3.5 font-bold text-slate-900">{item.name}</td>
                      <td className="p-3.5 text-slate-600">{item.category}</td>
                      <td className="p-3.5">
                        {isOut ? (
                          <span className="px-2.5 py-1 bg-red-100 text-red-800 rounded-full font-bold text-[10px] uppercase">
                            OUT OF STOCK
                          </span>
                        ) : isLow ? (
                          <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full font-bold text-[10px] uppercase">
                            LOW STOCK
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 bg-green-100 text-green-800 rounded-full font-bold text-[10px] uppercase">
                            IN STOCK
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 font-black text-slate-900 text-sm">{item.stock}</td>
                      <td className="p-3.5 text-right">
                        <div className="inline-flex items-center border border-slate-200 rounded-lg overflow-hidden">
                          <button
                            onClick={() => updateStock(item.id, item.stock, -1)}
                            disabled={item.stock <= 0}
                            className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 disabled:opacity-40"
                            title="Decrease Stock"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3 font-bold text-slate-900 text-xs">{item.stock}</span>
                          <button
                            onClick={() => updateStock(item.id, item.stock, 1)}
                            className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700"
                            title="Increase Stock"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default AdminInventory;
