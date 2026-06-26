import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productService } from '../services/api';

function LowStock() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productService.getAll();
        const alerts = data.filter(p => p.status === 'Low Stock' || p.status === 'Out of Stock');
        setProducts(alerts);
      } catch (err) {
        console.error('Error fetching products:', err);
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const outOfStock = products.filter(p => p.status === 'Out of Stock').length;
  const lowStock = products.filter(p => p.status === 'Low Stock').length;

  const urgencyStyle = (status) => {
    if (status === 'Out of Stock') return {
      badge: 'bg-red-100 text-red-700',
      bar: 'bg-red-500',
      label: 'Out of Stock',
    };
    return {
      badge: 'bg-orange-100 text-orange-700',
      bar: 'bg-orange-400',
      label: 'Low Stock',
    };
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
      ⏳ Loading alerts...
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium text-gray-800">Low Stock Alerts</h1>
          <p className="text-sm text-gray-400">{products.length} products need attention</p>
        </div>
        <button
          onClick={() => navigate('/add-product')}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          ➕ Add Product
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-red-50 rounded-xl p-4">
          <div className="text-2xl font-medium text-red-700">{outOfStock}</div>
          <div className="text-sm text-red-500 mt-1">Out of stock</div>
        </div>
        <div className="bg-orange-50 rounded-xl p-4">
          <div className="text-2xl font-medium text-orange-700">{lowStock}</div>
          <div className="text-sm text-orange-500 mt-1">Low stock</div>
        </div>
        <div className="bg-indigo-50 rounded-xl p-4">
          <div className="text-2xl font-medium text-indigo-700">{products.length}</div>
          <div className="text-sm text-indigo-500 mt-1">Total alerts</div>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="bg-green-50 border border-green-100 rounded-xl p-8 text-center">
          <div className="text-4xl mb-3">✅</div>
          <div className="text-base font-medium text-green-700">All products are well stocked!</div>
          <div className="text-sm text-green-500 mt-1">No alerts at the moment</div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {products.map(p => {
            const style = urgencyStyle(p.status);
            const minStock = 10;
            const percent = Math.min(100, (p.quantity / minStock) * 100);
            return (
              <div key={p._id} className="bg-white rounded-xl border border-gray-100 p-5 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-800">{p.name}</div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      {p.ref} · {p.category} · {p.supplier}
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${style.badge}`}>
                    {style.label}
                  </span>
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Current stock: <span className="font-medium text-gray-700">{p.quantity}</span></span>
                    <span>Min required: <span className="font-medium text-gray-700">{minStock}</span></span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${style.bar} transition-all`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Price: <span className="font-medium text-gray-700">${p.price}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/edit-product/${p._id}`)}
                      className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => navigate('/add-product')}
                      className="px-3 py-1.5 text-xs bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      🔄 Reorder
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default LowStock;