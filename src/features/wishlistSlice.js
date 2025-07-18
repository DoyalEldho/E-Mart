import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';


export const addToWishlistThunk = createAsyncThunk(
  'wishlist/addToWishlist',
  async ({productId}, { rejectWithValue }) => {
    try {
      const res = await axios.post(`http://localhost:5000/add-to-wishlist/${productId}`, null, { withCredentials: true });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

//display wishlist
export const getWishlistThunk = createAsyncThunk(
  'wishlist/getWishlist',
  async () => {
    const res = await axios.get('http://localhost:5000/display/wishlist', {
      withCredentials: true,
    });
    return res.data.wishlist;
  }
);

//delete
export const deleteWishlistThunk = createAsyncThunk(
  'wishlist/deleteWishlist',
  async (id) => {
    await axios.delete(`http://localhost:5000/remove-from-wishlist/${id}`, {
      withCredentials: true,
    });
    return id;
  }
);

//move to cart
export const moveToCartThunk = createAsyncThunk(
  'wishlist/moveToCart',
  async ( productId ) => {
    await axios.post(`http://localhost:5000/wishlist-to-cart/${productId}`, null, {
      withCredentials: true,
    });
    return productId;
  }
);


const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    item: [],
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getWishlistThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getWishlistThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.item = action.payload;
      })
      .addCase(getWishlistThunk.rejected, (state) => {
        state.loading = false;
      })

      .addCase(deleteWishlistThunk.fulfilled, (state, action) => {
        state.item = state.item.filter(
          (item) => item._id !== action.payload
        );
      })
        .addCase(moveToCartThunk.fulfilled, (state, action) => {
            state.item = state.item.filter(
                (item) => item.productId._id !== action.payload
            );
        })

  },
});

export default wishlistSlice.reducer;
