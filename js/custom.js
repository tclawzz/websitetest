/*

Custom script

This file will not be overwritten by the updater

*/

let allGames = []; // Store all games for searching

// JavaScript code
function search_games() {
    let input = document.getElementById("searchInput").value;
    input = input.toLowerCase();
    let gameItems = document.getElementsByClassName("game-item");
    
    if (input === '') {
        // If search is empty, show all games
        for (let i = 0; i < gameItems.length; i++) {
            gameItems[i].parentElement.parentElement.style.display = "block";
        }
        return;
    }

    let foundResults = false;
    
    for (let i = 0; i < gameItems.length; i++) {
        const gameTitle = gameItems[i].querySelector('.list-thumbnail img').alt.toLowerCase();
        if (!gameTitle.includes(input)) {
            gameItems[i].parentElement.parentElement.style.display = "none";
        } else {
            gameItems[i].parentElement.parentElement.style.display = "block";
            foundResults = true;
        }
    }

    // Show "no results" message if needed
    const noResultsElement = document.getElementById("noResultsMessage");
    if (!foundResults) {
        if (!noResultsElement) {
            const noResultsHtml = `<div class="col-12 text-center py-5" id="noResultsMessage"><h4>No games found matching "${input}"</h4></div>`;
            document.getElementById('listgame').insertAdjacentHTML('beforeend', noResultsHtml);
        } else {
            noResultsElement.querySelector('h4').textContent = `No games found matching "${input}"`;
            noResultsElement.style.display = "block";
        }
    } else if (noResultsElement) {
        noResultsElement.style.display = "none";
    }
}

function sortByOrder(games) {
    return games.sort((a, b) => b.order - a.order);
}

/* Lấy thông tin về game trong file data hiển thị */
function loadAllGame(dataJson) {
    fetch(dataJson, {
        headers: {
            'Content-Type': 'application/json',
        },
    }).then(response => response.json())
    .then(data => {
        allGames = sortByOrder(data);
        const listgameElement = document.getElementById('listgame');
        listgameElement.innerHTML = ''; // Clear previous content
        
        for (let j = allGames.length - 1; j >= 0; j--) {
            const item = allGames[j];
            const img = "/images/logo/" + item.img;
            const slug = item.slug + ".html";
            const title = item.title;
            const htmlItem = `
                <div class="col-lg-2 col-md-4 col-6 grid-3">
                    <a href="${slug}">
                        <div class="game-item">
                            <div class="list-game">
                                <div class="list-thumbnail"><img src="${img}" class="lazyload" alt="${title}"></div>
                            </div>
                        </div>
                    </a>
                </div>
            `;
            listgameElement.insertAdjacentHTML('beforeend', htmlItem);
        }

        // Initialize search event listeners after games are loaded
        document.getElementById('searchButton').addEventListener('click', search_games);
        document.getElementById('searchInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                search_games();
            }
        });
    });
}

window.addEventListener('load', function() {
    loadAllGame("/game/all.json");
});