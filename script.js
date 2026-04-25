// ========================================
// HH Yarn Creations - Global Script
// Handles:
// - Mobile navigation
// - Cart functionality (localStorage)
// - Product navigation
// - Product detail page logic
// ========================================

// ------------------------------
// Mobile Navigation
// ------------------------------
const bar = document.getElementById("bar");
const closeBtn = document.getElementById("close");
const nav = document.getElementById("navbar");
const header = document.getElementById("header");

// Opens mobile menu
function openMenu() {
    if (nav && header) {
        nav.classList.add("active");
        header.classList.add("menu-open");
    }
}

// Closes mobile menu
function closeMenu() {
    if (nav && header) {
        nav.classList.remove("active");
        header.classList.remove("menu-open");
    }
}

// Event listeners for menu toggle
if (bar && nav && header) {
    bar.addEventListener("click", openMenu);
}

if (closeBtn && nav && header) {
    closeBtn.addEventListener("click", closeMenu);
}

// Close menu with ESC key
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && nav && nav.classList.contains("active")) {
        closeMenu();
    }
});


// ------------------------------
// Navigation Buttons
// ------------------------------
const shopNowBtn = document.getElementById("shop-now-btn");

if (shopNowBtn) {
    shopNowBtn.addEventListener("click", () => {
        window.location.href = "shop.html";
    });
}


// ------------------------------
// Review Highlight Animation
// ------------------------------
const reviewRows = document.querySelectorAll(".review-table tbody tr");

if (reviewRows.length > 0) {
    let currentReview = 0;

    setInterval(() => {
        reviewRows.forEach((row) => {
            row.style.backgroundColor = "";
        });

        reviewRows[currentReview].style.backgroundColor = "#dffcff";
        currentReview = (currentReview + 1) % reviewRows.length;
    }, 2000);
}


// ------------------------------
// Cart Functions (localStorage)
// ------------------------------

// Get cart from storage
function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

// Save cart to storage
function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// Update cart icon count
function updateCartCount() {
    const cart = getCart();
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

    const cartCount = document.getElementById("cart-count");
    const mobileCartCount = document.getElementById("mobile-cart-count");

    if (cartCount) cartCount.textContent = totalItems;
    if (mobileCartCount) mobileCartCount.textContent = totalItems;
}

// Add item to cart
function addToCart(product, quantity = 1) {
    const cart = getCart();
    const existingItem = cart.find((item) => item.id === product.id);
    const stock = Number(product.stock) || 0;

    if (stock <= 0) {
        alert("Out of stock.");
        return;
    }

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({ ...product, quantity });
    }

    saveCart(cart);
    updateCartCount();
}

// Remove item
function removeFromCart(productId) {
    const updatedCart = getCart().filter((item) => item.id !== productId);
    saveCart(updatedCart);
    updateCartCount();
}

// Update quantity
function updateQuantity(productId, newQuantity) {
    const cart = getCart();
    const item = cart.find((p) => p.id === productId);

    if (!item) return;

    if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
    }

    item.quantity = newQuantity;
    saveCart(cart);
    updateCartCount();
}

// Clear entire cart
function clearCart() {
    localStorage.removeItem("cart");
    updateCartCount();
}

// Initialize cart count on page load
updateCartCount();