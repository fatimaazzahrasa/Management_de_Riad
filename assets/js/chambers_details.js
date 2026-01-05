document.addEventListener('DOMContentLoaded', () => {
    const detailsCard = document.getElementById('room-details-card');
    const exportBtn = document.getElementById('export-pdf-btn');
    
    // 1. جلب البيانات
    const urlParams = new URLSearchParams(window.location.search);
    const roomId = parseInt(urlParams.get('id'));
    const rooms = storage.getRooms() || [];
    const room = rooms.find(r => r.id === roomId);

    if (!room) {
        detailsCard.innerHTML = "<h2><i class='fa fa-exclamation-triangle'></i> Chambre non trouvée</h2>";
        return;
    }

    try {
        // 2. إنشاء معرض الصور (Gallery) - الكود الجديد والمطور
        const galleryDiv = document.createElement('div');
        galleryDiv.className = 'room-gallery';

        const mainImg = document.createElement('img');
        
        // جلب الصورة من الـ storage، وإذا لم توجد نضع صورة افتراضية
        const roomMainImg = room.image || "assets/image/ch101.jpg";
        
        mainImg.src = roomMainImg; 
        mainImg.className = 'main-img';
        mainImg.id = 'current-img';

        const subImgsDiv = document.createElement('div');
        subImgsDiv.className = 'sub-imgs';

        // استخراج المسار بدون .jpg (مثلا assets/image/ch101)
        const baseName = roomMainImg.substring(0, roomMainImg.lastIndexOf('.'));
        
        const images = [
            roomMainImg, 
            `${baseName}_1.jpg`, 
            `${baseName}_2.jpg`
        ];

        images.forEach(src => {
            const img = document.createElement('img');
            img.src = src;
            img.style.cursor = "pointer";
            
            // إذا لم توجد الصورة الفرعية، نخفيها تماماً
            img.onerror = function() { 
                this.style.display = 'none'; 
            }; 
            
            img.onclick = () => mainImg.src = src;
            subImgsDiv.appendChild(img);
        });

        galleryDiv.appendChild(mainImg);
        galleryDiv.appendChild(subImgsDiv);

        // 3. إنشاء حاوية المعلومات
        const infoDiv = document.createElement('div');
        infoDiv.className = 'room-info-content';

        const title = document.createElement('h2');
        title.textContent = `Détails de la Chambre ${room.number}`;
        infoDiv.appendChild(title);

        function createInfoItem(iconClass, label, value, isStatus = false) {
            const div = document.createElement('div');
            div.className = 'info-item';
            const icon = document.createElement('i');
            icon.className = `fa ${iconClass}`;
            const span = document.createElement('span');
            const boldLabel = document.createElement('strong');
            boldLabel.textContent = label;
            span.appendChild(boldLabel);
            if (isStatus) {
                const statusSpan = document.createElement('span');
                statusSpan.className = `status ${room.status}`;
                statusSpan.textContent = room.status === 'available' ? ' Disponible' : ' Occupée';
                span.appendChild(statusSpan);
            } else {
                span.append(` ${value}`);
            }
            div.appendChild(icon);
            div.appendChild(span);
            return div;
        }

        infoDiv.appendChild(createInfoItem('fa-door-open', ' Numéro: ', room.number));
        infoDiv.appendChild(createInfoItem('fa-tag', ' Prix: ', `${room.price} DH / Nuit`));
        infoDiv.appendChild(createInfoItem('fa-check-circle', ' Statut: ', '', true));
        infoDiv.appendChild(createInfoItem('fa-bed', ' Type: ', 'Suite de Luxe'));

        // 4. عرض العناصر في الصفحة
        detailsCard.innerHTML = ""; 
        detailsCard.appendChild(galleryDiv);
        detailsCard.appendChild(infoDiv);

        // 5. تفعيل زر الـ PDF
        if (exportBtn) {
            exportBtn.onclick = () => {
                const opt = {
                    margin:       0.5,
                    filename:     `Chambre_${room.number}.pdf`,
                    image:        { type: 'jpeg', quality: 0.98 },
                    html2canvas:  { scale: 2 },
                    jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
                };
                html2pdf().set(opt).from(detailsCard).save();
            };
        }

    } catch (error) {
        console.error("Erreur:", error);
    }
});