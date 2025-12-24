document.querySelector("#addBtn").addEventListener("click", addTask);
document.querySelector("#clearBtn").addEventListener("click", clearAll);
document.querySelector("#searchInput").addEventListener("keyup", searchTask);

function addTask() {
    let taskText = document.querySelector("#taskInput").value;
    let priority = document.querySelector("#priorityInput").value;

    if (taskText === "") {
        alert("Enter a task");
        return;
    }

    let li = document.createElement("li");
    li.classList.add(priority);

    let span = document.createElement("span");
    span.innerHTML = taskText;

    let status = document.createElement("select");
    status.innerHTML = `
        <option value="pending">Pending</option>
        <option value="done">Done</option>
    `;

    status.onchange = function () {
        span.classList.toggle("done", this.value === "done");
        updateCounts();
    };

     // Edit button
    let editBtn = document.createElement("button");
    editBtn.innerText = "Edit";
    editBtn.className = "edit-btn";

    editBtn.onclick = function () {
        let newText = prompt("Edit task:", span.innerText);
        if (newText) {
            span.innerText = newText;
        }
    };

    status.onchange = function () {
        if (this.value === "done") {
            span.classList.add("done");
            editBtn.disabled = true;
        } else {
            span.classList.remove("done");
            editBtn.disabled = false;
        }
        updateCounts();
    };

    li.append(span, status, editBtn);
    document.querySelector("#taskList").append(li);

    document.querySelector("#taskInput").value = "";
    updateCounts();
}

function clearAll() {
    document.querySelector("#taskList").innerHTML = "";
    updateCounts();
}

function searchTask() {
    let filter = document.querySelector("#searchInput").value.toLowerCase();
    let tasks = document.querySelectorAll("#taskList li");
    let found = false;

    tasks.forEach(task => {
        let text = task.querySelector("span").innerText.toLowerCase();

        if (text.includes(filter)) {
            task.style.display = "flex";
            found = true;
        } else {
            task.style.display = "none";
        }
    });

    // show / hide "Task not found"
    document.querySelector("#noTaskMsg").style.display =
        found ? "none" : "block";
}


function updateCounts() {
    const tasks = document.querySelectorAll("#taskList li");

    const done = document.querySelectorAll("#taskList .done").length;

    const low = document.querySelectorAll("#taskList li.low").length;
    const medium = document.querySelectorAll("#taskList li.medium").length;
    const high = document.querySelectorAll("#taskList li.high").length;

    document.querySelector("#totalCount").innerText =
        "Total: " + tasks.length;

    document.querySelector("#doneCount").innerText =
        "Done: " + done;

    document.querySelector("#pendingCount").innerText =
        "Pending: " + (tasks.length - done);

    document.querySelector("#lowCount").innerText =
        "Low: " + low;

    document.querySelector("#mediumCount").innerText =
        "Medium: " + medium;

    document.querySelector("#highCount").innerText =
        "High: " + high;
}

document.querySelector("#totalCount").addEventListener("click", showAll);
document.querySelector("#doneCount").addEventListener("click", showDone);
document.querySelector("#pendingCount").addEventListener("click", showPending);

document.querySelector("#lowCount").addEventListener("click", () => filterByPriority("low"));
document.querySelector("#mediumCount").addEventListener("click", () => filterByPriority("medium"));
document.querySelector("#highCount").addEventListener("click", () => filterByPriority("high"));

function showAll() {
    document.querySelectorAll("#taskList li").forEach(li => {
        li.style.display = "flex";
    });
}

function showDone() {
    document.querySelectorAll("#taskList li").forEach(li => {
        const span = li.querySelector("span");
        li.style.display = span.classList.contains("done") ? "flex" : "none";
    });
}

function showPending() {
    document.querySelectorAll("#taskList li").forEach(li => {
        const span = li.querySelector("span");
        li.style.display = span.classList.contains("done") ? "none" : "flex";
    });
}

function filterByPriority(level) {
    document.querySelectorAll("#taskList li").forEach(li => {
        li.style.display = li.classList.contains(level)
            ? "flex"
            : "none";
    });
}
