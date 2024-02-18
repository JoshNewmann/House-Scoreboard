// Show and Hide Containers
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

let ginviteCode

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
    // Get the current URL
    var url = window.location.href;

    // Check if there are any parameters in the URL
    if (url.indexOf('?') !== -1) {
        // Remove parameters and get the base URL
        var baseUrl = url.substring(0, url.indexOf('?'));

        // Update the URL without parameters
        window.history.replaceState({}, document.title, baseUrl);
        
        console.log("URL parameters cleared.");
    } else {
        console.log("No URL parameters to clear.");
    }
}

window.onload = function() {
    const token = getCookie('token');
    if (token) {
        unhideAdminControls();
        hideContainers();
        console.log('Authorised!');
        clearURLParameters();
    } else {
        console.log('Not Authorised. Please Log In.');
        document.getElementById(canvas).style.display = 'block';
        extractEmailAndInviteCodeFromURL()
    }
};

// Functions to get cookies
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

//Authentication
function signUp() {
    const email = document.querySelector('#signupForm input[name="email"]').value;
    const password = document.querySelector('#signupForm input[name="password"]').value;
    const confirmPassword = document.querySelector('#signupForm input[name="confirmPassword"]').value;
    
    // Check if any field is undefined
    if (email === undefined || password === undefined || confirmPassword === undefined) {
        console.error('One or more fields are undefined');
        return;
    }

    // Check if password and confirmPassword match
    if (password !== confirmPassword) {
        console.error('Passwords do not match');
        return;
    }

    // Check if password and confirmPassword match
    if (!ginviteCode) {
        alert('Please check you have clicked the link with the invite code');
        return;
    }

    // Create an object to send in the POST request
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
        // Extract the token from the response data
        const token = data.token;
        setTokenCookie(token);
        console.log('Token:', token);
        location.reload();
        // Do something with the successful response if needed
    })
    .catch(error => {
        console.error('Error during sign up:', error);
        showToast();
    });
}

function signIn() {
    const email = document.querySelector('#signinForm input[name="email"]').value;
    const password = document.querySelector('#signinForm input[name="password"]').value;    
    // Check if any field is undefined
    if (email === undefined || password === undefined) {
        console.error('One or more fields are undefined');
        return;
    }

    // Create an object to send in the POST request
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
        // Extract the token from the response data
        const token = data.token;
        setTokenCookie(token);
        console.log('Token:', token);
		location.reload();
        // Do something with the successful response if needed
    })
    .catch(error => {
        console.error('Error during sign in:', error);
        showToast();
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const signUpButton = document.querySelector('#signupForm input[type="submit"]');
    
    signUpButton.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent default form submission
        signUp(); // Call the signUp function to handle the form submission
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const signInButton = document.querySelector('#signinForm input[type="submit"]');
    
    signInButton.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent default form submission
        signIn(); 
    });
});

//Admin Controls - Buttons

const buttons = document.querySelectorAll('.adminControls button');

buttons.forEach(button => {
    button.addEventListener('click', function() {
        // Remove the 'active' class from all buttons
        buttons.forEach(btn => {
            btn.classList.remove('active');
        });

        // Add the 'active' class to the clicked button
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

// Call the function to apply the restriction
restrictNumericInput();

// Get all arrow buttons
var arrowButtons = document.querySelectorAll(".arrows");

// Add event listener to each arrow button
arrowButtons.forEach(function(button) {
    button.addEventListener("click", function() {
        // Add the "clicked" class to change the background color
        button.classList.add("clicked");

        // Remove the "clicked" class after a short delay
        setTimeout(function() {
            button.classList.remove("clicked");
        }, 200); // Adjust the delay time as needed
    });
});

var allArrowButtons = document.querySelectorAll('.upArrow, .downArrow, .aupArrow, .adownArrow');

allArrowButtons.forEach(function(button) {
    button.addEventListener("click", function() {
        // Get the input field next to the clicked button
        var inputField = button.parentElement.querySelector("input[type='number']");

        // Check if the input field exists and it's not empty
        if (inputField && inputField.value !== "") {
            // Increment or decrement the value based on the arrow button clicked
            if (button.classList.contains("upArrow") || button.classList.contains("aupArrow")) {
                // Increment the value by 1 if it's the up arrow button
                inputField.value = parseInt(inputField.value) + 1;
            } else if (button.classList.contains("downArrow") || button.classList.contains("adownArrow")) {
                // Decrement the value by 1 if it's the down arrow button
                inputField.value = parseInt(inputField.value) - 1;
            }
        }
    });
});

function changeButtonText(buttonId, finalText) {
    var button = document.getElementById(buttonId);
    if (button) {
        // Change text to a tick
        button.disabled = true;
        button.innerText = '✔';

        // Wait for 1 second (1000 milliseconds)
        setTimeout(function() {
            // Change text back to the final text
            button.innerText = finalText;
            button.disabled = false;
        }, 1000); // 1000 milliseconds = 1 second
    }
}

//Admin Controls - Scoring

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
        
        // Check if the displayName is in the allowedIDs array
        if (allowedIDs.includes(displayName)) {
            const inputField = document.querySelector(`#${displayName} input`);
            if (inputField) {
                inputField.value = points;
            }
        }
    });

    changeButtonText('gsfs', 'Get Scores from server');
}

// Call the function to extract and store email and inviteCode
extractEmailAndInviteCodeFromURL();

function sendScores(operation) {
  // Get input values
  var onkaScore, scottScore, coxScore, sturtScore;

  if (getComputedStyle(document.getElementById("updateScores")).display !== "none") {
      // If #updateScores is visible, use elements with IDs starting with 'a'
      onkaScore = document.getElementById("aOnka").querySelector("input").value;
      scottScore = document.getElementById("aScott").querySelector("input").value;
      coxScore = document.getElementById("aCox").querySelector("input").value;
      sturtScore = document.getElementById("aSturt").querySelector("input").value;
  } else {
      // Otherwise, use elements with IDs starting without 'a'
      onkaScore = document.getElementById("Onka").querySelector("input").value;
      scottScore = document.getElementById("Scott").querySelector("input").value;
      coxScore = document.getElementById("Cox").querySelector("input").value;
      sturtScore = document.getElementById("Sturt").querySelector("input").value;
  }
  // Construct payload

  var token = getToken();

  var payload = {
    operation: operation,
    green: onkaScore,
    yellow: scottScore,
    red: coxScore,
    blue: sturtScore,
    token: token
  };

  // Send data to server
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
    // IDs of the input fields
    const inputIds = ['aOnka', 'aScott', 'aCox', 'aSturt'];

    // Loop through each input field ID and set its value to 0
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
    var inputs = document.querySelectorAll('.cci'); // Get all input elements with class 'cci'
    inputs.forEach(function(input) { // Loop through each input element
        if (input.value === '') { // Check if input value is empty
            input.value = '0'; // Set input value to '0'
        }
    });
}

//Admin Controls - Access Control

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
        // Extract valid emails from the response
        const validEmails = data.validEmails;

        // Get the container to display users
        const usersContainer = document.getElementById('userList');

        // Create a list element to contain the valid emails
        const userList = document.createElement('ul');

        // Add each valid email as a list item
        validEmails.forEach(email => {
            const listItem = document.createElement('li');
            listItem.textContent = email;
            userList.appendChild(listItem);
        });

        // Clear any existing content and append the list of users
        usersContainer.innerHTML = '';
        usersContainer.appendChild(userList);
    })
    .catch(error => {
        console.error('Error fetching valid emails:', error.message);
        // You can handle errors here, such as displaying an error message to the user
    });
}

