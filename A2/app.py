from flask import Flask, jsonify, request
import boto3
import requests
import os, re

# Initialize Flask app
app = Flask(__name__)

@app.route('/home', methods=['GET'])
def index():
    return "Application is running"

# Initialize boto3 to use the S3 client.
s3_client = boto3.client('s3')
S3_BUCKET_NAME = "mybucket-b00948857"
AWS_REGION = "us-east-1"
file_name = "store.txt"

@app.route('/start', methods=['POST'])
def start():
    # Process JSON from /start
    data = request.get_json()

    headers = {
        "Content-Type": "application/json"
    }

    response = requests.post('http://129.173.67.184:8080/start', json = data, headers= headers)

    print(response)

    # Respond with success status
    return jsonify({'status': 'success'}), response.status_code

@app.route('/store-data', methods=['POST'])
def store_data():
    # Process JSON from /store-data
    request_data = request.get_json()
    data = request_data['data']

    lines = data.split('\n')

    # Create a temporary file to store the lines
    temp_file_path = 'temp_file.txt'

    with open(temp_file_path, 'w') as temp_file:
        for i, line in enumerate(lines):
            # Append a newline if it's not the last line
            if i < len(lines) - 1:
                temp_file.write(line + '\n')
            else:
                # For the last line, don't append a newline
                temp_file.write(line)



    # Upload the file to S3
    s3_client.upload_file(temp_file_path, S3_BUCKET_NAME, file_name)

    # Get the public URL   
    s3_url = f'https://{S3_BUCKET_NAME}.s3.amazonaws.com/{file_name}'

    # Remove the temporary file
    os.remove(temp_file_path)

    # Respond with the public URL
    return jsonify({'s3uri': s3_url}), 200

@app.route('/append-data', methods=['POST'])
def append_data():
    data = request.json
    content = data['data']

    # Get the existing content from S3
    existing_content = read_file_from_s3(S3_BUCKET_NAME, file_name)

    # Append the new content
    updated_content = existing_content + content

    # Upload the updated content to S3
    s3_client.put_object(Body=updated_content, Bucket=S3_BUCKET_NAME, Key=file_name)

    return jsonify({'status': 'success'}), 200

@app.route('/search-data', methods=['POST'])
def search_data():
    data = request.json
    regex_pattern = data['regex']
    
    print(regex_pattern)
    # Get the content from S3
    file_content = read_file_from_s3(S3_BUCKET_NAME, file_name)

    # Search for the regex pattern in the content
    match = re.search(fr'^(.*?{regex_pattern}.*?)$', file_content, re.MULTILINE)

    if match:
        result = match.group(1)
        response_data = {'found': True, 'result': result}
    else:
        response_data = {'found': False, 'result': ''}

    return jsonify(response_data), 200

@app.route('/delete-file', methods=['POST'])
def delete_file():
    data = request.json
    s3_url_to_delete = data['s3uri']

    # Extract file key from the S3 URL
    file_key = extract_file_key_from_url(s3_url_to_delete)

    # Delete the file from S3
    delete_file_from_s3(file_key)

    return jsonify({'status': 'success'}), 200

# Helper function to extract file key from S3 URL
def extract_file_key_from_url(s3_url):
    # Assuming the S3 URL format is 'https://<bucket-name>.s3.amazonaws.com/<file-key>'
    file_key = s3_url.split('/')[-1]
    return file_key

# Helper function to delete file from S3
def delete_file_from_s3(file_key):
    s3_client.delete_object(Bucket=S3_BUCKET_NAME, Key=file_key)

@app.route("/s3/<bucket_name>/<file_name>")
def read_file_from_s3(bucket_name, file_name):

    try:
        # https://www.radishlogic.com/aws/boto3/how-to-read-a-file-in-s3-and-store-it-in-a-string-using-python-and-boto3/ 
        
        # Get the file inside the S3 Bucket
        s3_response = s3_client.get_object(
            Bucket=bucket_name,
            Key=file_name
        )
                
        # Get the Body object in the S3 get_object() response
        s3_object_body = s3_response.get('Body')

        # Read the data in bytes format and convert it to string
        content_str = s3_object_body.read().decode('utf-8')

        # Print the file contents as a string
        print(content_str)
        return content_str

    except s3_client.exceptions.NoSuchBucket as e:
        # S3 Bucket does not exist
        print('The S3 bucket does not exist.')
        print(e)

    except s3_client.exceptions.NoSuchKey as e:
        # Object does not exist in the S3 Bucket
        print('The S3 objects does not exist in the S3 bucket.')
        print(e)

if __name__ == '__main__':
    app.run(host='0.0.0.0')