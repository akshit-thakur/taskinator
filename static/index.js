const API_BASE_URL = ""; // Update this with your actual API base URL if needed

document.addEventListener("DOMContentLoaded", () => {
  loadTodos();

  const addTodoForm = document.getElementById("addTodoForm");
  addTodoForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent default form submission

    const title = document.getElementById("todoTitle").value;
    const description = document.getElementById("todoDescription").value;

    document.getElementById("todoTitle").value = "";
    document.getElementById("todoDescription").value = "";

    addTodo({
      title,
      description,
    });
  });

  document
    .getElementById("todoList")
    .addEventListener("click", function (event) {
      if (event.target.classList.contains("delete-icon")) {
        const todoId = event.target.closest(".todo-item").dataset.todoId;
        deleteTodo(todoId);
      } else if (event.target.classList.contains("complete-icon")) {
        const todoId = event.target.closest(".todo-item").dataset.todoId;
        completeTodo(todoId);
      } else if (event.target.classList.contains("edit-icon")) {
        const todoId = event.target.closest(".todo-item").dataset.todoId;
        editTodoPrompt(todoId);
      }
    });
});

const loadTodos = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/todos`);
    const todos = await response.json();

    const todoList = document.getElementById("todoList");
    todoList.innerHTML = "";

    todos.forEach((todo) => {
      const todoItem = createTodoElement(todo);
      todoList.appendChild(todoItem);
    });
  } catch (error) {
    console.error("Error loading todos:", error);
  }
};

const addTodo = async (newTodo) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/todos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTodo),
    });

    if (!response.ok) {
      throw new Error("Failed to add todo");
    }

    const addedTodo = await response.json();
    appendTodoToList(addedTodo);
  } catch (error) {
    console.error("Error adding todo:", error);
    alert("Failed to add todo. Please try again.");
  }
};

const deleteTodo = async (todoId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/todos/${todoId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete todo");
    }

    removeTodoFromList(todoId);
  } catch (error) {
    console.error("Error deleting todo:", error);
    alert("Failed to delete todo. Please try again.");
  }
};

const completeTodo = async (todoId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/todos/${todoId}/complete`,
      {
        method: "PUT",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to complete todo");
    }

    const updatedTodo = await response.json();
    updateTodoInList(updatedTodo);
  } catch (error) {
    console.error("Error completing todo:", error);
    alert("Failed to complete todo. Please try again.");
  }
};

const editTodo = async (todoId, updatedTodo) => {
  try {
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
  } catch (error) {
    console.error("Error editing todo:", error);
    alert("Failed to edit todo. Please try again.");
  }
};

const appendTodoToList = (todo) => {
  const todoList = document.getElementById("todoList");
  const todoItem = createTodoElement(todo);
  todoList.appendChild(todoItem);
};

const updateTodoInList = (todo) => {
  const todoItem = document.querySelector(
    `.todo-item[data-todo-id="${todo._id.$oid}"]`
  );
  if (todoItem) {
    const todoTitle = todoItem.querySelector(".todo-title");
    const todoDescription = todoItem.querySelector(".todo-description");
    todoTitle.textContent = todo.title;
    todoDescription.textContent = todo.description;
  }
};

const removeTodoFromList = (todoId) => {
  const todoItem = document.querySelector(
    `.todo-item[data-todo-id="${todoId}"]`
  );
  if (todoItem) {
    todoItem.remove();
  }
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

const editTodoPrompt = (todoId) => {
  const todoItem = document.querySelector(
    `.todo-item[data-todo-id="${todoId}"]`
  );
  const title = todoItem.querySelector(".todo-title").textContent;
  const description = todoItem.querySelector(".todo-description").textContent;

  const newTitle = prompt("Edit Todo Title:", title);
  const newDescription = prompt("Edit Todo Description:", description);

  if (newTitle !== null && newDescription !== null) {
    editTodo(todoId, { title: newTitle, description: newDescription });
  }
};
