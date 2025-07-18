import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ProductCard from './ProductCard';
import { fetchProducts, filterProducts } from '../../features/userSlice';
import Spinner from '../Loader/Spinner';

const ProductList = () => {
  const dispatch = useDispatch();
  const { items: products, loading, allItems, filters } = useSelector(state => state.user);

  const [category, setCategory] = useState('All');
  const [price, setPrice] = useState(10000);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    dispatch(filterProducts({ category, price }));
  }, [category, price, dispatch, allItems]);

  const categories = ['All', ...new Set(allItems.map(p => p.category))]; //db without duplication

  if (loading) return <p className="text-center mt-20 text-lg"><Spinner/></p>;

  return (
    <div className="p-6">
      <h2 className="text-3xl text-center font-bold mb-4 text-gray-800">Our Products</h2>

      {/* Filters */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        {/* Category */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="p-2 border rounded-md"
        >
          {categories.map(cat => (
            <option key={cat}>{cat}</option>
          ))}
        </select>

        {/* Price */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-700">Max Price:</label>
          <input
            type="range"
            min="0"
            max="10000"
            step="100"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="w-48"
          />
          <span className="text-gray-800 font-medium">₹{price}</span>
        </div>
      </div>

      {/* Products */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map(product => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
