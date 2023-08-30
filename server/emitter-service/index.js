// emitter.js

const net = require('net');
const crypto = require('crypto');
const fs = require('fs');

const data = JSON.parse(fs.readFileSync('data.json'));
const passKey = 'your-pass-key'; // Replace with your pass key

const server = net.createServer((socket) => {
  setInterval(() => {
    const numMessages = Math.floor(Math.random() * (499 - 49 + 1)) + 49;
    const encryptedMessages = [];

    for (let i = 0; i < numMessages; i++) {
      const randomIndex = Math.floor(Math.random() * data.length);
      const message = data[randomIndex];

      const cipher = crypto.createCipher('aes-256-ctr', passKey);
      const encryptedMessage = cipher.update(JSON.stringify(message), 'utf8', 'hex');
      encryptedMessages.push(encryptedMessage);
    }

    const messageStream = encryptedMessages.join('|');
    socket.write(messageStream);
  }, 10000); // Emit every 10 seconds
});

server.listen(3000, '127.0.0.1', () => {
  console.log('Emitter server started on port 3000');
});
