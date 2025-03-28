# MyBooks API Documentation

## Overview

This documentation provides details about the API endpoints available in the MyBooks application. The API is categorized into user, admin, book, favorite, purchase, transaction, and Gemini AI-related routes.

---

## Endpoints

### User Endpoints

#### POST /google-login

- **Description**: Log in using Google.
- **Request**:
  - Headers: `{ "Content-Type": "application/json" }`
  - Body: `{ "token": "<Google Token>" }`
- **Response**:
  - 200: `{ "message": "Login successful" }`
  - 400: `{ "message": "Invalid token" }`

#### POST /logout

- **Description**: Log out the user.
- **Response**:
  - 200: `{ "message": "Logout successful" }`

#### GET /users/profile

- **Description**: Get the profile of the logged-in user.
- **Response**:
  - 200: `{ "id": 1, "name": "John Doe", "email": "john@example.com" }`

#### PUT /users/profile

- **Description**: Update the profile of the logged-in user.
- **Request**:
  - Body: `{ "name": "John Updated", "email": "john.updated@example.com" }`
- **Response**:
  - 200: `{ "message": "Profile updated successfully" }`

#### GET /users/purchases

- **Description**: Get the purchase history of the logged-in user.
- **Response**:
  - 200: `[ { "id": 1, "book": "Book Title", "date": "2025-03-11" } ]`

---

### Gemini AI Endpoint

#### POST /gemini

- **Description**: Generate a response using Gemini AI.
- **Request**:
  - Body: `{ "query": "What is AI?" }`
- **Response**:
  - 200: `{ "response": "AI stands for Artificial Intelligence." }`

---

### Book Endpoints

#### GET /books

- **Description**: Get a list of all books.
- **Response**:
  - 200: `[ { "id": 1, "title": "Book Title", "author": "Author Name" } ]`

#### GET /books/:id

- **Description**: Get details of a specific book by ID.
- **Response**:
  - 200: `{ "id": 1, "title": "Book Title", "author": "Author Name" }`

#### GET /books/search

- **Description**: Search for books by query.
- **Request**:
  - Query Params: `?q=searchTerm`
- **Response**:
  - 200: `[ { "id": 1, "title": "Book Title", "author": "Author Name" } ]`

#### POST /admin/books

- **Description**: Add a new book (Admin only).
- **Request**:
  - Body: `{ "title": "New Book", "author": "Author Name" }`
- **Response**:
  - 201: `{ "message": "Book added successfully" }`

#### PUT /admin/books/:id

- **Description**: Update a book by ID (Admin only).
- **Request**:
  - Body: `{ "title": "Updated Book", "author": "Updated Author" }`
- **Response**:
  - 200: `{ "message": "Book updated successfully" }`

#### DELETE /admin/books/:id

- **Description**: Delete a book by ID (Admin only).
- **Response**:
  - 200: `{ "message": "Book deleted successfully" }`

---

### Favorite Endpoints

#### POST /favorites

- **Description**: Add a book to favorites.
- **Request**:
  - Body: `{ "bookId": 1 }`
- **Response**:
  - 201: `{ "message": "Book added to favorites" }`

#### GET /favorites

- **Description**: Get the list of favorite books.
- **Response**:
  - 200: `[ { "id": 1, "title": "Favorite Book" } ]`

---

### Purchase Endpoints

#### POST /purchases

- **Description**: Create a new purchase.
- **Request**:
  - Body: `{ "bookId": 1, "quantity": 1 }`
- **Response**:
  - 201: `{ "message": "Purchase successful" }`

#### POST /midtrans-webhook

- **Description**: Handle Midtrans webhook for payment updates.
- **Response**:
  - 200: `{ "message": "Webhook received" }`

---

### Transaction Endpoints

#### GET /transactions

- **Description**: Get all transactions of the logged-in user.
- **Response**:
  - 200: `[ { "id": 1, "status": "Completed" } ]`

#### GET /transactions/:id

- **Description**: Get details of a specific transaction by ID.
- **Response**:
  - 200: `{ "id": 1, "status": "Completed" }`

---

### Admin Endpoints

#### GET /admin/users

- **Description**: Get a list of all users (Admin only).
- **Response**:
  - 200: `[ { "id": 1, "name": "User Name" } ]`

#### PUT /admin/users/:id

- **Description**: Update a user's role by ID (Admin only).
- **Request**:
  - Body: `{ "role": "admin" }`
- **Response**:
  - 200: `{ "message": "User role updated" }`

#### DELETE /admin/users/:id

- **Description**: Delete a user by ID (Admin only).
- **Response**:
  - 200: `{ "message": "User deleted successfully" }`

---

## Global Errors

- **500 - Internal Server Error**: `{ "message": "Internal Server Error" }`
- **401 - Unauthorized**: `{ "message": "Unauthorized" }`
- **404 - Not Found**: `{ "message": "Resource not found" }`
- **400 - Bad Request**: `{ "message": "Invalid request" }`
