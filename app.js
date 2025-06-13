
document.addEventListener('DOMContentLoaded', function () {
    const sendButton = document.getElementById('sendButton');
    const messageInput = document.getElementById('messageInput');

    messageInput.addEventListener('input', function () {
        sendButton.disabled = messageInput.value.trim() === '';
    });

    sendButton.addEventListener('click', function () {
        const message = messageInput.value.trim();
        if (message) {
            const chatBox = document.getElementById('chatBox');
            chatBox.innerHTML += `<div><b>You:</b> ${message}</div>`;
            messageInput.value = '';
            sendButton.disabled = true;

            // Simulate bot response
            setTimeout(() => {
                chatBox.innerHTML += `<div><b>Bot:</b> This is a reply.</div>`;
            }, 1000);
        }
    });
});
