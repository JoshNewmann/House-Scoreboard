// Cog Hover
const cog = document.getElementById('Cog');
cog.addEventListener('mouseenter', function() {
    this.style.transition = 'src 0.5s ease';
    this.src = '../assets/user-square.svg';
});
cog.addEventListener('mouseleave', function() {
    if (document.getElementById("popup").style.display !== "block") {
        this.style.transition = 'src 0.5s ease';
        this.src = '../assets/user-circle.svg';
    }
});

// Fill and Unfill Cog Functions
function fillCog() {
    const cog = document.getElementById('Cog');
    cog.style.transition = 'src 0.5s ease';
    cog.src = '../assets/user-square.svg';
}
function unfillCog() {
    const cog = document.getElementById('Cog');
    cog.style.transition = 'src 0.5s ease';
    cog.src = '../assets/user-circle.svg';
}

// Show and Hide Popup Functions
function showPopup() {
    document.getElementById("popup").style.display = "block";
    fillCog();
}
function hidePopup() {
    document.getElementById("popup").style.display = "none";
    unfillCog();
}

// Event listener for Esc key
window.addEventListener("keydown", function(event) {
    if (event.key === "Escape") {
        hidePopup();
    }
});