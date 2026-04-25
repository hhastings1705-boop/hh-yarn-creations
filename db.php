<?php
// ========================================
// HH Yarn Creations - Database Connection
// Handles:
// - Connecting PHP files to the MySQL database
// - Returning an error message if the connection fails
// ========================================

// Sends PHP responses as JSON.
header("Content-Type: application/json");

// Turns off automatic MySQL error reporting so errors can be handled manually.
mysqli_report(MYSQLI_REPORT_OFF);

// Database connection settings.
$host = "127.0.0.1";
$username = "root";
$password = "Hhastings1705";
$database = "hh_yarn_creations";

// Connect to the MySQL database.
$conn = @mysqli_connect($host, $username, $password, $database);

// Stop the script if the database connection fails.
if (!$conn) {
    echo json_encode([
        "success" => false,
        "message" => "Database connection failed: " . mysqli_connect_error()
    ]);
    exit;
}
?>