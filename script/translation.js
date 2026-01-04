// Project name: iomdin.com
// Started on: 20.08.2025
// by @mishaiomdin


// translation.js
// Handles the language selection and translation of the website


window.onload = function () {
    const savedLanguage = localStorage.getItem('language') || 'en';
    document.getElementById("languageSelector").value = savedLanguage;
    changeLanguage();
};

/* Language choice */
async function changeLanguage() {
    const lang = document.getElementById("languageSelector").value;
    localStorage.setItem("language", lang); // Save selected language

    try {
        const response = await fetch('translations.json');
        const translations = await response.json();

        if (!translations[lang]) {
            console.error("Language not found:", lang);
            return;
        }

        // Apply translations dynamically
        Object.entries(translations[lang]).forEach(([key, value]) => {
            const element = document.getElementById(key);
            if (element) {
                const textNode = Array.from(element.childNodes).find(node => node.nodeType === Node.TEXT_NODE);
                if (textNode) {
                    textNode.nodeValue = value;
                } else {
                    element.insertBefore(document.createTextNode(value), element.firstChild);
                }
            }
        });

        // Handle direction/alignment for Hebrew
        if (lang === "he") {
            document.body.classList.add("rtl");
        } else {
            document.body.classList.remove("rtl");
        }

    } catch (error) {
        console.error("Error loading translations:", error);
    }
};
