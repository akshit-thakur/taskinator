const API_BASE_URL = ""; // Set your API base URL here

document.addEventListener("DOMContentLoaded", () => {
  loadTodos();

  const addTodoForm = document.getElementById("addTodoForm");
  addTodoForm.addEventListener("submit", handleAddTodo);

  const todoList = document.getElementById("todoList");
  todoList.addEventListener("click", handleTodoListClick);
});

const handleAddTodo = async (event) => {
  event.preventDefault(); // Prevent default form submission

  const title = document.getElementById("todoTitle").value;
  const description = document.getElementById("todoDescription").value;

  try {
    const todo = {
      title,
      description,
      startDate: new Date(),
      status: "todo",
    };

    await addTodoAPI(todo);
    clearAddTodoForm();
    $("#addTodoModal").modal("hide");
    loadTodos(); // Reload todos after adding
  } catch (error) {
    console.error("Error adding todo:", error);
    alert("Failed to add todo. Please try again.");
  }
};

const handleTodoListClick = async (event) => {
  if (event.target.classList.contains("delete-icon")) {
    const todoId = getTodoIdFromEvent(event);
    await deleteTodoAPI(todoId);
    loadTodos(); // Reload todos after deletion
  } else if (event.target.classList.contains("complete-icon")) {
    const todoId = getTodoIdFromEvent(event);
    await toggleCompleteAPI(todoId);
  } else if (event.target.classList.contains("edit-icon")) {
    const todoId = getTodoIdFromEvent(event);
    editTodoPrompt(todoId);
  }
};

const loadTodos = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/todos`);
    if (!response.ok) {
      throw new Error("Failed to fetch todos");
    }
    const todos = await response.json();
    displayTodos(todos);
  } catch (error) {
    console.error("Error loading todos:", error);
    alert("Failed to load todos. Please try again.");
  }
};

const displayTodos = (todos) => {
  const todoList = document.getElementById("todoList");
  todoList.innerHTML = ""; // Clear existing list

  todos.forEach((todo) => {
    const todoItem = createTodoElement(todo);
    todoList.appendChild(todoItem);
  });
};

const addTodoAPI = async (todo) => {
  const response = await fetch(`${API_BASE_URL}/api/todos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(todo),
  });

  if (!response.ok) {
    throw new Error("Failed to add todo");
  }

  const addedTodo = await response.json();
  return addedTodo;
};

const deleteTodoAPI = async (todoId) => {
  const response = await fetch(`${API_BASE_URL}/api/todos/${todoId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete todo");
  }
};

const toggleCompleteAPI = async (todoId) => {
  const response = await fetch(`${API_BASE_URL}/api/todos/${todoId}/complete`, {
    method: "PUT",
  });

  if (!response.ok) {
    throw new Error("Failed to toggle todo completion");
  }

  const updatedTodo = await response.json();
  updateTodoInList(updatedTodo);
};

const editTodoPrompt = (todoId) => {
  const todoItem = document.querySelector(
    `.todo-item[data-todo-id="${todoId}"]`
  );
  if (!todoItem) return;

  const title = todoItem.querySelector(".todo-title").textContent;
  const description = todoItem.querySelector(".todo-description").textContent;

  const newTitle = prompt("Edit Todo Title:", title);
  const newDescription = prompt("Edit Todo Description:", description);

  if (newTitle !== null && newDescription !== null) {
    const updatedTodo = {
      title: newTitle,
      description: newDescription,
    };
    editTodoAPI(todoId, updatedTodo);
  }
};

const editTodoAPI = async (todoId, updatedTodo) => {
  const response = await fetch(`${API_BASE_URL}/api/todos/${todoId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedTodo),
  });

  if (!response.ok) {
    throw new Error("Failed to edit todo");
  }

  const updatedTodoResponse = await response.json();
  updateTodoInList(updatedTodoResponse);
};

const updateTodoInList = (todo) => {
  const todoItem = document.querySelector(
    `.todo-item[data-todo-id="${todo._id.$oid}"]`
  );
  if (!todoItem) return;

  const todoTitle = todoItem.querySelector(".todo-title");
  const todoDescription = todoItem.querySelector(".todo-description");
  todoTitle.textContent = todo.title;
  todoDescription.textContent = todo.description;
};

const createTodoElement = (todo) => {
  const li = document.createElement("li");
  li.className =
    "list-group-item todo-item d-flex justify-content-between align-items-center";
  li.dataset.todoId = todo._id.$oid;

  const todoContent = `
    <div>
      <h5 class="todo-title">${todo.title}</h5>
      <p class="todo-description">${todo.description}</p>
    </div>
    <div>
      <i class="fas fa-check complete-icon text-success mx-2" role="button"></i>
      <i class="fas fa-edit edit-icon text-primary mx-2" role="button"></i>
      <i class="fas fa-trash delete-icon text-danger" role="button"></i>
    </div>
  `;
  li.innerHTML = todoContent;

  return li;
};

const clearAddTodoForm = () => {
  document.getElementById("todoTitle").value = "";
  document.getElementById("todoDescription").value = "";
};

const getTodoIdFromEvent = (event) => {
  return event.target.closest(".todo-item").dataset.todoId;
};
