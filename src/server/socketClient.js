const io = require('socket.io-client');

const socket = io('http://localhost:3000');

socket.on('fetchMessagesResponse', (data) => {
    if (data.success) {
        console.log('Messages for restaurant:', data.messages);
    } else {
        console.error('Error fetching messages:', data.error);
    }
});

socket.on('connect', () => {
    console.log('Connected to the server');
    const restaurantId = 'restaurant3';
    socket.emit('fetchMessagesByRestaurant', restaurantId);
});

socket.on('disconnect', () => {
    console.log('Disconnected from the server');
});
