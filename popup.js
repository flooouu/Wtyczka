document.addEventListener('DOMContentLoaded', () => {
    // Obsługuje dodawanie linku
    document.getElementById('addLink').addEventListener('click', async () => {
        const url = document.getElementById('url').value;
        const status = document.getElementById('status').value;

        try {
            const response = await fetch('https://addlink-z7s7pe3uva-uc.a.run.app', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ url, status })
            });

            if (!response.ok) {
                throw new Error('Błąd podczas dodawania linku');
            }

            const result = await response.text();
            alert(result);
        } catch (error) {
            console.error('Błąd:', error);
            alert('Wystąpił błąd podczas dodawania linku: ' + error.message);
        }
    });

    // Obsługuje sprawdzanie linku
    document.getElementById('checkLink').addEventListener('click', async () => {
        const url = document.getElementById('checkUrl').value;

        try {
            const response = await fetch(`https://checklink-z7s7pe3uva-uc.a.run.app?url=${encodeURIComponent(url)}`);
            
            if (response.ok) {
                const data = await response.json();
                document.getElementById('checkResult').innerText = `Status: ${data.status}`;
            } else {
                const result = await response.text();
                document.getElementById('checkResult').innerText = result;
            }
        } catch (error) {
            console.error('Błąd:', error);
            document.getElementById('checkResult').innerText = 'Wystąpił błąd: ' + error.message;
        }
    });

    // Funkcja do pobierania linków z bazy danych
    async function fetchLinks() {
        try {
            const response = await fetch('https://getlinks-z7s7pe3uva-uc.a.run.app'); // Zastąp to rzeczywistym URL
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const links = await response.json();
            displayLinks(links);
        } catch (error) {
            console.error('Failed to fetch links:', error);
        }
    }

    // Funkcja do wyświetlania linków
    function displayLinks(links) {
        const linkContainer = document.getElementById('linkContainer'); // Zakładając, że masz element, aby wyświetlić linki
        linkContainer.innerHTML = ''; // Wyczyść istniejące linki

        links.forEach(link => {
            const linkElement = document.createElement('div');
            linkElement.innerText = link.url; // Ustaw URL jako tekst
            linkElement.style.color = link.status === 'dobry' ? 'green' : 'red'; // Ustaw kolor na podstawie statusu
            linkContainer.appendChild(linkElement);
        });
    }

    // Wywołaj fetchLinks podczas ładowania popupu
    fetchLinks();
});
