// ========================================
// HH Yarn Creations - Global Script
// ========================================

const API_BASE_URL = "https://hh-yarn-api.onrender.com";

// ------------------------------
// Mobile Navigation
// ------------------------------
const bar = document.getElementById("bar");
const closeBtn = document.getElementById("close");
const nav = document.getElementById("navbar");
const header = document.getElementById("header");

function openMenu() {
    if (nav && header) {
        nav.classList.add("active");
        header.classList.add("menu-open");
    }
}

function closeMenu() {
    if (nav && header) {
        nav.classList.remove("active");
        header.classList.remove("menu-open");
    }
}

if (bar) bar.addEventListener("click", openMenu);
if (closeBtn) closeBtn.addEventListener("click", closeMenu);

// ------------------------------
// Cart Functions
// ------------------------------
function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartCount() {
    const cart = getCart();
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);

    const desktop = document.getElementById("cart-count");
    const mobile = document.getElementById("mobile-cart-count");

    if (desktop) desktop.textContent = total;
    if (mobile) mobile.textContent = total;
}

function addToCart(product, quantity = 1) {
    const cart = getCart();
    const existing = cart.find((item) => item.id === product.id);

    if (product.stock <= 0) {
        alert("Out of stock");
        return;
    }

    if (existing) {
        existing.quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: `$${product.price}`,
            image: product.image,
            stock: product.stock,
            quantity
        });
    }

    saveCart(cart);
    updateCartCount();
}

updateCartCount();

// ------------------------------
// Product Detail Page
// ------------------------------
async function loadProductDetails() {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get("id");

    if (!productId) return;

    try {
        const response = await fetch(`${API_BASE_URL}/products/${productId}`);
        const product = await response.json();

        const name = document.getElementById("detail-name");
        const price = document.getElementById("detail-price");
        const description = document.getElementById("detail-description");
        const image = document.getElementById("detail-image");
        const stock = document.getElementById("detail-stock");
        const cartBtn = document.getElementById("detail-cart-btn");

        if (name) name.textContent = product.name;
        if (price) price.textContent = `$${product.price}`;

        // ✅ THIS IS THE KEY CHANGE
        if (description) {
            description.innerHTML = product.description
                .replace(/\n/g, "<br>")
                .replace(/(Dimensions:|Care Instructions:)/g, "<br><strong>$1</strong>");
        }

        if (image) image.src = product.image;

        if (stock) {
            stock.textContent = `Stock: ${product.stock}`;
        }

        if (cartBtn) {
            cartBtn.addEventListener("click", () => {
                addToCart(product, 1);
            });
        }

    } catch (error) {
        console.error("Error loading product:", error);
    }
}

loadProductDetails();