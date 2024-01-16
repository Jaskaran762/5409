from flask import Flask, request, jsonify
import mysql.connector
import requests

app = Flask(__name__)

# Replace these values with your actual database and Redis configurations
db_config = {
    'host': 'my-rds.c4vdsenzhvlb.us-east-1.rds.amazonaws.com',
    'database': 'assignment',
    'user': 'admin',
    'password': 'qwerty123',
    'port': '3306'
}

# Initialize the database
def init_db():
    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS products (
            name varchar(100),
            price varchar(100),
            availability boolean
        )
    """)
    conn.commit()
    conn.close()

# Store products in the database
@app.route('/store-products', methods=['POST'])
def store_products():
    try:
        data = request.json.get('products', [])
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        for product in data:
            cursor.execute("""
                INSERT INTO products (name, price, availability)
                VALUES (%s, %s, %s)
            """, (product['name'], product['price'], product['availability']))

        conn.commit()
        conn.close()

        return jsonify({"message": "Success."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# List products from the cache (Redis) or database
@app.route('/list-products', methods=['GET'])
def list_products():
    try:

        # Try to retrieve products from Redis
        products_str = requests.get('http://44.197.226.68:5000/list-products')

        if products_str.status_code==200:
            # If data is present in Redis, convert the string to a list
            products = products_str
            cache_status = True
        else:
            # If data is not present in Redis, fetch from the database
            conn = mysql.connector.connect(**db_config)
            cursor = conn.cursor(dictionary=True)
            cursor.execute("SELECT * FROM products")
            products = cursor.fetchall()
            conn.close()

            # Convert the data to the required format
            products = [{"name": row['name'], "price": row['price'], "availability": row['availability']} for row in products]

            # Store the data in Redis for future use
            requests.post('http://100.27.37.69:5000/store-products', json = jsonify(products), headers= {"Content-Type": "application/json"})
            cache_status = False

        return jsonify({"products": products, "cache": cache_status}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    init_db()
    app.run(host='0.0.0.0', port=5000)
