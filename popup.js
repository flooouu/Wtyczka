document.addEventListener('DOMContentLoaded', () => {

    // Funkcja usuwająca duplikaty linków
    function removeDuplicates(links) {
        const uniqueLinks = Array.from(new Set(links.map(link => link.url)))
                                  .map(url => links.find(link => link.url === url));
        return uniqueLinks;
    }

    // Funkcja analizująca linki
    function analyzeLink(url) {
        const suspiciousWords = [
            "access", "auth", "login", "password", "secure", "confirmation", "update",
            "finance", "account", "validation", "authentication", "token", "dashboard",
            "invoice", "subscription", "transaction", "profile", "support", "email"
        ];
    
        const suspiciousExtensions = [
            ".pro", ".co", ".cc", ".xyz", ".live", ".info", ".top", ".shop", ".site"
        ];
    
        for (const word of suspiciousWords) {
            if (url.toLowerCase().includes(word)) {
                return 'potencjalnie podejrzany';
            }
        }
    
        for (const ext of suspiciousExtensions) {
            if (url.toLowerCase().endsWith(ext)) {
                return 'potencjalnie podejrzany';
            }
        }
    
        const suspiciousPattern = /[-]{2,}|[\d]{4,}/;  
        if (suspiciousPattern.test(url)) {
            return 'potencjalnie podejrzany';
        }
    
        return 'potencjalnie dobry';
    }

    // Funkcja do pobierania linków z bazy danych
    async function fetchLinks() {
        try {
            const response = await fetch('https://getlinks-z7s7pe3uva-uc.a.run.app'); 
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const links = await response.json();
            
            // Usuwanie duplikatów przed sortowaniem
            const uniqueLinks = removeDuplicates(links);
            displayLinks(uniqueLinks);
        } catch (error) {
            console.error('Failed to fetch links:', error);
        }
    }

    // Funkcja do wyświetlania linków
    function displayLinks(links) {
        const linkContainer = document.getElementById('linkContainer');
        linkContainer.innerHTML = ''; // Wyczyść istniejące linki

        links.forEach(link => {
            const linkElement = document.createElement('div');
            linkElement.innerText = link.url;
            linkElement.style.color = link.status === 'dobry' ? 'green' : 'red'; // Status kolorystyki
            linkContainer.appendChild(linkElement);
        });
    }

    // Obsługuje dodawanie linku
    document.getElementById('addLink').addEventListener('click', async () => {
        const url = document.getElementById('url').value.trim();
        const status = document.getElementById('status').value;

        if (!url || !status) {
            alert('Proszę podać URL i status linku!');
            return;
        }

        try {
            const response = await fetch('https://addlink-z7s7pe3uva-uc.a.run.app', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ url, status })
            });

            if (response.ok) {
                const result = await response.text();
                alert(result);
                fetchLinks(); // Odśwież linki po dodaniu
            } else {
                const errorMessage = await response.text();
                alert(errorMessage);
            }
        } catch (error) {
            console.error('Błąd:', error);
            alert('Wystąpił błąd podczas dodawania linku: ' + error.message);
        }
    });

    // Obsługuje sprawdzanie linku
    document.getElementById('checkLink').addEventListener('click', async () => {
        let url = document.getElementById('checkUrl').value.trim();

        // Sprawdzenie prefiksu
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            if (url.startsWith('www.')) {
                url = 'http://' + url; 
            } else {
                url = 'http://' + url; 
            }
        }

        try {
            const response = await fetch(`https://checklink-z7s7pe3uva-uc.a.run.app?url=${encodeURIComponent(url)}`);
            
            if (response.ok) {
                const data = await response.json();
                document.getElementById('checkResult').innerText = `Status: ${data.status}`;
            } else {
                const result = await response.text();
                
                if (result === "Link not found!") {
                    const analysisResult = analyzeLink(url);
                    document.getElementById('checkResult').innerText = 
                        `Nie ma go w bazie danych, ale jest ${analysisResult}.`;
                } else {
                    document.getElementById('checkResult').innerText = result;
                }
            }
            
            document.getElementById('checkResult').style.display = 'block'; // Pokaż wynik
        } catch (error) {
            console.error('Błąd:', error);
            document.getElementById('checkResult').innerText = 'Wystąpił błąd: ' + error.message;
            document.getElementById('checkResult').style.display = 'block'; // Pokaż wynik
        }
    });

    // Sortowanie linków
    document.getElementById('sortOptions').addEventListener('change', () => {
        const sortBy = document.getElementById('sortOptions').value;
        
        fetch('https://getlinks-z7s7pe3uva-uc.a.run.app')
            .then(response => response.json())
            .then(links => {
                let sortedLinks;
                if (sortBy === 'status') {
                    sortedLinks = links.sort((a, b) => a.status.localeCompare(b.status));  // Sortowanie według statusu
                } else if (sortBy === 'date') {
                    sortedLinks = links.sort((a, b) => new Date(b.date) - new Date(a.date));  // Sortowanie według daty
                } else {
                    sortedLinks = links;
                }

                // Usuwamy duplikaty przed wyświetleniem
                const uniqueSortedLinks = removeDuplicates(sortedLinks);
                displayLinks(uniqueSortedLinks);
            })
            .catch(error => {
                console.error('Error fetching or sorting links:', error);
            });
    });

    // Inicjalizacja - pobieranie linków po załadowaniu strony
    fetchLinks();
});
