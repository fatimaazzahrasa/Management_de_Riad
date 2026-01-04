let editingClient = null;

document.addEventListener("DOMContentLoaded", renderClients);

function renderClients() {
    const tbody = document.getElementById("clientsTable");
    tbody.innerHTML = "";

    const clients = storage.getClients();

    clients.forEach(c => {
        tbody.innerHTML += `
            <tr>
                <td>${c.name}</td>
                <td>${c.phone}</td>
                <td>
                    <button onclick="editClient(${c.id})">Edit</button>
                    <button onclick="deleteClient(${c.id})">Delete</button>
                </td>
            </tr>
        `;
    });
}

function saveClient() {
    const name = document.getElementById("clientName").value.trim();
    const phone = document.getElementById("clientPhone").value.trim();

    if (!name || !phone) {
        alert("عمر جميع الخانات");
        return;
    }

    let clients = storage.getClients();

    if (editingClient) {
        clients = clients.map(c =>
            c.id === editingClient.id ? { ...c, name, phone } : c
        );
        editingClient = null;
    } else {
        clients.push({
            id: storage.generateId(clients), 
            name,
            phone
        });
    }

    storage.saveClients(clients);
    hideForm();
    renderClients();
}

function editClient(id) {
    const clients = storage.getClients();
    editingClient = clients.find(c => c.id === id);
    if (!editingClient) return;

    document.getElementById("clientName").value = editingClient.name;
    document.getElementById("clientPhone").value = editingClient.phone;
    showForm();
}

function deleteClient(id) {
    const reservations = storage.getReservations();
    const used = reservations.some(r => r.clientId === id);

    if (used) {
        alert("Client مرتبط بحجز");
        return;
    }

    let clients = storage.getClients();
    clients = clients.filter(c => c.id !== id);
    storage.saveClients(clients);
    renderClients();
}

function showForm() {
    document.getElementById("form").style.display = "block";
}

function hideForm() {
    document.getElementById("form").style.display = "none";
    document.getElementById("clientName").value = "";
    document.getElementById("clientPhone").value = "";
}





