document.addEventListener('DOMContentLoaded', () => {
    // 1. جلب العناصر
    const detailsContainer = document.getElementById('details-container');
    const exportBtn = document.getElementById('export-pdf-btn');

    // 2. قراءة ID من الرابط
    const params = new URLSearchParams(window.location.search);
    const clientId = parseInt(params.get('id'));

    if (!clientId) {
        detailsContainer.textContent = "ID du client introuvable !";
        detailsContainer.style.color = "red";
        detailsContainer.style.textAlign = "center";
        return;
    }

    // 3. جلب بيانات العميل
    const client = (storage.getClients() || []).find(c => c.id === clientId);

    if (!client) {
        detailsContainer.textContent = "Client non trouvé.";
        detailsContainer.style.color = "red";
        detailsContainer.style.textAlign = "center";
        return;
    }

    // 4. تعبئة الصفحة بالبيانات (DOM Manipulation)
    document.getElementById('client-fullname').textContent = client.name;
    document.getElementById('det-pays').textContent = client.pays || 'Maroc';
    document.getElementById('det-cin').textContent = client.cin || '---';
    document.getElementById('det-telephone').textContent = client.phone || '---';
    document.getElementById('det-email').textContent = client.email || 'Non fourni';
    
    const pageTitle = document.getElementById('pageTitle');
    if (pageTitle) pageTitle.textContent = `Détails de ${client.name}`;

    // 5. ربط حدث تصدير PDF باستخدام html2pdf مباشرة
    if (exportBtn) {
        exportBtn.onclick = () => {
            const options = {
                margin:       0.5,
                filename:     `Fiche_Client_${client.name.replace(/\s+/g, '_')}.pdf`,
                image:        { type: 'jpeg', quality: 0.98 },
                html2canvas:  { scale: 2, useCORS: true },
                jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
            };

            // تصدير الحاوية المطلوبة فقط
            html2pdf().set(options).from(detailsContainer).save();
        };
    }
});