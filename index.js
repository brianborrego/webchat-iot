require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, query, orderBy, limit, getDocs, Timestamp } = require('firebase/firestore');

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors());

// Serve static files from the current directory
app.use(express.static(__dirname));

// Socket.io connection handling
io.on('connection', async (socket) => {
  console.log('A user connected:', socket.id);

  // On connect: send the 10 most recent messages
  try {
    const messagesRef = collection(db, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'), limit(10));
    const snapshot = await getDocs(q);

    snapshot.forEach((doc) => {
      const data = doc.data();
      socket.emit('message', { username: data.username, message: data.message });
    });
  } catch (err) {
    console.error('Error fetching messages:', err);
  }

  // Handle incoming messages
  socket.on('message', (data) => {
    // Broadcast message to all clients immediately
    io.emit('message', data);

    // Save message to Firestore in the background
    addDoc(collection(db, 'messages'), {
      username: data.username,
      message: data.message,
      timestamp: Timestamp.now()
    })
      .then((docRef) => console.log('Message saved with ID:', docRef.id))
      .catch((err) => console.error('Error saving message:', err));
  });

  // Handle typing indicator
  socket.on('typing', (data) => {
    socket.broadcast.emit('typing', data);
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
