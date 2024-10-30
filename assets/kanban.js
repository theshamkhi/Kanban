document.addEventListener("DOMContentLoaded", LoadTasks);

function OpenModal() {
  document.getElementById("Modal").classList.remove("hidden");
}

function CloseModal() {
  document.getElementById("Modal").classList.add("hidden");
  ClearModal(); // Clear fields after closing the modal
}

function SaveTask() {
  // Get values from modal fields
  const title = document.getElementById("title").value;
  const status = document.getElementById("status").value;
  const priority = document.getElementById("priority").value;
  const dueDate = document.getElementById("date").value;
  const description = document.getElementById("description").value;

  if (title == "") {
    alert("Fields must be filled out");
    return false;
  }
  else {
    const task = {title, status, priority, dueDate, description};

    // Save task to localStorage
    const tasks = JSON.parse(localStorage.getItem("tasks")) || []; //JSON.parse() to convert text into a JavaScript object
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));//JSON.stringify() to convert it into a string

    // Add task to the UI
    DisplayTask(task);

    // Close the modal and clear the form
    CloseModal();
  }
}

function DisplayTask(task) {
  // Create task element
  const taskElement = document.createElement("div");
  taskElement.classList.add("bg-gray-800", "p-5", "rounded-lg", "shadow-lg", "card-shadow", "transition", "transform", "hover:scale-105");
  let priorityClass = "";

  if (task.priority === "P1") {
    priorityClass = "text-red-600";
  }
  else if (task.priority === "P2") {
    priorityClass = "text-blue-600";
  }
  else if (task.priority === "P3") {
    priorityClass = "text-green-500";
  }
  
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
  

  // Append task to the correct column based on status
  const columnId = task.status === "ToDo" ? "TodoCol" : task.status === "Doing" ? "DoingCol" : "DoneCol";
  document.getElementById(columnId).querySelector(".space-y-4").appendChild(taskElement);

  // Add event listener to delete button
  taskElement.querySelector(".DeleteTask").addEventListener("click", () => {
    taskElement.remove();
    removeTaskFromLocalStorage(task);
  });
}

function LoadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach(DisplayTask);
}

function removeTaskFromLocalStorage(taskToRemove) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const updatedTasks = tasks.filter(task => task.title !== taskToRemove.title || task.dueDate !== taskToRemove.dueDate);
  localStorage.setItem("tasks", JSON.stringify(updatedTasks));
}

function ClearModal() {
  document.getElementById("title").value = "";
  document.getElementById("date").value = "";
  document.getElementById("description").value = "";
}