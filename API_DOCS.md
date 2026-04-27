# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Authentication Endpoints

### Login

**Endpoint:** `POST /auth/login`

**Description:** Authenticate user or staff member

**Request Body:**
```json
{
  "username": "user",
  "password": "21",
  "userType": "user"
}
```

**Parameters:**
- `username` (string): "user" or "staff"
- `password` (string): User password
- `userType` (string): "user" or "staff"

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "user",
    "role": "user"
  }
}
```

**Error Response (401 Unauthorized):**
```json
{
  "message": "Invalid credentials"
}
```

---

## Product Endpoints

### Get All Products

**Endpoint:** `GET /products`

**Description:** Retrieve all available menu items

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Margherita Pizza",
    "basePrice": 12.99,
    "category": "pizza",
    "description": "Fresh tomato, mozzarella, basil",
    "image": "pizza1.jpg",
    "pricing": {
      "small": 12.99,
      "medium": 15.99,
      "large": 18.99
    }
  },
  ...
]
```

### Get Products by Category

**Endpoint:** `GET /products/category/:category`

**Description:** Retrieve products filtered by category

**Path Parameters:**
- `category` (string): "pizza", "burger", "salad", "dessert", "beverage"

**Example:** `GET /products/category/pizza`

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Margherita Pizza",
    "basePrice": 12.99,
    "category": "pizza",
    ...
  }
]
```

### Get Single Product

**Endpoint:** `GET /products/:id`

**Description:** Retrieve details of a specific product

**Path Parameters:**
- `id` (number): Product ID

**Example:** `GET /products/1`

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "Margherita Pizza",
  "basePrice": 12.99,
  "category": "pizza",
  "description": "Fresh tomato, mozzarella, basil",
  "image": "pizza1.jpg",
  "pricing": {
    "small": 12.99,
    "medium": 15.99,
    "large": 18.99
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "message": "Product not found"
}
```

### Add New Product

**Endpoint:** `POST /products`

**Description:** Create a new menu item (Staff only)

**Authorization:** Required (Staff role)

**Request Body:**
```json
{
  "name": "Veggie Burger",
  "basePrice": 9.99,
  "category": "burger",
  "description": "Fresh vegetables with special sauce",
  "pricing": {
    "small": 9.99,
    "medium": 11.99,
    "large": 13.99
  }
}
```

**Response (201 Created):**
```json
{
  "id": 6,
  "name": "Veggie Burger",
  "basePrice": 9.99,
  "category": "burger",
  "description": "Fresh vegetables with special sauce",
  "pricing": {
    "small": 9.99,
    "medium": 11.99,
    "large": 13.99
  }
}
```

**Error Response (403 Forbidden):**
```json
{
  "message": "Only staff can add products"
}
```

---

## Order Endpoints

### Create Order

**Endpoint:** `POST /orders`

**Description:** Place a new order

**Authorization:** Required

**Request Body:**
```json
{
  "items": [
    {
      "itemName": "Margherita Pizza",
      "portionSize": "medium",
      "quantity": 2,
      "itemRate": 15.99
    },
    {
      "itemName": "Caesar Salad",
      "portionSize": "small",
      "quantity": 1,
      "itemRate": 8.99
    }
  ],
  "tableNumber": "5"
}
```

**Parameters:**
- `items` (array): Array of order items
  - `itemName` (string): Name of the item
  - `portionSize` (string): "small", "medium", or "large"
  - `quantity` (number): Number of items
  - `itemRate` (number): Price per item
- `tableNumber` (string): Table number

**Response (201 Created):**
```json
{
  "id": 1,
  "userId": 1,
  "tableNumber": "5",
  "items": [...],
  "totalAmount": 40.97,
  "status": "pending",
  "createdAt": "2024-04-27T10:30:00.000Z",
  "updatedAt": "2024-04-27T10:30:00.000Z"
}
```

### Get All Orders

**Endpoint:** `GET /orders`

**Description:** Retrieve all orders (Staff only)

