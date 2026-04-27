# Restaurant Backend - Documentation Index

## 📚 Quick Navigation

### Getting Started
1. **[SETUP.md](SETUP.md)** - Start here! Installation and basic setup
2. **[MIGRATION.md](MIGRATION.md)** - How to update your HTML files

### For Developers
3. **[README.md](README.md)** - Complete project overview
4. **[API_DOCS.md](API_DOCS.md)** - Detailed API reference
5. **[TESTING.md](TESTING.md)** - Testing and troubleshooting

---

## 🚀 Quick Start (3 Steps)

### 1️⃣ Install & Start Backend
```powershell
npm install
npm start
```

### 2️⃣ Update HTML Files
Replace `<script src="app.js"></script>` with `<script src="app-backend.js"></script>` in:
- index.html
- home.html  
- order.html
- staff.html

### 3️⃣ Test Login
- User: password `21`
- Staff: password `1234`

---

## 📋 File Structure

```
Restaurant-Website/
├── 📄 server.js                    Main backend server
├── 📄 package.json                 Dependencies
│
├── 📁 bootstrap-4.5.3-dist/        Frontend files
│   ├── 📄 app-backend.js           NEW: Backend-compatible frontend
│   ├── 📄 index.html               Login page
│   ├── 📄 home.html                Menu browsing
│   ├── 📄 order.html               Order placement
│   └── 📄 staff.html               Staff orders view
│
├── 📁 data/                        AUTO-GENERATED
│   ├── 📄 users.json               User credentials
│   ├── 📄 products.json            Menu items
│   └── 📄 orders.json              Orders history
│
├── 📚 Documentation
│   ├── 📄 README.md                Full project documentation
│   ├── 📄 SETUP.md                 Installation guide
│   ├── 📄 MIGRATION.md             HTML migration guide
│   ├── 📄 API_DOCS.md              API reference
│   ├── 📄 TESTING.md               Testing guide
│   └── 📄 INDEX.md                 This file
│
└── 📄 .env.example                 Environment variables template
```

---

## 🔑 Key Features

✅ **Authentication**
- JWT-based login system
- User and Staff roles
- Token expiration (24 hours)

✅ **Product Management**
- View all products
- Filter by category
- Dynamic pricing for portion sizes

✅ **Order Management**
- Create orders
- Track status (pending → preparing → ready → completed)
- Staff can manage all orders

✅ **Data Persistence**
- JSON file storage
- Automatic data initialization
- Ready for database upgrade

---

## 📡 API Endpoints

All endpoints start with `http://localhost:5000/api`

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/auth/login` | User/Staff login |
| GET | `/products` | Get all products |
| GET | `/products/category/:cat` | Filter by category |
| GET | `/products/:id` | Get product details |
| POST | `/products` | Add product (staff) |
| POST | `/orders` | Create order |
| GET | `/orders` | Get all orders (staff) |
| GET | `/orders/:id` | Get order details |
| PUT | `/orders/:id` | Update order status (staff) |
| DELETE | `/orders/:id` | Delete order (staff) |

See [API_DOCS.md](API_DOCS.md) for detailed documentation.

---

## 🔐 Default Credentials

| Role | Username | Password |
|------|----------|----------|
| User | user | 21 |
| Staff | staff | 1234 |

⚠️ Change these in `data/users.json` after initial setup for production!

---

## ⚙️ Configuration

### Environment Variables (.env)
```
PORT=5000
JWT_SECRET=your_jwt_secret_key_change_in_production
NODE_ENV=development
```

See [.env.example](.env.example) for template.

---

## 🧪 Testing

Quick tests to verify setup:

```powershell
# 1. Check server is running
curl http://localhost:5000/api/health

# 2. Get products
curl http://localhost:5000/api/products

# 3. Login
curl -X POST http://localhost:5000/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{"username":"user","password":"21","userType":"user"}'
```

See [TESTING.md](TESTING.md) for comprehensive testing guide.

---

## 📖 Documentation Files

### [README.md](README.md)
Complete overview including:
- Feature list
- Setup instructions
- API reference overview
- Security features
- Future enhancements

### [SETUP.md](SETUP.md)
Installation guide with:
- Dependency installation
- Server startup
- HTML file updates
- Troubleshooting

### [MIGRATION.md](MIGRATION.md)
Step-by-step HTML migration:
- What changed
- How to update each file
- Migration checklist
- Common issues

### [API_DOCS.md](API_DOCS.md)
Detailed API reference:
- All endpoints documented
- Request/response examples
- Error responses
- cURL testing examples

### [TESTING.md](TESTING.md)
Comprehensive testing guide:
- Installation tests
- API tests
- Frontend integration tests
- Troubleshooting
- Automated test script

---

## 🛠️ Common Tasks

### Start Backend
```powershell
npm start
```

### Install Packages
```powershell
npm install
```

### Test API Endpoints
See [TESTING.md](TESTING.md)

### Update User Credentials
Edit `data/users.json` directly

### Add New Products
POST to `/api/products` endpoint or edit `data/products.json`

### Check Server Status
```powershell
curl http://localhost:5000/api/health
```

---

## 🔄 Upgrade Path

### Current: File-Based Storage
- Easy to understand
- Good for development
- All data in JSON files

### Next: Database Integration
1. Install MongoDB or PostgreSQL
2. Create Mongoose/Sequelize models
3. Replace file operations with database queries
4. Update environment variables

Example: `npm install mongoose`

---

## 🐛 Troubleshooting Quick Links

- **Port already in use** → [TESTING.md](TESTING.md#5-troubleshooting-tests)
- **CORS errors** → [TESTING.md](TESTING.md#5-troubleshooting-tests)
- **Products not loading** → [MIGRATION.md](MIGRATION.md#common-issues-after-migration)
- **Login failing** → [MIGRATION.md](MIGRATION.md#common-issues-after-migration)
- **API not found** → [MIGRATION.md](MIGRATION.md#common-issues-after-migration)

---

## 📝 Next Steps

1. ✅ Read [SETUP.md](SETUP.md)
2. ✅ Run `npm install`
3. ✅ Start server with `npm start`
4. ✅ Update HTML files per [MIGRATION.md](MIGRATION.md)
5. ✅ Test using [TESTING.md](TESTING.md)
6. 📌 Refer to [API_DOCS.md](API_DOCS.md) for development

---

## 📞 Support Resources

- **Installation Issues**: Check [SETUP.md](SETUP.md)
- **API Questions**: See [API_DOCS.md](API_DOCS.md)
- **Testing Problems**: Review [TESTING.md](TESTING.md)
- **HTML Updates**: Follow [MIGRATION.md](MIGRATION.md)

---

## 📅 Version Info

- Backend: Node.js with Express 4.18.2
- Database: JSON files (file-based)
- Authentication: JWT
- Frontend Framework: Bootstrap 4.5.3

---

## ✨ Features by Version

### v1.0 (Current)
- ✅ User/Staff login
- ✅ Product browsing & filtering
- ✅ Order creation & management
- ✅ Staff order dashboard
- ✅ JSON data persistence

### Planned (v2.0)
- 🔄 MongoDB integration
- 🔄 User registration
- 🔄 Email notifications
- 🔄 Real-time updates (WebSocket)
- 🔄 Payment processing

---

## 📞 Quick Reference

**Backend URL:** `http://localhost:5000`
**API Base:** `http://localhost:5000/api`
**Frontend Scripts:** Use `app-backend.js`

---

**Last Updated:** April 2024
**Status:** Ready for Production Use
