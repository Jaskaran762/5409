const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });


exports.handler = async (event) => {
  // TODO implement
  
  try {
        const userId = event.id;
        
        const userDataInDynamo = await getUserData(userId);
        
        return {
            statusCode: 200,
            headers: { 
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*' 
                },
            body: JSON.stringify({ message: userDataInDynamo }),
        };
  }
  catch (error) {
        console.error('Error uploading image:', error);
        return {
            statusCode: 500,
            headers: { 
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*' 
                },
            body: JSON.stringify({ message: 'Internal server error' }),
        };
  }
};

async function getUserData(id) {
    console.log(id);
    const params = {
        TableName: 'photo-upload-table', 
        Key: {
            'user-id': id
        }
    };

    try {
        // Query DynamoDB for the item with the specified ID
        const data = await dynamoDB.get(params).promise();
        console.log(data);
        return data.Item;
    } catch (error) {
        console.error('Error:', error);

        return {
            statusCode: 500,
            headers: { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*' 
            },
            body: JSON.stringify({
                error: `Error: ${error.message}`
            })
        };
    }
}
