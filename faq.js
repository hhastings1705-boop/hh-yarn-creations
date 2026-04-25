// ========================================
// HH Yarn Creations - FAQ Script
// Handles:
// - Opening and closing FAQ accordion items
// - Making sure only one FAQ answer is open at a time
// ========================================

// Selects all FAQ question buttons.
const faqButtons = document.querySelectorAll(".faq-question");

faqButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const faqItem = button.parentElement;
        const isOpen = faqItem.classList.contains("active");

        // Close all FAQ items before opening a new one.
        document.querySelectorAll(".faq-item").forEach((item) => {
            item.classList.remove("active");
            item.querySelector(".faq-question span").textContent = "+";
        });

        // Open the clicked FAQ item if it was not already open.
        if (!isOpen) {
            faqItem.classList.add("active");
            button.querySelector("span").textContent = "−";
        }
    });
});