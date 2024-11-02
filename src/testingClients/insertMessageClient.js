const { io } = require('socket.io-client');

const socket = io('http://localhost:3000');

socket.on('connect', () => {
    console.log('Connected to server');

    const testMessage = {
        restaurantId: '002',
        customerId: '03',
        tableNo: 6,
        customerMobileNo: '7452845000',
        chat: 'Food is too spicy.',
        userType: 'customer',
        messageStatus: 'UNREAD'
    };

    socket.emit('sendMessage', testMessage);
    console.log('Message sent:', testMessage);
});

socket.on('messageResponse', (response) => {
    console.log('Message response:', response);
});

socket.on('newMessage', (newMessage) => {
    console.log('New message received:', newMessage);
});
