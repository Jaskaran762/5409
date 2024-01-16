from flask import Flask, jsonify, request

import pandas as pd
import requests

app = Flask(__name__)

filepath = '/etc/data/'

@app.route('/user-info', methods=['POST'])
def user_info():
    data = request.get_json()
    filename = data.get('file')
    username = data.get('name')
    key = data.get('key')

    try:
        if not filename:
            raise ValueError("Invalid JSON input.")
        
        df = pd.read_csv(filepath + filename)

        # Additional check for the expected structure of the DataFrame
        if 'name' not in df.columns or 'latitude' not in df.columns or 'longitude' not in df.columns:
            raise pd.errors.ParserError("Invalid CSV format.")
    
        if key == "location":
            if not df.empty:
                user_entries = df[df['name'] == username]

                if user_entries.empty:
                    raise ValueError("Invalid JSON input.")
                # Find the latest location
                latest_latitude = user_entries['latitude'].max()
                latest_longitude = user_entries['longitude'].max()

                if not (isinstance(latest_latitude, float) and isinstance(latest_longitude, float)):
                    raise ValueError("Invalid JSON input.")
                
                response = {
                    "file": filename,
                    "latitude": float(latest_latitude),
                    "longitude": float(latest_longitude)
                }
                return jsonify(response), 200
            else:
                raise ValueError("Invalid JSON input.")
        else:
            headers = {
                "Content-Type": "application/json"
                }
            response = requests.post('http://temphandler:6050/temp', json = data, headers= headers)
            response_data = response.json()
            return jsonify(response_data), response.status_code
        
    except pd.errors.ParserError:
        error_message = {
            "file": filename,
            "error": "Input file not in CSV format."
        }
        return(jsonify(error_message)), 400

    except FileNotFoundError:
        error_message = {
            "file": filename,
            "error": "File not found."
        }
        return(jsonify(error_message)), 400

    except ValueError as ve:
        error_message = {
            "file": "null",
            "error": str(ve)
        }
        return(jsonify(error_message)), 400
    
if __name__ == '__main__':
    app.run()
    
    