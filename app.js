const backendUrl = 'https://family-assistant-backend.onrender.com';

async function loadChatHistory() {
    const userId = localStorage.getItem('name') || 'default_user';
    const chatBox = document.getElementById('chatBox');
    chatBox.innerHTML = '';  // Clear previous chat

    try {
        const response = await fetch(`${backendUrl}/history/${userId}`);
        const messages = await response.json();

        if (messages && Array.isArray(messages)) {
            messages.forEach(msg => {
                const sender = msg.role === 'user' ? 'You' : 'Bot';
                chatBox.innerHTML += `<div><b>${sender}:</b> ${msg.content}</div>`;
            });
        }
    } catch (error) {
        console.error('Error loading chat history:', error);
    }
}

function showTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) indicator.style.display = 'block';
}

function hideTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) indicator.style.display = 'none';
}

async function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const chatBox = document.getElementById('chatBox');
    const message = messageInput.value.trim();
    const userId = localStorage.getItem('name') || 'default_user';

    if (!message) return;

    chatBox.innerHTML += `<div><b>You:</b> ${message}</div>`;
    messageInput.value = '';
    showTypingIndicator();

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

        if (data && data.response) {
            chatBox.innerHTML += `<div><b>Bot:</b> ${data.response}</div>`;
        } else {
            chatBox.innerHTML += `<div><b>Bot:</b> Sorry, no response received.</div>`;
        }

    } catch (error) {
        console.error("Error:", error);
        hideTypingIndicator();
        chatBox.innerHTML += `<div><b>Bot:</b> Sorry, something went wrong.</div>`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const name = localStorage.getItem('name');
    const usernameSpan = document.getElementById('username');
    const messageInput = document.getElementById('messageInput');
    const logoutButton = document.getElementById('logoutButton');

    if (usernameSpan) usernameSpan.textContent = name || 'Guest';

    loadChatHistory();

    if (messageInput) {
        messageInput.addEventListener('keypress', function (event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                sendMessage();
            }
        });
    }

    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            localStorage.removeItem('name');
            window.location.href = 'index.html';
        });
    }
});
