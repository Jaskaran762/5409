const AWS = require('aws-sdk');

// Initialize AWS SDK
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const s3 = new AWS.S3();

const tableName = 'photo-upload-table';

exports.handler = async (event) => {
  try {
    // Parse request body
    const requestBody = JSON.parse(event.body);
    console.log(requestBody);

    // Generate a unique user ID
    const userId = generateUniqueId();

    console.log(userId);
    
    const photos = [];

    // Prepare user data for DynamoDB
    const userParams = {
      TableName: tableName,
      Item: {
        'user-id': userId,
        'photos': photos,
        'name': requestBody.name,
        'email': requestBody.email,
        'password': requestBody.password,
      },
    };

    // Save user data to DynamoDB
    await dynamoDB.put(userParams).promise();

    return {
      statusCode: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' 
      },
      body: JSON.stringify({ message: 'User registered successfully' }),
    };
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


function generateUniqueId() {
    // Get the current timestamp
    const timestamp = new Date().getTime();
  
    // Generate a random number (between 0 and 999999)
    const random = Math.floor(Math.random() * 100);
  
    // Combine timestamp and random number to create a unique ID
    const uniqueId = parseInt(`${timestamp}${random}`);
  
    return uniqueId;
  }