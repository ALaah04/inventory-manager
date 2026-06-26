import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { icon: '📊', label: 'Dashboard', path: '/' },
  { icon: '📦', label: 'Products', path: '/products' },
  { icon: '➕', label: 'Add Product', path: '/add-product' },
  { icon: '⚠️', label: 'Low Stock', path: '/low-stock' },
  { icon: '📈', label: 'Analytics', path: '/analytics' },
];

function Sidebar() {
  const location = useLocation();

  return (
    <div className="w-56 min-h-screen bg-indigo-950 flex flex-col py-6 px-3 gap-1">
      <div className="flex items-center gap-2 px-3 pb-6 border-b border-white/10 mb-2">
        <span className="text-indigo-300 text-2xl">📦</span>
        <span className="text-white font-medium text-lg">StockManager</span>
      </div>

      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all
            ${location.pathname === item.path
              ? 'bg-indigo-600 text-white'
              : 'text-white/60 hover:bg-white/10 hover:text-white'
            }`}
        >
          <span>{item.icon}</span>
          {item.label}
        </Link>
      ))}
    </div>
  );
}

export default Sidebar;