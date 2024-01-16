const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });
const s3 = new AWS.S3();
const lambda = new AWS.Lambda();

exports.handler = async (event) => {
    try {
        // Parse the incoming JSON data
        const imageData = JSON.parse(event.body);
        const imageWithPrefix = imageData.image;
        
        // Remove the image prefix
        const image = imageWithPrefix.replace(/^data:image\/jpeg;base64,/, '');

        // Convert the base64 image to a buffer
        const imageBuffer = Buffer.from(image, 'base64');

        // Upload image to S3
        const uploadParams = {
            Bucket: 'b00948857-term-project',
            Key: `${Date.now()}.jpg`,
            Body: imageBuffer,
            ContentType: 'image/jpg'
        };

        // Upload image to S3 and get the result
        const s3Data = await s3.upload(uploadParams).promise();
        console.log('S3 Upload Result:', s3Data);

        // Retrieve existing user data from DynamoDB
        const existingUserData = await getUserData(imageData.id);
        console.log('Existing User Data:', existingUserData);

        // Initialize the photos array if it doesn't exist
        if (!existingUserData.photos) {
            existingUserData.photos = [];
        }

        // Get labels for the uploaded image
        const labels = await getLabelsForImages(s3Data.key);

        // Prepare photo data
        const photoData = {
            location: s3Data.Location,
            labels: labels
        };

        // Add the photo data to the user's photos array
        existingUserData.photos.push(photoData);
        console.log('Updated User Data:', existingUserData);

        // Update user data in DynamoDB
        await updateUserData(existingUserData);

        // Return success response
        return {
            statusCode: 200,
            headers: { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*' 
            },
            body: JSON.stringify({ message: s3Data.Location }),
        };
       
    } catch (error) {
        console.error('Error handling request:', error);
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

// Function to fetch user data from DynamoDB
async function getUserData(id) {
    const params = {
        TableName: 'photo-upload-table', 
        Key: {
            'user-id': id
        }
    };

    try {
        // Query DynamoDB for the item with the specified ID
        const data = await dynamoDB.get(params).promise();
        console.log('Fetched User Data:', data.Item);
        return data.Item;
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
    }
}

// Function to update user data in DynamoDB
async function updateUserData(data) {
    const params = {
        TableName: 'photo-upload-table',
        Item: data
    };

    try {
        await dynamoDB.put(params).promise();
        console.log('User Data updated successfully.');
    } catch (error) {
        console.error('Error updating user data:', error);
        throw error;
    }
}

// Function to get labels for the uploaded image using another Lambda function
async function getLabelsForImages(key){
    const params = {
        FunctionName: 'labelsForImages', // Replace with the name of your target Lambda function
        InvocationType: 'RequestResponse', // Can be 'Event' for asynchronous invocation
        Payload: JSON.stringify({ key: key }) // Replace with your payload data
    };
    
    try {
        const data = await lambda.invoke(params).promise();
        const labels = JSON.parse(data.Payload);
        console.log('Labels for Image:', labels.body);
        return labels.body;
    } catch (error) {
        console.error('Error invoking Lambda:', error);
        throw error;
    }
}
