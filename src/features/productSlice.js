import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


// Add single product 
export const addProduct = createAsyncThunk(
  'product/add',
  async (data, { rejectWithValue }) => {
    try {
        const res = await axios.post('http://localhost:5000/add/products', data, {
            withCredentials: true 
        });
        return res.data.message;

    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Add Product Failed');
    }
  }
);

// Upload bulk product through CSV
export const uploadCsv = createAsyncThunk(
  'product/uploadCsv',
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axios.post('http://localhost:5000/upload-csv', formData, {
            withCredentials: true 
        },{
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data.message;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'CSV Upload Failed');
    }
  }
);

// Slice
const productSlice = createSlice({
  name: 'product',
  initialState: {
    loading: false,
    successMessage: '',
    errorMessage: '',
  },
  reducers: {
    clearMessages: (state) => {
      state.successMessage = '';
      state.errorMessage = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // Add Product
      .addCase(addProduct.pending, (state) => {
        state.loading = true;
        state.successMessage = '';
        state.errorMessage = '';
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload;
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.payload;
      })

      // Upload CSV
      .addCase(uploadCsv.pending, (state) => {
        state.loading = true;
        state.successMessage = '';
        state.errorMessage = '';
      })
      .addCase(uploadCsv.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload;
      })
      .addCase(uploadCsv.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.payload;
      });
  },
});

export const { clearMessages } = productSlice.actions;
export default productSlice.reducer;


