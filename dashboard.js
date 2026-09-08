document.addEventListener("DOMContentLoaded", function () {

    // =========================
    // STUDENT INFORMATION
    // =========================

    const username = localStorage.getItem("username") || "Rey";

    document.getElementById("navUsername").textContent = username;
    document.getElementById("studentName").textContent = username;


    // =========================
    // GREETING
    // =========================

    const hour = new Date().getHours();
    const greeting = document.getElementById("greeting");

    if (hour < 12) {
        greeting.textContent = "Good morning!";
    } else if (hour < 18) {
        greeting.textContent = "Good afternoon!";
    } else {
        greeting.textContent = "Good evening!";
    }


    // =========================
    // DATE
    // =========================

    document.getElementById("currentDate").textContent =
        new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric"
        });


    // =========================
    // 
    // =========================

    document.getElementById("gpaValue").textContent = "150";
    document.getElementById("coursesValue").textContent = "$5,430";
    document.getElementById("assignmentsValue").textContent = "15";
    document.getElementById("attendanceValue").textContent = "Pasta Carbonara";


    // =========================
    // INVENTORY ELEMENTS
    // =========================

    const searchInput = document.getElementById("searchInput");
    const categoryFilter = document.getElementById("categoryFilter");
    const stockFilter = document.getElementById("stockFilter");
    const inventoryTable = document.getElementById("inventoryTable");
    const lowStockAlert = document.getElementById("lowStockAlert");
    const lowStockMessage = document.getElementById("lowStockMessage");
    const exportBtn = document.getElementById("exportBtn");


    // =========================
    // PRODUCTS
    // =========================

    const allProducts = getProducts();


    // =========================
    // CATEGORY DROPDOWN
    // =========================

    getCategories().forEach(function (category) {

        const option = document.createElement("option");

        option.value = category;
        option.textContent = category;

        categoryFilter.appendChild(option);
    });


    // =========================
    // DISPLAY INVENTORY
    // =========================

    function displayInventory() {

        let products = [...allProducts];


        // Search
        const searchText = searchInput.value
            .trim()
            .toLowerCase();

        if (searchText !== "") {

            products = products.filter(function (product) {

                return (
                    product.name.toLowerCase().includes(searchText) ||
                    product.sku.toLowerCase().includes(searchText)
                );

            });
        }


        // Category filter
        if (categoryFilter.value !== "all") {

            products = products.filter(function (product) {

                return product.category === categoryFilter.value;

            });
        }


        // Stock filter
        if (stockFilter.value !== "all") {

            products = products.filter(function (product) {

                if (stockFilter.value === "in stock") {
                    return product.quantity > 5;
                }

                if (stockFilter.value === "low stock") {
                    return product.quantity > 0 &&
                           product.quantity <= 5;
                }

                if (stockFilter.value === "out of stock") {
                    return product.quantity === 0;
                }

                return true;
            });
        }


        // Clear table
        inventoryTable.innerHTML = "";


        // No products
        if (products.length === 0) {

            inventoryTable.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center">
                        No products found.
                    </td>
                </tr>
            `;

            return;
        }


        // Display products
        products.forEach(function (product) {

            let status;
            let badge;


            if (product.quantity === 0) {

                status = "Out of Stock";
                badge = "bg-danger";

            } else if (product.quantity <= 5) {

                status = "Low Stock";
                badge = "bg-warning text-dark";

            } else {

                status = "In Stock";
                badge = "bg-success";
            }


            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${product.name}</td>
                <td>${product.sku}</td>
                <td>${product.category}</td>
                <td>${product.quantity}</td>
                <td>₱${product.price.toLocaleString()}</td>
                <td>
                    <span class="badge ${badge}">
                        ${status}
                    </span>
                </td>
            `;

            inventoryTable.appendChild(row);
        });
    }


    // =========================
    // LOW STOCK ALERT
    // =========================

    function updateLowStockAlert() {

        const lowStockProducts = getLowStock();

        if (lowStockProducts.length === 0) {

            lowStockMessage.textContent =
                "No products are currently low in stock.";

        } else {

            const names = lowStockProducts
                .map(function (product) {
                    return product.name;
                })
                .join(", ");

            lowStockMessage.textContent =
                names + " need attention.";
        }
    }


    // =========================
    // INVENTORY VALUE CHART
    // =========================

    const inventoryCanvas =
        document.getElementById("inventoryChart");

    const categoryValues =
        getInventoryValueByCategory();

    new Chart(inventoryCanvas, {

        type: "bar",

        data: {

            labels: Object.keys(categoryValues),

            datasets: [{
                label: "Inventory Value",
                data: Object.values(categoryValues)
            }]
        },

        options: {
            responsive: true,

            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });


    // =========================
    // STOCK STATUS CHART
    // =========================

    const stockCanvas =
        document.getElementById("stockChart");

    function getStockCounts() {

        return {
            inStock: allProducts.filter(
                product => product.quantity > 5
            ).length,

            lowStock: allProducts.filter(
                product =>
                    product.quantity > 0 &&
                    product.quantity <= 5
            ).length,

            outOfStock: allProducts.filter(
                product => product.quantity === 0
            ).length
        };
    }

    const stockCounts = getStockCounts();

    new Chart(stockCanvas, {

        type: "doughnut",

        data: {

            labels: [
                "In Stock",
                "Low Stock",
                "Out of Stock"
            ],

            datasets: [{
                data: [
                    stockCounts.inStock,
                    stockCounts.lowStock,
                    stockCounts.outOfStock
                ]
            }]
        },

        options: {
            responsive: true
        }
    });


    // =========================
    // SEARCH EVENT
    // =========================

    searchInput.addEventListener("input", function () {
        displayInventory();
    });


    // =========================
    // CATEGORY EVENT
    // =========================

    categoryFilter.addEventListener("change", function () {
        displayInventory();
    });


    // =========================
    // STOCK EVENT
    // =========================

    stockFilter.addEventListener("change", function () {
        displayInventory();
    });


    // =========================
    // EXPORT CSV
    // =========================

    exportBtn.addEventListener("click", function () {

        let csv =
            "Product,SKU,Category,Quantity,Unit Price,Status\n";


        allProducts.forEach(function (product) {

            let status;

            if (product.quantity === 0) {
                status = "Out of Stock";
            } else if (product.quantity <= 5) {
                status = "Low Stock";
            } else {
                status = "In Stock";
            }


            csv +=
                `"${product.name}",` +
                `"${product.sku}",` +
                `"${product.category}",` +
                `${product.quantity},` +
                `${product.price},` +
                `"${status}"\n`;
        });


        const blob = new Blob(
            [csv],
            { type: "text/csv" }
        );

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");

        link.href = url;
        link.download = "inventory.csv";

        link.click();

        URL.revokeObjectURL(url);
    });


    // =========================
    // LOGOUT
    // =========================

    document
        .getElementById("logoutBtn")
        .addEventListener("click", function () {

            localStorage.removeItem("username");
            localStorage.removeItem("loggedIn");

            window.location.href = "index.html";

        });


    // =========================
    // RECENT ACTIVITY
    // =========================

    const activityTable =
        document.getElementById("activityTable");

    if (activityTable) {

        activityTable.innerHTML = `
            <tr>
                <td>August 23, 2026</td>
                <td>ORD1234</td>
                <td>Arnold</td>
                <td>Completed<td>
            </tr>

            <tr>
                <td>August 22, 2026</td>
                <td>ORD1235</td>
                <td>Bryan</td>
                <td>Pending<td>
            </tr>

            <tr>
                <td>August 21, 2026</td>
                <td>ORD1236</td>
               <td>Joshua</td>
                 <td>Completed</td>
            </tr>
        `;
    }


    // =========================
    // REAL-TIME STOCK SIMULATION
    // =========================

    setInterval(function () {

        const randomIndex =
            Math.floor(Math.random() * allProducts.length);

        const randomProduct =
            allProducts[randomIndex];

        if (randomProduct.quantity > 0) {
            randomProduct.quantity--;
        }

        displayInventory();
        updateLowStockAlert();

    }, 5000);


    // =========================
    // INITIAL LOAD
    // =========================

    displayInventory();
    updateLowStockAlert();

});