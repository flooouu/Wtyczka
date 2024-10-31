// content.js

// Funkcja, która podświetla linki na stronie
async function highlightLinks() {
    const response = await fetch('https://getlinks-z7s7pe3uva-uc.a.run.app'); 
    if (!response.ok) {
        console.error('Błąd podczas pobierania linków:', response.statusText);
        return;
    }

    const linksData = await response.json();
    console.log('Dane linków:', linksData); // Logowanie danych linków

    // Zapisz linki w obiekcie dla szybszego dostępu
    const linkStatusMap = {};
    linksData.forEach(link => {
        linkStatusMap[link.url] = link.status;
    });

    // Funkcja do podświetlania linków
    function applyHighlight() {
        const anchorTags = document.querySelectorAll('a'); // Wybierz wszystkie linki
        anchorTags.forEach(anchor => {
            const linkUrl = anchor.href;
            if (linkStatusMap[linkUrl]) {
                const status = linkStatusMap[linkUrl];
                // Dodaj klasy CSS do linków
                anchor.classList.add(status === 'dobry' ? 'highlight-good' : 'highlight-suspicious');
                console.log(`Podświetlono link: ${linkUrl} z status: ${status}`); // Logowanie podświetlanych linków

                // Dodatkowe efekty podświetlenia
                anchor.addEventListener('mouseover', () => {
                    anchor.style.opacity = '0.8';
                });

                anchor.addEventListener('mouseout', () => {
                    anchor.style.opacity = '1';
                });
            }
        });
    }

    // Naładuj podświetlanie przy pierwszym uruchomieniu
    applyHighlight();

    // Nasłuchiwanie na zmiany w DOM
    const observer = new MutationObserver(applyHighlight);
    observer.observe(document.body, { childList: true, subtree: true });
}

// Wywołanie funkcji
highlightLinks();