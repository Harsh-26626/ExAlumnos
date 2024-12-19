document.querySelector('.submit').addEventListener('click', async (event) => {
    event.preventDefault(); // Prevent the form from submitting the traditional way
    
    const formData = new FormData();
    const about = document.querySelector('.About').value;
    const linkedin = document.querySelector('.LinkedIn').value;
    const insta = document.querySelector('.Insta').value;
    const github = document.querySelector('.Github').value;
    const profilePic = document.querySelector('#profilePhoto2').files[0];
    const bannerPic = document.querySelector('#bannerImage2').files[0];
  
    formData.append('About', about);
    formData.append('LinkedIn', linkedin);
    formData.append('Insta', insta);
    formData.append('Github', github);
    if (profilePic) formData.append('profilePic', profilePic);
    if (bannerPic) formData.append('bannerPic', bannerPic);
  
    try {
      const response = await fetch('/update-profile', {
        method: 'POST',
        body: formData,
      });
  
      const result = await response.json();
      if (response.ok) {
        alert(result.message);
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('An error occurred while updating your profile.');
    }
  });