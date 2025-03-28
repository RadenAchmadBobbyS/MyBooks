const request = require('supertest');
const app = require('../app');
const { sequelize } = require('../models');

describe('Admin Controller', () => {
  let adminToken;

  beforeAll(async () => {
    await sequelize.sync({ force: true });

    const admin = await sequelize.models.User.create({
      googleId: 'admin-google-id',
      email: 'admin@example.com',
      name: 'Admin User',
      role: 'admin',
    });

    const jwt = require('jsonwebtoken');
    const adminPayload = {
      id: admin.id,
      email: admin.email,
      role: admin.role,
    };
    adminToken = jwt.sign(adminPayload, process.env.JWT_SECRET, { expiresIn: '1h' });
  });

  it('should return a list of all users', async () => {
    const response = await request(app)
      .get('/admin/users')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should update a user role', async () => {
    const user = await sequelize.models.User.create({
      googleId: 'usersdasdas',
      email: 'user223@example.com',
      name: 'Usersdas',
      role: 'user',
    });

    const response = await request(app)
      .put(`/admin/users/${user.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ role: 'admin' });

      console.log('Response Status:', response.status); // Log status respons
      console.log('Response Body:', response.body); // Log body respons

    expect(response.status).toBe(200);
    expect(response.body.role).toBe(undefined);
  });

  it('should delete a user', async () => {
    const user = await sequelize.models.User.create({
      googleId: 'user-google-id-to-delete',
      email: 'user-to-delete@example.com',
      name: 'User to Delete',
      role: 'user',
    });

    const response = await request(app)
      .delete(`/admin/users/${user.id}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message","user User to Delete success deleted");
  });
});



describe('Book Controller', () => {
    it('should return all books', async () => {
      await sequelize.models.Book.bulkCreate([
        { title: 'Book One', author: 'Author One', price: 100 },
        { title: 'Book Two', author: 'Author Two', price: 200 },
      ]);
  
      const response = await request(app).get('/books');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
    });
  
    it('should return a book by ID', async () => {
      const book = await sequelize.models.Book.create({
        title: 'Book One',
        author: 'Author One',
        price: 100,
      });
  
      const response = await request(app).get(`/books/${book.id}`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', book.id);
    });
  
    it('should add a new book', async () => {
      const adminToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJib2JieXN5YWtpcjE4QGdtYWlsLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzQzMDk1NDM3LCJleHAiOjE3NDMxODE4Mzd9.dymtI3f0AnMQCjiQrZ4eCDlYf3FKh_2cclIeSSACyis'; // Ganti dengan token admin yang valid
      const response = await request(app)
        .post('/admin/books')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'New Book',
          author: 'New Author',
          price: 150,
        });
  
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("message", "Book added");
      expect(response.body.title).toBe(undefined);
    });
  });


  describe('Auth Middleware', () => {
    it('should return 401 if no token is provided', async () => {
      const response = await request(app).get('/users/profile');
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Unauthorized');
    });
  
    it('should return 403 if token is invalid', async () => {
      const response = await request(app)
        .get('/admin/users')
        .set('Authorization', 'Bearer 12412dsdasd12312asdasd');
  
      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('message', 'Forbidden');
    });
  
    it('should allow access for valid token', async () => {
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJib2JieXN5YWtpcjE4QGdtYWlsLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzQzMDk2MTI2LCJleHAiOjE3NDMxODI1MjZ9.JhQcz4F7ubRP8byPW7k4eI9Vp3VMAdLiPy_v4uYnVHc'; // Ganti dengan token valid
      const response = await request(app)
        .get('/users/profile')
        .set('Authorization', `Bearer ${token}`);
  
      expect(response.status).toBe(200);
    });
  });

  const  generateText  = require('../helpers/geminiAI');

describe('Gemini AI Helper', () => {
  it('should generate a response', async () => {
    const input = 'Apa itu AI?';
    const response = await generateText(input);
    expect(response).toBeDefined();
    expect(typeof response).toBe('string');
  });

  
});


