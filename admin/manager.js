// CONTAINER VISIBILITY
function hideContainers() {
    var containers = document.getElementsByClassName('container');
    for (var i = 0; i < containers.length; i++) {
        containers[i].style.display = 'none';
    }
}

function showContainer(elementid) {
    hideContainers()
    document.getElementById(elementid).style.display = 'block';
}

function unhideAdminControls() {
    const adminControls = document.getElementsByClassName("adminControls");
    Array.from(adminControls).forEach(element => {
        element.style.display = "block";
    });
}

// COOKIE AND TOKEN STUFF
function getCookie(cookieName) {
    const name = cookieName + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');
    for(let i = 0; i < cookieArray.length; i++) {
        let cookie = cookieArray[i];
        while (cookie.charAt(0) === ' ') {
            cookie = cookie.substring(1);
        }
        if (cookie.indexOf(name) === 0) {
            return cookie.substring(name.length, cookie.length);
        }
    }
    return "";
}

function getToken() {
    var value = "; " + document.cookie;
    var parts = value.split("; " + "token" + "=");
    if (parts.length === 2) return parts.pop().split(";").shift();
  }

function validateToken(token) {
    // Make a POST request to the endpoint
    fetch('https://jn6scoreboardapi.quinquadcraft.org/houseleaderboard/validateToken', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token: token })
    })
    .then(response => {
        if (response.status === 200) {
            console.log('Authentication request returned 200');
        } else if (response.status === 401) {
            // If the response is 401, clear the 'token' cookie and reload the page
            document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            location.reload();
        } else {
            console.log('Unexpected status code:', response.status);
        }
    })
    .catch(error => {
        console.error('Error sending request:', error);
    });
}

function setTokenCookie(token) {
    const oneDayInSeconds = 86400;
    const expiryDays = 400;

    const expirationDate = new Date();
    expirationDate.setTime(expirationDate.getTime() + (expiryDays * oneDayInSeconds * 1000));

    document.cookie = `token=${token}; expires=${expirationDate.toUTCString()}; path=/; Secure; SameSite=Strict`;
}

function renewTokenCookie() {
    const tokenCookie = getCookie('token');
    if (tokenCookie !== "") {
        setTokenCookie(tokenCookie);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    renewTokenCookie();
});


// LOGGING IN AND SIGNING UP
let ginviteCode // Global invite code

function extractEmailAndInviteCodeFromURL() {
    var urlParams = new URLSearchParams(window.location.search);

    var email = urlParams.get('email');
    var inviteCode = urlParams.get('inviteCode');

    if (email && inviteCode) {
        showContainer('signup');
        var emailInput = document.getElementById('signupEmail');
        if (emailInput) {
            emailInput.value = email;
        }
        ginviteCode = inviteCode;    

    } else if (inviteCode && !email) {
        showContainer('signup')
        console.log("Invite Code:", inviteCode);
        ginviteCode = inviteCode
    } else {
        showContainer('login')
    }
}

function clearURLParameters() {
    var url = window.location.href;

    if (url.indexOf('?') !== -1) {
        var baseUrl = url.substring(0, url.indexOf('?'));

        window.history.replaceState({}, document.title, baseUrl);
    }
}

window.onload = function() {
    const token = getCookie('token');
    if (token) {
        unhideAdminControls();
        hideContainers();
        clearURLParameters();
        validateToken(token);
    } else {
        console.log('Not Authorised. Please Log In.');
        extractEmailAndInviteCodeFromURL()
    }
};

//Authentication
function signUp() {
    const email = document.querySelector('#signupForm input[name="email"]').value;
    const password = document.querySelector('#signupForm input[name="password"]').value;
    const confirmPassword = document.querySelector('#signupForm input[name="confirmPassword"]').value;
    
    if (email === undefined || password === undefined || confirmPassword === undefined) {
        console.error('One or more fields are undefined');
        return;
    }

    if (password !== confirmPassword) {
        console.error('Passwords do not match');
        return;
    }

    if (!ginviteCode) {
        alert('Please check you have clicked the link with the invite code');
        return;
    }

    const data = {
        email: email,
        password: password,
        confirmPassword: confirmPassword,
        inviteCode: ginviteCode
    };

    fetch('https://jn6scoreboardapi.quinquadcraft.org/houseleaderboard/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Sign up successful:', data);
        const token = data.token;
        setTokenCookie(token);
        console.log('Token:', token);
        location.reload();
    })
    .catch(error => {
        console.error('Error during sign up:', error);
        showToast();
    });
}

