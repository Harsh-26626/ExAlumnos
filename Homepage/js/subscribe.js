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