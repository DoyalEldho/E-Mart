import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrdersByStatus, updateOrderStatus } from '../../features/orderSlice';
import toast from 'react-hot-toast';
import Spinner from '../Loader/Spinner';

const Orders = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.orders);
  const [statusMap, setStatusMap] = useState({});

  useEffect(() => {
    dispatch(fetchOrdersByStatus({ status: 'processing' }))

  }, [dispatch]);

  const handleStatusChange = (orderId, newStatus) => {
    setStatusMap({ ...statusMap, [orderId]: newStatus });
  };

  const handleUpdate = (orderId) => {
    if (statusMap[orderId]) {
      dispatch(updateOrderStatus({ orderId, status: statusMap[orderId] })).then(()=>{

        dispatch(fetchOrdersByStatus({ status: 'processing' }))
        toast.success("Status updated");
      })
    }
  };

  if (loading) return <p><Spinner/></p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {orders.map((order) => (
            <div key={order._id} className="border p-6 rounded-lg shadow-md relative bg-white">
              {/* Status Dropdown and Button */}
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <select
                  className="border rounded px-2 py-1"
                  value={statusMap[order._id] || order.status}
                  onChange={(e) => handleStatusChange(order._id, e.target.value)}
                >
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                </select>
                <button
                  onClick={() => handleUpdate(order._id)}
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                >
                  Update
                </button>
              </div>

              <p><strong>Customer:</strong> {order.userId?.name} ({order.userId?.email})</p>
        <p><strong>Status:</strong>{' '}<span className="text-orange-500 font-semibold capitalize">{order.status}</span></p>
              <p><strong>Payment:</strong> {order.paymentMethod} {order.isPaid && "(Paid)"}</p>
              <p><strong>Total:</strong> ₹{order.totalPrice}</p>
              <p><strong>Address:</strong>  {order.address?.city},{order.address?.street}, {order.address?.state} - {order.address?.zipCode}</p>

              <div className="mt-4">
                <strong>Products:</strong>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                  {order.products.map((p) => (
                    <div key={p._id} className="border p-2 rounded bg-gray-100">
                      <img src={p.productId.image} alt="product" className="w-full h-32 object-cover rounded" />
                      <p className="mt-1 font-semibold">{p.productId.title}</p>
                      <p className="text-sm">₹{p.productId.price}</p>
                      <p className="text-sm">Qty: {p.quantity}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
