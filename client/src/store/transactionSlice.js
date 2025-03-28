import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import http from "../helpers/http";
import Swal from "sweetalert2";

export const purchaseBook = createAsyncThunk(
  "transaction/purchaseBook",
  async ({ bookId, token }, { rejectWithValue }) => {
    try {
      const response = await http({
        method: "POST",
        url: "/purchases",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { bookId },
      });
      return response.data;
    } catch (error) {
      // Kirim pesan error ke Redux state
      if (error.response && error.response.data && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue("Something went wrong!");
    }
  }
);

export const updateTransactionStatus = createAsyncThunk(
  "transaction/updateTransactionStatus",
  async ({ transactionId, status }, { rejectWithValue }) => {
    try {
      const response = await updatePaymentStatus(transactionId, status);
      return response;
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue("Failed to update transaction status!");
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
        state.error = null; // Reset error saat loading
      })
      .addCase(purchaseBook.fulfilled, (state) => {
        state.status = "succeeded";
        state.error = null; // Reset error saat berhasil
        Swal.fire({
          title: "Success!",
          text: "Book purchased successfully.",
          icon: "success",
        });
      })
      .addCase(purchaseBook.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload; // Simpan pesan error dari rejectWithValue
        Swal.fire({
          title: "Error!",
          text: action.payload || "Failed to purchase the book.",
          icon: "error",
        });
      })
      .addCase(updateTransactionStatus.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateTransactionStatus.fulfilled, (state) => {
        state.status = "succeeded";
        Swal.fire({
          title: "Success!",
          text: "Transaction status updated successfully.",
          icon: "success",
        });
      })
      .addCase(updateTransactionStatus.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        Swal.fire({
          title: "Error!",
          text: action.payload || "Failed to update transaction status.",
          icon: "error",
        });
      });
  },
});

export default transactionSlice.reducer;
