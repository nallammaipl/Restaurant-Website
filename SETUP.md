# Quick Start Guide

## 1. Install Dependencies

Open PowerShell in the Restaurant-Website folder and run:

```powershell
npm install
```

## 2. Start the Backend Server

```powershell
npm start
```

Expected output:
```
Server is running on http://localhost:5000
API Endpoints:
- POST   /api/auth/login              - User login
...
```

## 3. Update Your HTML Files

Replace this line in all HTML files (index.html, home.html, order.html, staff.html):

**OLD:**
```html
<script src="app.js"></script>
```

**NEW:**
```html
<script src="app-backend.js"></script>
```

## 4. Test the Application

- Open browser to `http://localhost:5000`
- Login with:
  - **User**: password `21`
  - **Staff**: password `1234`

## 5. Troubleshooting

If you get CORS errors:
- Make sure backend is running on `http://localhost:5000`
- Make sure frontend is accessing API at `http://localhost:5000/api`

## File Updates Needed

### index.html (Login Page)
Change script tag:
```html
<script src="app-backend.js"></script>
```

### home.html (Menu Page)
Change script tag:
```html
<script src="app-backend.js"></script>
```

### order.html (Ordering Page)
Change script tag:
```html
<script src="app-backend.js"></script>
```

### staff.html (Staff Orders Page)
Change script tag:
```html
<script src="app-backend.js"></script>
```

## Backend Features

✅ User & Staff Login with JWT  
✅ Product Management & Filtering  
✅ Order Creation & Tracking  
✅ Order Status Management (Preparing → Ready → Completed)  
✅ Automatic Data Persistence  

## Next Steps

1. **Database**: Upgrade to MongoDB for production
2. **Security**: Implement password hashing with bcrypt
3. **Images**: Add product image upload
4. **Real-time**: Add WebSocket for live order updates
5. **Payment**: Integrate payment processing

## API Reference

See detailed documentation in `README.md`
