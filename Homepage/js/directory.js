async function fetchAlumni() {
    try {
        const response = await fetch('http://localhost:3000/api/alumni');
        const alumniData = await response.json();

        const alumniContainer = document.getElementById('alumniContainer');
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
    } catch (error) {
        console.error('Error fetching alumni data:', error);
    }
}

function storeEmail(input) {
    console.log("Input value:", input);
    localStorage.setItem('input', input);
    window.location.href = "viewprofile.html";
    }

fetchAlumni();