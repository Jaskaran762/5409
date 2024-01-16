from flask import Flask, jsonify, request
import pandas as pd
from pandas.errors import ParserError  # Import ParserError

app = Flask(__name__)

filepath = '/etc/data/'

@app.route('/temp', methods=['POST'])
def temp_info():
    data = request.get_json()
    print("hello")
    try:
        filename = data.get('file')
        username = data.get('name')
        
        if not filename or not username:
            raise ValueError("Invalid JSON input.")
        
        df = pd.read_csv(filepath + filename)
        
        if 'name' not in df.columns or 'latitude' not in df.columns or 'longitude' not in df.columns:
            raise ParserError("Invalid CSV format")
        
        if not df.empty:
            user_entries = df[df['name'] == username]
            
            if user_entries.empty:
                raise ValueError("Invalid JSON input.")
            
            last_row = user_entries.iloc[-1]
            
            if 'temperature' in last_row and not pd.isna(last_row['temperature']):
                latest_temp_int = int(last_row['temperature'])
            else:
                raise ValueError("Invalid JSON input.")

            response = {
                "file": filename,
                "temperature": latest_temp_int
            }
            
            return jsonify(response), 200
        else:
            raise ValueError("Invalid JSON input.")
        
    except ParserError:
        error_message = {
            "file": filename,
            "error": "Input file not in CSV format."
        }
        return jsonify(error_message), 400
    
    except (ValueError, KeyError) as ve:
        error_message = {
            "error": str(ve),
            "file": None
        }
        return jsonify(error_message), 400
    
    except FileNotFoundError:
        error_message = {
            "file": filename,
            "error": "File not found."
        }
        return jsonify(error_message), 400

if __name__ == '__main__':
    app.run()
