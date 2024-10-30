document.addEventListener("DOMContentLoaded", LoadTasks);

let currentTaskIndex = null; // Track the index of the task being edited

function OpenModal() {
  document.getElementById("Modal").classList.remove("hidden");
}

function CloseModal() {
  document.getElementById("Modal").classList.add("hidden");
  ClearModal();
  currentTaskIndex = null; // Reset index when closing modal
}

function SaveTask() {
  // Get values from modal fields
  const title = document.getElementById("title").value;
  const status = document.getElementById("status").value;
  const priority = document.getElementById("priority").value;
  const dueDate = document.getElementById("date").value;
  const description = document.getElementById("description").value;

  if (title === "") {
    alert("Fields must be filled out");
    return false;
  }

  const task = { title, status, priority, dueDate, description };
  const tasks = JSON.parse(localStorage.getItem("tasks")) || []; //JSON.parse() to convert text into a JavaScript object

  if (currentTaskIndex !== null) {
    // Update existing task
    tasks[currentTaskIndex] = task;
  } else {
    // Add new task
    tasks.push(task);
  }

  localStorage.setItem("tasks", JSON.stringify(tasks)); //JSON.stringify() to convert it into a string
  ClearTasksDisplay(); // Clear current display
  LoadTasks(); // Re-load tasks to reflect changes
  CloseModal();
}

function DisplayTask(task, index) {
  const taskElement = document.createElement("div");
  taskElement.classList.add("bg-gray-800", "p-5", "rounded-lg", "shadow-lg", "card-shadow", "transition", "transform", "hover:scale-105");

  let priorityClass = task.priority === "P1" ? "text-red-600" : task.priority === "P2" ? "text-blue-600" : "text-green-500";

  taskElement.innerHTML = `
    <div class="flex justify-between">
      <p class="TaskTitle text-lg font-semibold">${task.title}</p>
      <p class="text-sm ${priorityClass}">${task.priority}</p>
    </div>
    <p class="text-sm text-gray-400">Due: ${task.dueDate}</p>
    <p class="TaskDescription mt-2 text-gray-300">${task.description}</p>
    <div class="flex mt-4 space-x-3">
      <button class="DeleteTask bg-red-500 text-white text-sm font-semibold px-4 py-1.5 rounded-full hover:bg-red-600 transition">Delete</button>
      <button class="EditTask bg-yellow-400 text-gray-800 text-sm font-semibold px-4 py-1.5 rounded-full hover:bg-yellow-500 transition">Edit</button>
    </div>
  `;

  const columnId = task.status === "ToDo" ? "TodoCol" : task.status === "Doing" ? "DoingCol" : "DoneCol";
  document.getElementById(columnId).querySelector(".space-y-4").appendChild(taskElement);

  // Add event listener for delete
  taskElement.querySelector(".DeleteTask").addEventListener("click", () => {
    taskElement.remove();
    removeTaskFromLocalStorage(task);
  });

  // Add event listener for edit
  taskElement.querySelector(".EditTask").addEventListener("click", () => {
    OpenModal();
    FillModalWithTask(task, index);
  });
}

function removeTaskFromLocalStorage(taskToRemove) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const updatedTasks = tasks.filter(task => task.title !== taskToRemove.title || task.dueDate !== taskToRemove.dueDate);
  localStorage.setItem("tasks", JSON.stringify(updatedTasks));
}

function FillModalWithTask(task, index) {
  document.getElementById("title").value = task.title;
  document.getElementById("status").value = task.status;
  document.getElementById("priority").value = task.priority;
  document.getElementById("date").value = task.dueDate;
  document.getElementById("description").value = task.description;
  currentTaskIndex = index; // Set current task index for editing
}

function LoadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach((task, index) => DisplayTask(task, index));
}

function ClearModal() {
  document.getElementById("title").value = "";
  document.getElementById("status").value = "";
  document.getElementById("priority").value = "";
  document.getElementById("date").value = "";
  document.getElementById("description").value = "";
}

function ClearTasksDisplay() {
  const columns = ["TodoCol", "DoingCol", "DoneCol"];
  columns.forEach(columnId => {
    const column = document.getElementById(columnId);
    const taskContainer = column.querySelector(".space-y-4");
    taskContainer.innerHTML = ""; // Clear existing tasks
  });
}
