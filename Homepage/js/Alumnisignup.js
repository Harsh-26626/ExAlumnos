function myFunction() {
    var x = document.getElementById("password");
    if (x.type === "password") {
        x.type = "text";
    } else {
        x.type = "password";
    }
}

// Form submission logic
document.getElementById('registrationForm').addEventListener('submit', async function (event) {
event.preventDefault(); // Prevent the page from refreshing

const formData = new FormData(this); // Includes file inputs automatically

try {
// Log the form data being sent
console.log('Sending request with data:', formData);

const response = await fetch('http://localhost:3000/api/register', {
    method: 'POST',
    body: formData, // Send as FormData for file handling
});

if (response.ok) {
    const responseData = await response.json();

    // Log the response data
    console.log('Response received:', responseData);

    alert(responseData.message || 'Registration successful!');
} else {
    const errorData = await response.json();

    // Log the error data if response is not ok
    console.error('Error received:', errorData);

    alert(errorData.error || 'There was an issue with the registration!');
}
} catch (error) {
console.error('Error:', error);

// Log the error details
alert('An unexpected error occurred. Please try again.');
}
});