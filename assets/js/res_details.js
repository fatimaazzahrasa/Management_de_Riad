document.addEventListener('DOMContentLoaded', () => {
    // 1. جلب العناصر
    const invoiceContent = document.getElementById('invoice-content');
    const downloadBtn = document.getElementById('download-pdf');

    // 2. قراءة ID من الرابط
    const params = new URLSearchParams(window.location.search);
    const resId = parseInt(params.get('id'));

    if (!resId) {
        invoiceContent.innerHTML = `<p style="color:red; text-align:center;">ID de réservation introuvable !</p>`;
        return;
    }

    // 3. جلب كل البيانات المطلوبة
    const reservation = (storage.getReservations() || []).find(r => r.id === resId);
    
    if (!reservation) {
        invoiceContent.innerHTML = `<h2 style="text-align:center; color:red;">Réservation non trouvée.</h2>`;
        return;
    }

    // جلب بيانات مرتبطة
    const client = (storage.getClients() || []).find(c => c.name === reservation.clientName);
    const room = (storage.getRooms() || []).find(r => r.number == reservation.roomNumber);

    // 4. تعمير الواجهة باستخدام DOM Manipulation
    function fillInvoice() {
        // --- الهيدر ---
        document.getElementById('res-id-title').textContent = `Réservation #${reservation.id}`;
        
        const statusContainer = document.getElementById('res-status-container');
        statusContainer.innerHTML = ''; // تفريغ
        const statusBadge = document.createElement('span');
        const statusText = reservation.status || 'confirmée';
        statusBadge.className = `status-badge status-${statusText.toLowerCase()}`;
        statusBadge.textContent = statusText.toUpperCase();
        statusContainer.appendChild(statusBadge);

        // --- معلومات العميل ---
        document.getElementById('det-client').textContent = client?.name || 'N/A';
        document.getElementById('det-email').textContent = client?.email || 'N/A';

        // --- تفاصيل الحجز ---
        document.getElementById('det-room').textContent = `Chambre N° ${room?.number || 'N/A'}`;
        document.querySelector('.info-item:nth-child(2) span').textContent = room?.type || 'Standard'; // افتراضي
        document.getElementById('det-start').textContent = reservation.checkIn;
        document.getElementById('det-end').textContent = reservation.checkOut;
        document.getElementById('det-price-night').textContent = `${(room?.price || 0).toFixed(2)} DH`;

        // حساب عدد الليالي
        const d1 = new Date(reservation.checkIn);
        const d2 = new Date(reservation.checkOut);
        const nights = Math.ceil(Math.abs(d2 - d1) / (1000 * 60 * 60 * 24)) || 0;
        document.getElementById('det-nights').textContent = nights;

        // --- الإجمالي ---
        document.getElementById('det-total').textContent = `${reservation.totalPrice.toFixed(2)} DH`;
    }

    // 5. وظيفة التحميل PDF (باستخدام addEventListener)
    downloadBtn.addEventListener('click', () => {
        const options = {
            margin: 0.5,
            filename: `Reservation_${resId}_${reservation.clientName}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
        };
        html2pdf().set(options).from(invoiceContent).save();
    });

    // استدعاء الدالة لملء البيانات
    fillInvoice();
});
