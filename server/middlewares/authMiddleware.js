const jwt = require('jsonwebtoken');
const { User } = require('../models')

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