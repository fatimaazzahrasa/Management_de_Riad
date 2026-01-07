document.addEventListener('DOMContentLoaded', () => {
    // 1. ربط العناصر
    const tableBody = document.getElementById('services-table-body');
    const formBox = document.getElementById('service-modal');
    const addBtn = document.getElementById('open-modal-btn');
    const saveBtn = document.getElementById('save-service-btn');
    const cancelBtn = document.getElementById('close-modal-btn');
    const searchInput = document.getElementById('search-service');

    const nameInput = document.getElementById('service-name');
    const priceInput = document.getElementById('service-price');
    const statusSelect = document.getElementById('service-status');
    const serviceIdInput = document.getElementById('service-id');

    let isEditing = false;

    // إخفاء الفورم تلقائياً عند التحميل
    if (formBox) formBox.style.display = 'none';

    // 2. دالة العرض الأساسية
    function render() {
        tableBody.textContent = ""; 
        const query = searchInput?.value.toLowerCase() || "";
        const services = storage.getServices();
        
        const filtered = services.filter(s => s.name.toLowerCase().includes(query));

        filtered.forEach(s => {
            const tr = document.createElement('tr');

            // خلية الاسم
            const tdName = document.createElement('td');
            const strong = document.createElement('strong');
            strong.textContent = s.name;
            tdName.appendChild(strong);
            tr.appendChild(tdName);

            // خلية الثمن
            const tdPrice = document.createElement('td');
            tdPrice.textContent = s.price + " DH";
            tr.appendChild(tdPrice);

            // خلية الحالة
            const tdStatus = document.createElement('td');
            const span = document.createElement('span');
            span.textContent = s.status;
            span.className = s.status === 'actif' ? 'status-available' : 'status-occupied';
            tdStatus.appendChild(span);
            tr.appendChild(tdStatus);

            // خلية الأزرار (Actions)
            const tdActions = document.createElement('td');
            tdActions.style.textAlign = "center";

            // زر العين (Détails)
            const btnDetails = document.createElement('a');
            btnDetails.href = `services_details.html?id=${s.id}`;
            btnDetails.className = "icon-btn";
            const iconEye = document.createElement('i');
            iconEye.className = "fa fa-eye";
            iconEye.style.color = "#3498db";
            btnDetails.appendChild(iconEye);

            // زر التعديل (Edit)
            const btnEdit = document.createElement('button');
            btnEdit.className = "icon-btn edit-btn";
            const iconEdit = document.createElement('i');
            iconEdit.className = "fa fa-edit";
            iconEdit.style.color = "#f39c12";
            btnEdit.appendChild(iconEdit);
            btnEdit.onclick = () => editService(s.id);

            // زر الحذف (Delete)
            const btnDelete = document.createElement('button');
            btnDelete.className = "icon-btn delete-btn";
            const iconTrash = document.createElement('i');
            iconTrash.className = "fa fa-trash";
            iconTrash.style.color = "#e74c3c";
            btnDelete.appendChild(iconTrash);
            btnDelete.onclick = () => deleteService(s.id);

            // إضافة الأزرار للخلية بالترتيب
            tdActions.appendChild(btnDetails);
            tdActions.appendChild(btnEdit);
            tdActions.appendChild(btnDelete);
            tr.appendChild(tdActions);

            tableBody.appendChild(tr);
        });
    }

    // 3. منطق العمليات (CRUD)

    addBtn.onclick = () => {
        isEditing = false;
        document.getElementById('modal-title').textContent = "Ajouter un Service";
        [nameInput, priceInput, serviceIdInput].forEach(i => i.value = "");
        statusSelect.value = "actif";
        formBox.style.display = 'flex';
    };

    saveBtn.onclick = () => {
        const name = nameInput.value.trim();
        const price = priceInput.value.trim();

        if (!name || !price) {
            alert("Veuillez remplir les champs!");
            return;
        }

        let services = storage.getServices();
        const serviceData = {
            name: name,
            price: parseFloat(price),
            status: statusSelect.value
        };

        if (isEditing) {
            const id = parseInt(serviceIdInput.value);
            services = services.map(s => s.id === id ? { ...s, ...serviceData } : s);
        } else {
            const newService = {
                id: storage.generateId(services),
                ...serviceData,
                description: "",
                image: "assets/image/default.jpg"
            };
            services.push(newService);
        }

        storage.saveServices(services);
        formBox.style.display = 'none';
        render();
    };

    function deleteService(id) {
        if (confirm("Voulez-vous supprimer ce service ?")) {
            let services = storage.getServices();
            services = services.filter(s => s.id !== id);
            storage.saveServices(services);
            render();
        }
    }

    function editService(id) {
        isEditing = true;
        const services = storage.getServices();
        const s = services.find(serv => serv.id === id);
        if (!s) return;

        document.getElementById('modal-title').textContent = "Modifier Service";
        serviceIdInput.value = s.id;
        nameInput.value = s.name;
        priceInput.value = s.price;
        statusSelect.value = s.status;
        
        formBox.style.display = 'flex';
    }

    cancelBtn.onclick = () => formBox.style.display = 'none';
    
    if (searchInput) {
        searchInput.oninput = render;
    }

    render();
});