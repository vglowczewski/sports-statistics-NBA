const gameCardsSection = document.getElementById('gameCards');

const urlParams = new URLSearchParams(window.location.search);
const teamName = urlParams.get('name');
document.getElementById('teamName').innerText = teamName;

//Get ALL the data from local storage
let data = JSON.parse(localStorage.getItem('scoreData')) || [];
//Find games that include the current team's name
let filteredData = data.filter((game) => game.team1 === teamName || game.team2 === teamName);

//Function to build the individual cards
function displayGames(games) {
    games.forEach((game) => {
        const card = document.createElement('div');
        card.className = 'card';

        const header = document.createElement('header');
        header.className = 'card-header';

        const headerTitle = document.createElement('p');
        headerTitle.className = 'card-header-title';
        headerTitle.innerText = `${game.team1} vs ${game.team2}`;

        header.appendChild(headerTitle);
        card.appendChild(header);

        const cardContent = document.createElement('div');
        cardContent.className = 'card-content';
        cardContent.style.padding = '20px'; // Adding padding to the card

        const content = document.createElement('div');
        content.className = 'content';
        content.innerHTML = `
            <p>${game.team1}: ${game.team1Score} - ${game.team2}: ${game.team2Score}</p>
            <p>Date: ${game.date}</p>
        `;

        cardContent.appendChild(content);
        card.appendChild(cardContent);

        gameCardsSection.appendChild(card);
    });
}

  //Display all of the team's games
  displayGames(filteredData);


 //To get Hamburger Menu
 document.addEventListener('DOMContentLoaded', () => {

    // Get all "navbar-burger" elements
    const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);
  
    // Add a click event on each of them
    $navbarBurgers.forEach( el => {
      el.addEventListener('click', () => {
  
        // Get the target from the "data-target" attribute
        const target = el.dataset.target;
        const $target = document.getElementById(target);
  
        // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
        el.classList.toggle('is-active');
        $target.classList.toggle('is-active');
  
      });
    });
  
  });