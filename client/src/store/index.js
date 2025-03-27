import { configureStore } from "@reduxjs/toolkit"
import bookReducer from "./bookSlice"
import geminiReducer from "./chatSlice"
import authReducer from "./authSlice"
import transactionReducer from "./transactionSlice"
import favoriteReducer from "./favoriteSlice"

const store = configureStore({
    reducer: {
        auth: authReducer,
        book: bookReducer,
        chat: geminiReducer,
        transaction: transactionReducer,
        favorite: favoriteReducer
    }
})

export default store