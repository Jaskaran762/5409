from flask import Flask, jsonify, request

import pandas as pd
import requests

app = Flask(__name__)

filepath = '/etc/data/'

@app.route('/store-file', methods=['POST'])
def user_info():
    apidata = request.get_json()
    filename = apidata.get('file')
    data = apidata.get('data')
    print("hi")
    try:
        if not filename:
            raise ValueError("Invalid JSON input.")
        
    
        if data is not None:
            lines = data.split('\n')

            if filename is None:
                raise ValueError("Invalid JSON input.")
            
            # Create a temporary file to store the lines
            temp_file_path = filepath + filename

            with open(temp_file_path, 'w') as temp_file:
                for i, line in enumerate(lines):
                    line = line.replace(" ", "")
                    # Append a newline if it's not the last line
                    if i < len(lines) - 1:
                        temp_file.write(line + '\n')
                    else:
                        # For the last line, don't append a newline
                        temp_file.write(line)

            response = {
                "file": filename,
                "message": "Success."
            }

            return jsonify(response), 200

        else:
            headers = {
                "Content-Type": "application/json"
                }
            response = requests.post('http://temphandler:6050/temp', json = apidata, headers= headers)
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

    except IOError as e:
        error_message = {
            "file": filename,
            "error": "Error while storing the file to the storage."
        }
        print(str(e))
        return(jsonify(error_message)), 400

    except ValueError as ve:
        error_message = {
            "error": str(ve),
            "file" : None 
        }
        return(jsonify(error_message)), 400

@app.route('/get-temperature', methods=['POST'])
def temp_info():
    headers = {
        "Content-Type": "application/json"
    }
    response = requests.post('http://k8-container2:6050/temp', json = request.get_json(), headers= headers)
    response_data = response.json()
    return jsonify(response_data), response.status_code

    
if __name__ == '__main__':
    app.run()
    
    