document.addEventListener('DOMContentLoaded', () => {
    // 1. ربط العناصر
    const clientsTable = document.getElementById('clientsTable');
    const formBox = document.getElementById('formBoxClient');
    const addBtn = document.getElementById('add-client-btn');
    const saveBtn = document.getElementById('save-client-btn');
    const cancelBtn = document.getElementById('cancel-client-btn');
    const searchInput = document.getElementById('searchClient');

    const nameInput = document.getElementById('clientName');
    const phoneInput = document.getElementById('clientPhone');
    const emailInput = document.getElementById('clientEmail');
    const editIdInput = document.getElementById('edit-client-id');

    let clients = storage.getClients() || [];
    let editMode = false;

    // --- 2. دالة العرض باستخدام DOM API (createElement) ---
    function render() {
        clientsTable.innerHTML = ""; // مسح الجدول قبل إعادة الرسم
        const query = searchInput.value.toLowerCase();
        const filtered = clients.filter(c => 
            c.name.toLowerCase().includes(query) || 
            c.phone.includes(query)
        );

        filtered.forEach(client => {
            const tr = document.createElement('tr');

            // الخلية 1: الاسم
            const tdName = document.createElement('td');
            tdName.textContent = client.name;
            tr.appendChild(tdName);

            // الخلية 2: الهاتف
            const tdPhone = document.createElement('td');
            tdPhone.textContent = client.phone;
            tr.appendChild(tdPhone);

            // الخلية 3: الإيميل
            const tdEmail = document.createElement('td');
            tdEmail.textContent = client.email || '---';
            tr.appendChild(tdEmail);

            // الخلية 4: الأزرار (Details, Edit, Delete)
            const tdActions = document.createElement('td');
            tdActions.className = "actions";
            tdActions.style.textAlign = "center";

            // أ) أيقونة العين (Details)
            const btnView = document.createElement('a');
            btnView.href = `client_details.html?id=${client.id}`;
            btnView.className = "icon-btn";
            btnView.title = "Détails";
            const iconEye = document.createElement('i');
            iconEye.className = "fa fa-eye";
            iconEye.style.color = "#3498db";
            btnView.appendChild(iconEye);

            // ب) أيقونة التعديل (Edit)
            const btnEdit = document.createElement('button');
            btnEdit.className = "icon-btn edit-btn";
            btnEdit.title = "Modifier";
            const iconEdit = document.createElement('i');
            iconEdit.className = "fa fa-edit";
            iconEdit.style.color = "#2ecc71";
            btnEdit.appendChild(iconEdit);
            btnEdit.onclick = () => editClient(client.id);

            // ج) أيقونة الحذف (Delete)
            const btnDelete = document.createElement('button');
            btnDelete.className = "icon-btn delete-btn";
            btnDelete.title = "Supprimer";
            const iconTrash = document.createElement('i');
            iconTrash.className = "fa fa-trash";
            iconTrash.style.color = "#e74c3c";
            btnDelete.appendChild(iconTrash);
            btnDelete.onclick = () => deleteClient(client.id);

            // إضافة الأزرار للخلية
            tdActions.appendChild(btnView);
            tdActions.appendChild(btnEdit);
            tdActions.appendChild(btnDelete);
            tr.appendChild(tdActions);

            clientsTable.appendChild(tr);
        });
    }

    // --- 3. العمليات (Add, Save, Edit, Delete) ---
    addBtn.onclick = () => {
        editMode = false;
        document.getElementById('modalTitle').textContent = "Nouveau Client";
        nameInput.value = ""; phoneInput.value = ""; emailInput.value = "";
        formBox.style.display = 'flex';
    };

    cancelBtn.onclick = () => formBox.style.display = 'none';

    saveBtn.onclick = () => {
        if(!nameInput.value || !phoneInput.value) {
            alert("Veuillez remplir les champs obligatoires");
            return;
        }

        if (editMode) {
            const id = parseInt(editIdInput.value);
            const index = clients.findIndex(c => c.id === id);
            clients[index] = { 
                ...clients[index], 
                name: nameInput.value, 
                phone: phoneInput.value, 
                email: emailInput.value 
            };
        } else {
            const newClient = {
                id: Date.now(), // ID فريد باستعمال الوقت
                name: nameInput.value,
                phone: phoneInput.value,
                email: emailInput.value
            };
            clients.push(newClient);
        }

        storage.saveClients(clients);
        formBox.style.display = 'none';
        render();
    };

    function deleteClient(id) {
        if(confirm("Supprimer ce client ?")) {
            clients = clients.filter(c => c.id !== id);
            storage.saveClients(clients);
            render();
        }
    }

    function editClient(id) {
        const client = clients.find(c => c.id === id);
        if(client) {
            editMode = true;
            editIdInput.value = client.id;
            document.getElementById('modalTitle').textContent = "Modifier Client";
            nameInput.value = client.name;
            phoneInput.value = client.phone;
            emailInput.value = client.email || "";
            formBox.style.display = 'flex';
        }
    }

    searchInput.onkeyup = render;
    render(); // أول عرض عند فتح الصفحة
});