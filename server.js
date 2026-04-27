const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 5000;
const JWT_SECRET = 'your_jwt_secret_key_change_in_production';

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'bootstrap-4.5.3-dist')));

// Data file paths
const PRODUCTS_FILE = path.join(__dirname, 'data', 'products.json');
const ORDERS_FILE = path.join(__dirname, 'data', 'orders.json');
const USERS_FILE = path.join(__dirname, 'data', 'users.json');

// Ensure data directory exists
if (!fs.existsSync(path.join(__dirname, 'data'))) {
  fs.mkdirSync(path.join(__dirname, 'data'));
}

// Initialize data files if they don't exist
const initializeDataFiles = () => {
  if (!fs.existsSync(USERS_FILE)) {
    const users = {
      users: [
        { id: 1, username: 'user', password: '21', role: 'user' },
        { id: 2, username: 'staff', password: '1234', role: 'staff' }
      ]
    };
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  }

  if (!fs.existsSync(PRODUCTS_FILE)) {
    const products = {
      products: [
        {
          id: 1,
          name: 'Margherita Pizza',
          basePrice: 12.99,
          category: 'pizza',
          description: 'Fresh tomato, mozzarella, basil',
          image: 'pizza1.jpg',
          pricing: {
            small: 12.99,
            medium: 15.99,
            large: 18.99
          }
        },
        {
          id: 2,
          name: 'Caesar Salad',
          basePrice: 8.99,
          category: 'salad',
          description: 'Crisp romaine, parmesan, croutons',
          image: 'salad1.jpg',
          pricing: {
            small: 8.99,
            medium: 10.99,
            large: 12.99
          }
        },
        {
          id: 3,
          name: 'Grilled Chicken Burger',
          basePrice: 10.99,
          category: 'burger',
          description: 'Tender grilled chicken with fresh vegetables',
          image: 'burger1.jpg',
          pricing: {
            small: 10.99,
            medium: 12.99,
            large: 14.99
          }
        },
        {
          id: 4,
          name: 'Chocolate Cake',
          basePrice: 5.99,
          category: 'dessert',
          description: 'Rich and decadent chocolate cake',
          image: 'dessert1.jpg',
          pricing: {
            small: 5.99,
            medium: 7.99,
            large: 9.99
          }
        },
        {
          id: 5,
          name: 'Iced Tea',
          basePrice: 2.99,
          category: 'beverage',
          description: 'Refreshing iced tea',
          image: 'beverage1.jpg',
          pricing: {
            small: 2.99,
            medium: 3.49,
            large: 3.99
          }
        }
      ]
    };
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));
  }

  if (!fs.existsSync(ORDERS_FILE)) {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify({ orders: [] }, null, 2));
  }
};

// Helper functions to read/write JSON files
const readJSON = (filePath) => {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return {};
  }
};

const writeJSON = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

// ==================== AUTH ENDPOINTS ====================

// Login endpoint
app.post('/api/auth/login', (req, res) => {
  const { username, password, userType } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  const usersData = readJSON(USERS_FILE);
  const user = usersData.users.find(
    u => u.username === username && u.password === password && u.role === userType
  );

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
});

// ==================== PRODUCTS ENDPOINTS ====================

// Get all products
app.get('/api/products', (req, res) => {
  const productsData = readJSON(PRODUCTS_FILE);
  res.json(productsData.products);
});

// Get products by category
app.get('/api/products/category/:category', (req, res) => {
  const { category } = req.params;
  const productsData = readJSON(PRODUCTS_FILE);
  const filtered = productsData.products.filter(p => p.category === category);
  res.json(filtered);
});

// Get single product
app.get('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const productsData = readJSON(PRODUCTS_FILE);
  const product = productsData.products.find(p => p.id == id);
  
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  res.json(product);
});

// Add new product (admin only)
app.post('/api/products', verifyToken, (req, res) => {
  if (req.user.role !== 'staff') {
    return res.status(403).json({ message: 'Only staff can add products' });
  }

  const { name, basePrice, category, description, pricing } = req.body;
  
  if (!name || !basePrice || !category || !pricing) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const productsData = readJSON(PRODUCTS_FILE);
  const newProduct = {
    id: productsData.products.length + 1,
    name,
    basePrice,
    category,
    description: description || '',
    pricing
  };

  productsData.products.push(newProduct);
  writeJSON(PRODUCTS_FILE, productsData);
  res.status(201).json(newProduct);
});

