const texts = ["ExAlumnos is a community built to reconnect, engage and empower the alumni of Universities.","Resister now! Reconnect with Your Alumni.","Ask Questions, Chat and Network or just explore the directory!"];
let index = 0;
const textElement = document.querySelector('.moto');

function updateText() {
  textElement.textContent = texts[index];
  index = (index + 1) % texts.length;
}

setInterval(updateText, 13000);
updateText();