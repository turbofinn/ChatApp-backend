const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

AWS.config.update({ region: 'us-east-1' }); // Change this to your region
const dynamoDB = new AWS.DynamoDB.DocumentClient();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const PORT = process.env.PORT || 3000;

app.use(express.json());

const fetchMessagesByRestaurant = (restaurantId, callback) => {
    const params = {
        TableName: 'Messages',
        FilterExpression: 'restaurantId = :restaurantId',
        ExpressionAttributeValues: {
            ':restaurantId': restaurantId,
        },
    };

    dynamoDB.scan(params, (err, data) => {
        if (err) {
            console.error('Unable to scan. Error JSON:', JSON.stringify(err, null, 2));
            return callback(err, null);
        } else {
            return callback(null, data.Items);
        }
    });
};

app.post('/messages', (req, res) => {
    const message = req.body;

    const params = {
        TableName: 'Messages',
        Item: {
            messageId: uuidv4(),
            restaurantId: message.restaurantId,
            customerId: message.customerId,
            tableNo: message.tableNo,
            customerMobileNo: message.customerMobileNo,
            chat: message.chat,
            userType: message.userType,
            messageStatus: 'UNREAD',
            time: Date.now(),
        },
    };

    dynamoDB.put(params, (err) => {
        if (err) {
            console.error('Unable to add item. Error JSON:', JSON.stringify(err, null, 2));
            return res.status(500).send('Error saving message');
        } else {
            console.log('Added item to DynamoDB:', message);
            io.emit('newMessage', message); // Emit the new message
            return res.status(200).send('Message sent successfully');
        }
    });
});

io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('fetchMessagesByRestaurant', (restaurantId) => {
        fetchMessagesByRestaurant(restaurantId, (err, messages) => {
            if (err) {
                socket.emit('fetchMessagesResponse', { success: false, error: err });
            } else {
                socket.emit('fetchMessagesResponse', { success: true, messages });
            }
        });
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
