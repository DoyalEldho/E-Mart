import  { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyOrders } from '../../features/historySlice';
import Spinner from '../Loader/Spinner';

const OrderHistory = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector(state => state.history);

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  if (loading) return <p>Loading order history.. <Spinner/> </p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
<div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
  <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Order History</h2>

  {orders.length === 0 ? (
    <p className="text-center text-gray-500">No past orders found.</p>
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {orders.map(order => (
        <div
          key={order._id}
          className="bg-white border border-gray-200 shadow-md rounded-xl p-4 hover:shadow-lg transition"
        >
          {/* Header: Status and Date */}
          <div className="flex justify-between items-center mb-3">
            <span
              className={`px-2 py-1 rounded-full text-xs font-semibold text-white ${
                order.status === 'processing'
                  ? 'bg-yellow-500'
                  : order.status === 'shipped'
                  ? 'bg-blue-500'
                  : 'bg-green-600'
              }`}
            >
              {order.status.toUpperCase()}
            </span>
            <span className="text-xs text-gray-400">
              {new Date(order.createdAt).toLocaleDateString()}
            </span>
          </div>

          <p className="text-sm text-gray-700 mb-3">
            <strong>Payment:</strong> {order.paymentMethod}
          </p>

          {/* Product List */}
          <ul className="divide-y divide-gray-100 mb-4">
            {order.products.map(p => (
              <li key={p._id} className="flex items-center gap-3 py-2">
                <img
                  src={p.productId.image}
                  alt={p.productId.title}
                  className="w-12 h-12 object-cover rounded-md border"
                />
                <div className="flex flex-col">
                  <p className="text-sm font-medium text-gray-800">{p.productId.title}</p>
                  <p className="text-xs text-gray-600">
                    Qty: {p.quantity} × ₹{p.productId.price}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          {/* Total Price */}
          <div className="text-right">
            <p className="text-md font-semibold text-gray-800">
              Total: ₹{order.totalPrice.toFixed(2)}
            </p>
          </div>
        </div>
      ))}
    </div>
  )}
</div>



  );
};

export default OrderHistory;
