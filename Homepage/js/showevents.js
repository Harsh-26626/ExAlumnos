async function fetchEvent() {
    try {
        const response = await fetch('http://localhost:3000/api/events');
        const eventData = await response.json();
        renderEvent(eventData);
    } catch (error) {
        console.error('Error fetching event data:', error);
    }
}

function renderEvent(eventData) {
    const eventContainer = document.getElementById('eventContainer');
    eventContainer.innerHTML = ''; // Clear the container
    eventData.forEach(event => {
        const eventCard = document.createElement('div');
        eventCard.onclick = () => storeEmail(`${event.link}`);
        eventCard.classList.add('event-card');
        eventCard.innerHTML = `
            <img class="profile-photo" src="${event.profilePic}" alt="${event.name}">
            <div class="event-info">
                <h1>${event.title}</h1>
                <h3>${event.category} - ${event.location}</h3>
                <h4>${event.link}</h4>
                <p id="details">${event.event}</p>
                <p>Created by: ${event.name} (${event.branch} - Batch of ${event.year})</p>
            </div>
        `;
        eventContainer.appendChild(eventCard);
    });
}

function storeEmail(email) {
    localStorage.setItem('selectedEmail', email);
    window.location.href = 'email';
}

fetchEvent();
