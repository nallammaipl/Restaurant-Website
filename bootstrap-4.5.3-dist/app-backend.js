const API_BASE_URL = 'http://localhost:5000/api';
let authToken = localStorage.getItem('authToken');
let currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

// ==================== AUTHENTICATION ====================

async function validateLogin() {
    const userType = document.getElementById("userType").value;
    const password = document.getElementById("password").value;
    const errorElement = document.getElementById("errorMessage");

    if (!userType || !password) {
        errorElement.textContent = "Please fill in all fields";
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: userType === 'user' ? 'user' : 'staff',
                password: password,
                userType: userType
            })
        });

        const data = await response.json();

        if (!response.ok) {
            errorElement.textContent = data.message || "Login failed";
            return;
        }

        // Save token and user info
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('currentUser', JSON.stringify(data.user));
        authToken = data.token;
        currentUser = data.user;

        // Redirect based on user type
        if (userType === 'user') {
            window.location.href = "home.html";
        } else {
            window.location.href = "staff.html";
        }
    } catch (error) {
        errorElement.textContent = "Connection error: " + error.message;
    }
}

function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// ==================== PRODUCTS ====================

async function loadProducts(category = 'all') {
    try {
        let url = `${API_BASE_URL}/products`;
        if (category !== 'all') {
            url = `${API_BASE_URL}/products/category/${category}`;
        }

        const response = await fetch(url);
        const products = await response.json();

        const container = document.querySelector('.row');
        if (container) {
            container.innerHTML = '';
            products.forEach(product => {
                const card = createProductCard(product);
                container.appendChild(card);
            });
        }
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

function createProductCard(product) {
    const col = document.createElement('div');
    col.className = 'col-md-6 col-lg-4';
    col.setAttribute('data-category', product.category);

    col.innerHTML = `
        <div class="card flex-card">
            <img src="https://via.placeholder.com/300x200?text=${encodeURIComponent(product.name)}" class="card-img-top" alt="${product.name}">
            <div class="card-body">
                <h5 class="card-title">${product.name}</h5>
                <p class="card-text">${product.description}</p>
                <p class="card-text"><strong>$${product.basePrice.toFixed(2)}</strong></p>
            </div>
            <div class="card-footer">
                <button class="btn btn-primary w-100" onclick="selectProduct(${product.id}, '${product.name}', ${product.basePrice})">
                    Order
                </button>
            </div>
        </div>
    `;

    return col;
}

function selectProduct(productId, productName, basePrice) {
    // Store product info for ordering
    localStorage.setItem('selectedProduct', JSON.stringify({
        id: productId,
        name: productName,
        basePrice: basePrice
    }));
    window.location.href = 'order.html';
}

// ==================== CATEGORY FILTERING ====================

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const token = localStorage.getItem('authToken');
    if (!token && !window.location.pathname.includes('index.html')) {
        if (window.location.pathname.includes('home.html') || 
            window.location.pathname.includes('order.html') ||
            window.location.pathname.includes('staff.html')) {
            window.location.href = 'index.html';
        }
    }

    // Load products on home page
    if (document.querySelector('.row')) {
        loadProducts();
    }

    // Setup category navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.getAttribute('data-category');

            document.querySelectorAll('.nav-link').forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');

            loadProducts(category);
        });
    });

    // Setup search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            document.querySelectorAll('.col-md-6, .col-lg-4').forEach(card => {
                const title = card.querySelector('.card-title')?.textContent.toLowerCase();
                if (title && title.includes(searchTerm)) {
                    card.style.display = 'block';
                } else if (title) {
                    card.style.display = 'none';
                }
            });
        });
    }

    // Setup order display on staff page
    const ordersList = document.getElementById('ordersList');
    if (ordersList) {
        loadStaffOrders();
    }
});

// ==================== ORDER MANAGEMENT ====================

