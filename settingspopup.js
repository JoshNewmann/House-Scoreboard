// School Logo Hover Effect
const slogo = document.getElementById('Slogo');
slogo.addEventListener('mouseenter', function() {
    this.style.transition = 'src 0.5s ease';
    this.src = 'logo-small-no-overlay.png';
});
slogo.addEventListener('mouseleave', function() {
    this.style.transition = 'src 0.5s ease';
    this.src = 'logo-small-black-overlay.png';
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