document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('student-login-form').addEventListener('submit', async function(event) {
      event.preventDefault();  // Prevent the default form submission behavior

      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      try {
          const response = await fetch('http://localhost:3000/api/student-login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, password })
          });

          const result = await response.json();

          if (response.ok) {
              alert(result.message);  // Login successful
              console.log('Student Name:', result.student.name);
              console.log('Student Email:', result.student.email);
              console.log('User College:', result.student.college);
              console.log('Student Branch: ', result.student.branch);
              console.log('Student Year: ', result.student.year);
              console.log('Student Photo: ', result.student.profilePic);
              console.log('Student Banner: ', result.student.bannerPic);

              localStorage.setItem('username', result.student.name);
              localStorage.setItem('email', result.student.email);
              localStorage.setItem('college', result.student.college);
              localStorage.setItem('branch', result.student.branch);
              localStorage.setItem('year', result.student.year);
              localStorage.setItem('photo', result.student.profilePic);
              localStorage.setItem('banner', result.student.bannerPic);

              window.location.href = 'dashboard.html';  // Redirect to the student dashboard
          } else {
              alert(result.error);  // Show error message
          }
      } catch (error) {
          console.error('Error during login:', error);
          alert('An error occurred. Please try again later.');
      }
    });
  });