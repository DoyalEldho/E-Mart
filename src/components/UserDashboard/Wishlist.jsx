import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteWishlistThunk, getWishlistThunk, moveToCartThunk } from '../../features/wishlistSlice'
import toast from 'react-hot-toast';
import { getCartThunk } from '../../features/cartSlice';

const Wishlist = () => {
  const dispatch = useDispatch();
  const {item} = useSelector((state) => state.wishlist);

  useEffect(() => {
    dispatch(getWishlistThunk());
  }, [dispatch]);

  const deleteItem=(productId)=>{
      dispatch(deleteWishlistThunk(productId)).then(()=>{
        toast.success('Item removed from Wishlist');
            dispatch(getWishlistThunk());
      })
  }

  const moveToCart=(productId)=>{
     dispatch(moveToCartThunk(productId)).then(()=>{
       toast.success('Item Moved to cart');
        dispatch(getWishlistThunk());
           dispatch(getCartThunk());
     })
  }

return (
    <div className="p-4">
      { item.length === 0 ? (
      <p className="text-center text-xl text-gray-500 font-semibold mt-10 bg-gray-100 p-6 rounded-lg shadow-sm">
        No items in your wishlist yet!
      </p>

      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {item.map((item) => (
            <div key={item._id} className="border rounded-lg p-4 shadow relative">
              <img
                src={item.productId.image}
                alt={item.productId.title}
                className="h-40 w-full object-contain mx-auto"
              />
              <h3 className="text-lg font-bold">{item.productId.title}</h3>
              <p className="text-sm text-gray-600">{item.productId.description}</p>
              <p className="mt-2 text-sm">Category: {item.productId.category}</p>
              <p className="font-semibold">₹{item.productId.price}</p>
              <p className="text-sm text-gray-500">Stock: {item.productId.stock}</p>

              <div className="mt-4 flex gap-3">
                <button
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
                  onClick={() => moveToCart(item.productId._id)}
                >
                  Move to Cart
                </button>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                  onClick={() => deleteItem(item._id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};



export default Wishlist;
