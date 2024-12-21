const username = localStorage.getItem('username');
if (username) {
    document.getElementById('username').textContent = username;
    document.getElementById('user').textContent = username;
} else {
    // Handle the case where the username is not available
    document.getElementById('username').textContent = 'Guest';
    document.getElementById('user').textContent = 'Guest';
}

const college = localStorage.getItem('college');
if (college) {
    document.getElementById('college').textContent = college;
} else {
    // Handle the case where the college is not available
    document.getElementById('college').textContent = 'Guest';
}
const branch = localStorage.getItem('branch');
if (branch) {
    document.getElementById('branch').textContent = branch;
} else {
    // Handle the case where the branch is not available
    document.getElementById('branch').textContent = 'Guest';
}
const email = localStorage.getItem('email');
if (email) {
    document.getElementById('email').textContent = email;
} else {
    document.getElementById('email').textContent = 'guest@Exalumnous.com';
}
const year = localStorage.getItem('year');
if (year) {
    document.getElementById('year').textContent = year;
} else {
    // Handle the case where the year is not available
    document.getElementById('year').textContent = 'Guest';
}

const image = localStorage.getItem('photo');
document.getElementById('image').src = image;
const photo = localStorage.getItem('photo');
document.getElementById('photo').src = photo;
const banner = localStorage.getItem('banner');
document.getElementById('banner').src = banner;

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

document.addEventListener('DOMContentLoaded', function() {
    const payButton = document.getElementById('submit'); // Assuming you have a pay button
    payButton.addEventListener('click', async function(e) {
      e.preventDefault();
  
      const email = localStorage.getItem('email'); // Retrieve user email from localStorage
      if (!email) {
        alert('Please log in to subscribe.');
        return;
      }
  
      try {
        const response = await fetch('http://localhost:3000/api/sub', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email: email }) // Send email in the request body
        });
  
        const result = await response.json();
        if (response.ok) {
          alert(result.message || 'Subscription is now processing.');
        } else {
          alert(result.error || 'Failed to process subscription.');
        }
      } catch (error) {
        console.error('Error while processing subscription:', error);
        alert('An error occurred while processing your subscription.');
      }
    });
  });