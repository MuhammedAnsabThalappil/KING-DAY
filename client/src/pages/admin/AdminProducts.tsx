import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, CheckCircle2, XCircle, Search, AlertCircle } from 'lucide-react';
import { Product } from '../../types/schema';
import { apiClient } from '../../api/client';

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Form inputs
  const [sku, setSku] = useState('');
  const [slug, setSlug] = useState('');
  const [name, setName] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Kids Ride-On');
  const [mrp, setMrp] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [stock, setStock] = useState('10');
  const [isPublished, setIsPublished] = useState(true);
  const [panIndiaEligible, setPanIndiaEligible] = useState(false);
  const [imagesText, setImagesText] = useState('');

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/admin/products');
      setProducts(res.data);
    } catch (err) {
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openAddModal = () => {
    setEditingProduct(null);
    setSku(`KD-NEW-${Math.floor(100 + Math.random() * 900)}`);
    setSlug('');
    setName('');
    setShortDescription('');
    setDescription('');
    setCategory('Kids Ride-On');
    setMrp('');
    setSalePrice('');
    setStock('10');
    setIsPublished(true);
    setPanIndiaEligible(false);
    setImagesText('');
    setError(null);
    setModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setSku(p.sku);
    setSlug(p.slug);
    setName(p.name);
    setShortDescription(p.shortDescription || '');
    setDescription(p.description);
    setCategory(p.category);
    setMrp(String(p.mrp));
    setSalePrice(String(p.salePrice));
    setStock(String(p.stock));
    setIsPublished(p.isPublished);
    setPanIndiaEligible(p.panIndiaEligible);
    setImagesText(Array.isArray(p.images) ? p.images.join('\n') : '');
    setError(null);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sku || !name || !mrp || !salePrice) {
      setError('Please fill in required fields (SKU, Name, MRP, Sale Price).');
      return;
    }

    if (Number(salePrice) > Number(mrp)) {
      setError('Sale price cannot exceed MRP.');
      return;
    }

    const images = imagesText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const generatedSlug = slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const payload = {
      sku,
      slug: generatedSlug,
      name,
      shortDescription,
      description,
      category,
      mrp: Number(mrp),
      salePrice: Number(salePrice),
      stock: Number(stock),
      isPublished,
      panIndiaEligible,
      images: images.length > 0 ? images : ['https://via.placeholder.com/600'],
    };

    try {
      if (editingProduct) {
        await apiClient.put(`/admin/products/${editingProduct.id}`, payload);
      } else {
        await apiClient.post('/admin/products', payload);
      }
      setModalOpen(false);
      fetchProducts();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save product.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete/unpublish this product?')) return;
    try {
      await apiClient.delete(`/admin/products/${id}`);
      fetchProducts();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Product Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage Kozhikode catalog SKUs, stock levels, and pricing</p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-brand-gradient hover:opacity-90 text-white text-xs font-bold px-5 py-3 rounded-xl shadow-md flex items-center gap-1.5 transition-all"
        >
          <Plus className="w-4 h-4" /> Add New SKU
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm mb-6 flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Filter by SKU, Name, or Category..."
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
                <th className="p-3.5">MRP</th>
                <th className="p-3.5">Sale Price</th>
                <th className="p-3.5">Stock</th>
                <th className="p-3.5">Published</th>
                <th className="p-3.5">Pan-India</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-400">Loading product database...</td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-400">No matching products found.</td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-slate-700">{p.sku}</td>
                    <td className="p-3.5 font-bold text-slate-900">{p.name}</td>
                    <td className="p-3.5 text-slate-600">{p.category}</td>
                    <td className="p-3.5 text-slate-400 line-through">₹{Number(p.mrp).toLocaleString('en-IN')}</td>
                    <td className="p-3.5 font-bold text-slate-900">₹{Number(p.salePrice).toLocaleString('en-IN')}</td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded-full font-bold ${p.stock <= 0 ? 'bg-red-100 text-red-700' : p.stock <= 5 ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'}`}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="p-3.5">
                      {p.isPublished ? (
                        <span className="text-green-600 font-bold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Yes</span>
                      ) : (
                        <span className="text-slate-400 font-bold flex items-center gap-1"><XCircle className="w-3.5 h-3.5" /> Draft</span>
                      )}
                    </td>
                    <td className="p-3.5">
                      {p.panIndiaEligible ? (
                        <span className="text-blue-600 font-bold">Yes</span>
                      ) : (
                        <span className="text-slate-400">Kerala Only</span>
                      )}
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(p)}
                        className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                        title="Edit product"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                        title="Delete product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl p-6 sm:p-8 my-8">
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              {editingProduct ? 'Edit Catalog Product' : 'Add New Product SKU'}
            </h2>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" /> {error}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">SKU *</label>
                  <input
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono focus:outline-none focus:border-kingBlue"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-kingBlue"
                  >
                    <option value="Kids Ride-On">Kids Ride-On</option>
                    <option value="Cycles">Cycles</option>
                    <option value="Toys">Toys</option>
                    <option value="Stationery">Stationery</option>
                    <option value="Baby Products">Baby Products</option>
                    <option value="Gifts">Gifts</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Product Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-kingBlue"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">MRP (₹) *</label>
                  <input
                    type="number"
                    value={mrp}
                    onChange={(e) => setMrp(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-kingBlue"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Sale Price (₹) *</label>
                  <input
                    type="number"
                    value={salePrice}
                    onChange={(e) => setSalePrice(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-kingBlue"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Stock *</label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-kingBlue"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-kingBlue"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Image URLs (One per line)</label>
                <textarea
                  rows={2}
                  placeholder="https://images.unsplash.com/..."
                  value={imagesText}
                  onChange={(e) => setImagesText(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono focus:outline-none focus:border-kingBlue"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="w-4 h-4 text-kingBlue rounded"
                  />
                  Published on Storefront
                </label>

                <label className="flex items-center gap-2 font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={panIndiaEligible}
                    onChange={(e) => setPanIndiaEligible(e.target.checked)}
                    className="w-4 h-4 text-kingBlue rounded"
                  />
                  Pan-India Shipping Eligible
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-kingBlue text-white font-bold rounded-xl shadow"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminProducts;
