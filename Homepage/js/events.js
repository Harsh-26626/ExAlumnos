// Retrieve the username from localStorage
const username = localStorage.getItem('username');
const email = localStorage.getItem('email');

const college = localStorage.getItem('college');

const photo = localStorage.getItem('photo');

const banner = localStorage.getItem('banner');

const branch = localStorage.getItem('branch');
const year = localStorage.getItem('year');

document.getElementById('eventform').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent default form submission
    
    const formData = new FormData(event.target);
    
    const eventData = {
    name: username,
    email: email,
    title: formData.get('title'),
    college: college,
    event: formData.get('event'),
    link: formData.get('link'),
    branch: branch,
    year: year,
    profilePic : photo,
    bannerPic : banner,
    category : formData.get('eventcategory'),
    location: formData.get('eventloc'),
    };
    
    try {
    const response = await fetch('http://localhost:3000/api/event', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(eventData),
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