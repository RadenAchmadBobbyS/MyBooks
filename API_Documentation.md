## Branded-Things/Product API Documentation

## Endpoints

List of Available Endpoints:

- `POST /add-user`
- `POST /login`
- `POST /product`
- `GET /product`
- `PUT /product/:id`
- `GET /product/:id`
- `DELETE /product/:id`
- `POST /category`
- `GET /category`
- `PUT /category/:id`
- `GET /public/product` `Public Site`
- `GET /public/product/:id` `Public Site`
- `PATCH /product/:id/image-url` `Public Site`

### POST /product

#### Description

- Create a new product data

#### Request

- Headers
  ```json
  {
    "Content-Type": "application/json"
  }
  ```
- Body
  ```json
  {
    "name": "Red T-Shirt",
    "description": "it's Red",
    "price": 2000,
    "stock": 5,
    "imgUrl": "https://shorturl.at/CmXZ6",
    "categoryId": 4,
    "authorId": 1
  }
  ```

#### Response

_201 - Created_

- Body
  ```json
  {
    "id": 5,
    "name": "Red T-Shirt",
    "description": "it's Red",
    "price": 2000,
    "stock": 5,
    "imgUrl": "https://shorturl.at/CmXZ6",
    "categoryId": 4,
    "authorId": 1,
    "updatedAt": "2025-03-11T12:12:38.070Z",
    "createdAt": "2025-03-11T12:12:38.070Z"
  }
  ```

_400 - Bad Request_

- Body
  ```json
  {
    "message": "name is required",
    "message": "desctiption is required",
    "message": "price is required",
    "message": "category id is required",
    "message": "author id is required"
  }
  ```

### GET /product

#### Description

- Get all the product data

#### Response

_200 - OK_

- Body

  ```json
  [
    {
      "id": 4,
      "name": "Red T-Shirt",
      "description": "it's Red",
      "price": 2000,
      "stock": 5,
      "imgUrl": "https://shorturl.at/CmXZ6",
      "categoryId": 4,
      "authorId": 1,
      "createdAt": "2025-03-10T15:18:31.845Z",
      "updatedAt": "2025-03-10T15:18:31.845Z"
    }
  ]
  ```

### PUT /product

#### Description

- Update product data

#### Request

- Headers
  ```json
  {
    "Content-Type": "application/json"
  }
  ```
- Body
  ```json
  {
    "name": "Red T-Shirt 2nd",
    "description": "it's Red",
    "price": 2000,
    "stock": 5,
    "imgUrl": "https://shorturl.at/CmXZ6",
    "categoryId": 4,
    "authorId": 1
  }
  ```

#### Response

_201 - Created_

- Body
  ```json
  {
    "id": 5,
    "name": "Red T-Shirt 2nd",
    "description": "it's Red",
    "price": 2000,
    "stock": 5,
    "imgUrl": "https://shorturl.at/CmXZ6",
    "categoryId": 4,
    "authorId": 1,
    "updatedAt": "2025-03-11T12:12:38.070Z",
    "createdAt": "2025-03-11T12:12:38.070Z"
  }
  ```

_400 - Bad Request_

- Body
  ```json
  {
    "message": "name is required",
    "message": "desctiption is required",
    "message": "price is required",
    "message": "category id is required",
    "message": "author id is required"
  }
  ```

### GET /product/:id

#### Description

- Get a product data based on given id

#### Response

_200 - OK_

- Body

  ```json
  {
    "id": 4,
    "name": "Red T-Shirt",
    "description": "it's Red",
    "price": 2000,
    "stock": 5,
    "imgUrl": "https://shorturl.at/CmXZ6",
    "categoryId": 4,
    "authorId": 1,
    "createdAt": "2025-03-10T15:18:31.845Z",
    "updatedAt": "2025-03-10T15:18:31.845Z"
  }
  ```

  _404 - Not Found_

- Body
  ```json
  {
    "message": "Product with id 300 not found"
  }
  ```

### Global Error

#### Response

_500 - Internal Server Error_

- Body
  ```json
  {
    "message": "Internal Server Error"
  }
  ```

### DELETE /product/:id

#### Description

- Remove a product data based on given id

#### Response

_200 - OK_

- Body

  ```json
  {
    "message": "${products.name} success to delete"
  }
  ```

  _404 - Not Found_

- Body
  ```json
  {
    "message": "Product with id 911 not found"
  }
  ```

### Global Error

#### Response

_500 - Internal Server Error_

- Body
  ```json
  {
    "message": "Internal Server Error"
  }
  ```

### POST /category

#### Description

- Create a new category data

#### Request

- Headers
  ```json
  {
    "Content-Type": "application/json"
  }
  ```
