const { io } = require('socket.io-client');

const socket = io('http://localhost:3000');

socket.on('connect', () => {
    console.log('Connected to server');

    const fetchRequest = {
        restaurantId: '001',
        tableNo: 2,
        customerId: '02'
    };

    socket.emit('fetchMessages', fetchRequest);
});

socket.on('fetchMessagesResponse', (response) => {
    if (response.success) {
        console.log('Fetched messages:', response.messages);
    } else {
        console.error('Error fetching messages:', response.error);
    }
});
