let rooms = storage.getRooms();  // غادي ناخدو data مباشرة من localStorage
let editingRoom = null;

// عرض الغرف فـ table
function renderRooms() {
    const tbody = document.getElementById("roomsTable");
    const search = document.getElementById("search") ? document.getElementById("search").value.toLowerCase() : "";
    tbody.innerHTML = "";

    rooms
        .filter(r => r.number.toLowerCase().includes(search))
        .forEach(room => {
            tbody.innerHTML += `
                <tr>
                    <td>${room.number}</td>
                    <td>${room.price} DH</td>
                    <td>${room.status}</td>
                    <td>
                        <button onclick="editRoom(${room.id})">Edit</button>
                        <button onclick="deleteRoom(${room.id})">Delete</button>
                        <a href="rooms-details.html?id=${room.id}">Voir</a>
                    </td>
                </tr>
            `;
        });
}

// فتح form لإضافة غرفة
function showAddForm() {
    editingRoom = null;
    document.getElementById("roomNumber").value = "";
    document.getElementById("roomPrice").value = "";
    document.getElementById("roomStatus").value = "available";
    document.getElementById("formBox").style.display = "block";
}

// إخفاء form
function hideForm() {
    document.getElementById("formBox").style.display = "none";
}

// حفظ الغرفة الجديدة أو تعديل الغرفة
function saveRoom() {
    const number = document.getElementById("roomNumber").value.trim();
    const price = document.getElementById("roomPrice").value.trim();
    const status = document.getElementById("roomStatus").value;

    if (!number || !price) return alert("Remplir tous les champs");

    if (editingRoom) {
        editingRoom.number = number;
        editingRoom.price = price;
        editingRoom.status = status;
        editingRoom = null;
    } else {
        const id = rooms.length ? Math.max(...rooms.map(r => r.id)) + 1 : 1;
        rooms.push({ id, number, price, status });
    }

    // مهم: حفظ فالlocalStorage
    storage.saveRooms(rooms);

    hideForm();
    renderRooms();
}

// تعديل غرفة
function editRoom(id) {
    editingRoom = rooms.find(r => r.id === id);
    document.getElementById("roomNumber").value = editingRoom.number;
    document.getElementById("roomPrice").value = editingRoom.price;
    document.getElementById("roomStatus").value = editingRoom.status;
    document.getElementById("formBox").style.display = "block";
}

// حذف غرفة
function deleteRoom(id) {
    if (!confirm("Voulez-vous supprimer cette chambre?")) return;
    rooms = rooms.filter(r => r.id !== id);
    storage.saveRooms(rooms);
    renderRooms();
}

// عرض الغرف منين تفتح الصفحة
document.addEventListener("DOMContentLoaded", () => {
    renderRooms();
});



