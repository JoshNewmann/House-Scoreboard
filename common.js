function showToast() {
        document.getElementById("custom-toast").style.display = "block";

    document.getElementById("email-toast").addEventListener("click", function () {
        window.open("mailto:Josh.Newman429@schools.sa.edu.au?subject=House Team Leaderboard Website", "_blank");
    });
}

function dismissToast() {
    document.getElementById("custom-toast").style.display = "none";
}

function showPopup() {
    document.getElementById("popup").style.display = "block";
}
  
function hidePopup() {
    document.getElementById("popup").style.display = "none";
}

function showPopup2(title, body, body2) {
    // Create popup container
    var popupContainer = document.createElement('div');
    popupContainer.classList.add('popup-container');

    // Create close button
    var closeButton = document.createElement('span');
    closeButton.innerHTML = 'X';
    closeButton.classList.add('popup-container-close-btn');
    closeButton.onclick = function() {
      document.body.removeChild(popupContainer);
    };

    // Create title element
    var titleElement = document.createElement('h2');
    titleElement.innerText = title;

    // Create body element
    var bodyElement = document.createElement('p');
    bodyElement.innerText = body;

    var lineBreak = document.createElement('p');
    lineBreak.innerText = '';

    var bodyElement2 = document.createElement('i');
    bodyElement2.innerText = body2;

    // Append elements to popup container
    popupContainer.appendChild(closeButton);
    popupContainer.appendChild(titleElement);
    popupContainer.appendChild(lineBreak);
    popupContainer.appendChild(bodyElement);
    popupContainer.appendChild(bodyElement2);


    // Append popup container to body
    document.body.appendChild(popupContainer);
  }

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