function createInvite() {
    const token = getToken();
    const emailInput = document.querySelector('#emailInput'); // Retrieve the input element

    fetch('https://jn6scoreboardapi.quinquadcraft.org/houseleaderboard/createInvite', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token: token, email: emailInput.value })
    })
    .then(response => response.json())
    .then(data => {
        // Extract email, inviteCode, and name from the response data
        const { email, inviteCode } = data;
        const name = getEmailName(email);

        // Use email, inviteCode, and name variables as needed
        console.log('Email:', email);
        console.log('Invite Code:', inviteCode);
        console.log('Name:', name);

        // Further processing
        console.log('Invite created:', data);
        changeButtonText('createInviteButton', 'Invite');
        emailInput.value = '';
        showPopup2('Invite Link', 'Send this link to ' + name + ' to invite them to this website:', 'https://score.joshnewman6.com/admin.html?email=' + email + '&inviteCode=' + inviteCode);
    })
    .catch(error => console.error('Error creating invite:', error));
}

// Function to extract name from email
function getEmailName(email) {
    // Extract name from email address
    const atIndex = email.indexOf('@');
    let name = email.substring(0, atIndex); // Extract characters before '@'
    name = name.replace(/\d+/g, ''); // Remove numbers
    name = name.replace('.', ' '); // Replace dots with spaces
    name = name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '); // Capitalize first letters of each word
    return name;
}


// Function to fetch all invites
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

// Function to display invites
function displayInvites(invites) {
    const inviteList = document.getElementById('inviteList');
    inviteList.innerHTML = '';

    invites.forEach(invite => {
        const listItem = document.createElement('li');
        listItem.classList.add('inviteList'); // Adding the class inviteList

        listItem.textContent = `Email: ${invite.email}, Invite Code: ${invite.inviteCode}`;

        const lineBreak = document.createElement('br');
        listItem.appendChild(lineBreak);

        const revokeButton = document.createElement('button');
        revokeButton.textContent = 'Revoke';
        revokeButton.classList.add('inviteButtons');
        revokeButton.id = `revokeButton_${invite.email}`;
        revokeButton.addEventListener('click', () => revokeInvite(invite.inviteCode));

        const copyButton = document.createElement('button');
        copyButton.textContent = 'Copy Link';
        copyButton.classList.add('inviteButtons');
        copyButton.id = `copyButton_${invite.email}`;
        copyButton.addEventListener('click', () => showPopup2('Invite Link', 'Send this link to ' + name + ' to invite them to this website:', 'http://127.0.0.1:5500/admin.html?email=' + email + '&inviteCode=' + inviteCode));

        listItem.appendChild(revokeButton);
        listItem.appendChild(copyButton);

        inviteList.appendChild(listItem);
    });
}

// Function to revoke an invite
function revokeInvite(inviteCode) {
    const token = getToken();

    fetch('https://jn6scoreboardapi.quinquadcraft.org/houseleaderboard/revokeInvite', {
        method: 'POST', // Changed method to POST
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token: token, inviteCode: inviteCode }) // Changed from inviteId to inviteCode
    })
    .then(response => {
        if (response.ok) {
            console.log('Invite revoked successfully');
            // Refresh invite list after revoking
            fetchInvites();
        } else {
            console.error('Failed to revoke invite');
            // Handle failure message or action
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

//Admin Controls - Log
