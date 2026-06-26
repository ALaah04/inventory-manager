const BASE_URL = 'http://localhost:5000/api';

export const productService = {
  getAll: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${BASE_URL}/products?${query}`);
    return res.json();
  },

  getOne: async (id) => {
    const res = await fetch(`${BASE_URL}/products/${id}`);
    return res.json();
  },

  create: async (data) => {
    const res = await fetch(`${BASE_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  update: async (id, data) => {
    const res = await fetch(`${BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  delete: async (id) => {
    const res = await fetch(`${BASE_URL}/products/${id}`, {
      method: 'DELETE',
    });
    return res.json();
  },

  updateStock: async (id, delta) => {
    const res = await fetch(`${BASE_URL}/products/${id}/stock`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ delta }),
    });
    return res.json();
  },
};