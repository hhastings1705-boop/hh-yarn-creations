// ========================================
// HH Yarn Creations - Cart React App
// Handles:
// - Displaying cart items
// - Updating item quantities
// - Removing items
// - Clearing the cart
// - Sending users to checkout
// ========================================

const { useEffect, useMemo, useState } = React;

function getStoredCart() {
    // Gets the saved cart from localStorage or returns an empty cart.
    return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveStoredCart(cart) {
    // Saves the current cart to localStorage.
    localStorage.setItem("cart", JSON.stringify(cart));
}

function getPriceNumber(priceString) {
    // Converts a price string into a number.
    return parseFloat(priceString.replace("$", ""));
}

function updateNavbarCartCounts(cart) {
    // Updates cart count in both desktop and mobile navigation.
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

    const desktopCount = document.getElementById("cart-count");
    const mobileCount = document.getElementById("mobile-cart-count");

    if (desktopCount) {
        desktopCount.textContent = totalItems;
    }

    if (mobileCount) {
        mobileCount.textContent = totalItems;
    }
}

function CartItem({ item, onQuantityChange, onRemove }) {
    // Displays one cart item with quantity and remove controls.
    return (
        <div className="cart-item">
            <img
                src={item.image}
                alt={item.name}
                className="cart-item-image"
                loading="lazy"
            />

            <div className="cart-item-details">
                <h4>{item.name}</h4>
                <p>Price: {item.price}</p>

                <div className="cart-item-actions">
                    <div className="quantity-group">
                        <label htmlFor={`quantity-${item.id}`}>Quantity:</label>
                        <input
                            id={`quantity-${item.id}`}
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) =>
                                onQuantityChange(item.id, parseInt(e.target.value, 10) || 1)
                            }
                        />
                    </div>

                    <button
                        type="button"
                        className="remove-item-btn"
                        onClick={() => onRemove(item.id)}
                    >
                        Remove
                    </button>
                </div>
            </div>
        </div>
    );
}

function CartSummary({ totalItems, totalPrice, onClearCart, onCheckout }) {
    // Displays total cart items, total price, and cart action buttons.
    return (
        <div className="cart-summary">
            <h3>Cart Summary</h3>
            <p>
                Total Items: <span>{totalItems}</span>
            </p>
            <p>
                Total Price: <span>${totalPrice.toFixed(2)}</span>
            </p>

            <div className="cart-summary-buttons">
                <button type="button" id="clear-cart-btn" onClick={onClearCart}>
                    Clear Cart
                </button>
                <button type="button" id="checkout-btn" onClick={onCheckout}>
                    Checkout
                </button>
            </div>
        </div>
    );
}

function EmptyCart() {
    // Message shown when there are no items in the cart.
    return <p className="empty-cart-message">Your cart is empty.</p>;
}

function CartApp() {
    // Main cart component.
    const [cart, setCart] = useState(getStoredCart());

    useEffect(() => {
        // Save cart and update cart count whenever cart changes.
        saveStoredCart(cart);
        updateNavbarCartCounts(cart);
    }, [cart]);

    function handleQuantityChange(productId, newQuantity) {
        if (newQuantity <= 0) {
            handleRemove(productId);
            return;
        }

        setCart((prevCart) =>
            prevCart.map((item) =>
                item.id === productId
                    ? { ...item, quantity: newQuantity }
                    : item
            )
        );
    }

    function handleRemove(productId) {
        setCart((prevCart) =>
            prevCart.filter((item) => item.id !== productId)
        );
    }

    function handleClearCart() {
        setCart([]);
    }

    function handleCheckout() {
        window.location.href = "checkout.html";
    }

    const totalItems = useMemo(() => {
        return cart.reduce((total, item) => total + item.quantity, 0);
    }, [cart]);

    const totalPrice = useMemo(() => {
        return cart.reduce((total, item) => {
            return total + getPriceNumber(item.price) * item.quantity;
        }, 0);
    }, [cart]);

    return (
        <>
            {cart.length === 0 ? (
                <EmptyCart />
            ) : (
                <>
                    <div>
                        {cart.map((item) => (
                            <CartItem
                                key={item.id}
                                item={item}
                                onQuantityChange={handleQuantityChange}
                                onRemove={handleRemove}
                            />
                        ))}
                    </div>

                    <CartSummary
                        totalItems={totalItems}
                        totalPrice={totalPrice}
                        onClearCart={handleClearCart}
                        onCheckout={handleCheckout}
                    />
                </>
            )}
        </>
    );
}

// Mount React cart app only if the cart page root exists.
const cartRootElement = document.getElementById("react-cart");

if (cartRootElement) {
    updateNavbarCartCounts(getStoredCart());
    const root = ReactDOM.createRoot(cartRootElement);
    root.render(<CartApp />);
}