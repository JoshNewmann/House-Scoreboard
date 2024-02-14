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

// Function to get the value of a cookie by name
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

// Function to unhide admin controls
function unhideAdminControls() {
    const adminControls = document.getElementsByClassName("adminControls");
    Array.from(adminControls).forEach(element => {
        element.style.display = "block";
    });
}

window.onload = function() {
    const token = getCookie('token');
    if (token) {
        unhideAdminControls();
        hideContainers();
        console.log('authorised');
    } else {
        showContainer('login');
        console.log('not');
    }
};

function setTokenCookie(token) {
    const oneDayInSeconds = 86400; // Number of seconds in one day
    const expiryDays = 400; // Expiry duration in days

    // Calculate expiration date (400 days from now)
    const expirationDate = new Date();
    expirationDate.setTime(expirationDate.getTime() + (expiryDays * oneDayInSeconds * 1000));

    // Set the cookie
    document.cookie = `token=${token}; expires=${expirationDate.toUTCString()}; path=/; Secure; SameSite=Strict`;
}

// Function to renew the token cookie if it exists
function renewTokenCookie() {
    const tokenCookie = getCookie('token');
    if (tokenCookie !== "") {
        setTokenCookie(tokenCookie); // Renew the token cookie
    }
}

// Call renewTokenCookie when the page is loaded
document.addEventListener('DOMContentLoaded', function() {
    renewTokenCookie();
});

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

    // Create an object to send in the POST request
    const data = {
        email: email,
        password: password,
        confirmPassword: confirmPassword
    };

    fetch('https://safetychecker.quinquadcraft.org/houseleaderboard/signup', {
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
        // Handle errors or display error message to user
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

    fetch('https://safetychecker.quinquadcraft.org/houseleaderboard/signin', {
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
        // Do something with the successful response if needed
    })
    .catch(error => {
        console.error('Error during sign in:', error);
        // Handle errors or display error message to user
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

async function fetchScores() {
    try {
        const response = await fetch('https://safetychecker.quinquadcraft.org/houseleaderboard/getscores', {
            method: 'POST'
        });
        const data = await response.json();
        updateScores(data);
        document.querySelector('main').style.display = 'block';
    } catch (error) {
        console.error('Error fetching scores:', error);
    }
}

function updateScores(data) {
    const houses = data.houses;
    Object.keys(houses).forEach((house) => {
        const displayName = houses[house].displayName;
        const points = houses[house].points;
        const inputField = document.querySelector(`#${displayName.split(' ')[0]} input`);
        if (inputField) {
            inputField.value = points;
        }
    });
}

function getTCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length === 2) return parts.pop().split(";").shift();
  }

function sendScores() {
  // Get input values
  var onkaScore = document.getElementById("Onka").querySelector("input").value;
  var scottScore = document.getElementById("Scott").querySelector("input").value;
  var coxScore = document.getElementById("Cox").querySelector("input").value;
  var sturtScore = document.getElementById("Sturt").querySelector("input").value;
  // Construct payload

  var token = getTCookie('token');

  var payload = {
    green: onkaScore,
    yellow: scottScore,
    red: coxScore,
    blue: sturtScore,
    token: token
  };
  // Send data to server
  fetch('https://safetychecker.quinquadcraft.org/houseleaderboard/updatescore', {
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
    // You can update UI or perform other actions here after successfully sending scores
  })
  .catch(error => {
    console.error('There was a problem sending scores:', error);
    // Handle errors or display error messages
  });
}

function getUsers() {

    var token = getTCookie('token');

    // Fetch list of valid emails from the server
    fetch('https://safetychecker.quinquadcraft.org/houseleaderboard/validemails?token=' + token)
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

  function usersButton() {
    showContainer('users');
    getUsers();
  }