document.querySelector('.form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent form submission

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
    const response = await fetch('http://localhost:3000/api/login', { // Correct URL path
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }) // Send email and password
    });

    // Check if the response is not a JSON response
    if (!response.ok) {
        const errorResult = await response.text(); // Get the response as text
        throw new Error(errorResult); // Throw the error message received
    }

    const result = await response.json(); // Parse the JSON response if the status is ok
    console.log('User Name:', result.user.name);
    console.log('User Email:', result.user.email);
    console.log('User College:', result.user.college);
    console.log('User Branch: ', result.user.branch);
    console.log('User Year: ', result.user.year);
    console.log('User Photo: ', result.user.profilePic);
    console.log('User Banner: ', result.user.bannerPic);
    alert(result.message); // Login successful

    localStorage.setItem('username', result.user.name);
    localStorage.setItem('email', result.user.email);
    localStorage.setItem('college', result.user.college);
    localStorage.setItem('branch', result.user.branch);
    localStorage.setItem('year', result.user.year);
    localStorage.setItem('photo', result.user.profilePic);
    localStorage.setItem('banner', result.user.bannerPic);

    // Redirect or perform additional actions
    window.location.href = 'dashboard.html'; // Example redirect after successful login
} catch (error) {
    console.error('Error during login:', error);
    alert('An error occurred. Please try again later.'); // Display error to the user
}
});