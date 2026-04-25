// ========================================
// Node.js Backend (Express + MySQL)
// Handles:
// - Fetching all products
// - Fetching a single product
// ========================================

const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

// Enable middleware
app.use(cors());
app.use(express.json());

// Connect to database
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

// Confirm DB connection
db.connect(err => {
    if (err) {
        console.error("Database error:", err);
        return;
    }
    console.log("Connected to MySQL");
});

// Get all products
app.get("/products", (req, res) => {
    db.query("SELECT * FROM products", (err, results) => {
        if (err) return res.status(500).json({ error: "Server error" });

        res.json(results);
    });
});

// Get single product by ID
app.get("/products/:id", (req, res) => {
    const id = req.params.id;

    db.query("SELECT * FROM products WHERE id = ?", [id], (err, results) => {
        if (err) return res.status(500).json({ error: "Server error" });
        if (results.length === 0) return res.status(404).json({ error: "Not found" });

        res.json(results[0]);
    });
});

// Start server
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});