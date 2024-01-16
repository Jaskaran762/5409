from flask import Flask, jsonify, request
import pandas as pd

app = Flask(__name__)

filepath = '/etc/data/'

@app.route('/temp', methods=['POST'])
def temp_info():
    data = request.get_json()
    
    try:
        filename = data['file']
        username = data['name']
        key = data['key']

        df = pd.read_csv(filepath + filename)

        if not df.empty:
            user_entries = df[df['name'] == username]

            if user_entries.empty:
                raise ValueError("Invalid JSON input.")

            # Find the latest temperature
            latest_temp = user_entries['temperature'].max()

            if pd.isna(latest_temp):
                raise ValueError("Invalid JSON input.")

            response = {
                "file": filename,
                "temperature": int(latest_temp)
            }

            return jsonify(response), 200
        else:
            raise ValueError("Invalid JSON input.")
    except (ValueError, KeyError) as ve:
        error_message = {
            "file": "null",
            "error": str(ve)
        }
        return jsonify(error_message), 400