**Authorization:** Required (Staff role)

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "userId": 1,
    "tableNumber": "5",
    "items": [...],
    "totalAmount": 40.97,
    "status": "pending",
    "createdAt": "2024-04-27T10:30:00.000Z",
    "updatedAt": "2024-04-27T10:30:00.000Z"
  },
  ...
]
```

### Get User's Orders

**Endpoint:** `GET /orders/user/:userId`

**Description:** Retrieve orders for a specific user

**Authorization:** Required

**Path Parameters:**
- `userId` (number): User ID

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "userId": 1,
    "tableNumber": "5",
    ...
  }
]
```

### Get Single Order

**Endpoint:** `GET /orders/:id`

**Description:** Retrieve details of a specific order

**Authorization:** Required

**Path Parameters:**
- `id` (number): Order ID

**Response (200 OK):**
```json
{
  "id": 1,
  "userId": 1,
  "tableNumber": "5",
  "items": [...],
  "totalAmount": 40.97,
  "status": "pending",
  "createdAt": "2024-04-27T10:30:00.000Z",
  "updatedAt": "2024-04-27T10:30:00.000Z"
}
```

### Update Order Status

**Endpoint:** `PUT /orders/:id`

**Description:** Update order status (Staff only)

**Authorization:** Required (Staff role)

**Path Parameters:**
- `id` (number): Order ID

**Request Body:**
```json
{
  "status": "preparing"
}
```

**Allowed Statuses:**
- `pending` - Initial status
- `preparing` - Chef is preparing
- `ready` - Ready for pickup
- `completed` - Delivered/Completed
- `cancelled` - Order cancelled

**Response (200 OK):**
```json
{
  "id": 1,
  "userId": 1,
  "tableNumber": "5",
  "items": [...],
  "totalAmount": 40.97,
  "status": "preparing",
  "createdAt": "2024-04-27T10:30:00.000Z",
  "updatedAt": "2024-04-27T10:35:00.000Z"
}
```

### Delete Order

**Endpoint:** `DELETE /orders/:id`

**Description:** Delete an order (Staff only)

**Authorization:** Required (Staff role)

**Path Parameters:**
- `id` (number): Order ID

**Response (200 OK):**
```json
{
  "message": "Order deleted",
  "order": {
    "id": 1,
    ...
  }
}
```

---

## Health Check

### Server Status

**Endpoint:** `GET /health`

**Description:** Check if server is running

**Response (200 OK):**
```json
{
  "status": "Server is running"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "message": "Missing required fields"
}
```

### 401 Unauthorized
```json
{
  "message": "No token provided"
}
```

### 403 Forbidden
```json
{
  "message": "Only staff can update orders"
}
```

### 404 Not Found
```json
{
  "message": "Order not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Internal server error"
}
```

---

## Testing with cURL

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "user",
    "password": "21",
    "userType": "user"
  }'
```

### Get All Products
```bash
curl http://localhost:5000/api/products
```

### Get Products by Category
```bash
curl http://localhost:5000/api/products/category/pizza
```

### Create Order (requires token)
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "items": [
      {
        "itemName": "Margherita Pizza",
        "portionSize": "medium",
        "quantity": 1,
        "itemRate": 15.99
      }
    ],
    "tableNumber": "5"
  }'
```

### Get All Orders (Staff only)
```bash
curl http://localhost:5000/api/orders \
  -H "Authorization: Bearer STAFF_TOKEN_HERE"
```

### Update Order Status
```bash
curl -X PUT http://localhost:5000/api/orders/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer STAFF_TOKEN_HERE" \
  -d '{
    "status": "preparing"
  }'
```

---

## Rate Limiting (Recommended for Production)

Not currently implemented. Recommended additions:
- 100 requests per minute per IP
- 10 login attempts per 15 minutes
- Implement using `express-rate-limit` package

---

## CORS Configuration

Currently allows requests from any origin (`*`).

**For Production, update to:**
```javascript
const cors = require('cors');
app.use(cors({
  origin: 'http://your-domain.com',
  credentials: true
}));
```
