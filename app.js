
const backendUrl = 'https://family-assistant-backend.onrender.com';

async function loadChatHistory() {
    const userId = localStorage.getItem('name');
    if (!userId) return;

    const chatBox = document.getElementById('chatBox');

    try {
        const response = await fetch(`${backendUrl}/history/${userId}`);
        const messages = await response.json();

        if (messages && messages.length > 0) {
            messages.forEach(msg => appendMessage(msg.role, msg.content));
        }
    } catch (error) {
        console.error('Error loading chat history:', error);
    }
}

function appendMessage(role, content) {
    const chatBox = document.getElementById('chatBox');
    const div = document.createElement('div');
    div.innerHTML = `<b>${role === 'user' ? 'You' : 'Bot'}:</b> ${content}`;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function showTypingIndicator() {
    document.getElementById('typing-indicator').style.display = 'flex';
}

function hideTypingIndicator() {
    document.getElementById('typing-indicator').style.display = 'none';
}

async function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();

    if (message === '') return;

    const userId = localStorage.getItem('name');
    if (!userId) {
        alert('Please log in again.');
        window.location.href = 'index.html';
        return;
    }

    appendMessage('user', message);
    showTypingIndicator();

    try {
        const response = await fetch(`${backendUrl}/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message, user_id: userId })
        });

        const data = await response.json();
        hideTypingIndicator();

        if (data.response) {
            appendMessage('assistant', data.response);
        } else {
            appendMessage('assistant', 'Sorry, no response received.');
        }
    } catch (error) {
        console.error('Error:', error);
        hideTypingIndicator();
        appendMessage('assistant', 'Sorry, something went wrong.');
    }

    messageInput.value = '';
    updateSendButtonState();
}

function updateSendButtonState() {
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    sendButton.disabled = messageInput.value.trim() === '';
}

document.addEventListener('DOMContentLoaded', () => {
    const name = localStorage.getItem('name');
    document.getElementById('username').textContent = name || 'Guest';

    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');

    messageInput.addEventListener('input', updateSendButtonState);

    messageInput.addEventListener('keypress', function (event) {
        if (event.key === 'Enter' && !sendButton.disabled) {
            event.preventDefault();
            sendMessage();
        }
    });

    sendButton.addEventListener('click', sendMessage);

    document.getElementById('logoutButton').addEventListener('click', function () {
        localStorage.removeItem('name');
        window.location.href = 'index.html';
    });

    loadChatHistory();
});
