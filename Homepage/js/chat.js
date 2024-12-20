const socket = io('https://chat-5rqk.onrender.com');

const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageimp');
const messageContainer = document.getElementById("chatbox");


const user = localStorage.getItem('username');
const userimg = localStorage.getItem('photo');

const append = (message, position, userimg)=>{
    const messageElement = document.createElement('div');
    messageElement.classList.add('message-div');
    messageElement.classList.add('message', position);

    if (userimg) {
        const imgElement = document.createElement('img');
        imgElement.src = userimg;
        imgElement.alt = `${message.split(':')[0]}'s Image`; // Alt text for accessibility
        imgElement.classList.add('user-image');
        messageElement.appendChild(imgElement);
    }

    const textElement = document.createElement('div');
    textElement.classList.add('user-message');
    textElement.innerText = message;
    messageElement.appendChild(textElement);

    messageContainer.appendChild(messageElement);
}

form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const message = messageimp.value;
    const userimg = localStorage.getItem('photo'); // Get the user image from localStorage
    append(`You: ${message}`, 'right', userimg); // Append the message with the image
    socket.emit('send', {user, message, userimg }); // Send the message and image to the server
    messageimp.value = '';
})

socket.emit('new-user-joined', { user, userimg })

socket.on('user-joined', data =>{
    const { user, userimg } = data;
    append(`${user} joined the chat`, 'centre', userimg);
})

socket.on('receive', data =>{
    const { user, message, userimg } = data;
    append(`${user}: ${message}`, 'left', userimg);
})