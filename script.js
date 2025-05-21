function toggleTheme(theme) {
  const body = document.body;
  if (theme === "dark") {
    body.classList.add("dark-theme");
    body.classList.remove("light-theme");
  } else {
    body.classList.add("light-theme");
    body.classList.remove("dark-theme");
  }
}

const input = document.getElementById("task-input");
const ul = document.getElementById("todo-list");
const addBtn = document.getElementById("add-btn");
let editableItem;

const todos = [
  {
    id: 1,
    title: "Shopping",
    isDone: false,
    createDate: "5/21/2025, 1:37:30 AM",
  },
  {
    id: 2,
    title: "Cleaning",
    isDone: false,
    createDate: "5/19/2025, 2:26:50 AM",
  },
];

function newTask() {
  input.value === ""
    ? (() => {
        const popup = document.getElementById("error-popup");
        popup.classList.add("show");
        setTimeout(() => popup.classList.remove("show"), 2000);
      })()
    : (() => {
        const task = {
          id: Math.floor(Math.random() * 100000),
          title: input.value,
          isDone: false,
          createDate: new Date().toLocaleString(),
        };
        todos.push(task);
        input.value = "";
        addNewTask();
      })();
}

function deleteTask(targetId) {
  const targetIndex = todos.findIndex((item) => item.id == targetId);
  targetIndex !== -1 ? todos.splice(targetIndex, 1) : null;
  addNewTask();
}

function editTask(targetId) {
  editableItem = targetId;
  addNewTask();
}

function doneTask(targetId) {
  const task = document.getElementById(`task-${targetId}`);
  task ? task.classList.toggle("done") : null;
}

function handleSaveEdit(id) {
  const todoInput = document.getElementById("todo-id");
  const foundTodoIndex = todos.findIndex((item) => item.id == id);

  foundTodoIndex !== -1
    ? ((todos[foundTodoIndex].title = todoInput.value),
      (editableItem = null),
      addNewTask())
    : null;
}
function addNewTask() {
  ul.innerHTML = todos
    .map(
      (item) => `
      <li class="todo" id="task-${item.id}">
        ${
          item.id === editableItem
            ? `<input id="todo-id" class="todo__edit-input" value="${item.title}" />`
            : `<span class="todo__item">${item.title}</span>`
        }

        <span class="todo__date">(${item.createDate})</span>

        ${
          item.id === editableItem
            ? `<button class="todo__save-btn" onclick="handleSaveEdit(${item.id})">save</button>`
            : `<button onclick="editTask(${item.id})" class="todo__check-btn"><i class="fas fa-pencil-alt"></i></button>`
        }

        <button class="todo__delete-btn" onclick="deleteTask(${
          item.id
        })"><i class="fas fa-trash"></i></button>
        <button class="todo__delete-btn" onclick="doneTask(${
          item.id
        })"><i class="fas fa-check-double"></i></button>
      </li>
    `
    )
    .join("");
}

function addTaskByEnter(evt) {
  evt.key === "Enter" ? newTask() : null;
}

addNewTask();
addBtn.addEventListener("click", newTask);
input.addEventListener("keypress", addTaskByEnter);
