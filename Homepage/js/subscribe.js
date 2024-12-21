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

function sel(input) {
    document.getElementById('subimg').src = input;
}

function done() {
    window.location.href = "dashboard.html";
}