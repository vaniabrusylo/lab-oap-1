let requests = JSON.parse(localStorage.getItem("requests")) || [];
let editId = null;

const form = document.getElementById("requestForm");
const tableBody = document.getElementById("tableBody");
const clearBtn = document.getElementById("clearBtn");
const searchInput = document.getElementById("searchInput");

form.addEventListener("submit", saveRequest);
clearBtn.addEventListener("click", clearForm);
searchInput.addEventListener("input", renderTable);

renderTable();

function saveRequest(e) {
    e.preventDefault();

    const userName = document.getElementById("userName").value.trim();
    const date = document.getElementById("date").value;
    const accessType = document.getElementById("accessType").value;
    const comments = document.getElementById("comments").value.trim();

    clearErrors();

    let valid = true;

    if (userName.length < 3) {
        document.getElementById("userError").textContent = "Мінімум 3 символи";
        valid = false;
    }

    if (date === "") {
        document.getElementById("dateError").textContent = "Оберіть дату";
        valid = false;
    }

    if (accessType === "") {
        document.getElementById("typeError").textContent = "Оберіть тип";
        valid = false;
    }

    if (comments.length < 5) {
        document.getElementById("commentError").textContent = "Мінімум 5 символів";
        valid = false;
    }

    if (!valid) return;

    if (editId === null) {
        requests.push({
            id: Date.now(),
            userName,
            date,
            accessType,
            comments,
            status: "Pending"
        });
    } else {
        const item = requests.find(x => x.id === editId);
        if (item) {
            item.userName = userName;
            item.date = date;
            item.accessType = accessType;
            item.comments = comments;
        }
        editId = null;
    }

    saveStorage();
    renderTable();
    clearForm();
}

function renderTable() {
    const text = searchInput.value.toLowerCase();

    const filtered = requests.filter(item =>
        item.userName.toLowerCase().includes(text) ||
        item.accessType.toLowerCase().includes(text)
    );

    tableBody.innerHTML = "";

    filtered.forEach(item => {
        tableBody.innerHTML += `
        <tr>
            <td>${item.id}</td>
            <td>${item.userName}</td>
            <td>${item.date}</td>
            <td>${item.accessType}</td>
            <td>${item.comments}</td>
            <td class="pending">${item.status}</td>
            <td>
                <button class="edit-btn" onclick="editRequest(${item.id})">Змінити</button>
                <button class="delete-btn" onclick="deleteRequest(${item.id})">Видалити</button>
            </td>
        </tr>
        `;
    });
}

function deleteRequest(id) {
    requests = requests.filter(x => x.id !== id);
    saveStorage();
    renderTable();
}

function editRequest(id) {
    const item = requests.find(x => x.id === id);
    if (!item) return;

    document.getElementById("userName").value = item.userName;
    document.getElementById("date").value = item.date;
    document.getElementById("accessType").value = item.accessType;
    document.getElementById("comments").value = item.comments;

    editId = id;
}

function clearForm() {
    form.reset();
    editId = null;
    clearErrors();
}

function clearErrors() {
    document.getElementById("userError").textContent = "";
    document.getElementById("dateError").textContent = "";
    document.getElementById("typeError").textContent = "";
    document.getElementById("commentError").textContent = "";
}

function saveStorage() {
    localStorage.setItem("requests", JSON.stringify(requests));
}