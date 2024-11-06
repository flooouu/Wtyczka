// content.js

// Obecnie nie ma funkcji przeszukiwania linków na stronie

// Nasłuchiwanie na wiadomości z popupu (jeśli jest potrzebne)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "checkLink") {
        // Możesz dodać logikę do sprawdzania linków tutaj, jeśli będzie to konieczne
        sendResponse({ status: "checked" });
    }
    
    return true; 
});
