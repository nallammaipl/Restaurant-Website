# Testing Guide

## Prerequisites

- Node.js installed
- Backend running on `http://localhost:5000`
- `app-backend.js` linked in HTML files

---

## 1. Backend Installation Test

### Step 1: Install Dependencies
```powershell
cd w:\nallu_projects\Restaurant-Website
npm install
```

Expected output:
```
up to date, audited 50 packages in 2s
```

### Step 2: Start Server
```powershell
npm start
```

Expected output:
```
Server is running on http://localhost:5000
API Endpoints:
- POST   /api/auth/login              - User login
- GET    /api/products                - Get all products
...
```

### Step 3: Test Health Endpoint

Open browser or use PowerShell:
```powershell
Invoke-WebRequest -Uri "http://localhost:5000/api/health" | ConvertFrom-Json
```

Expected output:
```
status
------
Server is running
```

---

## 2. API Testing

### Test 1: Get Products

```powershell
$response = Invoke-WebRequest -Uri "http://localhost:5000/api/products" -UseBasicParsing
$products = $response.Content | ConvertFrom-Json
$products | Select-Object -First 1
```

Expected output shows product data with fields: id, name, basePrice, category, etc.

### Test 2: User Login

```powershell
$loginData = @{
    username = "user"
    password = "21"
    userType = "user"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:5000/api/auth/login" `
    -Method POST `
    -ContentType "application/json" `
    -Body $loginData `
    -UseBasicParsing

$result = $response.Content | ConvertFrom-Json
$result
```

Expected output:
```
token : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
user  : @{id=1; username=user; role=user}
```

### Test 3: Staff Login

```powershell
$loginData = @{
    username = "staff"
    password = "1234"
    userType = "staff"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:5000/api/auth/login" `
    -Method POST `
    -ContentType "application/json" `
    -Body $loginData `
    -UseBasicParsing

$result = $response.Content | ConvertFrom-Json
$result
```

Expected: User token with role: staff

---

## 3. Frontend Integration Test

### Step 1: Update HTML Files

Add this script tag to all HTML files (bottom of <body> tag):

**index.html, home.html, order.html, staff.html:**
```html
<script src="app-backend.js"></script>
```

### Step 2: Test Login

1. Make sure backend is running
2. Open `http://localhost:5000` in browser
3. Try login with:
   - **User**: Password "21"
   - **Staff**: Password "1234"

Expected: Should redirect to home.html or staff.html

### Step 3: Test Product Loading

After login on home page:
1. Products should load from backend API
2. Categories should work (click Pizza, Burger, etc.)
3. Search bar should filter products

### Step 4: Test Order Placement

On order page:
1. Select product and portion size
2. Enter table number
3. Click "Add to Cart"

Expected: Order should be created in backend and confirmation shown

### Step 5: Test Staff Orders View

Login as staff:
1. Should see all orders
2. Click "Preparing" to update status
3. Status changes should reflect in real-time

---

## 4. Data Files Test

After running the server, check the `data/` folder:

```powershell
Get-ChildItem w:\nallu_projects\Restaurant-Website\data\
```

Expected files:
- `users.json` - Contains user credentials
- `products.json` - Contains menu items
- `orders.json` - Contains orders (empty initially)

View products:
```powershell
Get-Content w:\nallu_projects\Restaurant-Website\data\products.json | ConvertFrom-Json
```

---

## 5. Troubleshooting Tests

### Test: Port 5000 Already in Use

```powershell
netstat -ano | findstr :5000
```

If port is in use:
```powershell
taskkill /PID <PID> /F
```

### Test: CORS Errors

Check browser console for errors. If you see CORS errors:
1. Verify backend is running on `http://localhost:5000`
2. Verify frontend is using `http://localhost:5000/api` (not https)
3. Check that `app-backend.js` is linked in HTML

### Test: Token Issues

Check browser localStorage:
```javascript
// Open Developer Tools > Console and run:
localStorage.getItem('authToken')
localStorage.getItem('currentUser')
```

