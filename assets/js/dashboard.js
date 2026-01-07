document.addEventListener('DOMContentLoaded', () => {

    // --- 1. جلب كل البيانات ---
    const reservations = storage.getReservations() || [];
    const clients = storage.getClients() || [];
    const rooms = storage.getRooms() || [];
    const personnel = storage.getPersonnel() || [];

    // --- 2. حساب وعرض إحصائيات البطاقات (KPIs) ---
    function displayKpis() {
        const totalRevenue = reservations.reduce((sum, res) => sum + res.totalPrice, 0);
        const availableRooms = rooms.filter(r => r.status === 'available').length;
        const occupancyRate = rooms.length > 0 ? ((rooms.length - availableRooms) / rooms.length) * 100 : 0;
        const avgPrice = rooms.length > 0 ? rooms.reduce((sum, room) => sum + room.price, 0) / rooms.length : 0;

        document.getElementById('kpi-total-revenue').textContent = `${totalRevenue.toFixed(2)} DH`;
        document.getElementById('kpi-total-reservations').textContent = reservations.length;
        document.getElementById('kpi-total-clients').textContent = clients.length;
        document.getElementById('kpi-available-rooms').textContent = `${availableRooms} / ${rooms.length}`;
        document.getElementById('kpi-occupancy-rate').textContent = `${occupancyRate.toFixed(1)}%`;
        document.getElementById('kpi-avg-price').textContent = `${avgPrice.toFixed(2)} DH`;
    }

    // --- 3. إنشاء كل الرسوم البيانية ---
    function createCharts() {
        // ---- 1. Pie Chart: Statut des Chambres ----
        try {
            const availableRooms = rooms.filter(r => r.status === 'available').length;
            new Chart(document.getElementById('roomStatusChart'), {
                type: 'pie',
                data: {
                    labels: ['Disponibles', 'Occupées'],
                    datasets: [{
                        data: [availableRooms, rooms.length - availableRooms],
                        backgroundColor: ['#27ae60', '#d35400'],
                        borderColor: '#ffffff', borderWidth: 2
                    }]
                },
                options: { responsive: true, maintainAspectRatio: false }
            });
        } catch (e) { console.error("Erreur Pie Chart:", e); }

        // ---- 2. Bar Chart: Revenus Mensuels ----
        try {
            const monthlyRevenue = Array(12).fill(0); // [0, 0, ..., 0]
            reservations.forEach(res => {
                const month = new Date(res.checkIn).getMonth();
                monthlyRevenue[month] += res.totalPrice;
            });
            new Chart(document.getElementById('monthlyRevenueChart'), {
                type: 'bar',
                data: {
                    labels: ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Aoû", "Sep", "Oct", "Nov", "Déc"],
                    datasets: [{
                        label: 'Revenus',
                        data: monthlyRevenue,
                        backgroundColor: 'rgba(142, 68, 173, 0.6)',
                        borderColor: '#8e44ad', borderWidth: 1
                    }]
                },
                options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true } } }
            });
        } catch (e) { console.error("Erreur Bar Chart:", e); }

        // ---- 3. Doughnut Chart: Réservations par Type ----
        try {
            // ملاحظة: سنفترض وجود أنواع للغرف بناءً على السعر
            const types = { 'Standard': 0, 'Supérieure': 0, 'Suite': 0 };
            reservations.forEach(res => {
                const room = rooms.find(r => r.number == res.roomNumber);
                if (room) {
                    if (room.price < 3000) types['Standard']++;
                    else if (room.price < 5000) types['Supérieure']++;
                    else types['Suite']++;
                }
            });
            new Chart(document.getElementById('roomTypeChart'), {
                type: 'doughnut',
                data: {
                    labels: Object.keys(types),
                    datasets: [{
                        data: Object.values(types),
                        backgroundColor: ['#3498db', '#f1c40f', '#e74c3c']
                    }]
                },
                options: { responsive: true, maintainAspectRatio: false }
            });
        } catch (e) { console.error("Erreur Doughnut Chart:", e); }

        // ---- 4. Line Chart: Tendance des Réservations (7 derniers jours) ----
        try {
            const trendData = { labels: [], data: [] };
            for (let i = 6; i >= 0; i--) {
                const date = new Date();
                date.setDate(date.getDate() - i);
                const dateString = date.toISOString().split('T')[0];
                trendData.labels.push(date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }));
                const count = reservations.filter(r => r.checkIn === dateString).length;
                trendData.data.push(count);
            }
            new Chart(document.getElementById('reservationsTrendChart'), {
                type: 'line',
                data: {
                    labels: trendData.labels,
                    datasets: [{
                        label: 'Nouvelles Réservations',
                        data: trendData.data,
                        borderColor: '#2980b9',
                        tension: 0.1,
                        fill: false
                    }]
                },
                options: { responsive: true, maintainAspectRatio: false }
            });
        } catch (e) { console.error("Erreur Line Chart:", e); }

        // ---- 5. Polar Area Chart: Répartition du Personnel ----
        try {
            const postCounts = {};
            personnel.forEach(p => {
                postCounts[p.poste] = (postCounts[p.poste] || 0) + 1;
            });
            new Chart(document.getElementById('staffDistributionChart'), {
                type: 'polarArea',
                data: {
                    labels: Object.keys(postCounts),
                    datasets: [{
                        data: Object.values(postCounts),
                        backgroundColor: ['#2ecc71', '#e67e22', '#9b59b6', '#1abc9c', '#34495e']
                    }]
                },
                options: { responsive: true, maintainAspectRatio: false }
            });
        } catch (e) { console.error("Erreur Polar Area Chart:", e); }
    }

    // --- 4. استدعاء الدوال ---
    displayKpis();
    createCharts();
});
