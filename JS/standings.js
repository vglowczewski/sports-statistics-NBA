 // Get the form and list elements
 const standings = document.getElementById('standings');
 const league = document.getElementById('league');
 const division = document.getElementById('division');

 // Check if local storage has existing scores
 let scoreData = JSON.parse(localStorage.getItem('scoreData')) || [];

 //Get the proper standings from scoreData
 function getStandings(){
     let data = JSON.parse(localStorage.getItem('scoreData')) || [];
     const wins = {};
     const losses = {};
     const played = {};
     const wpercentage = {};
     data.forEach((game) => {
         //add the game played to total played
         if(played[game.team1]){
                 played[game.team1] += 1;
         }   else {
                 played[game.team1] = 1;
         }
         if(played[game.team2]){
                 played[game.team2] += 1;
         }   else {
                 played[game.team2] = 1;
         }
         //add team1 win and team2 loss
         if(game.team1Score > game.team2Score){
             if(wins[game.team1]){
                 wins[game.team1] += 1;
             } 
             else {
                 wins[game.team1] = 1;
             }
             if(losses[game.team2]){
                 losses[game.team2] += 1;
             }
             else {
                 losses[game.team2] = 1;
             }
         }
         //add team2 win and team1 loss
         if(game.team2Score > game.team1Score){
             if(wins[game.team2]){
                 wins[game.team2] += 1;
             } 
             else {
                 wins[game.team2] = 1;
             }
             if(losses[game.team1]){
                 losses[game.team1] += 1;
             }
             else {
                 losses[game.team1] = 1;
             }
         }
         //compute win percentage for team1 if they have won games
         if(wins[game.team1]){
             wpercentage[game.team1] = (wins[game.team1]/played[game.team1]).toFixed(3)*100; //round to 3
         } else {
             wpercentage[game.team1] = 0;
         }

         //compute win percentage for team2 if they have won games
         if(wins[game.team2]){
             wpercentage[game.team2] = (wins[game.team2]/played[game.team2]).toFixed(3)*100; //round to 3
         } else {
             wpercentage[game.team2] = 0;
         }

     })

     //array of all teams
     const teams = [
         {name: "Celtics", division: "East"},
         {name: "Magic", division: "East"},
         {name: "Bucks", division: "East"},
         {name: "76ers", division: "East"},
         {name: "Heat", division: "East"},
         {name: "Knicks", division: "East"},
         {name: "Pacers", division: "East"},
         {name: "Cavaliers", division: "East"},
         {name: "Hawks", division: "East"},
         {name: "Raptors", division: "East"},
         {name: "Timberwolves", division: "West"},
         {name: "Thunder", division: "West"},
         {name: "Mavericks", division: "West"},
         {name: "Suns", division: "West"},
         {name: "Nuggets", division: "West"},
         {name: "Warriors", division: "West"},
         {name: "Lakers", division: "West"},
         {name: "Pelicans", division: "West"},
         {name: "Clippers", division: "West"},
         {name: "Grizzlies", division: "West"},
         ];
    
    //set the key-value pairs for each team
     const teamData = teams.map((team, index) =>{
         return {
             name: team.name,
             wins: wins[team.name] || 0,
             losses: losses[team.name] || 0,
             wpercentage: wpercentage[team.name] || 0,
             played: played[team.name] || 0,
             division: team.division,
             rank: 0,
             divRank: 0,
         }
     })
     //Call functions to determine value for rank and divRank
     setLeagueRanks(teamData);
     setDivisionRanks(teamData);
     return teamData;
 }

 //Find which conference the header corresponds to
 function determineConference(element) {
     let conference = 'League'; // Default value if not specific to a conference

     // Check if the clicked header is within a specific conference table
     const parentTable = element.closest('table');
     if (parentTable) {
         if (parentTable.id === 'eastStandings') {
             conference = 'East';
         } else if (parentTable.id === 'westStandings') {
             conference = 'West';
         }
     }
     return conference;
 }

 //Add event listeners to the headers
 function addSortListeners() {
     const headers = document.querySelectorAll('th');

     headers.forEach(header => {
         header.addEventListener('click', () => {
             const conference = determineConference(header);
             const attribute = header.getAttribute('sorted-order');
             headers.forEach(otherHeader => {
                 // Reset sorting order for other columns
                 if (otherHeader !== header) {
                     otherHeader.removeAttribute('sorted-order');
                 }
             });
             sortByColumn(header.id, conference);
         });
     });
 }

