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
app.get('/books/:id')
app.get('/books/search')

// admin only endpoints
app.post('/books')
app.put('/books/:id')
app.delete('/books/:id')

// favorite endpoints
app.post('/favorites', authMiddleware.authenticate, favoriteController.addToFavorite)
app.get('/favorites', authMiddleware.authenticate, favoriteController.getFavotire)

// purchase endpoints
app.post('/purchases', authMiddleware.authenticate, purchaseController.createPurchase)
app.post('/midtrans-webhook', purchaseController.midtransWebHook)

// user transaction endpoints
app.get('/transactions')
app.get('/transactions/:id')

// admin transaction endpoints
app.get('/admin/transactions')
app.get('/admin/transactions/:id')

// admin endpoints
app.get('/admin/users')
app.put('/admin/users/:id')
app.delete('/admin/users/:id')

app.listen(port, () => {
    console.log(`f u ${port} times`)
})
