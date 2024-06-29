# Taskinator Website

Taskinator is a simple task management application built using Flask, MongoDB, and Bootstrap. It allows users to manage their tasks with features like adding, editing, completing, and deleting tasks.

## Features

- **Add Task**: Users can add new tasks with a title and optional description.
- **Edit Task**: Tasks can be edited to update the title and description.
- **Complete Task**: Tasks can be marked as completed with a completion date.
- **Delete Task**: Users can delete tasks they no longer need.
- **Responsive Design**: The website is designed to work seamlessly across different devices.

## Technologies Used

- **Flask**: Python-based web framework for building the backend API.
- **MongoDB**: NoSQL database used to store task data.
- **Bootstrap**: Frontend framework for responsive design and UI components.
- **FontAwesome**: Icon library used for task management icons.
- **jQuery**: JavaScript library used for DOM manipulation and AJAX requests.

## Installation

To run Taskinator locally, follow these steps:

1. Clone the repository:

git clone
cd taskinator

2. Install dependencies:

pip install -r requirements.txt

3. Set up MongoDB:
- Install MongoDB and start the MongoDB service.
- Configure MongoDB URI in `app.py` for `MongoClient`.

4. Run the Flask application:
python app.py

5. Access Taskinator in your web browser: 
http://localhost:2040/

## API Endpoints

- **POST /api/todos**: Add a new task.
- **GET /api/todos**: Get all tasks.
- **PUT /api/todos/<todo_id>**: Update an existing task.
- **DELETE /api/todos/<todo_id>**: Delete a task.
- **PUT /api/todos/<todo_id>/complete**: Mark a task as completed.

## Folder Structure

taskinator/
│
├── static/         (Static assets like CSS and JavaScript)
├── templates/      (HTML templates)
├── app.py          (Flask application)
├── requirements.txt (Python dependencies)
└── README.md       (This file)

## Contributing

Contributions are welcome! If you find any issues or have suggestions, feel free to create a pull request or raise an issue.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