// Function to sort the league standings by a specific column
function sortByColumn(column, conference) {
 let teamData;

 if (conference === 'East') {
     teamData = getStandings().filter(team => team.division === 'East');
 } else if (conference === 'West') {
     teamData = getStandings().filter(team => team.division === 'West');
 } else {
     teamData = getStandings();
 }

 const header = document.getElementById(column);
 let currentOrder;

 if (header.getAttribute('sorted-order')) {
     currentOrder = header.getAttribute('sorted-order');
 } else {
     currentOrder = 'desc';
 }

 // Toggle sorting order based on the current state
 let sortOrder;
 if (currentOrder === 'asc') {
     sortOrder = 'desc';
 } else {
     sortOrder = 'asc';
 }

 teamData.sort((a, b) => {
     if (column === 'wins') {
         return (a.wins - b.wins) * (sortOrder === 'asc' ? 1 : -1);
     } else if (column === 'losses') {
         return (a.losses - b.losses) * (sortOrder === 'asc' ? 1 : -1);
     } else if (column === 'wPercentage'){
         return (a.wpercentage - b.wpercentage) * (sortOrder === 'asc' ? -1 : 1);
     } else if (column === 'played'){
         return (a.played - b.played) * (sortOrder === 'asc' ? -1 : 1);
     } else if (column === 'teamName'){
         return a.name.localeCompare(b.name) * (sortOrder === 'asc' ? 1 : -1);
     } else if (column === 'division'){
         return a.division.localeCompare(b.division) * (sortOrder === 'asc' ? 1 : -1);
     } 
     if (column === 'winsWest') {
         return (a.wins - b.wins) * (sortOrder === 'asc' ? 1 : -1);
     } else if (column === 'lossesWest') {
         return (a.losses - b.losses) * (sortOrder === 'asc' ? 1 : -1);
     } else if (column === 'wPercentageWest'){
         return (a.wpercentage - b.wpercentage) * (sortOrder === 'asc' ? -1 : 1);
     } else if (column === 'playedWest'){
         return (a.played - b.played) * (sortOrder === 'asc' ? -1 : 1);
     } else if (column === 'teamNameWest'){
         return a.name.localeCompare(b.name) * (sortOrder === 'asc' ? 1 : -1);
     } else if (column === 'divisionWest'){
         return a.division.localeCompare(b.division) * (sortOrder === 'asc' ? 1 : -1);
     } 
     if (column === 'winsEast') {
         return (a.wins - b.wins) * (sortOrder === 'asc' ? 1 : -1);
     } else if (column === 'lossesEast') {
         return (a.losses - b.losses) * (sortOrder === 'asc' ? 1 : -1);
     } else if (column === 'wPercentageEast'){
         return (a.wpercentage - b.wpercentage) * (sortOrder === 'asc' ? -1 : 1);
     } else if (column === 'playedEast'){
         return (a.played - b.played) * (sortOrder === 'asc' ? -1 : 1);
     } else if (column === 'teamNameEast'){
         return a.name.localeCompare(b.name) * (sortOrder === 'asc' ? 1 : -1);
     } else if (column === 'divisionEast'){
         return a.division.localeCompare(b.division) * (sortOrder === 'asc' ? 1 : -1);
     } 
 });

 // Update the sorted-order attribute only for the clicked column
 header.setAttribute('sorted-order', sortOrder);

 // Repopulate the league standings table based on the sorted data
 populateLeagueStandings(teamData, conference);
}


