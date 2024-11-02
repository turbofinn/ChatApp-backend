const fetchActiveCustomers = (connection, restaurantId, socket) => {
    const query = `
        SELECT *
        FROM Messages
        WHERE restaurantId = ? AND messageStatus = 'Unread'
    `;
    
    connection.query(query, [restaurantId], (err, results) => {
        if (err) {
            console.error('Error fetching active users with unread messages:', err);
            socket.emit('fetchActiveCustomers', { error: 'Error fetching data' });
            return;
        }

        socket.emit('fetchActiveCustomers', { users: results });
    });
};

module.exports = fetchActiveCustomers;
