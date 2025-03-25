const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { OAuth2Client } = require('google-auth-library')
const { User } = require('../models')

dotenv.config();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

class authMiddleware {
    static authenticate(req, res, next) {
        try {
            const token = req.headers['authorization']?.split(' ')[1];

            if (!token) return res.status(403).json({ message: 'Token not provided' })

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            next()
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: 'Internal server error' })
        }
    }

    static async verifyGoogleToken(req, res, next) {
        try {
            const tokenId = req.headers['authorization']?.split(' ')[1];
            if (!tokenId) return res.status(403).json({ message: 'Token not provided' });

            const ticket = await client.verifyIdToken({
                idToken: tokenId,
                audience: process.env.GOOGLE_CLIENT_ID,
            });

            const payload = ticket.getPayload();
            let user = await User.findOne({ where: { googleId: payload.sub } });

            if (!user) {
                user = await User.create({
                    googleId: payload.sub,
                    email: payload.email,
                    name: payload.name,
                    role: 'user'
                });
            }

            req.user = user;
            next();
        } catch (error) {
            console.log(error);
            res.status(401).json({ message: 'Invalid Google token' });
        }
    }
}

module.exports = authMiddleware