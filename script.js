async function fetchScores() {
    try {
        const response = await fetch('http://192.168.1.207:3000/houseleaderboard/getscores', {
            method: 'POST'
        });
        const data = await response.json();
        updateScores(data);
        document.querySelector('main').style.display = 'block';
    } catch (error) {
        console.error('Error fetching scores:', error);
    }
}

function updateScores(scores) {
    const houses = Object.keys(scores.houses).map((house) => ({
        name: house,
        displayName: scores.houses[house].displayName, // Adding displayName
        ...scores.houses[house]
    }));

    // Sort houses based on points
    houses.sort((a, b) => b.points - a.points);

    // Get the main element where cards are appended
    const mainElement = document.querySelector('main');

    // Clear the main element
    mainElement.innerHTML = '';

    // Update scores and rearrange cards
    houses.forEach((house, index) => {
        const cardId = `${house.name}Card`;
        const positionId = `${house.name}Position`;
        const pointsId = `${house.name}Points`;

        const position = index + 1;
        const positionSuffix = position === 1 ? 'st' : position === 2 ? 'nd' : position === 3 ? 'rd' : 'th';

        // Create card elements
        const cardDiv = document.createElement('div');
        cardDiv.classList.add('houseCard');
        cardDiv.id = cardId;

        const positionDiv = document.createElement('div');
        const positionHeader = document.createElement('h1');
        positionHeader.classList.add('position');
        positionHeader.id = positionId;
        positionHeader.textContent = `${position}${positionSuffix}`;
        positionDiv.appendChild(positionHeader);
        cardDiv.appendChild(positionDiv);

        const nameDiv = document.createElement('div');
        const nameHeader = document.createElement('h2');
        nameHeader.classList.add('teamName');
        nameHeader.id = `${house.name}Name`;
        nameHeader.textContent = house.displayName; // Use displayName
        nameDiv.appendChild(nameHeader);
        cardDiv.appendChild(nameDiv);

        const scoresContainerDiv = document.createElement('div');
        scoresContainerDiv.classList.add('scoresContainer');
        const scoresHeader = document.createElement('h2');
        scoresHeader.classList.add('scores');
        scoresHeader.id = pointsId;
        scoresHeader.textContent = `${house.points} Points`;
        scoresContainerDiv.appendChild(scoresHeader);
        cardDiv.appendChild(scoresContainerDiv);

        // Append the card to the main element
        mainElement.appendChild(cardDiv);
    });
}


// Function to update scores periodically
function startUpdatingScores() {
    // Fetch scores initially
    fetchScores();
    // Update scores every 10 seconds
    setInterval(fetchScores, 1000);
}

// Start updating scores when the page loads
window.onload = startUpdatingScores;

// School Logo Hover Effect
const slogo = document.getElementById('Slogo');
slogo.addEventListener('mouseenter', function() {
    this.style.transition = 'src 0.5s ease';
    this.src = '/assets/logo-small-no-overlay.png';
});
slogo.addEventListener('mouseleave', function() {
    this.style.transition = 'src 0.5s ease';
    this.src = '/assets/logo-small-black-overlay.png';
});

//Cog Hover
const cog = document.getElementById('Cog');
cog.addEventListener('mouseenter', function() {
    this.style.transition = 'src 0.5s ease';
    this.src = '/assets/cog-f.svg';
});
cog.addEventListener('mouseleave', function() {
    if (document.getElementById("popup").style.display !== "block") {
        this.style.transition = 'src 0.5s ease';
        this.src = '/assets/cog.svg';
    }
});

function fillCog() {
    const cog = document.getElementById('Cog');
    cog.style.transition = 'src 0.5s ease';
    cog.src = '/assets/cog-f.svg';
}
function unfillCog() {
    const cog = document.getElementById('Cog');
    cog.style.transition = 'src 0.5s ease';
    cog.src = '/assets/cog.svg';
}

function showPopup() {
    document.getElementById("popup").style.display = "block";
    fillCog()
  }
  
function hidePopup() {
    document.getElementById("popup").style.display = "none";
    unfillCog()
  }

//Buttons

  document.getElementById("licenseBtn").addEventListener("click", function() {
    window.location.href = "/legal.html";
});

document.getElementById("manageBtn").addEventListener("click", function() {
    window.location.href = "/admin.html";
});