function signIn() {
    const email = document.querySelector('#signinForm input[name="email"]').value;
    const password = document.querySelector('#signinForm input[name="password"]').value;    
    if (email === undefined || password === undefined) {
        console.error('One or more fields are undefined');
        return;
    }

    const data = {
        email: email,
        password: password,
    };

    fetch('https://jn6scoreboardapi.quinquadcraft.org/houseleaderboard/signin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Sign in successful:', data);
        const token = data.token;
        setTokenCookie(token);
        console.log('Token:', token);
		location.reload();
    })
    .catch(error => {
        console.error('Error during sign in:', error);
        showToast();
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const signUpButton = document.querySelector('#signupForm input[type="submit"]');
    
    signUpButton.addEventListener('click', function(event) {
        event.preventDefault();
        signUp();
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const signInButton = document.querySelector('#signinForm input[type="submit"]');
    
    signInButton.addEventListener('click', function(event) {
        event.preventDefault();
        signIn(); 
    });
});

//ADMIN CONTROLS - BUTTONS

const buttons = document.querySelectorAll('.adminControls button');

buttons.forEach(button => {
    button.addEventListener('click', function() {
        buttons.forEach(btn => {
            btn.classList.remove('active');
        });

        this.classList.add('active');
    });
});

function restrictNumericInput() {
    var numericInputs = document.querySelectorAll(".cci");

    numericInputs.forEach(function(input) {
        input.addEventListener("input", function(event) {
            if (isNaN(event.target.value)) {
                event.target.value = "";
            }
        });
    });
}

restrictNumericInput();

var arrowButtons = document.querySelectorAll(".arrows");

arrowButtons.forEach(function(button) {
    button.addEventListener("click", function() {
        button.classList.add("clicked");

        setTimeout(function() {
            button.classList.remove("clicked");
        }, 200);
    });
});

var allArrowButtons = document.querySelectorAll('.upArrow, .downArrow, .aupArrow, .adownArrow');

allArrowButtons.forEach(function(button) {
    button.addEventListener("click", function() {
        var inputField = button.parentElement.querySelector("input[type='number']");

        if (inputField && inputField.value !== "") {
            if (button.classList.contains("upArrow") || button.classList.contains("aupArrow")) {
                inputField.value = parseInt(inputField.value) + 1;
            } else if (button.classList.contains("downArrow") || button.classList.contains("adownArrow")) {
                inputField.value = parseInt(inputField.value) - 1;
            }
        }
    });
});

//SCORE TAB

async function fetchScores() {
    try {
        const response = await fetch('https://jn6scoreboardapi.quinquadcraft.org/houseleaderboard/getscores', {
            method: 'POST'
        });
        const data = await response.json();
        updateScores(data);
    } catch (error) {
        console.error('Error fetching scores:', error);
    }
}

function updateScores(data) {
    const allowedIDs = ['Onka', 'Scott', 'Cox', 'Sturt'];

    const houses = data.houses;
    Object.keys(houses).forEach((house) => {
        const displayName = houses[house].displayName;
        const points = houses[house].points;
        
        if (allowedIDs.includes(displayName)) {
            const inputField = document.querySelector(`#${displayName} input`);
            if (inputField) {
                inputField.value = points;
            }
        }
    });

    changeButtonText('gsfs', 'Get Scores from server');
}

extractEmailAndInviteCodeFromURL();

function sendScores(operation) {
  var onkaScore, scottScore, coxScore, sturtScore;

  if (getComputedStyle(document.getElementById("updateScores")).display !== "none") {
      // Add to the score
      onkaScore = document.getElementById("aOnka").querySelector("input").value;
      scottScore = document.getElementById("aScott").querySelector("input").value;
      coxScore = document.getElementById("aCox").querySelector("input").value;
      sturtScore = document.getElementById("aSturt").querySelector("input").value;
  } else {
      // Override the score
      onkaScore = document.getElementById("Onka").querySelector("input").value;
      scottScore = document.getElementById("Scott").querySelector("input").value;
      coxScore = document.getElementById("Cox").querySelector("input").value;
      sturtScore = document.getElementById("Sturt").querySelector("input").value;
  }

  var token = getToken();

  var payload = {
    operation: operation,
    green: onkaScore,
    yellow: scottScore,
    red: coxScore,
    blue: sturtScore,
    token: token
  };

  fetch('https://jn6scoreboardapi.quinquadcraft.org/houseleaderboard/updatescore', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    console.log('Scores sent successfully:', data);
    changeButtonText('updateButton', 'Update Scores');
    changeButtonText('sendNewButton', 'Overide Server Scores');
    if (operation = 'update') {
        resetInputsToZero()
    } 
  })
  .catch(error => {
    console.error('There was a problem sending scores:', error);
  });
}

function resetInputsToZero() {
    const inputIds = ['aOnka', 'aScott', 'aCox', 'aSturt'];

    inputIds.forEach((id) => {
        const inputField = document.getElementById(id).querySelector('input');
        if (inputField) {
            inputField.value = 0;
        }
    });
}

function ors() {
    var overrideScores = document.getElementById("overrideScores");
    var updateScores = document.getElementById("updateScores");
    overrideScores.style.display = "block";
    updateScores.style.display = "none";
}

function uds() {
    var overrideScores = document.getElementById("overrideScores");
    var updateScores = document.getElementById("updateScores");
    overrideScores.style.display = "none";
    updateScores.style.display = "block";
    zeroIfEmpty()
}

function zeroIfEmpty() {
    var inputs = document.querySelectorAll('.cci');
    inputs.forEach(function(input) {
        if (input.value === '') {
            input.value = '0';
        }
    });
}

//USERS TAB

function toggleAccessControlView() {
    const allUsersContainer = document.getElementById('allUsers');
    const allInvitesContainer = document.getElementById('allInvites');

    if (allUsersContainer.style.display === 'none') {
        allUsersContainer.style.display = 'block';
        allInvitesContainer.style.display = 'none';
    } else {
        allUsersContainer.style.display = 'none';
        allInvitesContainer.style.display = 'block';
    }
}

function getUsers() {
    var token = getToken('token');

    // Fetch list of valid emails from the server
    fetch('https://jn6scoreboardapi.quinquadcraft.org/houseleaderboard/validemails', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token: token })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch valid emails');
        }
        return response.json();
    })
    .then(data => {
        const validEmails = data.validEmails;

        const usersContainer = document.getElementById('userList');

        const userList = document.createElement('ul');

        validEmails.forEach(email => {
            const listItem = document.createElement('li');
            listItem.textContent = email;
            userList.appendChild(listItem);
        });

        usersContainer.innerHTML = '';
        usersContainer.appendChild(userList);
    })
    .catch(error => {
        console.error('Error fetching valid emails:', error.message);
    });
}

