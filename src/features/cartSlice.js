import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const addToCartThunk = createAsyncThunk(
  'cart/addToCart',
  async ({productId}, { rejectWithValue }) => {
    try {
      const res = await axios.post(`http://localhost:5000/add-to-cart/${productId}`,null, { withCredentials: true });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

//  fetch cart items
export const getCartThunk = createAsyncThunk('cart/getCart', async () => {
  const response = await axios.get('http://localhost:5000/display/cart', {
    withCredentials: true,
  });
  return response.data.cart; 
});

// delete
export const deleteProductThunk = createAsyncThunk(
  'products/deleteProduct',
  async (productId, { rejectWithValue }) => {
    try {
      await axios.delete(`http://localhost:5000/remove-from-cart/${productId}`,{
      withCredentials: true,
    });
      return productId;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    loading: false,
    length:0
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCartThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCartThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.length =action.payload.length
      })
      .addCase(getCartThunk.rejected, (state) => {
        state.loading = false;
      })
      .addCase(deleteProductThunk.fulfilled,(state,action)=>{
           
        state.loading = false;
        state.items = state.items.filter(res=>res._id!==action.payload)
        state.length = state.items.length;
      })
        .addCase(deleteProductThunk.pending, (state) => {
         state.loading = true;
         })
       .addCase(deleteProductThunk.rejected, (state) => {
            state.loading = false;
         });

    },
});

export default cartSlice.reducer;