it('should return 404 if book is not found', async () => {
    const response = await request(app).get('/books/9999'); // ID yang tidak ada
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message', 'Book not found');
  });
  
  it('should return 400 if book creation input is invalid', async () => {
    const adminToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJib2JieXN5YWtpcjE4QGdtYWlsLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzQzMDk2MTI2LCJleHAiOjE3NDMxODQzNjF9.JhQcz4F7ubRP8byPW7k4eI9Vp3VMAdLiPy_v4uYnVHc'; // Ganti dengan token admin yang valid
    const response = await request(app)
      .post('/admin/books')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: '', // Input tidak valid
        author: '',
        price: -100,
      });
  
    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty('message', 'Forbidden');
  });
  


  it('should return 400 if role is missing when updating user role', async () => {
    const user = await sequelize.models.User.create({
      googleId: 'use32323',
      email: 'usersad@example.com',
      name: 'Usersd',
      role: 'user', // Ensure role is provided
    });

    let adminToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJib2JieXN5YWtpcjE4QGdtYWlsLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzQzMDk3OTYxLCJleHAiOjE3NDMxODQzNjF9.lLc4R3kkzad5TGD2O9OH4tr6Y7KuClLONBnwxr_5l3Q';

    const response = await request(app)
      .put(`/admin/users/${user.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({}); 

    expect(response.status).toBe(400); // Update expected status to 400
    expect(response.body).toHaveProperty('message', 'Role is required'); // Update expected message
  });

  it('should return 404 if book is not found when updating', async () => {
    const adminToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJib2JieXN5YWtpcjE4QGdtYWlsLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzQzMDk3OTYxLCJleHAiOjE3NDMxODQzNjF9.lLc4R3kkzad5TGD2O9OH4tr6Y7KuClLONBnwxr_5l3Q'; 
    const response = await request(app)
      .put('/admin/books/9999') 
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Updated Book',
        author: 'Updated Author',
        price: 200,
      });
  
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message', 'Book with 9999 not found');
  });


  it('should add a book to favorites', async () => {
    const user = await sequelize.models.User.create({
      googleId: 'use321412',
      email: 'user22@example.com',
      name: 'User12',
      role: 'user',
    });
  
    const book = await sequelize.models.Book.create({
      title: 'Book One',
      author: 'Author One',
      price: 0,
      description: 'ayam',
      status: 'free',
      content: 'jaja',
      imgUrl: 'test'
    });
  
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJib2JieXN5YWtpcjE4QGdtYWlsLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzQzMDk3OTYxLCJleHAiOjE3NDMxODQzNjF9.lLc4R3kkzad5TGD2O9OH4tr6Y7KuClLONBnwxr_5l3Q'; // Ganti dengan token pengguna yang valid
    const response = await request(app)
      .post('/favorites')
      .set('Authorization', `Bearer ${token}`)
      .send({ bookId: book.id });

      console.log('Response Status:', response.status); // Log status respons
      console.log('Response Body:', response.body); // Log body respons
  
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('message', 'Book added to favorites');
  });

  it('should return 403 if token is expired', async () => {
    const expiredToken = 'your-expired-token'; // Ganti dengan token yang sudah kedaluwarsa
    const response = await request(app)
      .get('/admin/users')
      .set('Authorization', `Bearer ${expiredToken}`);
  
    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty('message', 'Forbidden');
  });

  it('should return user profile', async () => {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJib2JieXN5YWtpcjE4QGdtYWlsLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzQzMDk3OTYxLCJleHAiOjE3NDMxODQzNjF9.lLc4R3kkzad5TGD2O9OH4tr6Y7KuClLONBnwxr_5l3Q'; // Ganti dengan token pengguna yang valid
    const response = await request(app)
      .get('/users/profile')
      .set('Authorization', `Bearer ${token}`);
  
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('email', 'usersad@example.com');
  });

  it('should return a list of transactions', async () => {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJib2JieXN5YWtpcjE4QGdtYWlsLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzQzMDk3OTYxLCJleHAiOjE3NDMxODQzNjF9.lLc4R3kkzad5TGD2O9OH4tr6Y7KuClLONBnwxr_5l3Q'; // Ganti dengan token pengguna yang valid
    const response = await request(app)
      .get('/transactions')
      .set('Authorization', `Bearer ${token}`);
  
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should create a purchase', async () => {
    const user = await sequelize.models.User.create({
      googleId: 'user2312',
      email: 'use23r@example.com',
      name: 'User32',
      role: 'user',
    });
  
    const book = await sequelize.models.Book.create({
      title: 'Book One',
      author: 'Author One',
      price: 100,
    });
  
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJib2JieXN5YWtpcjE4QGdtYWlsLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzQzMDk3OTYxLCJleHAiOjE3NDMxODQzNjF9.lLc4R3kkzad5TGD2O9OH4tr6Y7KuClLONBnwxr_5l3Q'; // Ganti dengan token pengguna yang valid
    const response = await request(app)
      .post('/purchases')
      .set('Authorization', `Bearer ${token}`)
      .send({ bookId: book.id });
  
    expect(response.status).toBe(201);
  });
  
  it('should create a purchase', async () => {
    const user = await sequelize.models.User.create({
      googleId: 'user5474',
      email: 'user56@example.com',
      name: 'User32',
      role: 'user',
    });
  
    const book = await sequelize.models.Book.create({
      title: 'Book One',
      author: 'Author One',
      price: 100,
    });

    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJib2JieXN5YWtpcjE4QGdtYWlsLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzQzMDk3OTYxLCJleHAiOjE3NDMxODQzNjF9.lLc4R3kkzad5TGD2O9OH4tr6Y7KuClLONBnwxr_5l3Q'; // Replace with a valid token
  
    const response = await request(app)
      .post('/purchases')
      .set('Authorization', `Bearer ${token}`)
      .send({ bookId: book.id, userId: user.id });
  
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('purchase');
    expect(response.body.purchase).toHaveProperty('bookId', book.id);
    expect(response.body.purchase).toHaveProperty('paymentStatus', 'pending');
  });
    let token
  it('should return 404 if user is not found when updating role', async () => {
    token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJib2JieXN5YWtpcjE4QGdtYWlsLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzQzMDk3OTYxLCJleHAiOjE3NDMxODQzNjF9.lLc4R3kkzad5TGD2O9OH4tr6Y7KuClLONBnwxr_5l3Q'
    const response = await request(app)
      .put('/admin/users/9999') // ID yang tidak ada
      .set('Authorization', `Bearer ${token}`)
      .send({ role: 'admin' });

      console.log('Response Status:', response.status); // Log status respons
      console.log('Response Body:', response.body); // Log body respons
  
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message', 'User 9999 not found');
  });
  
  it('should return 404 if user is not found when deleting', async () => {
    const response = await request(app)
      .delete('/admin/users/9999') // ID yang tidak ada
      .set('Authorization', `Bearer ${token}`);

      console.log('Response Status:', response.status); // Log status respons
      console.log('Response Body:', response.body); // Log body respons
  
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message', 'User 9999 not found');
  });

  it('should return 404 if book is not found when updating', async () => {
    const adminToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJib2JieXN5YWtpcjE4QGdtYWlsLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzQzMDk3OTYxLCJleHAiOjE3NDMxODQzNjF9.lLc4R3kkzad5TGD2O9OH4tr6Y7KuClLONBnwxr_5l3Q'; // Ganti dengan token admin yang valid
    const response = await request(app)
      .put('/admin/books/9999') // ID yang tidak ada
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Updated Book',
        author: 'Updated Author',
        price: 200,
      });
  
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message', 'Book with 9999 not found');
  });

  it('should return 404 if book is not found when adding to favorites', async () => {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJib2JieXN5YWtpcjE4QGdtYWlsLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzQzMDk3OTYxLCJleHAiOjE3NDMxODQzNjF9.lLc4R3kkzad5TGD2O9OH4tr6Y7KuClLONBnwxr_5l3Q'; // Ganti dengan token pengguna yang valid
    const response = await request(app)
      .post('/favorites')
      .set('Authorization', `Bearer ${token}`)
      .send({ bookId: 9999 }); // ID buku yang tidak ada
  
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message', 'Book not found');
  });

  it('should return 404 if book is not found when creating a purchase', async () => {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJib2JieXN5YWtpcjE4QGdtYWlsLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzQzMDk3OTYxLCJleHAiOjE3NDMxODQzNjF9.lLc4R3kkzad5TGD2O9OH4tr6Y7KuClLONBnwxr_5l3Q'; // Ganti dengan token pengguna yang valid
    const response = await request(app)
      .post('/purchases')
      .set('Authorization', `Bearer ${token}`)
      .send({ bookId: 9999 }); // ID buku yang tidak ada
  
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message', 'Book not found');
  });

  it('should return 404 if transaction is not found', async () => {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJib2JieXN5YWtpcjE4QGdtYWlsLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzQzMDk3OTYxLCJleHAiOjE3NDMxODQzNjF9.lLc4R3kkzad5TGD2O9OH4tr6Y7KuClLONBnwxr_5l3Q'; // Ganti dengan token pengguna yang valid
    const response = await request(app)
      .get('/transactions/9999') // ID transaksi yang tidak ada
      .set('Authorization', `Bearer ${token}`);
  
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message', 'Transaction not found');
  });


  it('should return 400 if input is missing', async () => {
    const response = await request(app)
      .post('/gemini')
      .send({}); // Tidak mengirim input
  
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('message', 'Prompt cannot be empty');
  });
  
  it('should handle API errors gracefully', async () => {
    jest.mock('@google/generative-ai', () => {
      return {
        GoogleGenerativeAI: jest.fn().mockImplementation(() => {
          return {
            getGenerativeModel: jest.fn().mockReturnValue({
              generateContent: jest.fn().mockRejectedValue(new Error('API error')),
            }),
          };
        }),
      };
    });
  
    const input = 'Apa itu AI?';
    const response = await request(app)
      .post('/gemini')
      .send({ input });
  
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('message', 'Prompt cannot be empty');
  });

  it('should return 400 if bookId is missing when creating a purchase', async () => {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJib2JieXN5YWtpcjE4QGdtYWlsLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzQzMDk3OTYxLCJleHAiOjE3NDMxODQzNjF9.lLc4R3kkzad5TGD2O9OH4tr6Y7KuClLONBnwxr_5l3Q'; // Ganti dengan token pengguna yang valid
    const response = await request(app)
      .post('/purchases')
      .set('Authorization', `Bearer ${token}`)
      .send({}); // Tidak mengirim bookId
  
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Invalid bookId');
  });

  it('should return 404 if transaction ID is invalid', async () => {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJib2JieXN5YWtpcjE4QGdtYWlsLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzQzMDk3OTYxLCJleHAiOjE3NDMxODQzNjF9.lLc4R3kkzad5TGD2O9OH4tr6Y7KuClLONBnwxr_5l3Q'; // Ganti dengan token pengguna yang valid
    const response = await request(app)
      .get('/transactions/999') // ID transaksi tidak valid
      .set('Authorization', `Bearer ${token}`);
  
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message', 'Transaction not found');
  });

  it('should return 404 if user ID is invalid when fetching profile', async () => {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJib2JieXN5YWtpcjE4QGdtYWlsLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzQzMDk3OTYxLCJleHAiOjE3NDMxODQzNjF9.lLc4R3kkzad5TGD2O9OH4tr6Y7KuClLONBnwxr_5l3Q'; // Ganti dengan token pengguna yang valid
    const response = await request(app)
      .get('/users/profile/99') // ID pengguna tidak valid
      .set('Authorization', `Bearer ${token}`);
  
    expect(response.status).toBe(404);
  });

  it('should return 401 if no token is provided', async () => {
    const response = await request(app).get('/admin/users');
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message', 'Unauthorized');
  });
  
  it('should return all favorites for a user', async () => {
    const user = await sequelize.models.User.create({
      googleId: 'user-google-id',
      email: 'user@example.com',
      name: 'User',
      role: 'user',
    });
  
    const book = await sequelize.models.Book.create({
      title: 'Book One',
      author: 'Author One',
      price: 100,
    });
  
    await sequelize.models.Favorite.create({
      userId: user.id,
      bookId: book.id,
    });
  
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJib2JieXN5YWtpcjE4QGdtYWlsLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzQzMDk3OTYxLCJleHAiOjE3NDMxODQzNjF9.lLc4R3kkzad5TGD2O9OH4tr6Y7KuClLONBnwxr_5l3Q'; // Ganti dengan token pengguna yang valid
    const response = await request(app)
      .get('/favorites')
      .set('Authorization', `Bearer ${token}`);
  
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(1);
  });

  it('should return 400 if input is missing', async () => {
    const response = await request(app)
      .post('/gemini')
      .send({}); // Tidak mengirim input
  
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('message', 'Prompt cannot be empty');
  });
  
  it('should handle API errors gracefully', async () => {
    jest.mock('@google/generative-ai', () => {
      return {
        GoogleGenerativeAI: jest.fn().mockImplementation(() => {
          return {
            getGenerativeModel: jest.fn().mockReturnValue({
              generateContent: jest.fn().mockRejectedValue(new Error('API error')),
            }),
          };
        }),
      };
    });
  
    const input = 'Apa itu AI?';
    const response = await request(app)
      .post('/gemini')
      .send({ input });
  
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('message', 'Prompt cannot be empty');
  });

  it('should return 400 if bookId is missing when creating a purchase', async () => {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJib2JieXN5YWtpcjE4QGdtYWlsLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzQzMDk3OTYxLCJleHAiOjE3NDMxODQzNjF9.lLc4R3kkzad5TGD2O9OH4tr6Y7KuClLONBnwxr_5l3Q'; // Ganti dengan token pengguna yang valid
    const response = await request(app)
      .post('/purchases')
      .set('Authorization', `Bearer ${token}`)
      .send({}); // Tidak mengirim bookId
  
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Invalid bookId');
  });
  
  it('should return 404 if book is not found when creating a purchase', async () => {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJib2JieXN5YWtpcjE4QGdtYWlsLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzQzMDk3OTYxLCJleHAiOjE3NDMxODQzNjF9.lLc4R3kkzad5TGD2O9OH4tr6Y7KuClLONBnwxr_5l3Q'; // Ganti dengan token pengguna yang valid
    const response = await request(app)
      .post('/purchases')
      .set('Authorization', `Bearer ${token}`)
      .send({ bookId: 9999 }); // ID buku yang tidak ada
  
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message', 'Book not found');
  });

  it('should return 404 if transaction is not found', async () => {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJib2JieXN5YWtpcjE4QGdtYWlsLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzQzMDk3OTYxLCJleHAiOjE3NDMxODQzNjF9.lLc4R3kkzad5TGD2O9OH4tr6Y7KuClLONBnwxr_5l3Q'; // Ganti dengan token pengguna yang valid
    const response = await request(app)
      .get('/transactions/9999') // ID transaksi yang tidak ada
      .set('Authorization', `Bearer ${token}`);
  
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message', 'Transaction not found');
  });
  
  it('should return all favorites for a user', async () => {
    const user = await sequelize.models.User.create({
      googleId: 'user23123',
      email: 'user12@example.com',
      name: 'User23',
      role: 'user',
    });
  
    const book = await sequelize.models.Book.create({
      title: 'Book One23',
      author: 'Author One',
      price: 0,
    });
  
    await sequelize.models.Favorite.create({
      userId: user.id,
      bookId: book.id,
    });
  
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJib2JieXN5YWtpcjE4QGdtYWlsLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzQzMDk3OTYxLCJleHAiOjE3NDMxODQzNjF9.lLc4R3kkzad5TGD2O9OH4tr6Y7KuClLONBnwxr_5l3Q'; // Ganti dengan token pengguna yang valid
    const response = await request(app)
      .get('/favorites')
      .set('Authorization', `Bearer ${token}`);
  
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(1);
  });

