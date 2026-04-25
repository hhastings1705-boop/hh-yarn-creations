// ========================================
// Shop Page React App
// Handles:
// - Fetching products from backend
// - Filtering by category
// - Displaying product cards
// ========================================

const { useEffect, useMemo, useState } = React;

// Base API URL (easy to update later)
const API_BASE_URL = "http://localhost:3000";

// Get products from backend
async function fetchProducts() {
    const response = await fetch(`${API_BASE_URL}/products`);
    return await response.json();
}

// Main Shop Component
function ShopApp() {
    const [products, setProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [loading, setLoading] = useState(true);

    // Load products on page load
    useEffect(() => {
        async function loadProducts() {
            try {
                const data = await fetchProducts();
                setProducts(data);
            } catch (error) {
                console.error("Error loading products:", error);
            } finally {
                setLoading(false);
            }
        }

        loadProducts();
    }, []);

    // Filter products by category
    const filteredProducts = useMemo(() => {
        return selectedCategory === "All"
            ? products
            : products.filter(p => p.category === selectedCategory);
    }, [selectedCategory, products]);

    if (loading) return <p>Loading...</p>;

    return (
        <>
            <ProductList items={filteredProducts} />
        </>
    );
}