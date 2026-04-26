// ========================================
// Shop Page React App
// Handles:
// - Fetching products from backend
// - Filtering by category
// - Displaying product cards
// - Adding products to cart
// ========================================

const { useEffect, useMemo, useState } = React;

const API_BASE_URL = "https://hh-yarn-api.onrender.com";

// ------------------------------
// Cart Helpers
// ------------------------------

function getStoredCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveStoredCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function updateNavbarCartCounts(cart) {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

    const desktopCount = document.getElementById("cart-count");
    const mobileCount = document.getElementById("mobile-cart-count");

    if (desktopCount) desktopCount.textContent = totalItems;
    if (mobileCount) mobileCount.textContent = totalItems;
}

function addProductToCart(product, quantity = 1) {
    const cart = getStoredCart();
    const existingItem = cart.find((item) => item.id === product.id);

    if (product.stock <= 0) {
        alert("Sorry, this item is currently out of stock.");
        return;
    }

    if (existingItem) {
        if (existingItem.quantity + quantity > product.stock) {
            alert(`Only ${product.stock} available.`);
            return;
        }

        existingItem.quantity += quantity;
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

    saveStoredCart(cart);
    updateNavbarCartCounts(cart);
}

// ------------------------------
// Stock Helpers
// ------------------------------

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
// Product Components
// ------------------------------

function FilterButtons({ selectedCategory, onSelectCategory }) {
    const categories = ["All", "Bag", "Headband", "Beanie", "Gloves"];

    return (
        <div id="filter-buttons" className="section-p1">
            {categories.map((category) => (
                <button
                    key={category}
                    type="button"
                    className={`filter-btn ${selectedCategory === category ? "active-filter" : ""}`}
                    onClick={() => onSelectCategory(category)}
                >
                    {category === "All" ? "All" : `${category}${category === "Gloves" ? "" : "s"}`}
                </button>
            ))}
        </div>
    );
}

function ProductCard({ product }) {
    function handleCardClick() {
        window.location.href = `product.html?id=${product.id}`;
    }

    function handleAddToCart(event) {
        event.stopPropagation();
        addProductToCart(product, 1);
    }

    function handleKeyDown(event) {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            handleCardClick();
        }
    }

    return (
        <div
            className="pro"
            onClick={handleCardClick}
            onKeyDown={handleKeyDown}
            tabIndex="0"
            role="button"
            aria-label={`View details for ${product.name}`}
        >
            <img src={product.image} alt={product.name} loading="lazy" />

            <div className="des">
                <span>{product.category}</span>
                <h5>{product.name}</h5>

                <div className="star" aria-hidden="true">
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                </div>

                <h4>${product.price}</h4>

                <p className={`stock-message ${getStockClass(product.stock)}`}>
                    {getStockText(product.stock)}
                </p>
            </div>

            <button
                type="button"
                className="cart-button"
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                aria-label={`Add ${product.name} to cart`}
            >
                <i className="fa-solid fa-cart-shopping cart" aria-hidden="true"></i>
            </button>
        </div>
    );
}

function ProductList({ items }) {
    if (items.length === 0) {
        return <p className="no-products-message">No products found.</p>;
    }

    return (
        <div className="pro-container">
            {items.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
}

// ------------------------------
// Main Shop App
// ------------------------------

function ShopApp() {
    const [products, setProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadProducts() {
            try {
                const response = await fetch(`${API_BASE_URL}/products`);
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error("Error loading products:", error);
            } finally {
                setLoading(false);
            }
        }

        loadProducts();
    }, []);

    const filteredProducts = useMemo(() => {
        return selectedCategory === "All"
            ? products
            : products.filter((product) => product.category === selectedCategory);
    }, [selectedCategory, products]);

    if (loading) {
        return <p>Loading products...</p>;
    }

    return (
        <>
            <FilterButtons
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
            />

            <ProductList items={filteredProducts} />
        </>
    );
}

// ------------------------------
// Render React App
// ------------------------------

const shopRootElement = document.getElementById("react-shop");

if (shopRootElement) {
    updateNavbarCartCounts(getStoredCart());

    const root = ReactDOM.createRoot(shopRootElement);
    root.render(<ShopApp />);
}
