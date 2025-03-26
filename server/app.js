const express = require('express')
const app = express()
const port = process.env.PORT || 3000

const dotenv = require('dotenv')
const userController = require('./controllers/userController')
const bookController = require('./controllers/bookController')
const favoriteController = require('./controllers/favoriteController')
const purchaseController = require('./controllers/purchaseController')
const authMiddleware = require('./middlewares/authMiddleware')
const cors = require('cors')
const transactionController = require('./controllers/transactionController')
const adminController = require('./controllers/adminController')

dotenv.config()
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use(cors())

// user endpoints
app.post('/google-login', userController.googleLogin)
app.post('/logout', userController.logout)

app.get('/users/profile', authMiddleware.authenticate, userController.getUserProfile)
app.put('/users/profile', authMiddleware.authenticate, userController.updateUserProfile)
app.get('/users/purchases', authMiddleware.authenticate, userController.getUserPurchase)

// user books endpoints
app.get('/books', bookController.getAllBooks)
app.get('/books/:id', bookController.getBookById)
app.get('/books/search', bookController.searchBooks)

// admin only endpoints
app.post('/books', authMiddleware.authenticate, authMiddleware.isAdmin, bookController.addBook)
app.put('/books/:id', authMiddleware.authenticate, authMiddleware.isAdmin, bookController.updateBook)
app.delete('/books/:id', authMiddleware.authenticate, authMiddleware.isAdmin, bookController.deleteBook)

// favorite endpoints
app.post('/favorites', authMiddleware.authenticate, favoriteController.addToFavorite)
app.get('/favorites', authMiddleware.authenticate, favoriteController.getFavotire)

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

app.listen(port, () => {
    console.log(`f u ${port} times`)
})
