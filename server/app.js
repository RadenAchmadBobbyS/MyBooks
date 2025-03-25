const express = require('express')
const app = express()
const port = process.env.PORT || 3000

const userController = require('./controllers/userController')
const bookController = require('./controllers/bookController')
const favoriteController = require('./controllers/favoriteController')
const purchaseController = require('./controllers/purchaseController')
const authMiddleware = require('./middlewares/authMiddleware')
const cors = require('cors')

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use(cors())

app.post('/google-login', userController.goggleLogin)
app.post('/logout', userController.logout)

app.get('/books', bookController.getAllBooks)

app.post('/favorites', authMiddleware.authenticate, favoriteController.addToFavorite)
app.get('/favorites', authMiddleware.authenticate, favoriteController.getFavotire)

app.post('/purchases', authMiddleware.authenticate, purchaseController.createPurchase)
app.post('/midtrans-webhook', purchaseController.midtransWebHook)

app.get('/user', authMiddleware.authenticate, userController.getUser)

app.listen(port, () => {
    console.log(`f u ${port} times`)
})