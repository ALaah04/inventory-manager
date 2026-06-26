import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { productService } from '../services/api';

const categories = ['Electronics', 'Furniture', 'Consumable', 'Office Supply', 'Other'];

function EditProduct() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form, setForm] = useState({
    name: '',
    ref: '',
    category: '',
    quantity: '',
    price: '',
    supplier: '',
    description: '',
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await productService.getOne(id);
        setForm({
          name: data.name,
          ref: data.ref,
          category: data.category,
          quantity: data.quantity,
          price: data.price,
          supplier: data.supplier,
          description: data.description || '',
        });
      } catch (err) {
        console.error('Error fetching product:', err);
      }
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Product name is required';
    if (!form.ref.trim()) newErrors.ref = 'Reference is required';
    if (!form.category) newErrors.category = 'Category is required';
    if (form.quantity === '' || form.quantity < 0) newErrors.quantity = 'Valid quantity is required';
    if (!form.price || form.price <= 0) newErrors.price = 'Valid price is required';
    if (!form.supplier.trim()) newErrors.supplier = 'Supplier is required';
    return newErrors;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setSubmitting(true);
    try {
      await productService.update(id, {
        ...form,
        quantity: Number(form.quantity),
        price: Number(form.price),
      });
      setSuccess(true);
      setTimeout(() => navigate('/products'), 1500);
    } catch (err) {
      console.error('Error updating product:', err);
    }
    setSubmitting(false);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
      ⏳ Loading product...
    </div>
  );

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-medium text-gray-800">Edit Product</h1>
        <p className="text-sm text-gray-400">Update the product details</p>
      </div>

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm">
          ✅ Product updated successfully! Redirecting...
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 p-6 flex flex-col gap-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-500">Product Name *</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Laptop Pro 15"
              className={`border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 ${errors.name ? 'border-red-300' : 'border-gray-200'}`}
            />
            {errors.name && <span className="text-xs text-red-500">{errors.name}</span>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-500">Reference *</label>
            <input
              name="ref"
              value={form.ref}
              onChange={handleChange}
              placeholder="e.g. REF-001"
              className={`border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 ${errors.ref ? 'border-red-300' : 'border-gray-200'}`}
            />
            {errors.ref && <span className="text-xs text-red-500">{errors.ref}</span>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-500">Category *</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className={`border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 ${errors.category ? 'border-red-300' : 'border-gray-200'}`}
            >
              <option value="">Select category</option>
              {categories.map(c => <option key={c}>{c}</option>)}
            </select>
            {errors.category && <span className="text-xs text-red-500">{errors.category}</span>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-500">Supplier *</label>
            <input
              name="supplier"
              value={form.supplier}
              onChange={handleChange}
              placeholder="e.g. TechCorp"
              className={`border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 ${errors.supplier ? 'border-red-300' : 'border-gray-200'}`}
            />
            {errors.supplier && <span className="text-xs text-red-500">{errors.supplier}</span>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-500">Quantity *</label>
            <input
              name="quantity"
              type="number"
              min="0"
              value={form.quantity}
              onChange={handleChange}
              placeholder="e.g. 50"
              className={`border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 ${errors.quantity ? 'border-red-300' : 'border-gray-200'}`}
            />
            {errors.quantity && <span className="text-xs text-red-500">{errors.quantity}</span>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-500">Price ($) *</label>
            <input
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              onChange={handleChange}
              placeholder="e.g. 299.99"
              className={`border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 ${errors.price ? 'border-red-300' : 'border-gray-200'}`}
            />
            {errors.price && <span className="text-xs text-red-500">{errors.price}</span>}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-gray-500">Description (optional)</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Brief description of the product..."
            rows={3}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate('/products')}
            className="flex-1 border border-gray-200 rounded-lg py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 bg-indigo-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {submitting ? 'Saving...' : '✏️ Update Product'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditProduct;