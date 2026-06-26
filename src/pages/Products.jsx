import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productService } from '../services/api';

const statusStyle = {
  'Available': 'bg-green-100 text-green-700',
  'Low Stock': 'bg-orange-100 text-orange-700',
  'Out of Stock': 'bg-red-100 text-red-700',
};

const categories = ['All', 'Electronics', 'Furniture', 'Consumable', 'Office Supply', 'Other'];
const statuses = ['All', 'Available', 'Low Stock', 'Out of Stock'];

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

function Products() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await productService.getAll();
      setProducts(data);
    } catch (err) {
      console.error('Error fetching products:', err);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    try {
      await productService.delete(id);
      setProducts(products.filter(p => p._id !== id));
      setDeleteId(null);
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  const handleStockChange = async (id, delta) => {
    try {
      const updated = await productService.updateStock(id, delta);
      setProducts(products.map(p => p._id === id ? updated : p));
    } catch (err) {
      console.error('Error updating stock:', err);
    }
  };

  const filtered = products
    .filter(p => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.ref.toLowerCase().includes(search.toLowerCase());
      const matchCategory = category === 'All' || p.category === category;
      const matchStatus = status === 'All' || p.status === status;
      return matchSearch && matchCategory && matchStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'price') return a.price - b.price;
      if (sortBy === 'quantity') return a.quantity - b.quantity;
      return 0;
    });

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
      ⏳ Loading products...
    </div>
  );

  return (
    <div className="flex flex-col gap-6">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium text-gray-800">Products</h1>
          <p className="text-sm text-gray-400">{filtered.length} products found</p>
        </div>
        <button
          onClick={() => navigate('/add-product')}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2"
        >
          ➕ Add Product
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-4 flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="🔍 Search by name or reference..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm flex-1 min-w-48 focus:outline-none focus:ring-2 focus:ring-indigo-300"
        />
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
        >
          {categories.map(c => <option key={c}>{c}</option>)}
        </select>
        <select
          value={status}
          onChange={e => setStatus(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
        >
          {statuses.map(s => <option key={s}>{s}</option>)}
        </select>
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
        >
          <option value="name">Sort: Name</option>
          <option value="price">Sort: Price</option>
          <option value="quantity">Sort: Quantity</option>
        </select>
        <button
          onClick={() => { setSearch(''); setCategory('All'); setStatus('All'); setSortBy('name'); }}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-500 hover:bg-gray-50 transition-colors"
        >
          ✕ Reset
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-5 py-3 text-xs text-gray-400 font-medium">Product</th>
              <th className="text-left px-5 py-3 text-xs text-gray-400 font-medium">Category</th>
              <th className="text-left px-5 py-3 text-xs text-gray-400 font-medium">Supplier</th>
              <th className="text-left px-5 py-3 text-xs text-gray-400 font-medium">Stock</th>
              <th className="text-left px-5 py-3 text-xs text-gray-400 font-medium">Price</th>
              <th className="text-left px-5 py-3 text-xs text-gray-400 font-medium">Status</th>
              <th className="text-left px-5 py-3 text-xs text-gray-400 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-gray-400">
                  No products found. Try adjusting your filters.
                </td>
              </tr>
            ) : (
              filtered.map(p => (
                <tr key={p._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="font-medium text-gray-800">{p.name}</div>
                    <div className="text-xs text-gray-400">{p.ref}</div>
                  </td>
                  <td className="px-5 py-3 text-gray-500">{p.category}</td>
                  <td className="px-5 py-3 text-gray-500">{p.supplier}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleStockChange(p._id, -1)}
                        className="w-6 h-6 rounded bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center font-medium"
                      >−</button>
                      <span className="w-6 text-center font-medium text-gray-700">{p.quantity}</span>
                      <button
                        onClick={() => handleStockChange(p._id, 1)}
                        className="w-6 h-6 rounded bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center font-medium"
                      >+</button>
                      <div className="w-14 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${stockBarColor(p.quantity)} ${stockBarWidth(p.quantity)}`}></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-gray-700">${p.price}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusStyle[p.status]}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/edit-product/${p._id}`)}
                        className="w-8 h-8 rounded-lg border border-gray-200 hover:bg-indigo-50 hover:border-indigo-200 flex items-center justify-center text-gray-500 hover:text-indigo-600 transition-colors"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => setDeleteId(p._id)}
                        className="w-8 h-8 rounded-lg border border-gray-200 hover:bg-red-50 hover:border-red-200 flex items-center justify-center text-gray-500 hover:text-red-500 transition-colors"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {deleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-80 flex flex-col gap-4 shadow-xl">
            <h2 className="text-base font-medium text-gray-800">Delete Product?</h2>
            <p className="text-sm text-gray-500">This action cannot be undone. Are you sure?</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50"
              >Cancel</button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600"
              >Delete</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Products;