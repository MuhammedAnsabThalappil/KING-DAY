import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, Search } from 'lucide-react';
import ProductCard from '../components/ui/ProductCard';
import { Product } from '../types/schema';
import { apiClient } from '../api/client';

const categories = ['All', 'Kids Ride-On', 'Cycles', 'Toys', 'Stationery', 'Baby Products', 'Gifts'];

const Shop: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const initialSearch = searchParams.get('search') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [sortOption, setSortOption] = useState('newest');
  const [panIndiaOnly, setPanIndiaOnly] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params: any = {};
        if (selectedCategory !== 'All') params.category = selectedCategory;
        if (searchQuery) params.search = searchQuery;
        if (panIndiaOnly) params.panIndia = 'true';
        if (sortOption) params.sort = sortOption;

        const res = await apiClient.get('/products', { params });
        setProducts(res.data);
      } catch (error) {
        console.error('Failed to fetch shop products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, searchQuery, sortOption, panIndiaOnly]);

  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat);
    if (cat === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="pt-28 pb-16 min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-black text-slate-900">Shop Catalog</h1>
          <p className="text-slate-500 text-sm mt-1">Discover verified ride-on vehicles and premium toys from Kozhikode Hub</p>
        </div>

        {/* Filter Controls */}
        <div className="bg-white p-4 lg:p-6 rounded-2xl shadow-sm border border-slate-200/80 mb-8 flex flex-col lg:flex-row gap-4 justify-between items-center">
          
          {/* Search */}
          <div className="relative w-full lg:w-72">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 text-sm pl-9 pr-4 py-2.5 rounded-xl border border-transparent focus:border-kingBlue focus:bg-white focus:outline-none transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </div>

          {/* Categories Horizontal Pills */}
          <div className="flex gap-2 overflow-x-auto w-full lg:w-auto scrollbar-hide py-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategorySelect(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-kingBlue text-white shadow'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort & Pan India Toggle */}
          <div className="flex items-center gap-4 w-full lg:w-auto justify-between lg:justify-end">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={panIndiaOnly}
                onChange={(e) => setPanIndiaOnly(e.target.checked)}
                className="w-4 h-4 text-kingBlue rounded focus:ring-kingBlue"
              />
              Pan-India Only
            </label>

            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-slate-400" />
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="bg-slate-100 text-xs font-bold text-slate-700 px-3 py-2 rounded-xl border border-transparent focus:border-kingBlue focus:outline-none"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="py-20 text-center text-slate-400 font-medium">Loading catalog products...</div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/80 shadow-sm max-w-md mx-auto my-12">
            <Filter className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800">No products found</h3>
            <p className="text-slate-500 text-xs mt-1">Try clearing filters or search queries</p>
            <button
              onClick={() => { setSelectedCategory('All'); setSearchQuery(''); setPanIndiaOnly(false); }}
              className="mt-4 bg-kingBlue text-white font-bold text-xs px-4 py-2 rounded-xl"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default Shop;
