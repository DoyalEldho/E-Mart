import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchProducts = createAsyncThunk('products/fetch', async () => {
  const res = await axios.get('http://localhost:5000/view/products/user',{withCredentials:true})
  return res.data;
});

const userSlice = createSlice({
  name: 'products',
  initialState: {
     items: [], // Filtered products
    allItems: [], // All products
    loading: false,
    error: null,
       filters: {
      category: 'All',
      price: 10000, //max
    }
  },
  reducers: {
    filterProducts: (state, action) => {
      const { category, price } = action.payload;
      // state.filters = { category, price };

      state.items = state.allItems.filter(product => {
        const matchCategory = category === 'All' || product.category === category;
        const matchPrice = product.price <= price;
        return matchCategory && matchPrice;
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.allItems = action.payload
        state.items = action.payload;
      })
         .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default userSlice.reducer;
export const { filterProducts } = userSlice.actions;