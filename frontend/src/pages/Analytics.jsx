import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productService } from '../services/api';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line
} from 'recharts';

const COLORS = ['#22c55e', '#f97316', '#ef4444'];

function Analytics() {
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
  const avgValue = totalProducts > 0 ? Math.round(totalValue / totalProducts) : 0;
  const categories = [...new Set(products.map(p => p.category))];

  const statusData = [
    { name: 'Available', value: products.filter(p => p.status === 'Available').length },
    { name: 'Low Stock', value: products.filter(p => p.status === 'Low Stock').length },
    { name: 'Out of Stock', value: products.filter(p => p.status === 'Out of Stock').length },
  ].filter(d => d.value > 0);

  const categoryData = categories.map(cat => ({
    category: cat,
    count: products.filter(p => p.category === cat).length,
    value: products.filter(p => p.category === cat).reduce((sum, p) => sum + p.price * p.quantity, 0),
  }));

  const topProducts = [...products]
    .map(p => ({ name: p.name, value: p.price * p.quantity }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const maxTopValue = topProducts.length > 0 ? topProducts[0].value : 1;

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
      ⏳ Loading analytics...
    </div>
  );

  if (totalProducts === 0) return (
    <div className="flex flex-col items-center justify-center h-64 gap-3">
      <div className="text-4xl">📊</div>
      <div className="text-base font-medium text-gray-700">No data yet</div>
      <div className="text-sm text-gray-400">Add some products to see analytics</div>
      <button
        onClick={() => navigate('/add-product')}
        className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors mt-2"
      >
        ➕ Add Product
      </button>
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-medium text-gray-800">Analytics</h1>
        <p className="text-sm text-gray-400">Overview of your inventory performance</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-indigo-50 rounded-xl p-4">
          <div className="text-2xl font-medium text-gray-800">{totalProducts}</div>
          <div className="text-xs text-gray-500 mt-1">Total Products</div>
          <div className="text-xs text-indigo-500 mt-1">{categories.length} categories</div>
        </div>
        <div className="bg-green-50 rounded-xl p-4">
          <div className="text-2xl font-medium text-gray-800">${totalValue.toLocaleString()}</div>
          <div className="text-xs text-gray-500 mt-1">Total Value</div>
          <div className="text-xs text-green-500 mt-1">Across all products</div>
        </div>
        <div className="bg-purple-50 rounded-xl p-4">
          <div className="text-2xl font-medium text-gray-800">{categories.length}</div>
          <div className="text-xs text-gray-500 mt-1">Categories</div>
          <div className="text-xs text-purple-500 mt-1">{categories.join(', ')}</div>
        </div>
        <div className="bg-amber-50 rounded-xl p-4">
          <div className="text-2xl font-medium text-gray-800">${avgValue.toLocaleString()}</div>
          <div className="text-xs text-gray-500 mt-1">Avg. Product Value</div>
          <div className="text-xs text-amber-500 mt-1">Per product</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h2 className="text-sm font-medium text-gray-700 mb-4">Products per category</h2>
          {categoryData.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-sm">No data</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="category" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 8, border: '0.5px solid #e5e7eb', fontSize: 12 }} />
                <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} name="Products" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h2 className="text-sm font-medium text-gray-700 mb-4">Stock status distribution</h2>
          {statusData.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-sm">No data</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 8, border: '0.5px solid #e5e7eb', fontSize: 12 }} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h2 className="text-sm font-medium text-gray-700 mb-4">Value by category ($)</h2>
          {categoryData.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-sm">No data</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={categoryData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis dataKey="category" type="category" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} width={90} />
                <Tooltip contentStyle={{ borderRadius: 8, border: '0.5px solid #e5e7eb', fontSize: 12 }} />
                <Bar dataKey="value" fill="#a5b4fc" radius={[0, 4, 4, 0]} name="Value ($)" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h2 className="text-sm font-medium text-gray-700 mb-4">Top products by value</h2>
          {topProducts.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-sm">No data</div>
          ) : (
            <div className="flex flex-col gap-4 mt-2">
              {topProducts.map((p) => (
                <div key={p.name} className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700 font-medium truncate max-w-40">{p.name}</span>
                    <span className="text-gray-500">${p.value.toLocaleString()}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full transition-all"
                      style={{ width: `${(p.value / maxTopValue) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Analytics;