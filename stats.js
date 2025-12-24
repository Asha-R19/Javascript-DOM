const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
const taskBody = document.getElementById("taskBody");
const noTaskMsg = document.getElementById("noTaskMsg");

/* COUNTS */
document.getElementById("total").innerText = tasks.length;
document.getElementById("pending").innerText = tasks.filter(t => t.status === "pending").length;
document.getElementById("done").innerText = tasks.filter(t => t.status === "done").length;
document.getElementById("low").innerText = tasks.filter(t => t.priority === "low").length;
document.getElementById("medium").innerText = tasks.filter(t => t.priority === "medium").length;
document.getElementById("high").innerText = tasks.filter(t => t.priority === "high").length;

/* RENDER TABLE */
function renderTasks(list) {
    taskBody.innerHTML = "";

    if (list.length === 0) {
        noTaskMsg.style.display = "block";
        return;
    }

    noTaskMsg.style.display = "none";

    list.forEach(t => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${t.text}</td>
            <td>${t.dueDate}</td>
            <td>${t.status}</td>
            <td>${t.priority}</td>
        `;
        taskBody.appendChild(row);
    });
}

/* FILTERS */
function showAll() {
    renderTasks(tasks);
}

function filterStatus(status) {
    renderTasks(tasks.filter(t => t.status === status));
}

function filterPriority(priority) {
    renderTasks(tasks.filter(t => t.priority === priority));
}
