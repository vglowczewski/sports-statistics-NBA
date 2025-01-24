    // Get the form and list elements
        const form = document.getElementById('scoreForm');
        const filterDateBtn = document.getElementById('filterDateBtn');
        const resetDateBtn = document.getElementById('resetDateBtn');

        // Check if local storage has existing scores
        let scoreData = JSON.parse(localStorage.getItem('scoreData')) || [];
        let filteredScores = [];

        const num_teams = scoreData.length;
        num_teams_per_page = 6; //display max 6 teams on 1 page
        curr_page = 1;  //start on page 1
        
        max_page = num_teams % num_teams_per_page === 0 ? num_teams / num_teams_per_page : Math.ceil(num_teams / num_teams_per_page) + 1;

        function updateGameCards(scores = scoreData, page = curr_page) {
          const gameCardsSection = document.getElementById('gameCards');
          gameCardsSection.innerHTML = ''; // Clear previous content

          // Calculate teams for the current page
          const teamsPerPage = num_teams_per_page;
          const startIndex = (page - 1) * teamsPerPage;
          const teamsCurrPage = scores.slice(startIndex, startIndex + teamsPerPage);

        teamsCurrPage.forEach((game, index) => {
            const column = document.createElement('div');
            column.className = 'column is-4';

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

            const removeLink = document.createElement('a');
            removeLink.href = '#';
            removeLink.innerText = 'Remove';
            removeLink.addEventListener('click', () => removeScore(startIndex + index));

            const content = document.createElement('div');
            content.className = 'content';
            content.innerHTML = `
            <p>${game.team1}: ${game.team1Score} - ${game.team2}: ${game.team2Score}</p>
            <span>Date: ${game.date}</span>`;

            const removeContainer = document.createElement('div');
            removeContainer.appendChild(removeLink);

            cardContent.appendChild(content);
            cardContent.appendChild(removeContainer);
            card.appendChild(cardContent);
            column.appendChild(card);

            gameCardsSection.appendChild(column);
        });

        // Update local storage with the modified game data
        localStorage.setItem('scoreData', JSON.stringify(scores));
    }

    function updatePagination(scores = scoreData) {
        const num_teams = scores.length;
        max_page = Math.max(1, Math.ceil(num_teams / num_teams_per_page)); // Ensure at least 1 page if there's data
    
        const ul = document.querySelector("#pagination");
        ul.innerHTML = ''; // Clear previous pagination links

        for (let page = 1; page <= max_page; page++) {
            const li = document.createElement('li');
            const link = document.createElement('a');
            link.setAttribute('class', 'pagination-link');
            link.setAttribute('aria-label', `Goto page ${page}`);
            link.innerText = page;
            li.appendChild(link);
            ul.appendChild(li);
        }
    
        const paginationLinks = document.querySelectorAll('.pagination-link');
        paginationLinks.forEach(link => {
            link.addEventListener('click', () => {
                const pageNumber = parseInt(link.innerText);
                if (pageNumber !== curr_page) {
                    curr_page = pageNumber;
                    updateGameCards(scores, curr_page);
                }
            });
        });
    
        // Ensure current page stays within valid range after filtering
        if (curr_page > max_page) {
            curr_page = max_page;
            updateGameCards(scores, curr_page);
        }
    }

        //Implement pagination buttons and add listners to know when clicked
        const pagination = document.querySelector("#pagination");
        const previousButton = document.querySelector(".pagination-previous");
        const nextButton = document.querySelector(".pagination-next");
        pagination.addEventListener('click', handlePaginationClick);
        previousButton.addEventListener('click', handlePreviousClick);
        nextButton.addEventListener('click', handleNextClick);


        //Handle page click
        function handlePaginationClick(event) {
            if (event.target.classList.contains('pagination-link')) {
                const pageNumber = parseInt(event.target.innerText);
                const dataToUse = filteredScores.length > 0 ? filteredScores : scoreData;
                curr_page = pageNumber;
                updateGameCards(dataToUse, curr_page);
            }
        }
        
        //Handle "previous"
        function handlePreviousClick() {
            if (curr_page > 1) {
                curr_page--;
                const dataToUse = filteredScores.length > 0 ? filteredScores : scoreData;
                updateGameCards(dataToUse, curr_page);
            }
        }
        
        //Handle "next"
        function handleNextClick() {
            if (curr_page < max_page) {
                curr_page++;
                const dataToUse = filteredScores.length > 0 ? filteredScores : scoreData;
                updateGameCards(dataToUse, curr_page);
            }
        }
   
        // Function to add game scores from the form
        form.addEventListener('submit', (e) => {
            console.log(e);
            e.preventDefault();
            const team1Select = document.getElementById('team1');
            const team1ScoreInput = document.getElementById('team1Score');
            const team2Select = document.getElementById('team2');
            const team2ScoreInput = document.getElementById('team2Score');
            const datePicker = document.getElementById('datepicker');

            const team1 = team1Select.value;
            const team1Score = parseInt(team1ScoreInput.value);
            const team2 = team2Select.value;
            const team2Score = parseInt(team2ScoreInput.value);
            const date = datePicker.value; // Get the selected date

                // Validate that a date is provided
            if (!date) {
                alert("Please select a date for the game.");
                return;
            }

            if (!isNaN(team1Score) && !isNaN(team2Score)) {
                const score = { team1, team1Score, team2, team2Score, date};
                scoreData.push(score);
                team1Select.value = 'Team A';
                team1ScoreInput.value = ''; // Clear the input field for Team 1
                team2Select.value = 'Team A';
                team2ScoreInput.value = ''; // Clear the input field for Team 2
                datePicker.value = ''; // Clear the date picker
                updateGameCards();
                updatePagination();
            }
        });

        filterDateBtn.addEventListener('click', () => {
            const startDateInput = document.getElementById('startDate');
            const endDateInput = document.getElementById('endDate');
            
            const startDate = startDateInput.value; // Date string
            const endDate = endDateInput.value; // Date string

            // Check if the end date is before the start date
            if (startDate > endDate) {
                alert("End date should be equal to or after the start date.");
                return;
            }

            if (startDate && endDate) {
                // Filter the list by date range
                filterScoresByDateRange(new Date(startDate), new Date(endDate));
            } else {
                // No date range selected, display all scores
                updateGameCards();
                updatePagination();
            }
        });

        function filterScoresByDateRange(startDate, endDate) {
            filteredScores = scoreData.filter(score => {
                const scoreDate = new Date(score.date);
                return scoreDate >= startDate && scoreDate <= endDate;
            });
            updateGameCards(filteredScores); // Update game cards with filtered data
            updatePagination(filteredScores); // Update pagination based on filtered data
        }

        resetDateBtn.addEventListener('click', () => {
            // Clear the start and end date input fields
            document.getElementById('startDate').value = '';
            document.getElementById('endDate').value = '';

            // Reset to the original score data
            filteredScores = [];
            updateGameCards(scoreData);
            updatePagination(scoreData);

            const paginationLinks = document.querySelectorAll('.pagination-link');
            paginationLinks.forEach(link => {
                link.addEventListener('click', () => {
                    const pageNumber = parseInt(link.innerText);
                    if (pageNumber !== curr_page) {
                        curr_page = pageNumber;
                        updateGameCards(scores, curr_page);
                    }
                });
            });
        });

        // Function to remove a score from the list
        function removeScore(index) {
            scoreData.splice(index, 1);
            updateGameCards();
            localStorage.setItem('scoreData', JSON.stringify(scoreData));
        }

        // Initial list population
        updatePagination();
        updateGameCards();

        
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

        