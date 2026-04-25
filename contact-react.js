// ========================================
// Contact Form Component
// Handles:
// - Form state
// - Validation
// - Sending data to PHP backend
// ========================================

const { useState } = React;

function ContactForm() {
    // Form input state
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });

    // Error messages
    const [errors, setErrors] = useState({});

    // Success message
    const [successMessage, setSuccessMessage] = useState("");

    // Loading state
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Handle input changes
    function handleChange(event) {
        const { name, value } = event.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when typing
        setErrors(prev => ({
            ...prev,
            [name]: ""
        }));
    }

    // Validate form fields
    function validateForm() {
        const newErrors = {};

        if (!formData.name.trim()) newErrors.name = "Name required";
        if (!formData.email.trim()) newErrors.email = "Email required";
        if (!formData.subject.trim()) newErrors.subject = "Subject required";
        if (!formData.message.trim()) newErrors.message = "Message required";

        return newErrors;
    }

    // Submit form
    async function handleSubmit(event) {
        event.preventDefault();

        const newErrors = validateForm();

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch("contact-submit.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: new URLSearchParams(formData)
            });

            const data = await response.json();

            setSuccessMessage(data.message);
        } catch {
            setSuccessMessage("Error sending message.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <h2>Get in Touch</h2>
        </form>
    );
}