document.addEventListener('DOMContentLoaded', () => {
    // 1. ربط العناصر (يبقى كما هو)
    const resTable = document.getElementById('reservationsTable');
    const formBox = document.getElementById('formBoxRes');
    const addResBtn = document.getElementById('add-res-btn');
    const saveResBtn = document.getElementById('save-res-btn');
    const cancelResBtn = document.getElementById('cancel-res-btn');
    const searchInput = document.getElementById('searchRes');
    const clientSelect = document.getElementById('resClient');
    const roomSelect = document.getElementById('resRoom');
    const checkInInput = document.getElementById('resCheckIn');
    const checkOutInput = document.getElementById('resCheckOut');
    const priceInput = document.getElementById('resPrice');

    let reservations = storage.getReservations() || [];
    let editId = null; // ✅ متغير جديد لتخزين ID الحجز الذي يتم تعديله

    // --- 2. دالة تعمير القوائم (تبقى كما هي) ---
    function populateDropdowns(isEditing = false, reservedRoomNumber = null) {
        clientSelect.innerHTML = '<option value="">-- Sélectionner un client --</option>';
        storage.getClients().forEach(c => {
            clientSelect.innerHTML += `<option value="${c.name}">${c.name}</option>`;
        });

        roomSelect.innerHTML = '<option value="">-- Sélectionner une chambre --</option>';
        let availableRooms = storage.getRooms().filter(r => r.status === 'available');

        // ✅ إذا كنا في وضع التعديل، نضيف الغرفة المحجوزة حاليًا إلى قائمة الخيارات
        if (isEditing && reservedRoomNumber) {
            const reservedRoom = storage.getRooms().find(r => r.number == reservedRoomNumber);
            if (reservedRoom) {
                availableRooms.push(reservedRoom);
            }
        }

        availableRooms.forEach(r => {
            roomSelect.innerHTML += `<option value="${r.number}" data-price="${r.price}">Chambre ${r.number} (${r.price} DH)</option>`;
        });
    }

    // --- 3. حساب الثمن (يبقى كما هو) ---
    function calculateTotal() { /* ... نفس الكود ... */ }
    [checkInInput, checkOutInput, roomSelect].forEach(el => el.onchange = calculateTotal);

    // --- 4. دالة العرض (مع إضافة زر التعديل) ---
    function render() {
        resTable.innerHTML = "";
        const query = searchInput?.value.toLowerCase() || "";
        const filtered = reservations.filter(r => r.clientName.toLowerCase().includes(query));

        filtered.forEach(res => {
            const tr = resTable.insertRow();
            tr.insertCell().textContent = res.clientName;
            tr.insertCell().textContent = "Chambre " + res.roomNumber;
            tr.insertCell().textContent = `${res.checkIn} / ${res.checkOut}`;
            tr.insertCell().textContent = res.totalPrice + " DH";

            const tdActions = tr.insertCell();
            tdActions.className = "actions";

            // زر التفاصيل
            const btnDetails = document.createElement('a');
            btnDetails.href = `reservation_details.html?id=${res.id}`;
            btnDetails.className = "icon-btn";
            btnDetails.title = "Voir les détails";
            btnDetails.innerHTML = '<i class="fa fa-eye"></i>';
            tdActions.appendChild(btnDetails);

            // ✅ START: إضافة زر التعديل
            const btnEdit = document.createElement('button');
            btnEdit.className = "icon-btn edit-btn"; // كلاس جديد للتعرف عليه
            btnEdit.dataset.id = res.id;
            btnEdit.title = "Modifier";
            btnEdit.innerHTML = '<i class="fa fa-edit"></i>';
            tdActions.appendChild(btnEdit);
            // ✅ END: نهاية إضافة زر التعديل

            // زر الحذف
            const btnDelete = document.createElement('button');
            btnDelete.className = "icon-btn delete-btn";
            btnDelete.dataset.id = res.id;
            btnDelete.title = "Supprimer";
            btnDelete.innerHTML = '<i class="fa fa-trash"></i>';
            tdActions.appendChild(btnDelete);
        });
    }

    // --- 5. العمليات (Add, Save, Edit, Delete) ---

    addResBtn.onclick = () => {
        editId = null; // ✅ التأكد من أننا في وضع الإضافة
        document.getElementById('formTitle').textContent = "Ajouter une réservation";
        populateDropdowns();
        formBox.style.display = 'flex';
        [clientSelect, roomSelect, checkInInput, checkOutInput, priceInput].forEach(i => i.value = "");
    };

    saveResBtn.onclick = () => {
        if (!clientSelect.value || !roomSelect.value || !checkInInput.value) return alert("Remplir les champs!");
        
        // ✅ START: منطق الحفظ المحدّث
        if (editId !== null) {
            // --- وضع التعديل ---
            const resIndex = reservations.findIndex(r => r.id === editId);
            if (resIndex > -1) {
                // ... (منطق تحرير الغرفة إذا تغيرت)
                reservations[resIndex] = {
                    ...reservations[resIndex],
                    clientName: clientSelect.value,
                    roomNumber: roomSelect.value,
                    checkIn: checkInInput.value,
                    checkOut: checkOutInput.value,
                    totalPrice: parseFloat(priceInput.value)
                };
            }
        } else {
            // --- وضع الإضافة (الكود القديم) ---
            const newRes = {
                id: storage.generateId(reservations),
                clientName: clientSelect.value,
                roomNumber: roomSelect.value,
                checkIn: checkInInput.value,
                checkOut: checkOutInput.value,
                totalPrice: parseFloat(priceInput.value)
            };
            reservations.push(newRes);
            // تحديث حالة الغرفة
            const rooms = storage.getRooms();
            const roomIdx = rooms.findIndex(r => r.number == newRes.roomNumber);
            if (roomIdx > -1) {
                rooms[roomIdx].status = 'occupied';
                storage.saveRooms(rooms);
            }
        }
        // ✅ END: نهاية منطق الحفظ المحدّث

        storage.saveReservations(reservations);
        formBox.style.display = 'none';
        editId = null; // إعادة تعيين
        render();
    };

    // ✅ دالة جديدة لفتح النموذج في وضع التعديل
    function editReservation(id) {
        editId = id;
        const reservation = reservations.find(r => r.id === id);
        if (!reservation) return;

        document.getElementById('formTitle').textContent = "Modifier la réservation";
        // ملء قائمة الغرف بما في ذلك الغرفة الحالية
        populateDropdowns(true, reservation.roomNumber);

        // تعيين القيم في النموذج
        clientSelect.value = reservation.clientName;
        roomSelect.value = reservation.roomNumber;
        checkInInput.value = reservation.checkIn;
        checkOutInput.value = reservation.checkOut;
        priceInput.value = reservation.totalPrice;

        formBox.style.display = 'flex';
    }

    // ✅ تحديث معالج الأحداث ليشمل زر التعديل
    resTable.addEventListener('click', (e) => {
        const deleteBtn = e.target.closest('.delete-btn');
        const editBtn = e.target.closest('.edit-btn'); // البحث عن زر التعديل

        if (editBtn) {
            editReservation(parseInt(editBtn.dataset.id));
        }
        else if (deleteBtn) {
            const id = parseInt(deleteBtn.dataset.id);
            if (confirm("Voulez-vous vraiment annuler cette réservation?")) {
                // ... (نفس منطق الحذف)
                storage.saveReservations(reservations);
                render();
            }
        }
    });

    cancelResBtn.onclick = () => formBox.style.display = 'none';
    if (searchInput) searchInput.onkeyup = render;
    render();

    // دالة حساب السعر (يجب أن تكون موجودة)
    function calculateTotal() {
        const checkIn = new Date(checkInInput.value);
        const checkOut = new Date(checkOutInput.value);
        const selectedOption = roomSelect.options[roomSelect.selectedIndex];
        if (checkIn && checkOut && checkOut > checkIn && selectedOption?.dataset.price) {
            const diffDays = Math.ceil(Math.abs(checkOut - checkIn) / (1000 * 60 * 60 * 24));
            priceInput.value = diffDays * parseFloat(selectedOption.dataset.price);
        } else {
            priceInput.value = 0;
        }
    }
});
