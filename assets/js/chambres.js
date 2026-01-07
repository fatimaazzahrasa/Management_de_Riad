
document.addEventListener('DOMContentLoaded', () => {
    // 1. جلب العناصر
    const roomsTable = document.getElementById('roomsTable');
    const searchInput = document.getElementById('search');
    const addRoomBtn = document.getElementById('add-room-btn');
    const formBox = document.getElementById('formBox');
    const saveBtn = document.getElementById('save-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    const roomNumberInput = document.getElementById('roomNumber');
    const roomPriceInput = document.getElementById('roomPrice');
    const roomStatusSelect = document.getElementById('roomStatus');
    const paginationControls = document.getElementById('pagination-controls');

    // 2. متغيرات الحالة
    let rooms = storage.getRooms() || [];
    let editId = null;
    let currentPage = 1;
    let rowsPerPage = 10; // ثابتة الآن بـ 10 أسطر

    // 3. ربط الأحداث
    addRoomBtn.addEventListener('click', showAddForm);
    cancelBtn.addEventListener('click', hideForm);
    saveBtn.addEventListener('click', saveRoom);
    
    searchInput.addEventListener('keyup', () => {
        currentPage = 1;
        render(); 
    });

    roomsTable.addEventListener('click', (event) => {
        const editButton = event.target.closest('.edit-btn');
        const deleteButton = event.target.closest('.delete-btn');
        if (editButton) editRoom(editButton.dataset.id);
        if (deleteButton) deleteRoom(deleteButton.dataset.id);
    });

    // 4. الدوال الرئيسية
    function render() {
        const searchValue = searchInput.value.toLowerCase();
        const filteredRooms = rooms.filter(r => r.number.toLowerCase().includes(searchValue));
        
        renderTable(filteredRooms);
        renderPagination(filteredRooms.length);
    }

    function renderTable(filteredRooms) {
        roomsTable.innerHTML = "";
        const startIndex = (currentPage - 1) * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        const paginatedItems = filteredRooms.slice(startIndex, endIndex);

        if (paginatedItems.length === 0) {
            const row = roomsTable.insertRow();
            const cell = row.insertCell();
            cell.textContent = "Aucune chambre trouvée.";
            cell.colSpan = 4;
            cell.style.textAlign = "center";
            return;
        }

        paginatedItems.forEach(room => {
            const row = roomsTable.insertRow();
            row.insertCell().textContent = room.number;
            row.insertCell().textContent = `${room.price} DH`;

            const statusCell = row.insertCell();
            const statusSpan = document.createElement('span');
            statusSpan.textContent = room.status === 'available' ? 'Disponible' : 'Occupée';
            statusSpan.className = `status ${room.status}`;
            statusCell.appendChild(statusSpan);

            const actionsCell = row.insertCell();
            actionsCell.className = 'actions';
            
            const detailsLink = document.createElement('a');
            detailsLink.href = `chambres_details.html?id=${room.id}`;
            detailsLink.className = 'icon-btn';
            detailsLink.title = 'Voir les détails';
            detailsLink.innerHTML = '<i class="fa fa-eye"></i>';

            const editButton = createActionButton('edit-btn', room.id, 'Modifier', 'fa-edit');
            const deleteButton = createActionButton('delete-btn', room.id, 'Supprimer', 'fa-trash');

            actionsCell.appendChild(detailsLink);
            actionsCell.appendChild(editButton);
            actionsCell.appendChild(deleteButton);
        });
    }

    function renderPagination(totalItems) {
        paginationControls.innerHTML = "";
        const totalPages = Math.ceil(totalItems / rowsPerPage);
        if (totalPages <= 1) return;

        paginationControls.appendChild(createPaginationButton('&laquo;', () => { currentPage--; render(); }, currentPage === 1));
        for (let i = 1; i <= totalPages; i++) {
            const pageButton = createPaginationButton(i, () => { currentPage = i; render(); });
            if (i === currentPage) pageButton.classList.add('active');
            paginationControls.appendChild(pageButton);
        }
        paginationControls.appendChild(createPaginationButton('&raquo;', () => { currentPage++; render(); }, currentPage === totalPages));
    }

    // 5. دوال CRUD
    function showAddForm() {
        editId = null;
        formBox.querySelector('h3').textContent = "Ajouter une nouvelle chambre";
        roomNumberInput.value = "";
        roomPriceInput.value = "";
        roomStatusSelect.value = "available";
        formBox.style.display = 'block';
    }

    function hideForm() { formBox.style.display = 'none'; }

    function saveRoom() {
        const number = roomNumberInput.value.trim();
        const price = roomPriceInput.value;
        const status = roomStatusSelect.value;

        if (!number || !price) {
            alert("Veuillez remplir tous les champs obligatoires.");
            return;
        }

        if (editId !== null) {
            const room = rooms.find(r => r.id === parseInt(editId));
            room.number = number;
            room.price = parseFloat(price);
            room.status = status;
        } else {
            const id = rooms.length ? Math.max(...rooms.map(r => r.id)) + 1 : 1;
            // إضافة مسار الصورة التلقائي عند الحفظ بناءً على الرقم
            rooms.push({ 
                id, 
                number, 
                price: parseFloat(price), 
                status,
                image: `assets/image/ch${number}.jpg` 
            });
        }

        storage.saveRooms(rooms);
        hideForm();
        render();
    }

    function editRoom(id) {
        editId = id;
        const room = rooms.find(r => r.id === parseInt(id));
        formBox.querySelector('h3').textContent = "Modifier la chambre";
        roomNumberInput.value = room.number;
        roomPriceInput.value = room.price;
        roomStatusSelect.value = room.status;
        formBox.style.display = 'block';
    }

    function deleteRoom(id) {
        if (confirm("Êtes-vous sûr de vouloir supprimer cette chambre ?")) {
            rooms = rooms.filter(r => r.id !== parseInt(id));
            storage.saveRooms(rooms);
            render();
        }
    }

    function createActionButton(className, id, title, iconClass) {
        const button = document.createElement('button');
        button.className = `icon-btn ${className}`;
        button.dataset.id = id;
        button.title = title;
        button.innerHTML = `<i class="fa ${iconClass}"></i>`;
        return button;
    }
    
    function createPaginationButton(html, onClick, disabled = false) {
        const button = document.createElement('button');
        button.innerHTML = html;
        button.disabled = disabled;
        button.addEventListener('click', onClick);
        return button;
    }

    render();
});
