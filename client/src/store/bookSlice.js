import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import http from '../helpers/http'


export const fetchBooks = createAsyncThunk("books/fetchBooks", async (_, { dispatch }) => {
    try {
        const response = await http({
            method: "GET",
            url: "/books"
        });

        dispatch(fetchBooksSuccess(response.data)); 
    } catch (error) {
        console.log(error, '<<<<')
    }
});

export const fetchBooksById = createAsyncThunk("books/fetchBooksById", async (id, { dispatch }) => {
    try {
        const response = await http({
            method: "GET",
            url: `/books/${id}`
        })
        dispatch(fetchBookDetailSuccess(response.data));
    } catch (error) {
        console.log(error)
    }
})

const bookSlice = createSlice({
    name: "books",
    initialState: {
        books: [],
        bookDetail: null
    },
    reducers: {
        fetchBooksSuccess(state, action) { 
            state.books = action.payload
        },
        fetchBookDetailSuccess(state, action) {
            state.bookDetail = action.payload
        },
    },
});

export const { fetchBooksSuccess, fetchBookDetailSuccess } = bookSlice.actions;
export default bookSlice.reducer