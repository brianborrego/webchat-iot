const socket = io();

const messagesDiv = document.getElementById('messages');
const typingIndicator = document.getElementById('typing-indicator');
const usernameInput = document.getElementById('username');
const messageInput = document.getElementById('message');
const sendBtn = document.getElementById('send-btn');

let typingTimeout;
let toxicityModel = null;

// Load the toxicity model on page load
const threshold = 0.9;
toxicity.load(threshold).then((model) => {
  toxicityModel = model;
  console.log('Toxicity model loaded');
});

// Check message for toxicity
async function checkToxicity(message) {
  if (!toxicityModel) return message;

  const predictions = await toxicityModel.classify(message);
  for (const prediction of predictions) {
    if (prediction.results[0].match === true) {
      return '*****';
    }
  }
  return message;
}

// Send message
async function sendMessage() {
  const username = usernameInput.value.trim() || 'Anonymous';
  const message = messageInput.value.trim();

  if (!message) return;

  // Disable send button while checking
  sendBtn.disabled = true;
  sendBtn.textContent = 'Checking...';

  const filteredMessage = await checkToxicity(message);

  socket.emit('message', { username, message: filteredMessage });
  messageInput.value = '';
  socket.emit('typing', '');

  sendBtn.disabled = false;
  sendBtn.textContent = 'Send Message';
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
