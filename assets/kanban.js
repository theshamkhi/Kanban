document.addEventListener("DOMContentLoaded", loadTasks);

function openModal() {
  document.getElementById("myModal").classList.remove("hidden");
}

function closeModal() {
  document.getElementById("myModal").classList.add("hidden");
  clearModal(); // Clear fields after closing the modal
}

function saveTask() {
  // Get values from modal fields
  const title = document.getElementById("name").value;
  const status = document.getElementById("status").value;
  const priority = document.getElementById("priority").value;
  const dueDate = document.getElementById("date").value;
  const description = document.getElementById("description").value;

  const task = {
    title,
    status,
    priority,
    dueDate,
    description,
  };

  // Save task to localStorage
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));

  // Add task to the UI
  DisplayTask(task);

  // Close the modal and clear the form
  closeModal();
}

function DisplayTask(task) {
  // Create task element
  const taskElement = document.createElement("div");
  taskElement.classList.add("bg-gray-800", "p-5", "rounded-lg", "shadow-lg", "card-shadow", "transition", "transform", "hover:scale-105");
  taskElement.innerHTML = `
    <p class="TaskTitle text-lg font-semibold">${task.title}</p>
    <p class="text-sm text-gray-400">Priority: ${task.priority} | Due: ${task.dueDate}</p>
    <p class="TaskDescription mt-2 text-gray-300">${task.description}</p>
    <div class="flex mt-4 space-x-3">
      <button class="DeleteTask bg-red-500 text-white text-sm font-semibold px-4 py-1.5 rounded-full hover:bg-red-600 transition">Delete</button>
      <button class="bg-yellow-400 text-gray-800 text-sm font-semibold px-4 py-1.5 rounded-full hover:bg-yellow-500 transition">Edit</button>
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

function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach(DisplayTask);
}

function removeTaskFromLocalStorage(taskToRemove) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const updatedTasks = tasks.filter(task => task.title !== taskToRemove.title || task.dueDate !== taskToRemove.dueDate);
  localStorage.setItem("tasks", JSON.stringify(updatedTasks));
}

function clearModal() {
  document.getElementById("name").value = "";
  document.getElementById("date").value = "";
  document.getElementById("description").value = "";
}
