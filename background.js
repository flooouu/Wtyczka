// background.js

// Nasłuchiwanie na wiadomości z popupu
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "addLink") {
        // Tutaj możesz dodać logikę do komunikacji z Firebase
        // na przykład wywołać API do dodania linku
        console.log("Dodawanie linku:", request.data);
        // Send response if needed
        sendResponse({ status: "success" });
    }

    if (request.action === "checkLink") {
        // Tutaj możesz dodać logikę do komunikacji z Firebase
        console.log("Sprawdzanie linku:", request.url);
        // Send response if needed
        sendResponse({ status: "checked" });
    }

    // Wymaga asynchronicznego wywołania
    return true; 
});

// Dodaj inne funkcje, jeśli potrzebujesz, np. do zarządzania stanem lub innymi działaniami
