import { useEffect,useState  } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteProductThunk, getCartThunk } from '../../features/cartSlice';
import toast from 'react-hot-toast';
import { FaTrash } from 'react-icons/fa';
import axios from 'axios';
import Spinner from '../Loader/Spinner';



const Cart = () => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.carts);
    const [showPopup, setShowPopup] = useState(false);
  const [address, setAddress] = useState({ street: '', city: '', state: '', zipCode: '', country: '', phone: ''});
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [orderLoading, setOrderLoading] = useState(false);


  useEffect(() => {
    dispatch(getCartThunk());
  }, [dispatch]);

  const handleDelete = (productId) => {
    dispatch(deleteProductThunk(productId)).then(()=>{
        dispatch(getCartThunk());
        toast.success('Item removed from cart');
    })
  };

  const totalPrice = items.reduce((sum, item) => {
    if (item.productId) {
      return sum + item.productId.price * item.quantity;
    }
    return sum;
  }, 0);

  const handleOrder = () => {
    setShowPopup(true);
  };

    const submitOrder = async () => {
      setOrderLoading(true);
    try {
      await axios.post(
        'http://localhost:5000/place-order',
        {
          address,
          paymentMethod,
          totalPrice
        },
        { withCredentials: true }
      );
      setShowPopup(false);
       setOrderLoading(false);
       toast.success('Order Placed Sucessfully');
         dispatch(getCartThunk());

  

    } catch (error) {
      console.error('Order error:', error);
    }
  };

  if (loading) return <p className="text-center mt-8"><Spinner/></p>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {items.length === 0 ? (
        <p className="text-center text-xl text-gray-600 font-semibold mt-10 bg-gray-50 p-6 rounded-lg shadow-sm">
          Your cart is empty.
        </p>
      ) : (
        <>
          {/* Order Button */}
          <div className="flex justify-between items-center mb-6 p-4 bg-yellow-100 border border-yellow-400 rounded-lg shadow-sm">
            <p className="text-2xl font-bold text-yellow-800">
              Total: ₹{totalPrice}
            </p>
            <button
              onClick={handleOrder}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded font-semibold shadow"
            >
              Place Order
            </button>
          </div>

          {/* Product Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => {
              const product = item.productId;
              if (!product) return null;

              return (
                <div
                  key={item._id}
                  className="border rounded-lg p-4 shadow relative"
                >
                  <img
                    src={product.image}
                    alt={product.title}
                    className="h-40 w-full object-contain mx-auto"
                  />
                  <h3 className="text-lg font-semibold mt-2">
                    {product.title}
                  </h3>
                  <p className="text-sm text-gray-600">{product.category}</p>
                  <p className="text-sm mt-1">{product.description}</p>
                  <p className="mt-2 font-bold">Quantity: {item.quantity}</p>
                  <p className="mt-1 font-bold text-green-600">
                    ₹{product.price}
                  </p>

                  <button
                    onClick={() => handleDelete(product._id)}
                    className="absolute bottom-2 right-4 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full text-xs"
                    title="Remove from Cart"
                  >
                    <FaTrash className="text-sm" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Order Popup */}
          {showPopup && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4">
                  Confirm Your Order
                </h2>

                {/* Address Form */}
                <input
                  type="text"
                  placeholder="Street"
                  className="w-full mb-2 border p-2"
                  value={address.street}
                  onChange={(e) =>
                    setAddress({ ...address, street: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="City"
                  className="w-full mb-2 border p-2"
                  value={address.city}
                  onChange={(e) =>
                    setAddress({ ...address, city: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="State"
                  className="w-full mb-2 border p-2"
                  value={address.state}
                  onChange={(e) =>
                    setAddress({ ...address, state: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Zip Code"
                  className="w-full mb-2 border p-2"
                  value={address.zipCode}
                  onChange={(e) =>
                    setAddress({ ...address, zipCode: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Country"
                  className="w-full mb-2 border p-2"
                  value={address.country}
                  onChange={(e) =>
                    setAddress({ ...address, country: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Phone"
                  className="w-full mb-2 border p-2"
                  value={address.phone}
                  onChange={(e) =>
                    setAddress({ ...address, phone: e.target.value })
                  }
                />

                {/* Payment Method */}
                <select
                  className="w-full border p-2 mb-4"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="COD">Cash on Delivery</option>
                  <option value="Online">Online Payment</option>
                </select>

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowPopup(false)}
                    className="bg-gray-300 px-4 py-2 rounded"
                  >
                    Cancel
                  </button>

                    {orderLoading ? (
                        <div className="fixed inset-0 z-[999] bg-black bg-opacity-50 flex items-center justify-center">
                      <Spinner />
                      </div>
                    ) : (
                      <button
                        onClick={submitOrder}
                        className="bg-green-600 text-white px-4 py-2 rounded"
                      >
                        Confirm
                      </button>
                )}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Cart;
