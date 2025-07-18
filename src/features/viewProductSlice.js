// src/redux/slices/viewProductSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (page = 1) => {
    const res = await axios.get(`http://localhost:5000/view/products?page=${page}&limit=4`, {
      withCredentials: true,
    });
    return res.data;
  }
);


// Delete product
export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (productId, { rejectWithValue }) => {
    try {
      await axios.delete(`http://localhost:5000/delete/products/${productId}`,{
      withCredentials: true,
    });
      return productId;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Edit product
export const editProduct = createAsyncThunk(
  'products/editProduct',
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`http://localhost:5000/update/products/${id}`, updatedData,{
      withCredentials: true,
    });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const viewProductSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    totalPages: 1,
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.items = action.payload.products;
        state.totalPages = action.payload.totalPages;
        state.loading = false;
      })
        .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter((prod) => prod._id !== action.payload);
      })
      .addCase(editProduct.fulfilled, (state, action) => {
        const index = state.items.findIndex((prod) => prod._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      });
  },
});

export default viewProductSlice.reducer;
