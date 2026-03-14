const socket = io();

const messagesDiv = document.getElementById('messages');
const typingIndicator = document.getElementById('typing-indicator');
const usernameInput = document.getElementById('username');
const messageInput = document.getElementById('message');
const sendBtn = document.getElementById('send-btn');

let typingTimeout;

// Send message
function sendMessage() {
  const username = usernameInput.value.trim() || 'Anonymous';
  const message = messageInput.value.trim();

  if (!message) return;

  socket.emit('message', { username, message });
  messageInput.value = '';
  socket.emit('typing', '');
}

// Send on button click
sendBtn.addEventListener('click', sendMessage);

// Send on Enter key
messageInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    sendMessage();
  }
});

// Typing indicator
messageInput.addEventListener('input', () => {
  const username = usernameInput.value.trim() || 'Anonymous';
  socket.emit('typing', `${username} is typing...`);

  clearTimeout(typingTimeout);
  typingTimeout = setTimeout(() => {
    socket.emit('typing', '');
  }, 1500);
});

// Listen for messages
socket.on('message', (data) => {
  appendMessage(data.username, data.message);
});

// Listen for typing
socket.on('typing', (data) => {
  typingIndicator.textContent = data;
});

// Append message to chat
function appendMessage(username, message) {
  const msgDiv = document.createElement('div');
  msgDiv.classList.add('message');
  msgDiv.innerHTML = `
    <div class="username">${escapeHtml(username)}</div>
    <div class="text">${escapeHtml(message)}</div>
  `;
  messagesDiv.appendChild(msgDiv);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
