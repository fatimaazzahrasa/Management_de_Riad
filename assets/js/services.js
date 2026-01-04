let services = storage.getServices();
let editingService = null;

function renderServices() {
    const tbody = document.getElementById("servicesTable");

    tbody.innerHTML = "";

    services.forEach(s => {
        tbody.innerHTML += `
            <tr>
                <td>${s.name}</td>
                <td>${s.price} DH</td>
                <td>
                    <button onclick="editService(${s.id})">Edit</button>
                    <button onclick="deleteService(${s.id})">Delete</button>
                </td>
            </tr>
        `;
    });
}

function showForm() {
    editingService = null;
    document.getElementById("form").style.display = "block";
}

function hideForm() {
    document.getElementById("form").style.display = "none";
}

function saveService() {
    const name = document.getElementById("serviceName").value;
    const price = document.getElementById("servicePrice").value;

    if (editingService) {
        editingService.name = name;
        editingService.price = price;

    } else {
        services.push({
            id: storage.generateId(services),
            name,
            price
        });
    }

    storage.saveServices(services);
    hideForm();
    renderServices();
}

function editService(id) {
    editingService = services.find(s => s.id === id);

    document.getElementById("serviceName").value = editingService.name;
    document.getElementById("servicePrice").value = editingService.price;

    document.getElementById("form").style.display = "block";
}

function deleteService(id) {
    services = services.filter(s => s.id !== id);
    storage.saveServices(services);
    renderServices();
}

renderServices();
