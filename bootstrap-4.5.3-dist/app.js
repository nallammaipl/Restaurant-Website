function validateLogin() {
    const userType = document.getElementById("userType").value;
    const password = document.getElementById("password").value;
    const userPassword = "21"; // User password
    const staffPassword = "1234"; // Staff password

    if (userType === "user" && password === userPassword) {
        window.location.href = "home.html"; // Redirect users to index page
    } else if (userType === "staff" && password === staffPassword) {
        window.location.href = "staff.html"; // Redirect staff to staff page
    } else {
        document.getElementById("errorMessage").textContent = "Incorrect user type or password. Please try again.";
    }
}
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault(); // Prevent the default link behavior
        const category = this.getAttribute('data-category');

        // Remove 'active' class from all links
        document.querySelectorAll('.nav-link').forEach(nav => nav.classList.remove('active'));
        // Add 'active' class to the clicked link
        this.classList.add('active');

        // Show/Hide cards based on the selected category
        document.querySelectorAll('.col-md-6, .col-lg-4').forEach(card => {
            if (category === 'all' || card.getAttribute('data-category') === category) {
                card.style.display = 'block'; // Show card
            } else {
                card.style.display = 'none'; // Hide card
            }
        });

        const row = document.querySelector('.row');
        row.style.display = 'flex'; // Ensure row is a flex container
        row.style.flexWrap = 'wrap';
    });
});
document.getElementById('searchInput').addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();

    // Get all the cards
    document.querySelectorAll('.col-md-6, .col-lg-4').forEach(card => {
        const title = card.querySelector('.card-title').textContent.toLowerCase();

        // Check if the title includes the search term
        if (title.includes(searchTerm)) {
            card.style.display = 'block'; // Show the card
        } else {
            card.style.display = 'none'; // Hide the card
        }
    });
});
document.addEventListener("DOMContentLoaded", function(){
    const allOrders = JSON.parse(localStorage.getItem("allOrders")) || [];
    const ordersList = document.getElementById("ordersList");

    if (allOrders.length > 0) {
        allOrders.forEach((order, index) => {
            const orderDiv = document.createElement("div");
            orderDiv.classList.add("order");
            
            const orderTitle = document.createElement("h2");
            orderTitle.textContent = `Order ${index + 1} - Table ${order.tableNumber}`;
            orderDiv.appendChild(orderTitle);

            const orderDetailsList = document.createElement("ul");
            orderDetailsList.classList.add("order-details");

            order.items.forEach(item => {
                const itemDetail = document.createElement("li");
                itemDetail.textContent = `${item.quantity}x ${item.itemName} (${item.portionSize}) - $${item.itemRate.toFixed(2)}`;
                orderDetailsList.appendChild(itemDetail);
            });

            const totalAmount = document.createElement("p");
            totalAmount.classList.add("total");
            totalAmount.textContent = `Total: $${order.totalAmount.toFixed(2)}`;
            orderDiv.appendChild(orderDetailsList);
            orderDiv.appendChild(totalAmount);
            
            ordersList.appendChild(orderDiv);
        });
    } else {
        ordersList.innerHTML = "<p>No orders have been placed yet.</p>";
    }
});