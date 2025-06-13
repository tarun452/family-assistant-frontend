
const backendUrl = 'https://family-assistant-backend.onrender.com';

function checkInput() {
    const message = document.getElementById('messageInput').value.trim();
    document.getElementById('sendButton').disabled = message === '';
}

async function sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();
    const chatBox = document.getElementById('chatBox');
    const typing = document.getElementById('typing-indicator');
    const userId = localStorage.getItem('name') || 'default_user';

    if (!message) return;

    chatBox.innerHTML += `<div><strong>You:</strong> ${message}</div>`;
    input.value = '';
    checkInput();
    typing.style.display = 'block';

    const res = await fetch(`${backendUrl}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, user_id: userId })
    });

    const data = await res.json();
    typing.style.display = 'none';
    chatBox.innerHTML += `<div><strong>Bot:</strong> ${data.response}</div>`;
    chatBox.scrollTop = chatBox.scrollHeight;
}

document.addEventListener('DOMContentLoaded', () => {
    const userId = localStorage.getItem('name') || 'Guest';
    document.getElementById('greeting').textContent = `Hello, ${userId}`;
    document.getElementById('logoutButton').onclick = () => {
        localStorage.removeItem('name');
        window.location.href = 'index.html';
    };
    document.getElementById('messageInput').addEventListener('keypress', e => {
        if (e.key === 'Enter' && !document.getElementById('sendButton').disabled) {
            sendMessage();
        }
    });
});
