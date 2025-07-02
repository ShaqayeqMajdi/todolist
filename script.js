const theme = localStorage.getItem("theme");
toggleTheme(theme);

function toggleTheme(theme) {
  const body = document.body;
  if (theme === "dark") {
    body.classList.add("dark-theme");
    body.classList.remove("light-theme");
  } else {
    body.classList.add("light-theme");
    body.classList.remove("dark-theme");
  }
  localStorage.setItem("theme", theme);
}

const input = document.getElementById("task-input");
const ul = document.getElementById("todo-list");
const addBtn = document.getElementById("add-btn");
let deleteId = null;
let editableItem;

let currentFilter = localStorage.getItem("filter") || "all";

const todos = JSON.parse(localStorage.getItem("todos")) || [
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

function saveToLocalStorage() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

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
        saveToLocalStorage();
        addNewTask();
      })();
}

function deleteTask(targetId) {
  deleteId = targetId;
  document.getElementById("confirm-modal").classList.add("show");
}
document.getElementById("confirm-delete").addEventListener("click", () => {
  const index = todos.findIndex((item) => item.id == deleteId);
  index !== -1 ? todos.splice(index, 1) : null;
  saveToLocalStorage();
  addNewTask();
  deleteId = null;
  document.getElementById("confirm-modal").classList.remove("show");
});
document.getElementById("cancel-delete").addEventListener("click", () => {
  deleteId = null;
  document.getElementById("confirm-modal").classList.remove("show");
});

function editTask(targetId) {
  editableItem = targetId;
  saveToLocalStorage();
  addNewTask();
}

function doneTask(targetId) {
  const index = todos.findIndex((item) => item.id == targetId);
  if (index !== -1) {
    todos[index].isDone = !todos[index].isDone;
    saveToLocalStorage();
    addNewTask();
  }
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
    .filter((item) => {
      if (currentFilter === "done") return item.isDone;
      if (currentFilter === "undone") return !item.isDone;
      return true;
    })
    .map(
      (item) => `
      <li class="todo ${item.isDone ? "done" : ""}" id="task-${item.id}">
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

  updateActiveFilterButton();
}

function setFilter(filter) {
  currentFilter = filter;
  localStorage.setItem("filter", filter);
  addNewTask();
}

function updateActiveFilterButton() {
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.classList.remove("active");
    if (btn.dataset.filter === currentFilter) {
      btn.classList.add("active");
    }
  });
}

document.querySelectorAll(".filter-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const selected = btn.getAttribute("data-filter");
    setFilter(selected);
  });
});

function addTaskByEnter(evt) {
  evt.key === "Enter" ? newTask() : null;
}

addNewTask();
addBtn.addEventListener("click", newTask);
input.addEventListener("keypress", addTaskByEnter);
ul.addEventListener("keypress", (e) => {
  if (e.target.id === "todo-id" && e.key === "Enter") {
    handleSaveEdit(editableItem);
  }
});
