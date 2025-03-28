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
      let message = "Something went wrong!";
                  if (error.response) {
                    console.log(error.response.data);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                    message = error.response.data.message;
                  }
                  Swal.fire({
                    title: "Error!",
                    text: message,
                    icon: "error",
                  });
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