async function addToCart() {
    if (!authToken) {
        alert('Please log in first');
        window.location.href = 'index.html';
        return;
    }

    const selectedProduct = JSON.parse(localStorage.getItem('selectedProduct') || '{}');
    const portionSize = document.getElementById('portionSize')?.value || 'medium';
    const quantity = parseInt(document.getElementById('quantity')?.value || '1');
    const tableNumber = document.getElementById('tableNumber')?.value;

    if (!tableNumber) {
        alert('Please enter a table number');
        return;
    }

    const rate = calculateRate(selectedProduct.basePrice, portionSize);

    const item = {
        itemName: selectedProduct.name,
        portionSize: portionSize,
        quantity: quantity,
        itemRate: rate,
        subtotal: rate * quantity
    };

    try {
        const response = await fetch(`${API_BASE_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
                items: [item],
                tableNumber: tableNumber
            })
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.message || 'Failed to place order');
            return;
        }

        // Store order data for confirmation page
        sessionStorage.setItem('placedOrder', JSON.stringify(data.items));
        sessionStorage.setItem('tableNumber', JSON.stringify(data.tableNumber));
        
        // Show order number confirmation
        const confirmMessage = `
✓ ORDER CONFIRMED!

Your Order Number: #${data.id}
Table Number: ${data.tableNumber}
Total Amount: $${data.totalAmount.toFixed(2)}

Your order has been sent to the kitchen.
        `;
        alert(confirmMessage);
        
        // Clear form
        document.getElementById('portionSize').value = 'medium';
        document.getElementById('quantity').value = '1';
        document.getElementById('tableNumber').value = '';

        // Redirect to confirmation page with order ID
        window.location.href = 'order-confirmation.html?orderId=' + data.id;

    } catch (error) {
        alert('Error placing order: ' + error.message);
    }
}

function calculateRate(basePrice, portionSize) {
    const multipliers = {
        'small': 1.0,
        'medium': 1.25,
        'large': 1.5
    };
    return basePrice * (multipliers[portionSize] || 1.0);
}

function updateRate() {
    const selectedProduct = JSON.parse(localStorage.getItem('selectedProduct') || '{}');
    if (!selectedProduct.basePrice) return;

    const portionSize = document.getElementById('portionSize')?.value || 'medium';
    const rate = calculateRate(selectedProduct.basePrice, portionSize);
    
    const rateElement = document.getElementById('rate');
    if (rateElement) {
        rateElement.textContent = rate.toFixed(2);
    }

    // Update item name and price display
    const itemNameElement = document.getElementById('itemName');
    const itemPriceElement = document.getElementById('itemPrice');
    
    if (itemNameElement) itemNameElement.textContent = selectedProduct.name;
    if (itemPriceElement) itemPriceElement.textContent = selectedProduct.basePrice.toFixed(2);
}

// Initialize product display on order page
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('itemName')) {
        updateRate();
    }
});

// ==================== STAFF ORDERS VIEW ====================

async function loadStaffOrders() {
    if (!authToken) {
        window.location.href = 'index.html';
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/orders`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to load orders');
        }

        const orders = await response.json();
        const ordersList = document.getElementById('ordersList');

        if (!orders || orders.length === 0) {
            ordersList.innerHTML = '<p>No orders have been placed yet.</p>';
            return;
        }

        ordersList.innerHTML = '';

        orders.forEach((order, index) => {
            const orderDiv = document.createElement('div');
            orderDiv.className = 'order';

            let itemsHTML = '<ul class="order-details">';
            order.items.forEach(item => {
                itemsHTML += `<li>${item.quantity}x ${item.itemName} (${item.portionSize}) - $${item.itemRate.toFixed(2)}</li>`;
            });
            itemsHTML += '</ul>';

            orderDiv.innerHTML = `
                <h2>Order ${order.id} - Table ${order.tableNumber}</h2>
                <p><strong>Status:</strong> <span style="color: #007BFF; font-weight: bold;">${order.status}</span></p>
                ${itemsHTML}
                <p class="total">Total: $${order.totalAmount.toFixed(2)}</p>
                <p style="font-size: 12px; color: #999;">Order placed: ${new Date(order.createdAt).toLocaleString()}</p>
                <div style="margin-top: 10px;">
                    <button class="btn btn-sm btn-primary" onclick="updateOrderStatus(${order.id}, 'preparing')">Preparing</button>
                    <button class="btn btn-sm btn-success" onclick="updateOrderStatus(${order.id}, 'ready')">Ready</button>
                    <button class="btn btn-sm btn-warning" onclick="updateOrderStatus(${order.id}, 'completed')">Completed</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteOrder(${order.id})">Delete</button>
                </div>
            `;

            ordersList.appendChild(orderDiv);
        });
    } catch (error) {
        console.error('Error loading orders:', error);
        document.getElementById('ordersList').innerHTML = '<p>Error loading orders: ' + error.message + '</p>';
    }
}

async function updateOrderStatus(orderId, status) {
    if (!authToken) {
        alert('Please log in first');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ status: status })
        });

        if (!response.ok) {
            throw new Error('Failed to update order');
        }

        alert('Order status updated to: ' + status);
        loadStaffOrders();
    } catch (error) {
        alert('Error updating order: ' + error.message);
    }
}

async function deleteOrder(orderId) {
    if (!confirm('Are you sure you want to delete this order?')) {
        return;
    }

    if (!authToken) {
        alert('Please log in first');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to delete order');
        }

        alert('Order deleted successfully');
        loadStaffOrders();
    } catch (error) {
        alert('Error deleting order: ' + error.message);
    }
}
