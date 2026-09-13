import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ProductCard from '../components/ui/ProductCard';
import { Product } from '../types/schema';
import { apiClient } from '../api/client';

const categoryTitles: Record<string, string> = {
  'kids-ride-on': 'Kids Ride-On Vehicles',
  'cycles': 'Bicycles & Tricycles',
  'toys': 'Educational & Interactive Toys',
  'stationery': 'School & Creative Stationery',
  'baby-products': 'Baby Products & Care',
  'gifts': 'Gifts & Special Occasion Toys',
};

const CategoryView: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const title = categoryTitles[slug || ''] || 'Category Products';

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      setLoading(true);
      try {
        const res = await apiClient.get('/products', {
          params: { category: slug },
        });
        setProducts(res.data);
      } catch (error) {
        console.error('Failed to load category products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [slug]);

  return (
    <div className="pt-28 pb-16 min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <Link to="/shop" className="text-xs font-bold text-kingBlue hover:underline mb-2 block">
            ← Back to All Products
          </Link>
          <h1 className="text-3xl lg:text-4xl font-black text-slate-900">{title}</h1>
          <p className="text-slate-500 text-sm mt-1">Showing Kozhikode catalog products in this collection</p>
        </div>

        {loading ? (
          <div className="py-20 text-center text-slate-400 font-medium">Loading category...</div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/80 shadow-sm max-w-md mx-auto my-12">
            <h3 className="text-lg font-bold text-slate-800">No products in this category yet</h3>
            <p className="text-slate-500 text-xs mt-1">Check back soon or explore other categories!</p>
            <Link to="/shop" className="inline-block mt-4 bg-kingBlue text-white font-bold text-xs px-6 py-2.5 rounded-xl">
              Browse All Shop Items
            </Link>
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

export default CategoryView;
