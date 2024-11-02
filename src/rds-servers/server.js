const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mysql = require('mysql');
const insertMessage = require('../services/insertMessage');
const fetchMessages = require('../services/fetchMessage');
const fetchActiveCustomers = require('../services/fetchActiveCustomers');
const dbConfig = require('../config/config');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const PORT = process.env.PORT || 3000;

const connection = mysql.createConnection(dbConfig);

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL');
});

connection.query(`
    CREATE TABLE IF NOT EXISTS Messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        restaurantId VARCHAR(255),
        customerId VARCHAR(255),
        tableNo INT,
        customerMobileNo VARCHAR(255),
        chat TEXT,
        userType VARCHAR(255),
        messageStatus TEXT,
        time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
`, (err) => {
    if (err) {
        console.error('Error creating table:', err);
    } else {
        console.log('Messages table created or already exists');
    }
});

io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('sendMessage', (message) => {
        insertMessage(connection, message, socket);
    });

    fetchMessages(connection, socket);

    socket.on('fetchActiveCustomers', (restaurantId) => {
        fetchActiveCustomers(connection, restaurantId, socket);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
