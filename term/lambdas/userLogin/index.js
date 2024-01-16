const AWS = require('aws-sdk');

// Initialize AWS SDK
const dynamoDB = new AWS.DynamoDB.DocumentClient();

const tableName = 'photo-upload-table';

exports.handler = async (event) => {
  try {
    // Parse request body
    const requestBody = JSON.parse(event.body);

    console.log(requestBody);

    // DynamoDB Query parameters
    const params = {
      TableName: tableName,
      FilterExpression: '#email = :email',
      ExpressionAttributeNames: {
        '#email': 'email',
      },
      ExpressionAttributeValues: {
        ':email': requestBody.email,
      },
    };

    // Call DynamoDB to scan the table based on the conditions
    const userResult = await dynamoDB.scan(params).promise();
    console.log(userResult);

    if (userResult.Count === 0) {
      return {
        statusCode: 401,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*' 
        },
        body: JSON.stringify({ error: 'Invalid credentials' }),
      };
    }

    const user = userResult.Items[0];

    var password = false;

    // Compare the stored password hash with the provided password
    if (requestBody.password === user.password) {
      password = true;
      console.log(password);
    }

    if (!password) {
      return {
        statusCode: 401,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*' 
        },
        body: JSON.stringify({ error: 'Invalid credentials' }),
      };
    }

    // Return success response
    return {
      statusCode: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' 
      },
      body: JSON.stringify({ id: user['user-id'], message: 'Login successful' }),    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' 
      },
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};
