import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, deleteProduct, editProduct,} from '../../features/viewProductSlice';
import toast from 'react-hot-toast';
import Spinner from '../Loader/Spinner';

const MyProducts = () => {
  const dispatch = useDispatch();
  const { items, totalPages, loading } = useSelector((state) => state.products);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchProducts(currentPage));
  }, [dispatch, currentPage]);

//search
  const filteredProducts = items.filter((prod) =>
  prod.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
  prod.category.toLowerCase().includes(searchTerm.toLowerCase())
);

  //toast + delete
 const handleDelete = (id, prod) => {
  toast.custom((t) => (
    <div
      className={`${
        t.visible ? 'animate-enter' : 'animate-leave'
      } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
    >
      <div className="flex-1 w-0 p-4">
        <div className="flex items-start">
          <div className="w-20 h-20 flex items-center justify-center bg-gray-100 border rounded">
            <img
              src={prod.image}
              alt={prod.title}
              className="w-full h-full object-contain p-1"
            />
          </div>

          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-900">{prod.title}</p>
            <p className="mt-1 text-sm text-gray-500">Are you sure you want to delete?</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col border-l border-gray-200">
        <button
          onClick={() => {
            dispatch(deleteProduct(id)).then(() => {
              dispatch(fetchProducts(currentPage));
              toast.dismiss(t.id);
            });
          }}
          className="px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700"
        >
          Confirm
        </button>
        <button
          onClick={() => toast.dismiss(t.id)}
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
        >
          Cancel
        </button>
      </div>
    </div>
  ));
};


  const handleEdit = (product) => {
    setEditingProduct({ ...product }); // make a  copy to edit
  };

  const handleEditSubmit = () => {
    dispatch(editProduct({ id: editingProduct._id, updatedData: editingProduct })).then(() => {
      setEditingProduct(null);
      toast.success("Product updated");
      dispatch(fetchProducts(currentPage));
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-4 flex justify-end">
  <input
    type="text"
    placeholder="Search by title or category"
    className="px-4 py-2 border border-gray-300 rounded shadow-sm w-full max-w-xs"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />
</div>


      {loading ? (
        <Spinner/>
      ) : (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full text-sm text-left text-gray-700">
            <thead className="bg-gray-100 text-xs uppercase">
              <tr>
                <th className="px-4 py-3 border">Image</th>
                <th className="px-4 py-3 border">Title</th>
                <th className="px-4 py-3 border">Category</th>
                <th className="px-4 py-3 border">Description</th>
                <th className="px-4 py-3 border">Price</th>
                <th className="px-4 py-3 border">Stock</th>
                <th className="px-4 py-3 border">Actions</th>
              </tr>
            </thead>
              <tbody>
                {filteredProducts.map((prod) => (
                  <tr key={prod._id} className="border-t hover:bg-gray-50 transition duration-200">
                    <td className="px-4 py-2 border">
                      <div className="w-20 h-24 flex items-center justify-center">
                        <img
                          src={prod.image}
                          alt={prod.title}
                          className="max-w-full max-h-full object-contain rounded"
                        />
                      </div>
                    </td>

                  <td className="px-4 py-2 border font-medium">{prod.title}</td>
                  <td className="px-4 py-2 border font-medium">{prod.category}</td>
                  <td className="px-4 py-2 border font-medium">{prod.description}</td>
                  <td className="px-4 py-2 border text-green-600 font-semibold">₹{prod.price}</td>
                  <td className="px-4 py-2 border">{prod.stock}</td>
                  <td className="px-4 py-2 border space-x-2">
                    <button
                      onClick={() => handleEdit(prod)}
                      className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(prod._id,prod )}
                      className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6 text-sm">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-gray-600">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Edit Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Edit Product</h3>

            <input
              type="text"
              className="w-full p-2 mb-3 border rounded"
              placeholder="image"
              value={editingProduct.image}
              onChange={(e) =>
                setEditingProduct({ ...editingProduct, image: e.target.value })
              }
            />

            <input
              type="text"
              className="w-full p-2 mb-3 border rounded"
              placeholder="Title"
              value={editingProduct.title}
              onChange={(e) =>
                setEditingProduct({ ...editingProduct, title: e.target.value })
              }
            />
            <input
              type="text"
              className="w-full p-2 mb-3 border rounded"
              placeholder="category"
              value={editingProduct.category}
              onChange={(e) =>
                setEditingProduct({ ...editingProduct, category: e.target.value })
              }
            />
              <input
              type="text"
              className="w-full p-2 mb-3 border rounded"
              placeholder="Stock"
              value={editingProduct.description}
              onChange={(e) =>
                setEditingProduct({ ...editingProduct, description: e.target.value })
              }
            />

            <input
              type="number"
              className="w-full p-2 mb-3 border rounded"
              placeholder="Price"
              value={editingProduct.price}
              onChange={(e) =>
                setEditingProduct({ ...editingProduct, price: Number(e.target.value) })
              }
            />
            <input
              type="number"
              className="w-full p-2 mb-3 border rounded"
              placeholder="Stock"
              value={editingProduct.stock}
              onChange={(e) =>
                setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })
              }
            />

          

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setEditingProduct(null)}
                className="px-4 py-2 bg-gray-400 text-white rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSubmit}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProducts;
