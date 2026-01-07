document.addEventListener('DOMContentLoaded', () => {
    // 1. جلب عناصر DOM باستخدام الـ IDs الجديدة
    const personnelTable = document.getElementById('personnelTable');
    const searchInput = document.getElementById('searchPersonnel');
    const addBtn = document.getElementById('add-personnel-btn');
    const formBox = document.getElementById('formBoxPersonnel');
    const saveBtn = document.getElementById('save-personnel-btn');
    const cancelBtn = document.getElementById('cancel-personnel-btn');
    const formTitle = document.getElementById('personnelFormTitle');

    // حقول النموذج
    const idInput = document.getElementById('personnelId');
    const nomInput = document.getElementById('personnelNom');
    const prenomInput = document.getElementById('personnelPrenom');
    const cinInput = document.getElementById('personnelCIN');
    const posteSelect = document.getElementById('personnelPoste');
    const telephoneInput = document.getElementById('personnelTelephone');
    const emailInput = document.getElementById('personnelEmail');
    const dateEmbaucheInput = document.getElementById('personnelDateEmbauche');
    const statutSelect = document.getElementById('personnelStatut');

    // 2. تحميل البيانات
    let personnelList = storage.getPersonnel() || [];

    // 3. دالة العرض الرئيسية (باستخدام DOM Manipulation فقط)
    function renderTable() {
        personnelTable.innerHTML = ''; // تفريغ الجدول للبدء
        const query = searchInput.value.toLowerCase();
        const filteredList = personnelList.filter(p => 
            p.nom.toLowerCase().includes(query) || p.prenom.toLowerCase().includes(query)
        );

        if (filteredList.length === 0) {
            const row = personnelTable.insertRow();
            const cell = row.insertCell();
            cell.textContent = "Aucun membre du personnel trouvé.";
            cell.colSpan = 5;
            cell.style.textAlign = "center";
            return;
        }

        filteredList.forEach(person => {
            const row = personnelTable.insertRow();

            // الخلايا الأساسية
            row.insertCell().textContent = `${person.prenom} ${person.nom}`;
            row.insertCell().textContent = person.poste;
            row.insertCell().textContent = person.telephone;
            
            // خلية الحالة
            const statusCell = row.insertCell();
            const statusSpan = document.createElement('span');
            statusSpan.className = `status ${person.statut === 'actif' ? 'available' : 'occupied'}`;
            statusSpan.textContent = person.statut;
            statusCell.appendChild(statusSpan);
            
            // خلية الأزرار (Actions)
            const actionsCell = row.insertCell();
            actionsCell.className = 'actions';

            // -- زر التفاصيل --
            const detailsLink = document.createElement('a');
            detailsLink.href = `personnel_details.html?id=${person.id}`; // يمكنك إضافة رابط صفحة التفاصيل هنا مستقبلاً
            detailsLink.className = 'icon-btn';
            detailsLink.innerHTML = '<i class="fa fa-eye"></i>'; // HTML بسيط للأيقونة مقبول

            // -- زر التعديل --
            const editButton = document.createElement('button');
            editButton.className = 'icon-btn edit-btn';
            editButton.dataset.id = person.id;
            editButton.innerHTML = '<i class="fa fa-edit"></i>';

            // -- زر الحذف --
            const deleteButton = document.createElement('button');
            deleteButton.className = 'icon-btn delete-btn';
            deleteButton.dataset.id = person.id;
            deleteButton.innerHTML = '<i class="fa fa-trash"></i>';
            
            actionsCell.appendChild(detailsLink);
            actionsCell.appendChild(editButton);
            actionsCell.appendChild(deleteButton);
        });
    }

    // 4. دوال النموذج (تبقى كما هي في المنطق، مع تحديث الـ selectors)
    function showForm(person = null) {
        if (person) { // وضع التعديل
            formTitle.textContent = "Modifier le Membre";
            idInput.value = person.id;
            nomInput.value = person.nom;
            prenomInput.value = person.prenom;
            cinInput.value = person.cin;
            posteSelect.value = person.poste;
            telephoneInput.value = person.telephone;
            emailInput.value = person.email;
            dateEmbaucheInput.value = person.dateEmbauche;
            statutSelect.value = person.statut;
        } else { // وضع الإضافة
            formTitle.textContent = "Ajouter un Membre";
            // مسح أفضل للنموذج
            document.querySelectorAll('#formBoxPersonnel input, #formBoxPersonnel select').forEach(el => el.value = '');
            idInput.value = '';
        }
        formBox.style.display = 'flex';
    }

    function hideForm() {
        formBox.style.display = 'none';
    }

    function savePersonnelMember() {
        const id = idInput.value ? parseInt(idInput.value) : null;
        const data = {
            nom: nomInput.value,
            prenom: prenomInput.value,
            cin: cinInput.value,
            poste: posteSelect.value,
            telephone: telephoneInput.value,
            email: emailInput.value,
            dateEmbauche: dateEmbaucheInput.value,
            statut: statutSelect.value,
        };

        if (id) { // تحديث
            const index = personnelList.findIndex(p => p.id === id);
            if (index > -1) {
                personnelList[index] = { ...personnelList[index], ...data };
            }
        } else { // إضافة
            data.id = storage.generateId(personnelList);
            personnelList.push(data);
        }

        storage.savePersonnel(personnelList);
        hideForm();
        renderTable();
    }

    // 5. ربط الأحداث
    addBtn.addEventListener('click', () => showForm());
    cancelBtn.addEventListener('click', hideForm);
    saveBtn.addEventListener('click', savePersonnelMember);
    searchInput.addEventListener('keyup', renderTable);

    personnelTable.addEventListener('click', (e) => {
        const editBtn = e.target.closest('.edit-btn');
        const deleteBtn = e.target.closest('.delete-btn');

        if (editBtn) {
            const id = parseInt(editBtn.dataset.id);
            const toEdit = personnelList.find(p => p.id === id);
            showForm(toEdit);
        }

        if (deleteBtn) {
            const id = parseInt(deleteBtn.dataset.id);
            if (confirm("Êtes-vous sûr de vouloir supprimer ce membre ?")) {
                personnelList = personnelList.filter(p => p.id !== id);
                storage.savePersonnel(personnelList);
                renderTable();
            }
        }
    });

    // 6. العرض الأولي
    renderTable();
});