//calculate team rank in the whole league
 function setLeagueRanks(teamData) {
     teamData.sort((a, b) => b.wpercentage - a.wpercentage);
     teamData.forEach((team, index) => {
         team.rank = index + 1;
     });
 }

//calculate team rank in the east/west division
 function setDivisionRanks(teamData) {
     const westTeams = teamData.filter(team => team.division === 'West');
     const eastTeams = teamData.filter(team => team.division === 'East');

     const setRanks = (teams) => {
         teams.sort((a, b) => b.wpercentage - a.wpercentage);
         teams.forEach((team, index) => {
             team.divRank = index + 1;
         });
     };
     setRanks(westTeams);
     setRanks(eastTeams);
 }

//Function to update ranks after adding a new game
function updateRanksAfterGame(teamData, team1, team2, team1Score, team2Score) {
 const winner = team1Score > team2Score ? team1 : team2;
 teamData.find(team => team.name === winner).wins++;
 teamData.sort((a, b) => b.wpercentage - a.wpercentage);
 teamData.forEach((team, index) => {
     team.rank = index + 1;
 });
}

//Populate the league table
function populateLeagueStandings(teamData, conference) {
 const tableBody = getTableBodyForConference(conference);

 tableBody.innerHTML = ''; // Clear the table body

 teamData.forEach((team) => {
     const tableRow = document.createElement('tr');
     if(conference == 'League') {
         tableRow.innerHTML = `<td>${team.rank}</td><td><a href="team.html?name=${team.name}">${team.name}</a></td><td>${team.wins}</td><td>${team.losses}</td><td>${team.wpercentage}</td><td>${team.played}</td><td>${team.division}</td>`;
     } else {
         tableRow.innerHTML = `<td>${team.divRank}</td><td><a href="team.html?name=${team.name}">${team.name}</a></td><td>${team.wins}</td><td>${team.losses}</td><td>${team.wpercentage}</td><td>${team.played}</td><td>${team.division}</td>`;
     }
     tableBody.appendChild(tableRow); // Append rows to the specific conference table body
 });
}

//Get the table from HTML depending on conference
function getTableBodyForConference(conference) {
 if (conference === 'West') {
     return document.getElementById('westStandingsBody');
 } else if (conference === 'East') {
     return document.getElementById('eastStandingsBody');
 } else {
     return document.getElementById('standingsBody'); // Default for the overall league table
 }
}


// Initial population of the league standings
function initializeStandings(conference) {
 if (conference === 'East') {
 teamData = getStandings().filter(team => team.division === 'East');
 } else if (conference === 'West') {
 teamData = getStandings().filter(team => team.division === 'West');
 } else {
 teamData = getStandings();
 }
 populateLeagueStandings(teamData, conference);
}


//If "League" button clicked
 league.addEventListener('click', () => {
     const leagueTableContainer = document.getElementById('leagueTableContainer');
     const westTableContainer = document.getElementById('westTableContainer');
     const eastTableContainer = document.getElementById('eastTableContainer');

     // Toggle visibility by adding/removing the 'hidden' class
     leagueTableContainer.classList.remove('hidden');
     westTableContainer.classList.add('hidden');
     eastTableContainer.classList.add('hidden');

     initializeStandings('League')
 })

 //If "Division" button clicked
 division.addEventListener('click', () => {
     const leagueTableContainer = document.getElementById('leagueTableContainer');
     const westTableContainer = document.getElementById('westTableContainer');
     const eastTableContainer = document.getElementById('eastTableContainer');

     // Toggle visibility by adding/removing the 'hidden' class
     leagueTableContainer.classList.add('hidden');
     westTableContainer.classList.remove('hidden');
     eastTableContainer.classList.remove('hidden');

     initializeStandings('West')
     initializeStandings('East')
 })

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

 // Initial list population
 initializeStandings('League');
 
 // Call the function to add event listeners on page load
 addSortListeners();