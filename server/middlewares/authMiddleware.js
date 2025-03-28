const jwt = require('jsonwebtoken');
const { User } = require('../models')
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

class authMiddleware {
    static authenticate(req, res, next) {
        try {
            const { authorization } = req.headers;

            if (!authorization) return res.status(401).json({ message: 'Unauthorized' })

            const token = authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;

            next()
        } catch (error) {
            console.log(error)
            res.status(403).json({ message: 'Forbidden' })
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
                return res.status(200).json({
                    message: 'User created',
                    user: {
                        email: user.email,
                        name: user.name,
                        role: user.role
                    }
                });
            }

            req.user = user;
            next();
        } catch (error) {
            if (error.message.includes('Invalid') || error.message.includes('invalid_token')) {
                return res.status(401).json({ message: 'Invalid Google token' });
            } else {
                return res.status(403).json({ message: 'Token not provided' });
            }
        }
    }

    static async isAdmin(req, res, next) {
        try {
            const user = await User.findByPk(req.user.id);
            if (!user || user.role !== 'admin') {
                return res.status(403).json({ message: 'Forbidden: Admin access only' });
            }

            next();
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}

module.exports = authMiddleware