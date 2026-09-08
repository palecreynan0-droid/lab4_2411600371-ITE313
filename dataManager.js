// ===============================
// DATA MANAGER
// ===============================

const products = [
    {
        name: "Pasta Carbonara",
        sku: "PAS-001",
        category: "DISH",
        quantity: 100,
        price: 500
    },
    {
        name: "Chicken Adobo",
        sku: "CHICK-001",
        category: "DISH",
        quantity: 40,
        price: 250
    },
    {
        name: "Pork Adobo",
        sku: "PRKAD-001",
        category: "DISH",
        quantity: 60,
        price: 300
    },
    {
        name: "Sinigang",
        sku: "SIN-001",
        category: "DISH",
        quantity: 60,
        price: 100
    },
    {
        name: "Kare-kare",
        sku: "KAR-001",
        category: "DISH",
        quantity: 60,
        price: 70
    },
    {
        name: "Pork Sisig",
        sku: "PRKSG-001",
        category: "DISH",
        quantity: 60,
        price: 160
    },
    {
        name: "Lechon",
        sku: "LECH-001",
        category: "DISH",
        quantity: 60,
        price: 600
    }
];


// Get all products
function getProducts() {
    return products;
}


// Get products with low stock
function getLowStock() {
    return products.filter(product => product.quantity <= 5);
}


// Get product categories
function getCategories() {
    return [...new Set(products.map(product => product.category))];
}


// Calculate total inventory value
function getInventoryValue() {
    return products.reduce((total, product) => {
        return total + (product.quantity * product.price);
    }, 0);
}


// Get inventory value by category
function getInventoryValueByCategory() {

    const result = {};

    products.forEach(product => {

        if (!result[product.category]) {
            result[product.category] = 0;
        }

        result[product.category] += product.quantity * product.price;

    });

    return result;
}