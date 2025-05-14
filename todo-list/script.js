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

const todos = [
  {
    id: 1,
    title: "Shopping",
    isDone: false,
    createDate: new Date().toLocaleString(),
  },
  {
    id: 2,
    title: "Cleaning",
    isDone: false,
    createDate: new Date().toLocaleString(),
  },
];

function newTask() {
  if (input.value === "") {
    const popup = document.getElementById("error-popup");
    popup.classList.add("show");

    setTimeout(() => {
      popup.classList.remove("show");
    }, 2000);

    return;
  }

  const task = {
    id: Math.floor(Math.random() * 100000),
    title: input.value,
    isDone: false,
    createDate: new Date().toLocaleString(),
  };

  todos.push(task);
  input.value = "";
  addNewTask();
}

function deleteTask(targetId) {
  const targetIndex = todos.findIndex((item) => item.id == targetId);
  todos.splice(targetIndex, 1);
  addNewTask();
}

function editTask(targetId) {
  const targetIndex = todos.findIndex((item) => item.id === targetId);
  const task = todos[targetIndex];

  const li = document.querySelectorAll(".todo")[targetIndex];

  li.innerHTML = `
    <input class="todo__edit-input" type="text" value="${task.title}">
    <button class="todo__save-btn">Save</button>
    <span class="todo__date">(${task.createDate})</span>
  `;

  const input = li.querySelector(".todo__edit-input");
  const saveBtn = li.querySelector(".todo__save-btn");

  saveBtn.onclick = () => {
    task.title = input.value;
    addNewTask();
  };
}

function doneTask(targetId) {
  const task = document.getElementById(`task-${targetId}`);
  if (task) {
    task.classList.toggle('done');
  }
}


function addNewTask() {
  const html = todos
    .map((item) => {
      return `
 <li class="todo" id="task-${item.id}">
    <span class="todo__item">${item.title}</span>
    <span class="todo__date">(${item.createDate})</span>
    <button onclick="editTask(${item.id})" class="todo__check-btn"><i class="fas fa-pencil-alt"></i></button>
    <button class="todo__delete-btn" onclick="deleteTask(${item.id})"><i class="fas fa-trash"></i></button>
    <button class="todo__delete-btn" onclick="doneTask(${item.id})"><i class="fas fa-check-double"></i></button>
  </li>
`;
    })
    .join("");

  ul.innerHTML = html;
}

function addTaskByEnter(evt) {
  if (evt.key === "Enter") {
    newTask();
  }
}

addNewTask();

addBtn.addEventListener("click", newTask);
input.addEventListener("keypress", addTaskByEnter);
