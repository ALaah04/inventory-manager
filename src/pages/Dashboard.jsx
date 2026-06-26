import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productService } from '../services/api';

function Dashboard() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productService.getAll();
        setProducts(data);
      } catch (err) {
        console.error('Error fetching products:', err);
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const totalProducts = products.length;
  const totalValue = products.reduce((sum, p) => sum + p.price * p.quantity, 0);
  const lowStock = products.filter(p => p.status === 'Low Stock').length;
  const outOfStock = products.filter(p => p.status === 'Out of Stock').length;
  const recentProducts = [...products].slice(-5).reverse();

  const stats = [
    {
      label: 'Total Products',
      value: totalProducts,
      change: 'Total items in inventory',
      changeColor: 'text-indigo-500',
      bg: 'bg-indigo-50',
      iconBg: 'bg-indigo-100',
      icon: '📦',
    },
    {
      label: 'Inventory Value',
      value: `$${totalValue.toLocaleString()}`,
      change: 'Total stock value',
      changeColor: 'text-green-500',
      bg: 'bg-green-50',
      iconBg: 'bg-green-100',
      icon: '💰',
    },
    {
      label: 'Low Stock Alerts',
      value: lowStock,
      change: lowStock > 0 ? 'Needs attention' : 'All good!',
      changeColor: lowStock > 0 ? 'text-orange-500' : 'text-green-500',
      bg: 'bg-orange-50',
      iconBg: 'bg-orange-100',
      icon: '⚠️',
    },
    {
      label: 'Out of Stock',
      value: outOfStock,
      change: outOfStock > 0 ? 'Reorder needed' : 'All good!',
      changeColor: outOfStock > 0 ? 'text-red-500' : 'text-green-500',
      bg: 'bg-red-50',
      iconBg: 'bg-red-100',
      icon: '🚫',
    },
  ];

  const statusStyle = {
    'Available': 'bg-green-100 text-green-700',
    'Low Stock': 'bg-orange-100 text-orange-700',
    'Out of Stock': 'bg-red-100 text-red-700',
  };

  const stockBarColor = (stock) => {
    if (stock === 0) return 'bg-red-500';
    if (stock < 5) return 'bg-orange-500';
    return 'bg-green-500';
  };

  const stockBarWidth = (stock) => {
    if (stock === 0) return 'w-0';
    if (stock < 5) return 'w-1/5';
    if (stock < 15) return 'w-2/5';
    return 'w-4/5';
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
      ⏳ Loading dashboard...
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400">Good morning, Alaa 👋</p>
          <h1 className="text-2xl font-medium text-gray-800">Dashboard</h1>
        </div>
        <button
          onClick={() => navigate('/add-product')}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2"
        >
          ➕ Add Product
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className={`${stat.bg} rounded-xl p-4 flex flex-col gap-2`}>
            <div className={`${stat.iconBg} w-10 h-10 rounded-lg flex items-center justify-center text-xl`}>
              {stat.icon}
            </div>
            <div className="text-2xl font-medium text-gray-800">{stat.value}</div>
            <div className="text-xs text-gray-500">{stat.label}</div>
            <div className={`text-xs ${stat.changeColor}`}>{stat.change}</div>
          </div>
        ))}
      </div>

      {(lowStock > 0 || outOfStock > 0) && (
        <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 flex items-center justify-between">
          <div className="text-sm text-red-600">
            ⚠️ You have <span className="font-medium">{lowStock + outOfStock}</span> product(s) that need attention.
          </div>
          <button
            onClick={() => navigate('/low-stock')}
            className="text-xs text-red-600 underline hover:text-red-700"
          >
            View alerts →
          </button>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-base font-medium text-gray-800">Recent Products</h2>
          <button
            onClick={() => navigate('/products')}
            className="text-sm text-indigo-600 hover:underline"
          >
            View all →
          </button>
        </div>

        {recentProducts.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-sm">
            No products yet. <button onClick={() => navigate('/add-product')} className="text-indigo-500 underline">Add your first product</button>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs text-gray-400 font-medium">Product</th>
                <th className="text-left px-5 py-3 text-xs text-gray-400 font-medium">Category</th>
                <th className="text-left px-5 py-3 text-xs text-gray-400 font-medium">Stock</th>
                <th className="text-left px-5 py-3 text-xs text-gray-400 font-medium">Price</th>
                <th className="text-left px-5 py-3 text-xs text-gray-400 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentProducts.map((p) => (
                <tr key={p._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="font-medium text-gray-800">{p.name}</div>
                    <div className="text-xs text-gray-400">{p.ref}</div>
                  </td>
                  <td className="px-5 py-3 text-gray-500">{p.category}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-14 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${stockBarColor(p.quantity)} ${stockBarWidth(p.quantity)}`}></div>
                      </div>
                      <span className="text-gray-700">{p.quantity}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-gray-700">${p.price}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusStyle[p.status]}`}>
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Dashboard;