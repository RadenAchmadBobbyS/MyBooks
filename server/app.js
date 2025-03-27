if (process.env.NODE_ENV !== "production") {
    require('dotenv').config()
}

const express = require('express')
const app = express()
const cors = require('cors')
const dotenv = require('dotenv')
const userController = require('./controllers/userController')
const bookController = require('./controllers/bookController')
const favoriteController = require('./controllers/favoriteController')
const purchaseController = require('./controllers/purchaseController')
const authMiddleware = require('./middlewares/authMiddleware')
const transactionController = require('./controllers/transactionController')
const adminController = require('./controllers/adminController')
const geminiController = require('./controllers/geminiController')

dotenv.config()
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use(cors())

app.get('/', (req, res) => {
    res.json({ message: 'Hello Hoyyy'})
})

// user endpoints
app.post('/google-login', userController.googleLogin)
app.post('/logout', userController.logout)

app.get('/users/profile', authMiddleware.authenticate, userController.getUserProfile)
app.put('/users/profile', authMiddleware.authenticate, userController.updateUserProfile)
app.get('/users/purchases', authMiddleware.authenticate, userController.getUserPurchase)

// gemini AI chat endpoint
app.post('/gemini', geminiController.generateRespons)

// user books endpoints
app.get('/books', bookController.getAllBooks)
app.get('/books/:id', bookController.getBookById)
app.get('/books/search', bookController.searchBooks)

// admin only endpoints
app.post('/admin/books', authMiddleware.authenticate, authMiddleware.isAdmin, bookController.addBook)
app.put('/admin/books/:id', authMiddleware.authenticate, authMiddleware.isAdmin, bookController.updateBook)
app.delete('/admin/books/:id', authMiddleware.authenticate, authMiddleware.isAdmin, bookController.deleteBook)

// favorite endpoints
app.post('/favorites', authMiddleware.authenticate, favoriteController.addToFavorite)
app.get('/favorites', authMiddleware.authenticate, favoriteController.getFavorite)

// purchase endpoints
app.post('/purchases', authMiddleware.authenticate, purchaseController.createPurchase)
app.post('/midtrans-webhook', purchaseController.midtransWebHook)

// user transaction endpoints
app.get('/transactions', authMiddleware.authenticate, transactionController.getAllTransactions)
app.get('/transactions/:id', authMiddleware.authenticate, transactionController.getTransactionById)

// admin transaction endpoints
app.get('/admin/transactions', authMiddleware.authenticate, authMiddleware.isAdmin, adminController.getUserTransaction)
app.get('/admin/transactions/:id', authMiddleware.authenticate, authMiddleware.isAdmin, adminController.getUserTransactionById)

// admin endpoints
app.get('/admin/users', authMiddleware.authenticate, authMiddleware.isAdmin, adminController.getAllusers)
app.put('/admin/users/:id', authMiddleware.authenticate, authMiddleware.isAdmin, adminController.updateUserRole)
app.delete('/admin/users/:id', authMiddleware.authenticate, authMiddleware.isAdmin, adminController.deleteUser)

module.exports = app
