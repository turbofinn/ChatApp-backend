module.exports = (connection, socket) => {
    socket.on('fetchMessages', ({ restaurantId, tableNo, customerId }) => {
        const query = `
            SELECT * FROM Messages 
            WHERE restaurantId = ? AND tableNo = ? AND customerId = ? 
            AND DATE(time) = CURDATE()
        `;
        const values = [restaurantId, tableNo, customerId];

        connection.query(query, values, (err, results) => {
            if (err) {
                console.error('Error fetching messages:', err);
                socket.emit('fetchMessagesResponse', { success: false, error: 'Failed to fetch messages' });
                return;
            }
            console.log('Fetched messages:', results);
            socket.emit('fetchMessagesResponse', { success: true, messages: results });
        });
    });
};
