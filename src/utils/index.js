const AWS = require('aws-sdk');

// Configure AWS region
AWS.config.update({ region: 'us-east-1' });

const dynamoDB = new AWS.DynamoDB.DocumentClient();

const params = {
    TableName: 'Messages',
    Item: {
        messageId: '2',
        restaurantId: 'restaurant-124', 
        customerId: 'customer-456', 
        tableNo: '5', 
        customerMobileNo: '1234567890', 
        chat: 'Hello, I need assistance with my order.', 
        userType: 'customer', 
        messageStatus: 'UNREAD' 
    }
};

dynamoDB.put(params, (err, data) => {
    if (err) {
        console.error('Unable to add item. Error JSON:', JSON.stringify(err, null, 2));
    } else {
        console.log('Added item:', JSON.stringify(data, null, 2));

        const getItemParams = {
            TableName: 'Messages',
            Key: {
                messageId: '1' 
            }
        };

        dynamoDB.get(getItemParams, (err, data) => {
            if (err) {
                console.error('Unable to read item. Error JSON:', JSON.stringify(err, null, 2));
            } else {
                console.log('Get item succeeded:', JSON.stringify(data, null, 2));
            }
        });
    }
});