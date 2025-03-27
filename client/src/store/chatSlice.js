import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import http from "../helpers/http";

export const fetchGeminiResponse = createAsyncThunk("chat/fetchResponse", async (prompt, { rejectWithValue }) => {
    try {
      console.log("Mengirim request ke /gemini dengan prompt:", prompt);
      const response = await http({
        method: "POST",
        url: "/gemini",
        data: {prompt},
      });
      console.log("Response dari API:", response.data);
      return { user: prompt, bot: response.data.response };
    } catch (error) {
      console.log(error, 'chat')
      return rejectWithValue(error.response?.data?.message || "Error fetching AI response");
    }
  }
);

const geminiSlice = createSlice({
  name: "chat",
  initialState: {
    messages: [], 
    loading: false,
    error: null,
  },
  reducers: {
    clearMessages: (state) => {
      state.messages = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGeminiResponse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGeminiResponse.fulfilled, (state, action) => {
        state.loading = false;
        state.messages.push(action.payload); 
      })
      .addCase(fetchGeminiResponse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearResponse } = geminiSlice.actions;
export default geminiSlice.reducer;
