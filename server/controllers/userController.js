const { OAuth2Client } = require('google-auth-library')
const { User } = require('../models');
const jwt = require('jsonwebtoken')

    class userController {

        static async goggleLogin(req, res) {
            try {
                const { tokenId } = req.body;
                
                const client = new OAuth2Client();

                const ticket = await client.verifyIdToken({
                    idToken: tokenId,
                    audience: process.env.GOOGLE_CLIENT_ID,

                });
                const payload = ticket.getPayload();
                console.log(payload, '<= payload')

                const { sub, name, email } = payload;
                let user = await User.findOne({ where: { googleId: sub } });
        
                if (!user) {
                    user = await User.create({
                        googleId: sub,
                        email,
                        name,
                        role: 'user'
                    });
                }

                const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, {
                    expiresIn: '24h'
                });
                console.log(token)

                res.json({ user, token })
            } catch (error) {
                console.log('Login Error', error)
                res.status(500).json({ message: 'Internal server error' })
            }
        }

        static async getUser(req, res) {
            try {
                const id = req.user.id
                const user = await User.findByPk(id);

                if (!user) return res.status(404).json({ message: 'User not found' })
                
                res.status(200).json(user);
            } catch (error) {
                console.log(error)
                res.status(500).json({ message: 'Internal server error' })
            }
        }

        static logout(req, res) {
            res.status(200).json({ message: 'Loggout susscess' })
        }

    }

    module.exports = userController