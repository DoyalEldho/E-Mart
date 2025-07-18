import { configureStore } from '@reduxjs/toolkit';
import productReducer from '../features/productSlice';
import viewProductReducer from '../features/viewProductSlice';
import orderReducer from '../features/orderSlice';
import userReducer from '../features/userSlice'
import cartReducer from '../features/cartSlice'
import wishlistReducer from '../features/wishlistSlice'
import historyReducer from '../features/historySlice'

export const store = configureStore({
  reducer: {
    product: productReducer,
    products:viewProductReducer,
    orders:orderReducer,
    user:userReducer,
    carts:cartReducer,
    wishlist:wishlistReducer,
    history: historyReducer,
  }
});
