import json
import hashlib
import requests

def lambda_handler(event, context):
    input_data = event
    value_to_hash = input_data['value']
    
    hashed_value = hashlib.md5(value_to_hash.encode('utf-8')).hexdigest()
    
    response = {
        'banner': 'B00948857',
        'result': hashed_value,
        'arn': 'arn:aws:lambda:us-east-1:514317883248:function:md5lambda',
        'action': 'md5',
        'value': value_to_hash
    }
    
    headers = {
        'Content-Type': 'application/json'
    }

    response1 = requests.post(input_data['course_uri'], json=response, headers=headers)
    if response1.status_code == 200:
        return response
        
    return 'failed'
