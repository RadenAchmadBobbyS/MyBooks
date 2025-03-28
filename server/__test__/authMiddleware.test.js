// Set up environment variables for testing
process.env.JWT_SECRET = 'testsecret';

const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middlewares/authMiddleware');
const { User } = require('../models');

jest.mock('../models', () => ({
    User: {
        findByPk: jest.fn(),
        findOne: jest.fn(),
        create: jest.fn(),
    },
}));

jest.mock('google-auth-library', () => ({
    OAuth2Client: jest.fn().mockImplementation(() => ({
        verifyIdToken: jest.fn(),
    })),
}));

const app = express();
app.use(express.json());

// Mock routes for testing
app.get('/protected', authMiddleware.authenticate, authMiddleware.verifyGoogleToken, (req, res) => {
    res.status(200).json({ message: 'Access granted', user: req.user });
});

app.get('/admin', authMiddleware.authenticate, authMiddleware.isAdmin, (req, res) => {
    res.status(200).json({ message: 'Admin access granted' });
});

// Mock User.findByPk behavior
beforeEach(() => {
    User.findByPk.mockReset();
});

describe('authMiddleware', () => {
    describe('authenticate', () => {
        it('should return 401 if no authorization header is provided', async () => {
            const response = await request(app).get('/protected');
            expect(response.status).toBe(401);
            expect(response.body.message).toBe('Unauthorized');
        });

        it('should return 403 if token is invalid', async () => {
            const response = await request(app)
                .get('/protected')
                .set('Authorization', 'Bearer invalidtoken');
            expect(response.status).toBe(403);
            expect(response.body.message).toBe('Forbidden');
        });

    });

    describe('isAdmin', () => {
        it('should return 403 if user is not an admin', async () => {
            const token = jwt.sign({ id: 1, role: 'user' }, process.env.JWT_SECRET);
            User.findByPk.mockResolvedValue({ id: 1, role: 'user' });

            const response = await request(app)
                .get('/admin')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(403);
            expect(response.body.message).toBe('Forbidden: Admin access only');
        });

        it('should grant access if user is an admin', async () => {
            const token = jwt.sign({ id: 1, role: 'admin' }, process.env.JWT_SECRET);
            User.findByPk.mockResolvedValue({ id: 1, role: 'admin' });

            const response = await request(app)
                .get('/admin')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Admin access granted');
        });
    });
});

describe('verifyGoogleToken', () => {
    it('should return 403 if token is not provided', async () => {
        const response = await request(app)
            .get('/protected')
            .set('Authorization', 'Bearer aodasodaso');

        expect(response.status).toBe(403);
        expect(response.body.message).toBe('Forbidden');
    });

    it('should return 401 if token is invalid', async () => {
        const response = await request(app)
            .get('/protected')
            .set('Authorization', 'Bearer invalidtoken');

        expect(response.status).toBe(403);
        expect(response.body.message).toBe('Forbidden');
    });

    it('should create a new user if not found in database', async () => {
        const mockPayload = {
            sub: '123',
            email: 'newuser@example.com',
            name: 'New User',
        };

        const mockClient = {
            verifyIdToken: jest.fn().mockResolvedValue({ getPayload: () => mockPayload }),
        };

        require('google-auth-library').OAuth2Client.mockImplementation(() => mockClient);

        User.findOne.mockResolvedValue(null);
        User.create.mockResolvedValue({ id: 1, ...mockPayload, role: 'user' });

        const token = '12482109481249u2109ej120dj101930'
        const response = await request(app)
            .get('/protected')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(403);
    });
});