function formatDescription(description) {
    const text = String(description || "");

    const sections = text.split(/(?=Features:|Dimensions:|Care Instructions:)/i);
    let formatted = "";

    sections.forEach(section => {
        const trimmed = section.trim();

        if (!trimmed) return;

        if (/^Features:/i.test(trimmed)) {
            formatted += "<h4>Features:</h4><ul>";
            trimmed
                .replace(/^Features:/i, "")
                .split(" - ")
                .map(item => item.trim())
                .filter(Boolean)
                .forEach(item => formatted += `<li>${item}</li>`);
            formatted += "</ul>";
        } else if (/^Dimensions:/i.test(trimmed)) {
            formatted += "<h4>Dimensions:</h4><ul>";
            trimmed
                .replace(/^Dimensions:/i, "")
                .split(" - ")
                .map(item => item.trim())
                .filter(Boolean)
                .forEach(item => formatted += `<li>${item}</li>`);
            formatted += "</ul>";
        } else if (/^Care Instructions:/i.test(trimmed)) {
            formatted += "<h4>Care Instructions:</h4><ul>";
            trimmed
                .replace(/^Care Instructions:/i, "")
                .split(" - ")
                .map(item => item.trim())
                .filter(Boolean)
                .forEach(item => formatted += `<li>${item}</li>`);
            formatted += "</ul>";
        } else {
            formatted += trimmed
                .split(/(?<=\.)\s+/)
                .map(sentence => `<p>${sentence}</p>`)
                .join("");
        }
    });

    return formatted;
}
