const taskInput = document.getElementById("taskInput");
const priorityInput = document.getElementById("priorityInput");
const dueDateInput = document.getElementById("dueDate");
const taskList = document.getElementById("taskList");
const searchInput = document.getElementById("searchInput");
const noTaskMsg = document.getElementById("noTaskMsg");

document.getElementById("addBtn").onclick = addTask;
document.getElementById("clearBtn").onclick = clearAll;
searchInput.onkeyup = searchTask;

/* ADD TASK */
function addTask() {
    if (!taskInput.value || !priorityInput.value || !dueDateInput.value) {
        alert("Fill all fields");
        return;
    }

    const li = document.createElement("li");
    li.classList.add(priorityInput.value);

    const taskSpan = document.createElement("span");
    taskSpan.innerText = taskInput.value;

    const dateSpan = document.createElement("span");
    dateSpan.innerText = dueDateInput.value;

    const status = document.createElement("select");
    status.innerHTML = `
        <option value="pending">Pending</option>
        <option value="done">Done</option>
    `;

    const prioritySpan = document.createElement("span");
    prioritySpan.innerText = priorityInput.value;
    prioritySpan.className = "priority-text";

    const editBtn = document.createElement("button");
    editBtn.innerText = "Edit";
    editBtn.className = "edit-btn";

    editBtn.onclick = () => {
        if (editBtn.disabled) return;
        const newText = prompt("Edit task:", taskSpan.innerText);
        if (newText) {
            taskSpan.innerText = newText;
            saveTasks();
        }
    };

    const deleteBtn = document.createElement("button");
    deleteBtn.innerText = "Delete";
    deleteBtn.className = "delete-btn";
    deleteBtn.onclick = () => {
        if (confirm("Delete task?")) {
            li.remove();
            saveTasks();
        }
    };

    const actions = document.createElement("div");
    actions.className = "actions";
    actions.append(editBtn, deleteBtn);

    li.append(taskSpan, dateSpan, status, prioritySpan, actions);
    taskList.append(li);

    applyOverdue(li, dateSpan.innerText, status.value);

    status.onchange = () => {
        if (status.value === "done") {
            if (!confirm("Mark task as completed?")) {
                status.value = "pending";
                return;
            }
            taskSpan.classList.add("done");
            editBtn.disabled = true;
            editBtn.classList.add("edit-disabled");
            li.classList.remove("overdue");
        } else {
            taskSpan.classList.remove("done");
            editBtn.disabled = false;
            editBtn.classList.remove("edit-disabled");
            applyOverdue(li, dateSpan.innerText, "pending");
        }
        saveTasks();
    };

    taskInput.value = "";
    dueDateInput.value = "";
    priorityInput.value = "";

    saveTasks();
}

/* OVERDUE CHECK */
function applyOverdue(li, dueDate, status) {
    const today = new Date();
    today.setHours(0,0,0,0);

    const due = new Date(dueDate);
    due.setHours(0,0,0,0);

    if (status === "pending" && due < today) {
        li.classList.add("overdue");
    } else {
        li.classList.remove("overdue");
    }
}

/* CLEAR ALL */
function clearAll() {
    taskList.innerHTML = "";
    saveTasks();
}

/* SEARCH */
function searchTask() {
    const val = searchInput.value.toLowerCase();
    let found = false;

    document.querySelectorAll("#taskList li").forEach(li => {
        const text = li.children[0].innerText.toLowerCase();
        if (text.includes(val)) {
            li.style.display = "grid";
            found = true;
        } else {
            li.style.display = "none";
        }
    });

    noTaskMsg.style.display = found ? "none" : "block";
}

/* SAVE */
function saveTasks() {
    const tasks = [];
    document.querySelectorAll("#taskList li").forEach(li => {
        tasks.push({
            text: li.children[0].innerText,
            dueDate: li.children[1].innerText,
            status: li.querySelector("select").value,
            priority: li.classList.contains("high") ? "high" :
                      li.classList.contains("medium") ? "medium" : "low"
        });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

/* LOAD */
window.onload = () => {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(t => {
        taskInput.value = t.text;
        priorityInput.value = t.priority;
        dueDateInput.value = t.dueDate;
        addTask();

        const last = taskList.lastChild;
        last.querySelector("select").value = t.status;

        if (t.status === "done") {
            last.children[0].classList.add("done");
            last.querySelector(".edit-btn").disabled = true;
            last.querySelector(".edit-btn").classList.add("edit-disabled");
        }

        applyOverdue(last, t.dueDate, t.status);
    });
};
