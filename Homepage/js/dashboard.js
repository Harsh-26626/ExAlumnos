
async function fetchPost() {
    try {
        const response = await fetch('http://localhost:3000/api/post');
        const postData = await response.json();

        const postContainer = document.querySelector('.main');
        postData.forEach(post => {
            const postCard = document.createElement('div');
            postCard.classList.add('post');
            postCard.innerHTML = `
            <div class="post-header">
                <img src="${post.profilePic}" alt="${post.name}">
                <div>
                    <strong style ="font-size: 17px;"><a href="viewprofile.html" onclick="storeEmail('${post.email}')">${post.name}</a></strong>
                    <div style ="display:flex; justify-content: centre; padding-top: 6px; font-size: 15px;">${post.branch} - Batch of ${post.year}</div>
                </div>
            </div>
            <div style="font-family:'Alkatra'; font-size: 20px;">${post.title}</div>
            <p style="font-family: 'ABeeZee';">${post.post}</p>
            `;
            postContainer.appendChild(postCard);
        });
    } catch (error) {
        console.error('Error fetching post data:', error);
    }
}
function storeEmail(input) {
console.log("Input value:", input);
localStorage.setItem('input', input);
}
fetchPost();

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

document.getElementById('postForm').addEventListener('submit', async (event) => {
event.preventDefault(); // Prevent default form submission

const formData = new FormData(event.target);

const postData = {
name: username,
email: email,
title: formData.get('title'),
post: formData.get('post'),
branch: branch,
year: year,
profilePic : photo,
bannerPic : banner,
};

try {
const response = await fetch('http://localhost:3000/api/post', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify(postData),
});

const result = await response.json();
if (response.ok) {
alert(result.message); // Show success message
event.target.reset(); // Reset form
location.reload();
} else {
alert(result.error); // Show error message
}
} catch (error) {
console.error('Error creating Post:', error);
alert('An error occurred. Please try again.');
}
});

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

function createPost() {
const check = localStorage.getItem('email');
const title = document.querySelector('.create-post');
if (check == "Guest@ExAlumnos.com")
{
title.style.display = 'none';
}
else {
title.style.display = 'block';
}
}

createPost();