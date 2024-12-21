function logout() {
    console.log("username:", localStorage.getItem('username'));
    localStorage.setItem('input', input);
    localStorage.setItem('username', "Guest");
localStorage.setItem('email', "Guest@ExAlumnos.com");
localStorage.setItem('college', "Gyan Ganga Group");
localStorage.setItem('branch', "unknown");
localStorage.setItem('year', "2003 - 2028");
localStorage.setItem('photo', result.user.profilePic);
localStorage.setItem('banner', result.user.bannerPic);
console.log("username:", localStorage.getItem('username'));
window.location.href = "index.html";
}