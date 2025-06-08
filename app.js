function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const chatBox = document.getElementById('chatBox');
    const message = messageInput.value.trim();
    if (message === '') return;

    chatBox.innerHTML += `<div><b>You:</b> ${message}</div>`;

    const botTyping = document.createElement('div');
    botTyping.id = 'typing';
    botTyping.innerHTML = `<b>Bot:</b> Typing...`;
    chatBox.appendChild(botTyping);

    fetch('https://family-assistant-backend.onrender.com/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: message })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('typing').remove();
        chatBox.innerHTML += `<div><b>Bot:</b> ${data.response}</div>`;
    });

    messageInput.value = '';
}

document.addEventListener('DOMContentLoaded', () => {
    const name = localStorage.getItem('name');
    document.getElementById('username').textContent = name || 'Guest';

    const messageInput = document.getElementById('messageInput');
    messageInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            sendMessage();
        }
    });

    document.getElementById('logoutButton').addEventListener('click', function() {
        localStorage.removeItem('name');
        window.location.href = "index.html";
    });
});
