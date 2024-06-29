from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson.objectid import ObjectId
from bson import json_util
from datetime import datetime

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# MongoDB setup (Docker container)
client = MongoClient('mongodb://mongo:27017/')
db = client.taskinator
todos_collection = db.todos

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/todos', methods=['POST'])
def add_todo():
    data = request.json
    title = data.get('title')
    description = data.get('description')
    
    if not title:
        return jsonify({"error": "Title is required"}), 400
    
    new_todo = {
        'title': title,
        'description': description,
        'startDate': datetime.utcnow(),
        'completeDate': None,
        'status': 'todo'
    }
    result = todos_collection.insert_one(new_todo)
    
    added_todo = todos_collection.find_one({'_id': result.inserted_id})
    added_todo = json_util.dumps(added_todo)
    
    return added_todo, 201

@app.route('/api/todos', methods=['GET'])
def get_todos():
    todos = list(todos_collection.find())
    todos = json_util.dumps(todos)
    return todos

@app.route('/api/todos/<string:todo_id>', methods=['PUT'])
def edit_todo(todo_id):
    data = request.json
    title = data.get('title')
    description = data.get('description')
    
    update_fields = {}
    if title:
        update_fields['title'] = title
    if description:
        update_fields['description'] = description
    
    if not update_fields:
        return jsonify({"error": "No fields to update"}), 400

    result = todos_collection.update_one(
        {'_id': ObjectId(todo_id)},
        {'$set': update_fields}
    )
    if result.modified_count == 1:
        updated_todo = todos_collection.find_one({'_id': ObjectId(todo_id)})
        updated_todo = json_util.dumps(updated_todo)
        return updated_todo
    else:
        return jsonify({"error": "Todo not found"}), 404

@app.route('/api/todos/<string:todo_id>', methods=['DELETE'])
def delete_todo(todo_id):
    result = todos_collection.delete_one({'_id': ObjectId(todo_id)})
    if result.deleted_count == 1:
        return jsonify({"success": True}), 200
    else:
        return jsonify({"error": "Todo not found"}), 404

@app.route('/api/todos/<string:todo_id>/complete', methods=['PUT'])
def complete_todo(todo_id):
    result = todos_collection.update_one(
        {'_id': ObjectId(todo_id)},
        {'$set': {'status': 'completed', 'completeDate': datetime.utcnow()}}
    )
    if result.modified_count == 1:
        updated_todo = todos_collection.find_one({'_id': ObjectId(todo_id)})
        updated_todo = json_util.dumps(updated_todo)
        return updated_todo
    else:
        return jsonify({"error": "Todo not found"}), 404

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=2040)