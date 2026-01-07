document.addEventListener('DOMContentLoaded', () => {
    // 1. جلب العناصر من الـ DOM
    const detailsContainer = document.getElementById('details-container');
    const exportBtn = document.getElementById('export-pdf-btn');

    // 2. قراءة ID الموظف من الرابط (URL)
    const params = new URLSearchParams(window.location.search);
    const personId = parseInt(params.get('id'));

    if (!personId) {
        detailsContainer.textContent = "ID du membre introuvable !";
        detailsContainer.style.color = "red";
        detailsContainer.style.textAlign = "center";
        return;
    }

    // 3. جلب بيانات الموظف من الـ Storage
    // تأكد أن storage.js معرف فيه دالة getPersonnel
    const allPersonnel = storage.getPersonnel() || [];
    const person = allPersonnel.find(p => p.id === personId);

    if (!person) {
        detailsContainer.textContent = "Membre du personnel non trouvé.";
        detailsContainer.style.color = "red";
        detailsContainer.style.textAlign = "center";
        return;
    }

    // 4. تعبئة الصفحة بالبيانات (DOM Manipulation)
    document.getElementById('staff-fullname').textContent = `${person.prenom} ${person.nom}`;
    document.getElementById('det-poste').textContent = person.poste;

    const statusSpan = document.getElementById('det-statut');
    statusSpan.textContent = person.statut === 'actif' ? 'Actif' : 'Inactif';
    // تحديث الكلاس بناءً على الحالة
    statusSpan.className = `status detail-value ${person.statut === 'actif' ? 'available' : 'occupied'}`;
    
    document.getElementById('det-cin').textContent = person.cin || "---";
    document.getElementById('det-telephone').textContent = person.telephone || "---";
    document.getElementById('det-email').textContent = person.email || "---";
    document.getElementById('det-date').textContent = person.dateEmbauche || "---";

    // 5. حدث تصدير PDF (استخدام html2pdf مباشرة)
    if (exportBtn) {
        exportBtn.onclick = () => {
            // نختار العنصر الذي نريد تحويله لـ PDF
            const element = document.getElementById('details-container');

            const options = {
                margin:       0.5,
                filename:     `Fiche_Personnel_${person.prenom}_${person.nom}.pdf`,
                image:        { type: 'jpeg', quality: 0.98 },
                html2canvas:  { scale: 2, useCORS: true },
                jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
            };

            // تشغيل عملية التحويل والحفظ
            html2pdf().set(options).from(element).save();
        };
    }
});