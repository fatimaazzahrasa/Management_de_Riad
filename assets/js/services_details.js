document.addEventListener('DOMContentLoaded', () => {
    const detailsCard = document.getElementById('service-details-card');
    const exportBtn = document.getElementById('export-pdf-btn');

    // --- جلب البيانات ---
    const urlParams = new URLSearchParams(window.location.search);
    const serviceId = parseInt(urlParams.get('id'));
    const services = storage.getServices() || [];
    const service = services.find(s => s.id === serviceId);

    // --- التعامل مع حالة الخطأ (بدون HTML) ---
    if (!service) {
        detailsCard.innerHTML = ''; // تفريغ البطاقة
        const errorP = document.createElement('p');
        errorP.textContent = "Service non trouvé !";
        errorP.style.color = "red";
        errorP.style.textAlign = "center";
        detailsCard.appendChild(errorP);
        return;
    }

    // --- بناء الواجهة باستخدام DOM Manipulation فقط ---
    detailsCard.innerHTML = ''; // تفريغ البطاقة أولاً

    // 1. حاوية الصورة
    const imageContainer = document.createElement('div');
    imageContainer.className = 'service-image-container';
    const mainImg = document.createElement('img');
    mainImg.src = service.image || 'assets/image/default_service.jpg';
    mainImg.className = 'service-main-img';
    imageContainer.appendChild(mainImg);
    
    // 2. حاوية المعلومات
    const infoContainer = document.createElement('div');
    infoContainer.className = 'service-info-content';

    const title = document.createElement('h2');
    title.textContent = service.name;
    infoContainer.appendChild(title);

    // دالة مساعدة لإنشاء أيقونة + نص
    function createInfoItem(iconClass, text) {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'service-info-item';
        
        const icon = document.createElement('i');
        icon.className = `fa ${iconClass}`;
        itemDiv.appendChild(icon);

        if (text) {
            const textSpan = document.createElement('span');
            textSpan.textContent = text;
            itemDiv.appendChild(textSpan);
        }
        
        return itemDiv;
    }

    // --- إنشاء عناصر المعلومات ---

    // السعر
    infoContainer.appendChild(createInfoItem('fa-tag', `${service.price} DH`));
    
    // الحالة (يتم بناؤها بشكل خاص)
    const statusItemDiv = document.createElement('div');
    statusItemDiv.className = 'service-info-item';
    
    const statusIcon = document.createElement('i');
    statusIcon.className = 'fa fa-toggle-on';
    statusItemDiv.appendChild(statusIcon);
    
    const statusSpan = document.createElement('span');
    statusSpan.className = 'status'; // الكلاس الأساسي
    if (service.status === 'actif') {
        statusSpan.classList.add('available');
        statusSpan.textContent = 'Actif';
    } else {
        statusSpan.classList.add('occupied');
        statusSpan.textContent = 'Inactif';
    }
    statusItemDiv.appendChild(statusSpan);
    infoContainer.appendChild(statusItemDiv);

    // الوصف
    infoContainer.appendChild(createInfoItem('fa-align-left', '')); // إضافة الأيقونة فقط
    const description = document.createElement('p');
    description.className = 'service-description';
    description.textContent = service.description || "Aucune description fournie.";
    infoContainer.appendChild(description);

    // 3. إضافة الحاويات إلى البطاقة الرئيسية
    detailsCard.appendChild(imageContainer);
    detailsCard.appendChild(infoContainer);

    // 4. تفعيل زر التصدير (يبقى كما هو)
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            const opt = {
                margin: 0.5,
                filename: `Service_${service.name}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
            };
            html2pdf().set(opt).from(detailsCard).save();
        });
    }
});
