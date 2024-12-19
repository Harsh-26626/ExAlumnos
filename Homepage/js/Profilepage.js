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

if (email) {
fetchPostsByEmail(email);
} else {
alert('User email not found.');
}

async function fetchPostsByEmail(email) {
try {
    // Make a GET request to the backend API with the email as a query parameter
    const response = await fetch(`http://localhost:3000/api/posts?email=${email}`);
    const posts = await response.json();

    // Check if posts exist
    if (posts.length === 0) {
        alert('No posts found for this user.');
        return;
    }

    const postContainer = document.querySelector('.main');

    // Remove existing posts, preserving other content
    const oldposts = postContainer.querySelectorAll('.post');
    oldposts.forEach(post => post.remove());

    // Render posts dynamically
    posts.forEach(post => {
        const postCard = document.createElement('div');
        postCard.classList.add('post');
        postCard.innerHTML = `
            <div class="post-header">
                <img src="${post.profilePic}" alt="${post.name}">
                <div>
                    <strong style="font-size: 17px;">${post.name}</strong>
                    <div style="display: flex; justify-content: center; padding-top: 6px; font-size: 15px;">
                        ${post.branch} - Batch of ${post.year}
                    </div>
                </div>
            </div>
            <div style="font-family: 'Alkatra'; font-size: 20px;">${post.title}</div>
            <p style="font-family: 'ABeeZee';">${post.post}</p>
        `;
        postContainer.appendChild(postCard);
    });
} catch (error) {
    console.error('Error fetching posts by email:', error);
    alert('An error occurred while fetching posts. Please try again.');
}
}