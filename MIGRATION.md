# HTML Migration Guide

This guide shows exactly how to update your existing HTML files to work with the new backend.

## Important Changes

All HTML files need to:
1. **Replace** `<script src="app.js"></script>` with `<script src="app-backend.js"></script>`
2. No other changes needed - the backend-compatible app.js handles everything

---

## Updated index.html (Login Page)

Find this line (near the bottom):
```html
<script src="app.js"></script>
```

Replace with:
```html
<script src="app-backend.js"></script>
```

### What Changes:
- Login now sends credentials to `/api/auth/login`
- Token is saved to localStorage
- User is redirected based on role

### Expected Form Structure:
```html
<form>
    <select id="userType">
        <option value="user">User</option>
        <option value="staff">Staff</option>
    </select>
    <input type="password" id="password">
    <button type="button" onclick="validateLogin()">Login</button>
    <span id="errorMessage"></span>
</form>
```

---

## Updated home.html (Menu Page)

Find this line (near the bottom):
```html
<script src="app.js"></script>
```

Replace with:
```html
<script src="app-backend.js"></script>
```

### What Changes:
- Products load from `/api/products`
- Categories filter using `/api/products/category/:category`
- Search functionality works on API-loaded products

### Required Elements:
```html
<!-- Navigation with categories -->
<nav class="navbar">
    <a class="nav-link active" href="#" data-category="all">All</a>
    <a class="nav-link" href="#" data-category="pizza">Pizza</a>
    <a class="nav-link" href="#" data-category="burger">Burger</a>
    <a class="nav-link" href="#" data-category="salad">Salad</a>
    <a class="nav-link" href="#" data-category="dessert">Dessert</a>
    <a class="nav-link" href="#" data-category="beverage">Beverage</a>
</nav>

<!-- Search Bar -->
<input type="text" id="searchInput" placeholder="Search menu...">

<!-- Products Container -->
<div class="row"></div>
```

### JavaScript Functions:
- `loadProducts(category)` - Loads products from API
- `selectProduct(productId, name, price)` - Stores selection and redirects to order.html

---

## Updated order.html (Ordering Page)

Find this line (near the bottom):
```html
<script src="app.js"></script>
```

Replace with:
```html
<script src="app-backend.js"></script>
```

### What Changes:
- Order data is sent to `/api/orders` instead of localStorage
- Portion sizes and quantities are calculated on backend
- Order confirmation shows order ID

### Required Form Elements:
```html
<form id="orderForm">
    <p>Item: <span id="itemName"></span></p>
    <p>Base Price: $<span id="itemPrice"></span></p>
    
    <select id="portionSize" name="portionSize" onchange="updateRate()">
        <option value="small">Small</option>
        <option value="medium">Medium</option>
        <option value="large">Large</option>
    </select>
    
    <p>Rate: $<span id="rate"></span></p>
    
    <input type="number" id="quantity" name="quantity" min="1" value="1" onchange="updateRate()">
    
    <input type="text" id="tableNumber" name="tableNumber" placeholder="Enter table number">
    
    <button type="button" onclick="addToCart()">Add to Cart</button>
</form>
```

### JavaScript Functions:
- `updateRate()` - Updates price based on portion size
- `addToCart()` - Sends order to API

---

## Updated staff.html (Orders Management Page)

Find this line (near the bottom):
```html
<script src="app.js"></script>
```

Replace with:
```html
<script src="app-backend.js"></script>
```

### What Changes:
- Orders load from `/api/orders` (staff only endpoint)
- Status updates send to `/api/orders/:id` with PUT request
- Real-time order management

### Required Elements:
```html
<!-- Orders Container -->
<div id="ordersList"></div>
```

### JavaScript Functions:
- `loadStaffOrders()` - Fetches all orders from API
- `updateOrderStatus(orderId, status)` - Updates order status
- `deleteOrder(orderId)` - Deletes an order

---

## Complete Migration Checklist

### Before Migration
- [ ] Backup existing HTML files
- [ ] Backup existing app.js
- [ ] Backend server installed (`npm install`)
- [ ] npm dependencies listed in package.json

### During Migration
- [ ] Update index.html script tag
- [ ] Update home.html script tag
- [ ] Update order.html script tag
- [ ] Update staff.html script tag
- [ ] Verify all HTML elements match required structure

### After Migration
- [ ] Start backend server (`npm start`)
- [ ] Test login functionality
- [ ] Test product loading
- [ ] Test order placement
- [ ] Test staff order view
- [ ] Test category filtering
- [ ] Test search functionality

---

## Step-by-Step Example: Updating index.html

### BEFORE:
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Login Page</title>
</head>
<body>
    <div class="login-container">
        <h1>Login</h1>
        <form>
            <select id="userType">
                <option value="user">User</option>
                <option value="staff">Staff</option>
            </select>
            <input type="password" id="password" placeholder="Password">
            <button type="button" onclick="validateLogin()">Login</button>
            <span id="errorMessage" style="color: red;"></span>
        </form>
    </div>
    
    <script src="app.js"></script>  <!-- ← CHANGE THIS LINE -->
</body>
</html>
```

### AFTER:
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Login Page</title>
</head>
<body>
    <div class="login-container">
        <h1>Login</h1>
        <form>
            <select id="userType">
                <option value="user">User</option>
                <option value="staff">Staff</option>
            </select>
            <input type="password" id="password" placeholder="Password">
            <button type="button" onclick="validateLogin()">Login</button>
            <span id="errorMessage" style="color: red;"></span>
        </form>
    </div>
    
    <script src="app-backend.js"></script>  <!-- ← UPDATED -->
</body>
</html>
```

---

## Default Credentials

After migration, use these to test:

**User Account:**
- Username: `user`
- Password: `21`

**Staff Account:**
- Username: `staff`
- Password: `1234`

---

## Common Issues After Migration

### Issue: "Failed to fetch from API"
**Solution:** Make sure backend is running (`npm start`)

### Issue: "CORS error"
**Solution:** Backend must be on `http://localhost:5000`, frontend accessing `/api` endpoints

### Issue: "Products not loading"
**Solution:** Check browser console for errors, verify `app-backend.js` is linked

### Issue: "Login not working"
**Solution:** Check that form elements have correct IDs (userType, password, errorMessage)

### Issue: "Page redirects to index.html after login"
**Solution:** Check that localStorage has authToken after login

---

## Verifying Migration Success

After updating all HTML files, open Developer Tools (F12) and:

1. Go to Console
2. Try logging in
3. Check console for messages

Expected console output on login:
```
Login successful
Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Redirecting to home.html
```

---

## Reverting to Old Version

If you need to revert:

1. Keep `app-backend.js` as backup
2. Update script tags back to `<script src="app.js"></script>`
3. Update API_BASE_URL in old app.js to use localStorage again

---

## Next Steps

1. ✅ Update all 4 HTML files
2. ✅ Start backend server
3. ✅ Test login flow
4. ✅ Test product browsing
5. ✅ Test order placement
6. Consider database upgrade (MongoDB, PostgreSQL)
7. Add security features (bcrypt passwords, HTTPS, etc.)

---

## Support

For issues or questions:
- Check TESTING.md for test procedures
- Check API_DOCS.md for endpoint documentation
- Check README.md for setup instructions
