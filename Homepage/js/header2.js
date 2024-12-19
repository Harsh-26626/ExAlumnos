function logout() {
    console.log("username:", localStorage.getItem('username'));
    localStorage.setItem('input', input);
    localStorage.setItem('username', "Guest");
localStorage.setItem('email', "Guest@ExAlumnos.com");
localStorage.setItem('college', "Gyan Ganga Group");
localStorage.setItem('branch', "");
localStorage.setItem('year', "");
localStorage.setItem('photo', result.user.profilePic);
localStorage.setItem('banner', result.user.bannerPic);
console.log("username:", localStorage.getItem('username'));
}