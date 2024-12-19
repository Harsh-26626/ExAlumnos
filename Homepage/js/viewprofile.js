const email = localStorage.getItem('input');
    console.log('Email being sent:', email);

    async function loadProfile() {
    try {
        // First, try fetching from the Student database
        let response = await fetch('http://localhost:3000/api/fetch-profile-student', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }) // Send 'email'
        });

        let result = await response.json();

        if (response.ok) {
            const username = localStorage.getItem('username');
      document.getElementById('username').textContent = username;
      document.getElementById('see').textContent = result.profile.name;
      document.getElementById('user').textContent = result.profile.name;

      document.getElementById('college').textContent = result.profile.college;
      document.getElementById('branch').textContent = result.profile.branch;
      const mail = localStorage.getItem('email');
      document.getElementById('email').textContent = mail;
      document.getElementById('year').textContent = result.profile.year;

      const image = localStorage.getItem('photo');

      document.getElementById('image').src = result.profile.profilePic;
      document.getElementById('photo').src = image;
      document.getElementById('banner').src = result.profile.bannerPic;
        } else {
            // If not found in Student database, fetch from User database
            response = await fetch('http://localhost:3000/api/fetch-profile-user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }) // Send 'email'
            });

            result = await response.json();

            if (response.ok) {
                const username = localStorage.getItem('username');
      document.getElementById('username').textContent = username;
      document.getElementById('user').textContent = result.profile.name;

      document.getElementById('college').textContent = result.profile.college;
      document.getElementById('branch').textContent = result.profile.branch;
      const mail = localStorage.getItem('email');
      document.getElementById('email').textContent = mail;
      document.getElementById('year').textContent = result.profile.year;

      const image = localStorage.getItem('photo');

      document.getElementById('image').src = result.profile.profilePic;
      document.getElementById('photo').src = image;
      document.getElementById('banner').src = result.profile.bannerPic;
            } else {
                alert('Profile not found in both databases.');
            }
        }
    } catch (error) {
        console.error('Error fetching profile:', error);
        alert('An error occurred. Please try again later.');
    }
}

if (!email) {
  alert('No profile email found. Please log in again.');
} else {
  loadProfile();
}
        

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
            <strong style="font-size: 17px;">
                <a href="viewprofile.html" style="text-decoration: none; color: inherit;">${post.name}</a>
            </strong>
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