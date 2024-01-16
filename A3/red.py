import redis
from flask import Flask, request, jsonify

app = Flask(__name__)

redis_host = 'localhost'
redis_port = 6379

# Store products in the Redis cache
@app.route('/store-products', methods=['POST'])
def store_products_redis():
    try:
        data = request.json.get('products', [])
        r = redis.StrictRedis(host=redis_host, port=redis_port, decode_responses=True)

        # Store products information in Redis
        r.set('products', str(data))

        return jsonify({"message": "Success."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# List products from the Redis cache
@app.route('/list-products', methods=['GET'])
def list_products_redis():
    try:
        r = redis.StrictRedis(host=redis_host, port=redis_port, decode_responses=True)

        # Try to retrieve products from Redis
        products_str = r.get('products')

        if products_str:
            # If data is present in Redis, convert the string to a list
            products = eval(products_str)
            return jsonify({"products": products}), 200
        else:
            return jsonify({"error": "No data in Redis cache"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)