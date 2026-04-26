// ========================================
// HH Yarn Creations - Global Script
// Handles:
// - Mobile navigation
// - Cart functionality
// - Product navigation
// - Product detail page logic
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

if (bar && nav && header) {
    bar.addEventListener("click", openMenu);
}

if (closeBtn && nav && header) {
    closeBtn.addEventListener("click", closeMenu);
}

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
// Product Card Navigation
// ------------------------------
const productCards = document.querySelectorAll(".pro");

if (productCards.length > 0) {
    productCards.forEach((card) => {
        card.addEventListener("click", function (event) {
            if (event.target.closest(".cart") || event.target.closest(".cart-button")) {
                return;
            }

            const productId = this.dataset.id;

            if (productId) {
                window.location.href = `product.html?id=${productId}`;
            }
        });

        card.addEventListener("keydown", function (event) {
            if (event.target.closest(".cart") || event.target.closest(".cart-button")) {
                return;
            }

            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();

                const productId = this.dataset.id;

                if (productId) {
                    window.location.href = `product.html?id=${productId}`;
                }
            }
        });
    });
}

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
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

    const cartCount = document.getElementById("cart-count");
    const mobileCartCount = document.getElementById("mobile-cart-count");

    if (cartCount) {
        cartCount.textContent = totalItems;
        cartCount.classList.remove("cart-bounce");
        void cartCount.offsetWidth;
        cartCount.classList.add("cart-bounce");
    }

    if (mobileCartCount) {
        mobileCartCount.textContent = totalItems;
        mobileCartCount.classList.remove("cart-bounce");
        void mobileCartCount.offsetWidth;
        mobileCartCount.classList.add("cart-bounce");
    }
}

function addToCart(product, quantity = 1) {
    const cart = getCart();
    const existingItem = cart.find((item) => item.id === product.id);
    const stock = Number(product.stock) || 0;

    if (stock <= 0) {
        alert("Sorry, this item is currently out of stock.");
        return;
    }

    if (quantity > stock) {
        alert(`Only ${stock} available.`);
        return;
    }

    if (existingItem) {
        if (existingItem.quantity + quantity > stock) {
            alert(`Only ${stock} available.`);
            return;
        }

        existingItem.quantity += quantity;
        existingItem.stock = stock;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: `$${product.price}`,
            image: product.image,
            stock: stock,
            quantity: quantity
        });
    }

    saveCart(cart);
    updateCartCount();
}

function removeFromCart(productId) {
    const updatedCart = getCart().filter((item) => item.id !== productId);
    saveCart(updatedCart);
    updateCartCount();
}

function updateQuantity(productId, newQuantity) {
    const cart = getCart();
    const item = cart.find((product) => product.id === productId);

    if (!item) return;

    if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
    }

    if (item.stock && newQuantity > item.stock) {
        alert(`Only ${item.stock} available.`);
        return;
    }

    item.quantity = newQuantity;
    saveCart(cart);
    updateCartCount();
}

function clearCart() {
    localStorage.removeItem("cart");
    updateCartCount();
}

updateCartCount();

// ------------------------------
// Stock Helpers
// ------------------------------
let selectedProduct = null;

function getStockClass(stock) {
    if (stock <= 0) return "out-of-stock";
    if (stock <= 2) return "low-stock";
    return "in-stock";
}

function getStockText(stock) {
    if (stock <= 0) return "Out of stock";
    if (stock <= 2) return `Only ${stock} left!`;
    return "In stock";
}

// ------------------------------
// Product Thumbnail Images
// ------------------------------
function getThumbnailMap() {
    return {
        1: [
            "images/Medium Size Crochet Sunflower Bag/feature.jpg",
            "images/Medium Size Crochet Sunflower Bag/m1.jpg",
            "images/Medium Size Crochet Sunflower Bag/m2.jpg"
        ],
        2: [
            "images/Cinnamon Cedar Twisted Headband/feature2.jpg",
            "images/Cinnamon Cedar Twisted Headband/c1.jpg",
            "images/Cinnamon Cedar Twisted Headband/c2.jpg"
        ],
        4: [
            "images/Cinnamon Cedar Market Bag/feature4.jpg",
            "images/Cinnamon Cedar Market Bag/cc1.jpg",
            "images/Cinnamon Cedar Market Bag/cc2.jpg"
        ],
        9: [
            "images/Camo Tweed Fingerless Gloves/p5.jpg",
            "images/Camo Tweed Fingerless Gloves/ct1.jpg",
            "images/Camo Tweed Fingerless Gloves/ct2.jpg"
        ],
        11: [
            "images/Small Sunflower Bag/p7.jpg",
            "images/Small Sunflower Bag/s1.jpg",
            "images/Small Sunflower Bag/s2.jpg"
        ],
        12: [
            "images/Sunset Beanie/p8.jpg",
            "images/Sunset Beanie/sb1.jpg",
            "images/Sunset Beanie/sb2.jpg"
        ]
    };
}

function renderProductThumbnails(product) {
    const detailImage = document.getElementById("detail-image");
    const smallImages = document.querySelectorAll(".small-img");
    const smallImageCols = document.querySelectorAll(".small-img-col");

    if (!smallImages.length || !smallImageCols.length) return;

    const thumbnailMap = getThumbnailMap();
    const thumbnails = thumbnailMap[product.id] || [product.image];

    smallImages.forEach((img, index) => {
        const thumb = thumbnails[index];
        const parentCol = smallImageCols[index];

        if (thumb && parentCol) {
            parentCol.style.display = "";
            img.src = thumb;
            img.alt = `${product.name} thumbnail ${index + 1}`;
            img.hidden = false;

            img.onclick = function () {
                if (detailImage) {
                    detailImage.src = thumb;
                    detailImage.alt = product.name;
                }
            };
        } else if (parentCol) {
            parentCol.style.display = "none";
        }
    });
}

