// Fetch alumni data from an API or database
        async function fetchAlumniData() {
            try {
                const response = await fetch('http://localhost:3000/api/alumni'); // Replace with your backend API endpoint
                const alumniData = await response.json();

                // Call function to render alumni cards
                renderAlumniCards(alumniData);
            } catch (error) {
                console.error('Error fetching alumni data:', error);
            }
        }

        // Function to render alumni cards
        function renderAlumniCards(data) {
            const container = document.getElementById('alumniContainer');
            container.innerHTML = ''; // Clear existing content

            data.forEach(alumni => {
                const card = document.createElement('div');
                card.classList.add('alumni-card');

                card.innerHTML = `
                    <img src="${alumni.image}" alt="${alumni.name}">
                    <div class="info">
                        <h3>${alumni.name}</h3>
                        <p>${alumni.college}</p>
                        <p>${alumni.branch}</p>
                        <p>${alumni.year}</p>
                    </div>
                `;

                // Make the card clickable
                card.addEventListener('click', () => {
                    window.location.href = `/alumni/${alumni.id}`; // Redirect to alumni detail page
                });

                container.appendChild(card);
            });
        }

        // Fetch and render alumni data on page load
        fetchAlumniData();

        // Optional: Refresh data periodically
        setInterval(fetchAlumniData, 30000); // Refresh every 30 seconds