function createInvite() {
    const token = getToken();
    const emailInput = document.querySelector('#emailInput');

    fetch('https://jn6scoreboardapi.quinquadcraft.org/houseleaderboard/createInvite', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token: token, email: emailInput.value })
    })
    .then(response => response.json())
    .then(data => {
        const { email, inviteCode } = data;
        const name = getEmailName(email);

        console.log('Email:', email);
        console.log('Invite Code:', inviteCode);
        console.log('Name:', name);

        console.log('Invite created:', data);
        changeButtonText('createInviteButton', 'Invite');
        emailInput.value = '';
        showPopup2('Invite Link', 'Send this link to ' + name + ' to invite them to this website:', 'https://score.joshnewman6.com/admin?email=' + email + '&inviteCode=' + inviteCode);
    })
    .catch(error => console.error('Error creating invite:', error));
}

function getEmailName(email) {
    const atIndex = email.indexOf('@');
    let name = email.substring(0, atIndex); 
    name = name.replace(/\d+/g, '');
    name = name.replace('.', ' ');
    name = name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    return name;
}

function fetchInvites() {
    const token = getToken();

    fetch('https://jn6scoreboardapi.quinquadcraft.org/houseleaderboard/fetchInvites', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token: token })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Invites:', data);
        displayInvites(data.invites);
    })
    .catch(error => console.error('Error fetching invites:', error));
}