// ------------------------------
// Product Detail Page
// ------------------------------
function setupProductButtons() {
    const detailCartBtn = document.getElementById("detail-cart-btn");
    const buyNowBtn = document.getElementById("buy-now-btn");

    if (detailCartBtn && selectedProduct) {
        detailCartBtn.addEventListener("click", function () {
            const quantityInput = document.getElementById("quantity");
            const quantity = parseInt(quantityInput?.value, 10) || 1;

            addToCart(selectedProduct, quantity);

            const originalText = detailCartBtn.textContent;
            detailCartBtn.textContent = "Added ✓";

            setTimeout(() => {
                detailCartBtn.textContent = originalText;
            }, 1200);
        });
    }

    if (buyNowBtn && selectedProduct) {
        buyNowBtn.addEventListener("click", function () {
            const quantityInput = document.getElementById("quantity");
            const quantity = parseInt(quantityInput?.value, 10) || 1;

            addToCart(selectedProduct, quantity);
            window.location.href = "cart.html";
        });
    }
}

function renderStockStatus(product) {
    const stockMessage = document.getElementById("detail-stock");
    const detailCartBtn = document.getElementById("detail-cart-btn");
    const buyNowBtn = document.getElementById("buy-now-btn");
    const quantityInput = document.getElementById("quantity");

    const stock = Number(product.stock) || 0;

    if (stockMessage) {
        stockMessage.textContent = getStockText(stock);
        stockMessage.className = `stock-message ${getStockClass(stock)}`;
    }

    if (quantityInput) {
        quantityInput.max = stock > 0 ? stock : 1;
    }

    if (stock <= 0) {
        if (detailCartBtn) {
            detailCartBtn.disabled = true;
            detailCartBtn.textContent = "Out of Stock";
        }

        if (buyNowBtn) {
            buyNowBtn.disabled = true;
            buyNowBtn.textContent = "Unavailable";
        }
    }
}

function formatDescription(description) {
    const text = String(description || "");

    const featureSplit = text.split(/Features\s*-?/i);
    const mainText = featureSplit[0] || "";
    const restAfterFeatures = featureSplit[1] || "";

    const careSplit = restAfterFeatures.split(/Care Instructions\s*-?/i);
    const featuresText = careSplit[0] || "";
    const careText = careSplit[1] || "";

    let formatted = `<p>${mainText.trim().replace(/\.\s+/g, ".</p><p>")}</p>`;

    if (featuresText.trim()) {
        const features = featuresText
            .split(/\s-\s/)
            .map(item => item.trim())
            .filter(Boolean);

        formatted += `<h4>Features:</h4><ul>`;
        features.forEach(item => {
            formatted += `<li>${item}</li>`;
        });
        formatted += `</ul>`;
    }

    if (careText.trim()) {
        const care = careText
            .split(/\s-\s/)
            .map(item => item.trim())
            .filter(Boolean);

        formatted += `<h4>Care Instructions:</h4><ul>`;
        care.forEach(item => {
            formatted += `<li>${item}</li>`;
        });
        formatted += `</ul>`;
    }

    return formatted;
}

async function loadProductDetails() {
    const detailName = document.getElementById("detail-name");
    const detailImage = document.getElementById("detail-image");
    const detailPrice = document.getElementById("detail-price");
    const detailDescription = document.getElementById("detail-description");

    if (!detailName || !detailImage || !detailPrice || !detailDescription) {
        return;
    }

    const params = new URLSearchParams(window.location.search);
    const productId = parseInt(params.get("id"), 10);

    if (!productId) {
        detailName.textContent = "Product not found";
        detailDescription.textContent = "No product ID was provided.";
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/products/${productId}`);

        if (!response.ok) {
            throw new Error("Product not found");
        }

        const product = await response.json();
        selectedProduct = product;

        detailImage.src = product.image;
        detailImage.alt = product.name;
        detailName.textContent = product.name;
        detailPrice.textContent = `$${product.price}`;

        const descriptionText = String(product.description || "");

       detailDescription.innerHTML = formatDescription(product.description);

        renderStockStatus(product);
        renderProductThumbnails(product);
        setupProductButtons();

    } catch (error) {
        console.error("Error loading product details:", error);
        detailName.textContent = "Product not found";
        detailDescription.textContent = "We could not load this product right now.";
    }
}

loadProductDetails();

// ------------------------------
// Featured Product Add-to-Cart
// ------------------------------
const featuredCartButtons = document.querySelectorAll("#featured-products .pro .cart-button");

if (featuredCartButtons.length > 0) {
    featuredCartButtons.forEach((button) => {
        button.addEventListener("click", async function (event) {
            event.stopPropagation();

            const card = this.closest(".pro");
            if (!card) return;

            const productId = parseInt(card.dataset.id, 10);
            if (!productId) return;

            try {
                const response = await fetch(`${API_BASE_URL}/products/${productId}`);

                if (!response.ok) {
                    throw new Error("Product not found");
                }

                const product = await response.json();
                addToCart(product, 1);
            } catch (error) {
                console.error("Error adding featured product to cart:", error);
            }
        });
    });
}
