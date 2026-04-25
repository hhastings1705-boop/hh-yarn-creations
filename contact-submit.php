<?php
// ========================================
// HH Yarn Creations - Contact Form Submit
// Handles:
// - Receiving contact form data
// - Validating required fields
// - Saving messages to the MySQL database
// - Returning a JSON success or error response
// ========================================

// Sends PHP responses as JSON.
header("Content-Type: application/json");

// Includes the database connection.
include __DIR__ . "/db.php";

// Get and clean form values.
$name = trim($_POST["name"] ?? "");
$email = trim($_POST["email"] ?? "");
$subject = trim($_POST["subject"] ?? "");
$message = trim($_POST["message"] ?? "");

// Validate that all fields are filled in.
if ($name === "" || $email === "" || $subject === "" || $message === "") {
    echo json_encode([
        "success" => false,
        "message" => "All fields are required."
    ]);
    exit;
}

// Prepare SQL statement to safely insert the message.
$stmt = mysqli_prepare(
    $conn,
    "INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)"
);

// Stop if the SQL statement cannot be prepared.
if (!$stmt) {
    echo json_encode([
        "success" => false,
        "message" => "Prepare failed: " . mysqli_error($conn)
    ]);
    exit;
}

// Bind form values to the SQL statement.
mysqli_stmt_bind_param($stmt, "ssss", $name, $email, $subject, $message);

// Run the query and return a response.
if (mysqli_stmt_execute($stmt)) {
    echo json_encode([
        "success" => true,
        "message" => "Message sent successfully!"
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Execute failed: " . mysqli_stmt_error($stmt)
    ]);
}

// Close the statement and database connection.
mysqli_stmt_close($stmt);
mysqli_close($conn);
?>