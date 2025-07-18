import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
  <div className="w-64 bg-gradient-to-r from-blue-300 to-gray-400 text-white p-6 min-h-screen font-[Inter] flex flex-col justify-between">
  <nav className="flex flex-col gap-6 text-base">
    <Link
      to="/adminDashboard/add-product"
      className="flex items-center gap-3 hover:text-blue-400 transition-all"
    >
      <span className="text-lg">➕</span>
      <span className="font-medium tracking-wide">Add Product</span>
    </Link>

    <Link
      to="/adminDashboard/my-products"
      className="flex items-center gap-3 hover:text-blue-400 transition-all"
    >
      <span className="text-lg">📋</span>
      <span className="font-medium tracking-wide">Product List</span>
    </Link>

    <Link
      to="/adminDashboard/orders"
      className="flex items-center gap-3 hover:text-green-400 transition-all"
    >
      <span className="text-lg">🛒</span>
      <span className="font-medium tracking-wide">Orders</span>
    </Link>

    <Link
      to="/adminDashboard/shipped"
      className="flex items-center gap-3 hover:text-green-400 transition-all"
    >
      <span className="text-lg">🚚</span>
      <span className="font-medium tracking-wide">Shipped</span>
    </Link>

    <Link
      to="/adminDashboard/delivered"
      className="flex items-center gap-3 hover:text-green-400 transition-all"
    >
      <span className="text-lg">✅</span>
      <span className="font-medium tracking-wide">Delivered</span>
    </Link>

    <Link
      to="/adminDashboard/chart"
      className="flex items-center gap-3 hover:text-green-400 transition-all"
    >
      <span className="text-lg">📊</span>
      <span className="font-medium tracking-wide">Chart</span>
    </Link>
  </nav>
</div>

  );
};

export default Sidebar;
