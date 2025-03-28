import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import http from "../helpers/http";

export const addToFavorite = createAsyncThunk(
  "favorite/addToFavorite",
  async ({ bookId, token }, { rejectWithValue }) => {
    try {
      const response = await http({
        method: "POST",
        url: "/favorites",
        headers: { Authorization: `Bearer ${token}` },
        data: { bookId },
      });
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || "Terjadi kesalahan");
    }
  }
);

export const fetchFavorites = createAsyncThunk(
  "favorite/fetchFavorites",
  async (token, { rejectWithValue }) => {
    try {
      const response = await http({
        method: "GET",
        url: "/favorites",
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
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

const favoriteSlice = createSlice({
  name: "favorite",
  initialState: { items: [], status: "idle", error: null },
  extraReducers: (builder) => {
    builder
      .addCase(addToFavorite.fulfilled, (state, action) => {
        if (action.payload) {
          state.items.push(action.payload);
        }
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(addToFavorite.rejected, (state, action) => {
        state.error = action.payload;
      });
  }
});

export const { fetchFavoritesSuccess } = favoriteSlice.actions
export default favoriteSlice.reducer;
