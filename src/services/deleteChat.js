import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
    console.log("Received event:", JSON.stringify(event, null, 2));

    const { customerId, restaurantId } = event;

    if (!customerId || !restaurantId) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Missing customerId or restaurantId" }),
        };
    }

    const params = {
        TableName: "Messages",
        FilterExpression: "customerId = :customerId AND restaurantId = :restaurantId",
        ExpressionAttributeValues: {
            ":customerId": customerId,
            ":restaurantId": restaurantId,
        },
    };

    try {
        const data = await dynamoDB.scan(params).promise();

        const deleteRequests = data.Items.map((item) => ({
            DeleteRequest: {
                Key: {
                    messageId: item.messageId,
                },
            },
        }));

        for (let i = 0; i < deleteRequests.length; i += 25) {
            const batch = deleteRequests.slice(i, i + 25);
            const batchParams = {
                RequestItems: {
                    Messages: batch,
                },
            };
            await dynamoDB.batchWrite(batchParams).promise();
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Chat closed successfully" }),
        };
    } catch (error) {
        console.error("Error deleting messages:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Error closing chat" }),
        };
    }
};