Should show token and user data after login.

### Test: 404 API Errors

Make sure endpoints are correct:
- ✅ `http://localhost:5000/api/products` (with /api)
- ❌ `http://localhost:5000/products` (without /api)

---

## 6. Performance Test

### Test: Load 100 Products

Add 100 products to test performance:

```powershell
$token = "YOUR_STAFF_TOKEN"

for ($i = 1; $i -le 100; $i++) {
    $body = @{
        name = "Test Product $i"
        basePrice = 10.00
        category = "test"
        pricing = @{
            small = 10.00
            medium = 12.00
            large = 14.00
        }
    } | ConvertTo-Json
    
    Invoke-WebRequest -Uri "http://localhost:5000/api/products" `
        -Method POST `
        -ContentType "application/json" `
        -Headers @{"Authorization" = "Bearer $token"} `
        -Body $body `
        -UseBasicParsing
}
```

Then test retrieval speed:
```powershell
Measure-Command {
    Invoke-WebRequest -Uri "http://localhost:5000/api/products" -UseBasicParsing
}
```

Should complete in < 1 second

---

## 7. Automated Test Script

Save as `test.ps1`:

```powershell
Write-Host "Testing Restaurant Backend..." -ForegroundColor Green

# Test 1: Health Check
Write-Host "`n[1/5] Testing health endpoint..."
try {
    $health = Invoke-WebRequest -Uri "http://localhost:5000/api/health" -UseBasicParsing
    Write-Host "✓ Server is running" -ForegroundColor Green
} catch {
    Write-Host "✗ Server not responding" -ForegroundColor Red
    exit
}

# Test 2: Get Products
Write-Host "`n[2/5] Testing product endpoint..."
try {
    $products = Invoke-WebRequest -Uri "http://localhost:5000/api/products" -UseBasicParsing
    $count = ($products.Content | ConvertFrom-Json).Count
    Write-Host "✓ Retrieved $count products" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed to get products" -ForegroundColor Red
}

# Test 3: User Login
Write-Host "`n[3/5] Testing user login..."
try {
    $loginBody = @{
        username = "user"
        password = "21"
        userType = "user"
    } | ConvertTo-Json
    
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/auth/login" `
        -Method POST -ContentType "application/json" -Body $loginBody -UseBasicParsing
    $result = $response.Content | ConvertFrom-Json
    Write-Host "✓ User login successful (Token: $($result.token.Substring(0, 20))...)" -ForegroundColor Green
} catch {
    Write-Host "✗ Login failed" -ForegroundColor Red
}

# Test 4: Staff Login
Write-Host "`n[4/5] Testing staff login..."
try {
    $loginBody = @{
        username = "staff"
        password = "1234"
        userType = "staff"
    } | ConvertTo-Json
    
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/auth/login" `
        -Method POST -ContentType "application/json" -Body $loginBody -UseBasicParsing
    $result = $response.Content | ConvertFrom-Json
    Write-Host "✓ Staff login successful" -ForegroundColor Green
} catch {
    Write-Host "✗ Staff login failed" -ForegroundColor Red
}

# Test 5: Data Files
Write-Host "`n[5/5] Checking data files..."
$files = @("users.json", "products.json", "orders.json")
$allExists = $true
foreach ($file in $files) {
    if (Test-Path ".\data\$file") {
        Write-Host "✓ $file exists" -ForegroundColor Green
    } else {
        Write-Host "✗ $file missing" -ForegroundColor Red
        $allExists = $false
    }
}

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "All tests completed!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
```

Run it:
```powershell
.\test.ps1
```

---

## Success Criteria

✅ Server starts without errors
✅ Health endpoint responds
✅ Products load correctly
✅ Login works for both user and staff
✅ Data files are created
✅ Frontend connects to backend
✅ Orders can be created
✅ Staff can view orders

If all tests pass, your backend is ready to use!
