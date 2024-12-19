
// Retrieve the username from localStorage
const username = localStorage.getItem('username');
if (username) {
document.getElementById('username').textContent = username;
} else {
// Handle the case where the username is not available
document.getElementById('username').textContent = 'Guest';
}
const email = localStorage.getItem('email');
if (email) {
document.getElementById('email').textContent = email;
} else {
document.getElementById('email').textContent = 'guest@Exalumnous.com';
}

const photo = localStorage.getItem('photo');
document.getElementById('photo').src = photo;

const banner = localStorage.getItem('banner');

const branch = localStorage.getItem('branch');
const year = localStorage.getItem('year');
    function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main');
    const big = document.querySelector('.big');
    const small = document.querySelector('.small');

  if (sidebar.classList.contains('open')) {
    sidebar.classList.remove('open');
    mainContent.style.flex = '1';
    big.style.display = 'none';
    small.style.display = 'block';
  } else {
    sidebar.classList.add('open');
    mainContent.style.flex = '1';
    big.style.display = 'block';
    small.style.display = 'none';
  }
}

function logout() {
    console.log("username:", localStorage.getItem('username'));
    localStorage.setItem('username', "Guest");
    localStorage.setItem('email', "Guest@ExAlumnos.com");
    localStorage.setItem('college', "Gyan Ganga Group");
    localStorage.setItem('branch', " ");
    localStorage.setItem('year', "2003 - 2028");
    localStorage.setItem('photo', "https://extralumnos.s3.us-east-1.amazonaws.com/images/profilePics/Usericon.png");
    localStorage.setItem('banner', "https://extralumnos.s3.us-east-1.amazonaws.com/images/bannerPics/GuestBanner.png");
    console.log("username:", localStorage.getItem('username'));
    window.location.href = "index.html";
    }