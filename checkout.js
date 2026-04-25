// ========================================
// HH Yarn Creations - Checkout Script
// Handles:
// - Displaying checkout cart items
// - Calculating totals
// - Saving customer checkout info
// - Redirecting users to Etsy
// ========================================

function getCheckoutCart() {
    // Gets the saved cart from localStorage or returns an empty cart.
    return JSON.parse(localStorage.getItem("cart")) || [];
}

function getPriceNumber(priceString) {
    // Converts a price string like "$20.00" into a number.
    return parseFloat(String(priceString).replace("$", "")) || 0;
}

function updateCheckoutCartCount(cart) {
    // Updates the desktop and mobile cart icon counts.
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

    const cartCount = document.getElementById("cart-count");
    const mobileCartCount = document.getElementById("mobile-cart-count");

    if (cartCount) {
        cartCount.textContent = totalItems;
    }

    if (mobileCartCount) {
        mobileCartCount.textContent = totalItems;
    }
}

function renderCheckout() {
    // Displays cart items and totals on the checkout page.
    const cart = getCheckoutCart();

    const checkoutItems = document.getElementById("checkout-items");
    const totalItemsElement = document.getElementById("checkout-total-items");
    const totalPriceElement = document.getElementById("checkout-total-price");

    updateCheckoutCartCount(cart);

    if (!checkoutItems || !totalItemsElement || !totalPriceElement) return;

    if (cart.length === 0) {
        checkoutItems.innerHTML = `
            <p>Your cart is empty.</p>
            <a href="shop.html" class="checkout-link">Continue Shopping</a>
        `;

        totalItemsElement.textContent = "0";
        totalPriceElement.textContent = "$0.00";
        return;
    }

    checkoutItems.innerHTML = cart.map((item) => {
        const itemTotal = getPriceNumber(item.price) * item.quantity;

        return `
            <div class="checkout-item">
                <img src="${item.image}" alt="${item.name}">
                <div>
                    <h3>${item.name}</h3>
                    <p>Price: ${item.price}</p>
                    <p>Quantity: ${item.quantity}</p>
                    <p>Item Total: $${itemTotal.toFixed(2)}</p>
                </div>
            </div>
        `;
    }).join("");

    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    const totalPrice = cart.reduce((total, item) => {
        return total + getPriceNumber(item.price) * item.quantity;
    }, 0);

    totalItemsElement.textContent = totalItems;
    totalPriceElement.textContent = `$${totalPrice.toFixed(2)}`;
}

function handleCheckoutSubmit(event) {
    // Validates checkout form and redirects user to Etsy.
    event.preventDefault();

    const cart = getCheckoutCart();
    const message = document.getElementById("checkout-message");

    if (cart.length === 0) {
        message.textContent = "Your cart is empty. Please add items before checking out.";
        return;
    }

    const name = document.getElementById("checkout-name").value.trim();
    const email = document.getElementById("checkout-email").value.trim();

    if (!name || !email) {
        message.textContent = "Please enter your name and email.";
        return;
    }

    localStorage.setItem("checkoutCustomer", JSON.stringify({
        name,
        email,
        notes: document.getElementById("checkout-notes").value.trim(),
        cart
    }));

    window.location.href = "https://hhyarncreations.etsy.com";
}

// Connect checkout form to submit function.
const checkoutForm = document.getElementById("checkout-form");

if (checkoutForm) {
    checkoutForm.addEventListener("submit", handleCheckoutSubmit);
}

// Load checkout content when page opens.
renderCheckout();