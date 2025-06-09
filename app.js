const backendUrl = 'https://family-assistant-backend.onrender.com';

function showTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    typingIndicator.style.display = 'flex';
}

function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    typingIndicator.style.display = 'none';
}

async function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const chatBox = document.getElementById('chatBox');
    const message = messageInput.value.trim();

    if (message === '') return;

    chatBox.innerHTML += `<div><b>You:</b> ${message}</div>`;

    showTypingIndicator();

    const userId = localStorage.getItem('name') || 'default_user';

    try {
        const response = await fetch(`${backendUrl}/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                message: message,
                user_id: userId
            })
        });

        const data = await response.json();

        hideTypingIndicator();

        chatBox.innerHTML += `<div><b>Bot:</b> ${data.response}</div>`;

    } catch (error) {
        console.error("Error:", error);
        hideTypingIndicator();
        chatBox.innerHTML += `<div><b>Bot:</b> Sorry, something went wrong.</div>`;
    }

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
