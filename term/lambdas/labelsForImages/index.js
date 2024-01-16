const AWS = require('aws-sdk');

const rekognition = new AWS.Rekognition();

exports.handler = async (event) => {
    
    console.log(event);

    try {
        const params = {
            Image: {
                S3Object: {
                    Bucket: "b00948857-term-project",
                    Name: event.key,
                },
            },
        };

        console.log(params);
        const data = await rekognition.detectLabels(params).promise();
        
        // Convert each label to lowercase
        const labels = data.Labels.map(label => label.Name.toLowerCase().replace(/''/g, ''));

        // Filter results for a specific object
        const desiredObject = 'chilli';
        
        // Convert desired object to lowercase for case-insensitive comparison
        const lowercaseDesiredObject = desiredObject.toLowerCase();
        
        const filteredLabels = data.Labels.filter(label => label.Name.toLowerCase() === lowercaseDesiredObject);

        // Perform further actions with filteredLabels
        console.log(labels);

        return {
            statusCode: 200,
            body: JSON.stringify(labels),
        };
    } catch (error) {
        console.error('Error detecting labels:', error);

        return {
            statusCode: 500,
            body: JSON.stringify('Error detecting labels'),
        };
    }
};