- Body
  ```json
  {
    "name": "Yellow"
  }
  ```

#### Response

_201 - Created_

- Body
  ```json
  {
    "id": 8,
    "name": "Yellow",
    "createdAt": "2025-03-11T13:33:31.571Z",
    "updatedAt": "2025-03-11T13:33:31.571Z"
  }
  ```

_400 - Bad Request_

- Body

  ```json
  {
    "message": "name is required"
  }
  ```

### GET /category

#### Description

- Get all the category data

#### Response

_200 - OK_

- Body

  ```json
  [
    {
      "id": 1,
      "name": "black",
      "createdAt": "2025-03-10T15:18:27.563Z",
      "updatedAt": "2025-03-10T15:18:27.563Z"
    }
  ]
  ```

### PUT /category/:id

#### Description

- Update product data

#### Request

- Headers
  ```json
  {
    "Content-Type": "application/json"
  }
  ```
- Body
  ```json
  {
    "name": "black 2nd"
  }
  ```

#### Response

_201 - Created_

- Body
  ```json
  {
    "id": 4,
    "name": "black 2nd",
    "createdAt": "2025-03-10T15:18:27.563Z",
    "updatedAt": "2025-03-11T13:44:12.828Z"
  }
  ```

_400 - Bad Request_

- Body
  ```json
  {
    "message": "name is required"
  }
  ```

### GET /public/product Public Site

#### Description

- Get all the product data to public site

#### Response

_200 - OK_

- Body

  ```json
  [
    {
      "id": 2,
      "name": "White T-Shirt",
      "description": "it's White",
      "price": 4000,
      "stock": 5,
      "imgUrl": "https://shorturl.at/CmXZ6",
      "categoryId": 2,
      "authorId": 1,
      "createdAt": "2025-03-11T19:16:55.719Z",
      "updatedAt": "2025-03-11T19:16:55.719Z"
    }
  ]
  ```

- Response (500 - ServerError)

_500 - Internal Server Error_

- Body
  ```json
  {
    "message": "Internal Server Error"
  }
  ```

### GET /public/product/:id Public Site

#### Description

- Get all the product data to public site

#### Response

_200 - OK_

- Body

  ```json
  [
    {
      "id": 1,
      "name": "Black T-Shirt",
      "description": "it's black",
      "price": 2000,
      "stock": 2,
      "imgUrl": "https://res.cloudinary.com/dfdd1idfq/image/upload/v1741794845/product-image-url/q10itdpqdar7fotigdyz.jpg",
      "categoryId": 1,
      "authorId": 1,
      "createdAt": "2025-03-11T19:16:55.719Z",
      "updatedAt": "2025-03-12T15:54:07.000Z"
    }
  ]
  ```

- Response body (404 - NotFound)

  ```json
  {
    "message": "string"
  }
  ```

### PATCH /product/:id/image-url

- Request Body

  ```json

    {
      "productImage": < image file >
    }

  ```

- Response body (200 - Created)

  ```json
  {
    "message": "string"
  }
  ```

- Response body (404 - NotFound)

  ```json
  {
    "message": "string"
  }
  ```

- Response body (400 - BadRequest)

  ```json
  {
    "message": "string"
  }
  ```

- Response (500 - ServerError)

_500 - Internal Server Error_

- Body
  ```json
  {
    "message": "Internal Server Error"
  }
  ```

### POST /add-user

- Request Header:

  ```json
  { "Authorization": "Bearer <your access token>" }
  ```

- Request Body

  ```json
  {
    "email": "string",
    "password": "string",
    "phoneNumber": "string",
    "addres": "string",
    "username": "string"
  }
  ```

- Response body (201 - Created)

  ```json
  {
    "id": 4,
    "email": "user2@gmail.com",
    "phoneNumber": "02122",
    "addres": "jl.kutil",
    "username": "staff safro"
  }
  ```

- Response body (400 - BadRequest)

  ```json
  {
    "message": "string"
  }
  ```

- Response (500 - ServerError)

_500 - Internal Server Error_

- Body
  ```json
  {
    "message": "Internal Server Error"
  }
  ```

### POST /login

- Request Body

  ```json
  {
    "email": "user1@gmail.com",
    "password": "user1user1"
  }
  ```

- Response (200 - Success Login)

  ```json
  {
    "id": 2,
    "email": "user1@gmail.com"
  }
  ```

- Response (400 - BadRequest)

  ```json
  {
    "message": "string"
  }
  ```

- Response (401 - Unauthorized)

  ```json
  {
    "message": "string"
  }
  ```

  13.215.184.205
  https://mybooks.radendev.my.id/
