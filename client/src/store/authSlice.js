import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import http from "../helpers/http";

export const fetchUser = createAsyncThunk("/profile/fetchUser", async (_, { dispatch }) => {
    try {
        const response = await http({
            method: 'POST',
            url: '/google-login'
        })
        dispatch(fetchUserSuccess(response.data))
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
})

const initialState = {
    user: JSON.parse(localStorage.getItem("user")) || null,
    token: localStorage.getItem("token") || null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser: (state, action) => {
            console.log("Set User dipanggil:", action.payload);
            state.user = action.payload;
            localStorage.setItem("user", JSON.stringify(action.payload));
        },
        setToken: (state, action) => {
            state.token = action.payload;
            localStorage.setItem("token", action.payload);
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem("user");
            localStorage.removeItem("token");
        },
        fetchUserSuccess: (state, action) => {
            state.user = action.payload;
            localStorage.setItem("user", JSON.stringify(action.payload));
        }
    }
});

export const { setUser, setToken, logout } = authSlice.actions;
export default authSlice.reducer;
