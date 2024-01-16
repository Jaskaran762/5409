import json
from hashlib import blake2b
import requests

def lambda_handler(event, context):
    input_data = event
    value_to_hash = input_data['value']
    
    # Using BLAKE2b for hashing
    h = blake2b(digest_size=32)
    h.update(value_to_hash.encode('utf-8'))
    hashed_value = h.hexdigest()
    
    response = {
        'banner': 'B00948857',
        'result': hashed_value,
        'arn': 'arn:aws:lambda:us-east-1:514317883248:function:blake2Lambda',
        'action': 'blake2',
        'value': value_to_hash
    }
    
    headers = {
        'Content-Type':'application/json'
    }

    response1 = requests.post(input_data['course_uri'], json = response , headers = headers)
    print(response1)
    if(response1.status_code == 200):
        return response
        
    return 'failed'
