const { io } = require('socket.io-client');

const socket = io('http://localhost:3000');

socket.on('connect', () => {
    console.log('Connected to server');

    const fetchRequest = {
        restaurantId: '002'
    };

    socket.emit('fetchActiveCustomers', fetchRequest.restaurantId);
});

socket.on('fetchActiveCustomers', (response) => {
    if (response.error) {
        console.error('Error fetching active users:', response.error);
    } else {
        console.log('Active Users with Unread Messages:', response);
    }
});

socket.on('disconnect', () => {
    console.log('Disconnected from server');
});
