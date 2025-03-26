const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET

// new token
const signToken = (payload) => {
    return jwt.sign(payload, JWT_SECRET)
}

// verify token
const verifyToken = (token) => {
    return jwt.verify(token, JWT_SECRET)
}

module.exports = { signToken, verifyToken }