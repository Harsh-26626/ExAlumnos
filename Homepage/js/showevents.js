async function fetchAlumni() {
    try {
        const response = await fetch('http://localhost:3000/api/alumni');
        const alumniData = await response.json();
        renderAlumni(alumniData);

        // Add event listener to filters
        document.getElementById('applyFilters').addEventListener('click', () => {
            applyFilters(alumniData);
        });
    } catch (error) {
        console.error('Error fetching alumni data:', error);
    }
}

function renderAlumni(alumniData) {
    const alumniContainer = document.getElementById('alumniContainer');
    alumniContainer.innerHTML = ''; // Clear the container
    alumniData.forEach(alumni => {
        const alumniCard = document.createElement('div');
        alumniCard.onclick = () => storeEmail(`${alumni.email}`);
        alumniCard.classList.add('alumni-card');
        alumniCard.innerHTML = `
            <img class="profile-photo" src="${alumni.profilePic}" alt="${alumni.name}">
            <div class="alumni-info">
                <h3>${alumni.name}</h3>
                <p>${alumni.college}</p>
                <p>${alumni.branch} - Batch of ${alumni.year}</p>
            </div>
        `;
        alumniContainer.appendChild(alumniCard);
    });
}

function applyFilters(alumniData) {
    const collegeFilter = document.getElementById('collegeFilter').value;
    const branchFilter = document.getElementById('branchFilter').value;
    const yearFilter = document.getElementById('yearFilter').value;

    const filteredData = alumniData.filter(alumni => {
        return (
            (collegeFilter === '' || alumni.college === collegeFilter) &&
            (branchFilter === '' || alumni.branch === branchFilter) &&
            (yearFilter === '' || alumni.year === parseInt(yearFilter))
        );
    });

    renderAlumni(filteredData);
}

function storeEmail(email) {
    localStorage.setItem('selectedEmail', email);
    window.location.href = 'viewprofile.html';
}

fetchAlumni();