function displayInvites(invites) {
    const inviteList = document.getElementById('inviteList');
    inviteList.innerHTML = '';

    invites.forEach(invite => {
        const listItem = document.createElement('li');
        listItem.classList.add('inviteList');

        listItem.textContent = `Email: ${invite.email}, Invite Code: ${invite.inviteCode}`;

        const lineBreak = document.createElement('br');
        listItem.appendChild(lineBreak);

        const revokeButton = document.createElement('button');
        revokeButton.textContent = 'Revoke';
        revokeButton.classList.add('inviteButtons');
        revokeButton.id = `revokeButton_${invite.email}`;
        revokeButton.addEventListener('click', () => revokeInvite(invite.inviteCode));

        const copyButton = document.createElement('button');
        const inviteName = getEmailName(invite.email);
        copyButton.textContent = 'Copy Link';
        copyButton.classList.add('inviteButtons');
        copyButton.id = `copyButton_${invite.email}`;
        copyButton.addEventListener('click', () => showPopup2('Invite Link', 'Send this link to ' + inviteName + ' to invite them to this website:', 'https://score.joshnewman6.com/admin?email=' + invite.email + '&inviteCode=' + invite.inviteCode));

        listItem.appendChild(revokeButton);
        listItem.appendChild(copyButton);

        inviteList.appendChild(listItem);
    });
}

function revokeInvite(inviteCode) {
    const token = getToken();

    fetch('https://jn6scoreboardapi.quinquadcraft.org/houseleaderboard/revokeInvite', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token: token, inviteCode: inviteCode })
    })
    .then(response => {
        if (response.ok) {
            console.log('Invite revoked successfully');
            fetchInvites();
        } else {
            console.error('Failed to revoke invite');
        }
    })
    .catch(error => console.error('Error revoking invite:', error));
}

function usersButton() {
    const allUsersContainer = document.getElementById('allUsers');
    const allInvitesContainer = document.getElementById('allInvites');
    showContainer('users');
    getUsers();
    allUsersContainer.style.display = 'block';
    allInvitesContainer.style.display = 'none';
}
  
function scoreButton() {
	showContainer('score');
    uds();
    fetchScores();
    restrictNumericInput();
}

//LOG TAB
function clearLogContainer() {
    const logContainer = document.getElementById('logContainer');
    logContainer.innerHTML = ''; // Clears all child elements
  }

function displayLogs() {
    fetch('https://jn6scoreboardapi.quinquadcraft.org/houseleaderboard/getUserLogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(response => response.text())
      .then(data => {
        const logs = data.split('\n').reverse();
        const logContainer = document.getElementById('logContainer');
        let currentDate = null;

        logs.forEach(log => {
          if (!log.trim()) return;

          const parts = log.split(';');
          if (parts.length < 3) return;

          const logDate = new Date(parts[0]).toLocaleDateString('en-AU');
          const logTime = new Date(parts[0]).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
          const logSummary = parts[1];
          const logText = parts[2];

          if (logDate !== currentDate) {
            currentDate = logDate;
            const dateHeading = document.createElement('p');
            dateHeading.classList.add('logDate');
            dateHeading.textContent = logDate;
            logContainer.appendChild(dateHeading);
          }

          const details = document.createElement('details');
          details.classList.add('logDetails');

          const summary = document.createElement('summary');
          summary.classList.add('logSummary');
          summary.textContent = `${logTime} - ${logSummary}`;

          const logTextElement = document.createTextNode(logText);

          details.appendChild(summary);
          details.appendChild(logTextElement);

          logContainer.appendChild(details);
        });
      })
      .catch(error => console.error('Error:', error));
    }

const logContainer = document.getElementById('logContainer');
const scrollbarTrack = document.createElement('div');
scrollbarTrack.classList.add('scrollbar-track');
logContainer.appendChild(scrollbarTrack);


//MORE TAB