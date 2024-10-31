/*

# element.addEventListener(event, function);
# document.getElementById("id").onclick = function(){code}	== document.getElementById("id").addEventListener("click", function);
# document.getElementById(id) - document.getElementsByTagName(name) - document.getElementsByClassName(name)
# document.createElement(element) - document.removeChild(element) - document.appendChild(element)

*/
document.addEventListener("DOMContentLoaded", LoadTasks);

let Index = null; // Track the task index being edited

function OpenModal() {
  document.getElementById("Modal").classList.remove("hidden");
}

function CloseModal() {
  document.getElementById("Modal").classList.add("hidden");
  ClearModal(); // Clear fields after closing the modal
  Index = null; // Reset editing index
}

function SaveTask() {
  // Get values from modal fields
  const title = document.getElementById("title").value;
  const status = document.getElementById("status").value;
  const priority = document.getElementById("priority").value;
  const dueDate = document.getElementById("date").value;
  const description = document.getElementById("description").value;

  // Input validation for title and status
  if (title === "") {
    alert("Title field must be filled out");
    return false;
  }
  if (status === "") {
    alert("Please select a status for the task");
    return false;
  }

  const task = { title, status, priority, dueDate, description };
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  //JSON.parse(): Converting JSON strings into JavaScript objects //localStorage.getItem: Retrieving data

  if (Index !== null) {
    // Update existing task
    tasks[Index] = task;
  } else {
    // Add new task
    tasks.push(task);
  }

  localStorage.setItem("tasks", JSON.stringify(tasks));
  //JSON.stringify(): Converting an object into a JSON string //localStorage.setItem: Storing data

  LoadTasks(); // Reload tasks to update UI

  // Close the modal and clear the form
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
  document.getElementById(columnId).querySelector(".Tasks").appendChild(taskElement);

  taskElement.querySelector(".DeleteTask").addEventListener("click", () => {
    taskElement.remove();
    removeTaskFromLocalStorage(task);
  });

  taskElement.querySelector(".EditTask").addEventListener("click", () => {
    EditTask(index); // Pass the index of the task to be edited
  });
}

function LoadTasks() {

  //JSON.parse(): Converting JSON strings into JavaScript objects //localStorage.getItem: Retrieving data
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  
  // Clear existing tasks from the UI
  document.querySelectorAll(".Tasks").forEach(col => col.innerHTML = "");

  // Count tasks by status
  let TodoCount = 0;
  let DoingCount = 0;
  let DoneCount = 0;

  // Display tasks and count them by column
  tasks.forEach((task, index) => {
    DisplayTask(task, index);
    if (task.status === "ToDo")
      TodoCount++;
    else if (task.status === "Doing")
      DoingCount++;
    else if (task.status === "Done")
      DoneCount++;
  });

  // Update the column headers with the task counts
  document.getElementById("TodoCount").textContent = `(${TodoCount})`;
  document.getElementById("DoingCount").textContent = `(${DoingCount})`;
  document.getElementById("DoneCount").textContent = `(${DoneCount})`;
}



function EditTask(index) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  //JSON.parse(): Converting JSON strings into JavaScript objects //localStorage.getItem: Retrieving data
  const task = tasks[index];

  // Fill modal fields with the task's data
  document.getElementById("title").value = task.title;
  document.getElementById("status").value = task.status;
  document.getElementById("priority").value = task.priority;
  document.getElementById("date").value = task.dueDate;
  document.getElementById("description").value = task.description;

  Index = index; // Set the task index for editing
  OpenModal();
}

function removeTaskFromLocalStorage(taskToRemove) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  //JSON.parse(): Converting JSON strings into JavaScript objects //localStorage.getItem: Retrieving data
  const updatedTasks = tasks.filter(task => task.title !== taskToRemove.title || task.dueDate !== taskToRemove.dueDate);
  localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  //JSON.stringify(): Converting an object into a JSON string //localStorage.setItem: Storing data
}

function ClearModal() {
  document.getElementById("title").value = "";
  document.getElementById("status").value = "Select...";
  document.getElementById("priority").value = "Select...";
  document.getElementById("date").value = "";
  document.getElementById("description").value = "";
}
