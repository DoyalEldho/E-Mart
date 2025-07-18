import React from 'react';
import { Heart, ShoppingCart } from 'lucide-react';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { addToCartThunk, getCartThunk } from '../../features/cartSlice';
import { addToWishlistThunk, getWishlistThunk } from '../../features/wishlistSlice';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();


 const addToCart = (id) => {
    dispatch(addToCartThunk({ productId: id }))
      .then((res) => {
        if (res.meta.requestStatus === 'fulfilled') {
          dispatch(getCartThunk());
          toast.success("Added to cart");
        } else {
          toast.error(res.payload?.message || "Failed to add to cart");
        }
      });
  };

  const addToWishlist = (id) => {
    dispatch(addToWishlistThunk({ productId: id }))
    .then((res) => {
        if (res.meta.requestStatus === 'fulfilled') {
          toast.success("Added to Wishlist");
          dispatch(getWishlistThunk())
        } else {
          toast.error(res.payload?.message || "Failed to add to wishlist");
        }
      });
  }
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden p-4 hover:shadow-lg transition">
    <div className="w-full h-48 overflow-hidden rounded-md bg-gray-100 flex items-center justify-center">
  <img  src={product.image}  alt={product.title}  className="h-full w-auto object-contain" />
</div>
      <h3 className="text-lg font-semibold mt-2">{product.title}</h3>
      <p className="text-gray-500 text-sm">{product.category}</p>
      <p className="text-xl font-bold mt-1">₹{product.price}</p>

      <div className="flex justify-between mt-4">
        <button onClick={()=>addToCart(product._id)} className="flex items-center gap-2 px-3 py-1 bg-black text-white rounded-lg text-sm hover:bg-gray-800">
          <ShoppingCart size={16} /> Add to Cart
        </button>
        <div className="relative group inline-block">
          <div className="absolute right-12 bottom-full -translate-y-1/2 mr-2 px-3 py-1 text-xs bg-white text-gray-700 border border-gray-300 rounded shadow group-hover:opacity-100 opacity-0 transition-opacity whitespace-nowrap z-50">
            Add to Wishlist
          </div>
          <button  onClick={()=>addToWishlist(product._id)}  className="p-2 border rounded-lg hover:bg-red-100 text-red-500">
            <Heart size={16} />
          </button>
        </div>


      </div>
    </div>
  );
};

export default ProductCard;
