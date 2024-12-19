async function fetchAlumni() {
    try {
        const response = await fetch('http://localhost:3000/api/alumni');
        const alumniData = await response.json();

        const alumniContainer = document.getElementById('alumniContainer');
        alumniData.forEach(alumni => {
            const alumniCard = document.createElement('div');
            alumniCard.classList.add('alumni-card');
            alumniCard.innerHTML = `
                <img class="alumni-image" src="${alumni.image}" alt="${alumni.name}">
                <div class="alumni-info">
                    <h3>${alumni.name}</h3>
                    <p>${alumni.college}</p>
                    <p>${alumni.branch} - ${alumni.year}</p>
                </div>
            `;
            alumniContainer.appendChild(alumniCard);
        });
    } catch (error) {
        console.error('Error fetching alumni data:', error);
    }
}

fetchAlumni();