// ==================== ORDERS ENDPOINTS ====================

// Create a new order
app.post('/api/orders', verifyToken, (req, res) => {
  const { items, tableNumber } = req.body;

  if (!items || items.length === 0 || !tableNumber) {
    return res.status(400).json({ message: 'Items and table number are required' });
  }

  const ordersData = readJSON(ORDERS_FILE);
  const newOrder = {
    id: ordersData.orders.length + 1,
    userId: req.user.id,
    tableNumber,
    items,
    totalAmount: items.reduce((sum, item) => sum + (item.rate * item.quantity), 0),
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  ordersData.orders.push(newOrder);
  writeJSON(ORDERS_FILE, ordersData);
  res.status(201).json(newOrder);
});

// Get all orders (staff only)
app.get('/api/orders', verifyToken, (req, res) => {
  if (req.user.role !== 'staff') {
    return res.status(403).json({ message: 'Only staff can view all orders' });
  }

  const ordersData = readJSON(ORDERS_FILE);
  res.json(ordersData.orders);
});

// Get user's orders
app.get('/api/orders/user/:userId', verifyToken, (req, res) => {
  const { userId } = req.params;
  
  if (req.user.id != userId && req.user.role !== 'staff') {
    return res.status(403).json({ message: 'Cannot view other user orders' });
  }

  const ordersData = readJSON(ORDERS_FILE);
  const userOrders = ordersData.orders.filter(o => o.userId == userId);
  res.json(userOrders);
});

// Get single order
app.get('/api/orders/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  const ordersData = readJSON(ORDERS_FILE);
  const order = ordersData.orders.find(o => o.id == id);

  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  if (req.user.role !== 'staff' && req.user.id !== order.userId) {
    return res.status(403).json({ message: 'Cannot view this order' });
  }

  res.json(order);
});

// Update order status (staff only)
app.put('/api/orders/:id', verifyToken, (req, res) => {
  if (req.user.role !== 'staff') {
    return res.status(403).json({ message: 'Only staff can update orders' });
  }

  const { id } = req.params;
  const { status } = req.body;

  if (!['pending', 'preparing', 'ready', 'completed', 'cancelled'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  const ordersData = readJSON(ORDERS_FILE);
  const order = ordersData.orders.find(o => o.id == id);

  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  order.status = status;
  order.updatedAt = new Date().toISOString();
  writeJSON(ORDERS_FILE, ordersData);
  res.json(order);
});

// Delete order (staff only)
app.delete('/api/orders/:id', verifyToken, (req, res) => {
  if (req.user.role !== 'staff') {
    return res.status(403).json({ message: 'Only staff can delete orders' });
  }

  const { id } = req.params;
  const ordersData = readJSON(ORDERS_FILE);
  const index = ordersData.orders.findIndex(o => o.id == id);

  if (index === -1) {
    return res.status(404).json({ message: 'Order not found' });
  }

  const deletedOrder = ordersData.orders.splice(index, 1);
  writeJSON(ORDERS_FILE, ordersData);
  res.json({ message: 'Order deleted', order: deletedOrder[0] });
});

// ==================== HEALTH CHECK ====================

app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Serve static files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'bootstrap-4.5.3-dist', 'index.html'));
});

// Initialize data files on startup
initializeDataFiles();

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`
API Endpoints:
- POST   /api/auth/login              - User login
- GET    /api/products                - Get all products
- GET    /api/products/category/:cat  - Get products by category
- GET    /api/products/:id            - Get single product
- POST   /api/products                - Add new product (staff only)
- POST   /api/orders                  - Create order
- GET    /api/orders                  - Get all orders (staff only)
- GET    /api/orders/:id              - Get single order
- PUT    /api/orders/:id              - Update order (staff only)
- DELETE /api/orders/:id              - Delete order (staff only)
- GET    /api/health                  - Health check
  `);
});
