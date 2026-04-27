# Restaurant Website Backend

A complete Node.js backend for a restaurant ordering website with authentication, menu management, and order processing.

## Features

✅ **User Authentication**
- Login system for users and staff
- JWT token-based authentication
- Role-based access control

✅ **Product Management**
- View all products
- Filter by category (pizza, burger, salad, dessert, beverage, etc.)
- Dynamic pricing based on portion size
- Product details with descriptions

✅ **Order Management**
- Create orders with multiple items
- Track order status (pending, preparing, ready, completed, cancelled)
- View order history
- Update and delete orders (staff only)

✅ **Data Persistence**
- JSON-based data storage (easily replaceable with database)
- Automatic data file initialization

## Setup Instructions

### 1. Install Dependencies

```bash
cd w:\nallu_projects\Restaurant-Website
npm install
```

This installs:
- **express** - Web framework
- **cors** - Cross-origin requests
- **body-parser** - Request parsing
- **jsonwebtoken** - Authentication tokens
- **bcryptjs** - Password hashing (optional, currently using plaintext for demo)

### 2. Start the Server

```bash
# Production
npm start

# Development (with auto-reload using nodemon)
npm run dev
```

The server will run on `http://localhost:5000`

### 3. Update Frontend JavaScript

Replace the old `app.js` with `app-backend.js` in your HTML files:

```html
<!-- OLD -->
<script src="app.js"></script>

<!-- NEW -->
<script src="app-backend.js"></script>
```

Or update in: `home.html`, `order.html`, `staff.html`, `index.html`

## API Endpoints

### Authentication

```
POST /api/auth/login
Content-Type: application/json

{
  "username": "user",
  "password": "21",
  "userType": "user"  // or "staff"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "username": "user",
    "role": "user"
  }
}
```

### Products

```
GET /api/products
Get all products

GET /api/products/category/:category
Get products by category (e.g., /api/products/category/pizza)

GET /api/products/:id
Get single product details
```

### Orders

```
POST /api/orders
Create new order (requires authentication)
Authorization: Bearer <token>
{
  "items": [
    {
      "itemName": "Margherita Pizza",
      "portionSize": "medium",
      "quantity": 2,
      "itemRate": 15.99
    }
  ],
  "tableNumber": "5"
}

GET /api/orders
Get all orders (staff only)

GET /api/orders/:id
Get single order details

PUT /api/orders/:id
Update order status (staff only)
{
  "status": "preparing"  // pending, preparing, ready, completed, cancelled
}

DELETE /api/orders/:id
Delete order (staff only)
```

## Default Credentials

**User Account:**
- Username: `user`
- Password: `21`

**Staff Account:**
- Username: `staff`
- Password: `1234`

## Data Files

The backend automatically creates and manages these files in the `data/` directory:

- **data/users.json** - User credentials and roles
- **data/products.json** - Menu items with pricing
- **data/orders.json** - Order history and status

## File Structure

```
Restaurant-Website/
├── server.js                      # Main Express server
├── package.json                   # Dependencies
├── bootstrap-4.5.3-dist/
│   ├── index.html                # Login page
│   ├── home.html                 # Menu browsing
│   ├── order.html                # Order placement
│   ├── staff.html                # Staff order view
│   ├── app-backend.js            # Frontend API integration (NEW)
│   └── css/
│       └── style.css
├── data/
│   ├── users.json                # Auto-generated
│   ├── products.json             # Auto-generated
│   └── orders.json               # Auto-generated
└── README.md
```

## Frontend Integration

The `app-backend.js` file replaces the old `app.js` and includes:

- **Login**: Communicates with `/api/auth/login`
- **Product Loading**: Fetches from `/api/products`
- **Category Filtering**: Uses `/api/products/category/:category`
- **Order Placement**: Posts to `/api/orders`
- **Staff View**: Loads all orders with status management

## Security Features

⚠️ **Current Implementation (Development):**
- JWT token authentication
- Role-based access control (user/staff)
- Token expiration (24 hours)

🔒 **Recommended for Production:**
- Use environment variables for secrets
- Implement bcrypt password hashing
- Use HTTPS
- Add input validation and sanitization
- Implement rate limiting
- Use a proper database (MongoDB, PostgreSQL)
- Add CORS restrictions
- Implement refresh token rotation

## Environment Variables

Create a `.env` file (optional, for production):

```env
PORT=5000
JWT_SECRET=your_very_secure_secret_key_here
NODE_ENV=production
```

## Upgrading to a Database

To upgrade from JSON files to MongoDB:

1. Install MongoDB driver:
   ```bash
   npm install mongoose
   ```

2. Replace file operations in `server.js` with Mongoose models
3. Update connection string in environment variables

## Troubleshooting

**Port already in use:**
```bash
# Change port in server.js or use environment variable
# Windows: netstat -ano | findstr :5000
```

**CORS errors:**
- Ensure frontend calls use `http://localhost:5000/api`
- Check that `cors` middleware is configured

**Authentication errors:**
- Verify token is included in Authorization header: `Bearer <token>`
- Check token hasn't expired (24 hours)

## Future Enhancements

- [ ] Database integration (MongoDB/PostgreSQL)
- [ ] Payment processing
- [ ] Email notifications
- [ ] Real-time order updates (WebSocket)
- [ ] User registration
- [ ] Product image uploads
- [ ] Advanced reporting
- [ ] Table management
- [ ] Inventory tracking

## License

ISC
