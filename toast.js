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