module.exports = (connection, message, socket) => {
    const query = 'INSERT INTO Messages (restaurantId, customerId, tableNo, customerMobileNo, chat, userType, messageStatus) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const values = [message.restaurantId, message.customerId, message.tableNo, message.customerMobileNo, message.chat, message.userType, message.messageStatus];

    connection.query(query, values, (err, results) => {
        if (err) {
            console.error('Error inserting message:', err);
            socket.emit('messageResponse', { success: false, error: 'Failed to send message' });
            return;
        }

        const responseMessage = {
            messageId: results.messageId,
            time: new Date().toISOString(),
            ...message 
        };

        console.log('Message inserted:', results);
        socket.emit('messageResponse', { success: true, messageId: responseMessage.messageId });
        socket.broadcast.emit('newMessage', responseMessage);
    });
};
