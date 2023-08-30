// listener.js
const express = require('express');
const cors = require('cors'); // Import the cors package
const app = express();

const net = require('net');
const crypto = require('crypto');
const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/timeseriesdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Schema = mongoose.Schema;
const TimeseriesSchema = new Schema({
  timestamp: Date,
  data: [Object],
});

const TimeseriesModel = mongoose.model('Timeseries', TimeseriesSchema);

const server = net.createServer((socket) => {
  socket.on('data', async (dataStream) => {
    const encryptedMessages = dataStream.toString().split('|');
    const decryptedMessages = [];

    for (const encryptedMessage of encryptedMessages) {
      const decipher = crypto.createDecipher('aes-256-ctr', 'your-pass-key');
      const decryptedMessage = decipher.update(encryptedMessage, 'hex', 'utf8');
      decryptedMessages.push(JSON.parse(decryptedMessage));
    }

    const currentTime = new Date();
    const timeseriesMinute = new Date(
      currentTime.getFullYear(),
      currentTime.getMonth(),
      currentTime.getDate(),
      currentTime.getHours(),
      currentTime.getMinutes()
    );

    const timeseriesData = new TimeseriesModel({
      timestamp: timeseriesMinute,
      data: decryptedMessages,
    });

    try {
      await timeseriesData.save();
      console.log('Data saved to MongoDB');
    } catch (error) {
      console.error('Error saving timeseries data:', error);
    }
  });
});

app.use(cors()); // Enable CORS for all routes

app.get('/api/data', async (req, res) => {
  try {
    const timeseriesData = await TimeseriesModel.find().sort({ timestamp: -1 }).limit(10);
    res.json(timeseriesData);
  } catch (error) {
    console.error('Error fetching timeseries data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(5000, () => {
  console.log('API server started on port 5000');
});

server.listen(4000, '127.0.0.1', () => {
  console.log('Listener server started on port 4000');
});
