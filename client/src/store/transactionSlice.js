import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import http from "../helpers/http";

export const purchaseBook = createAsyncThunk(
  "transaction/purchaseBook",
  async ({ bookId, token }, { rejectWithValue }) => {
    try {
      const response = await http({
            method: 'POST',
            url: '/purchases',
            headers: {
                Authorization: `Bearer ${token}`
            },
            data: { bookId }
            
      });
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || "Terjadi kesalahan");
    }
  }
);

const transactionSlice = createSlice({
  name: "transaction",
  initialState: {
    status: "idle",
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(purchaseBook.pending, (state) => {
        state.status = "loading";
      })
      .addCase(purchaseBook.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(purchaseBook.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default transactionSlice.reducer;
