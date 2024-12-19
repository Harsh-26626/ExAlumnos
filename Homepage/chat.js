const socket = io('http://localhost:7000');

const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageimp');
const messageContainer = document.getElementById("chatbox");

const append = (message, position)=>{
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
}

form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const message = messageimp.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageimp.value = '';
})

const user = localStorage.getItem('username');
socket.emit('new-user-joined', user)

socket.on('user-joined', data =>{
    append(`${data} joined the chat`, 'right');
})

socket.on('receive', data =>{
    append(`${data.user}: ${data.message}`, 'left');
})