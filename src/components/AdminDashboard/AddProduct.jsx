import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import toast from 'react-hot-toast';
import { addProduct, clearMessages, uploadCsv } from '../../features/productSlice';

const AddProductPage = () => {
  const dispatch = useDispatch();
  const { loading, successMessage, errorMessage } = useSelector((state) => state.product);

  const [product, setProduct] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    stock: '',
    image: '',
    tags: ''
  });

  const [csvFile, setCsvFile] = useState(null);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmitProduct = (e) => {
    e.preventDefault();
    dispatch(addProduct(product));
    setProduct({ title: '', description: '', category: '', price: '', stock: '', image: '', tags: '' });
  };

  const handleSubmitCsv = (e) => {
    e.preventDefault();
    if (!csvFile) return toast.error('No CSV selected');
    const formData = new FormData();
    formData.append('file', csvFile);
    dispatch(uploadCsv(formData));
    setCsvFile(null);
  };

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearMessages());
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(clearMessages());
    }
  }, [successMessage, errorMessage, dispatch]);

  return (
 <div className="max-w-6xl mx-auto p-8 sm:p-10">
  <h2 className="text-4xl font-bold text-center text-blue-700 mb-12 tracking-wide">🛍️ Product Management</h2>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

    {/* Add Product Form */}
    <form onSubmit={handleSubmitProduct} className="bg-gradient-to-br from-white via-gray-50 to-blue-50 p-8 rounded-2xl shadow-md hover:shadow-xl transition space-y-5">
      <h3 className="text-2xl font-semibold text-gray-800 mb-4">Add Single Product</h3>

      <input
        name="title"
        placeholder="Product Title"
        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={product.title}
        onChange={handleChange}
        required
      />

      <textarea
        name="description"
        placeholder="Product Description"
        className="w-full px-4 py-3 rounded-lg border border-gray-300 h-24 focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={product.description}
        onChange={handleChange}
        required
      />

      <input
        name="category"
        placeholder="Category"
        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={product.category}
        onChange={handleChange}
        required
      />

      <div className="flex gap-4">
        <input
          name="price"
          type="number"
          placeholder="Price"
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={product.price}
          onChange={handleChange}
          required
        />
        <input
          name="stock"
          type="number"
          placeholder="Stock"
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={product.stock}
          onChange={handleChange}
          required
        />
      </div>

      <input
        name="image"
        placeholder="Image URL"
        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={product.image}
        onChange={handleChange}
        required
      />

      <input
        name="tags"
        placeholder="Tags (comma separated)"
        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={product.tags}
        onChange={handleChange}
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg w-full font-semibold text-lg transition"
      >
        {loading ? 'Adding...' : 'Add Product'}
      </button>
    </form>

    {/* Upload CSV */}
    <form onSubmit={handleSubmitCsv} className="bg-gradient-to-br from-white via-gray-50 to-green-50 p-8 rounded-2xl shadow-md hover:shadow-xl transition space-y-5">
      <h3 className="text-2xl font-semibold text-gray-800 mb-4">Bulk Upload (CSV)</h3>

      <input
        type="file"
        accept=".csv"
        onChange={(e) => setCsvFile(e.target.files[0])}
        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
        required
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg w-full font-semibold text-lg transition"
      >
        {loading ? 'Uploading...' : '📂 Upload CSV'}
      </button>
    </form>

  </div>
</div>

  );
};

export default AddProductPage;
