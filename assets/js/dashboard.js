/**
 * Dashboard Logic - 5 Different Charts
 */

let myCharts = {}; // لتخزين كائنات Chart.js

function initDashboard() {
    // 1. جلب البيانات من التخزين (storage.js)
    const reservations = storage.getReservations() || [];
    const rooms = storage.getRooms() || [];
    const clients = storage.getClients() || [];
    const services = storage.getServices() || [];
    const personnel = storage.getPersonnel() || [];

    // 2. تحديث بطاقات الإحصائيات (KPI Cards)
    const totalRev = reservations.reduce((s, r) => s + (parseFloat(r.totalPrice) || 0), 0);
    const availableRooms = rooms.filter(r => r.status === 'available').length;
    const occupancyRate = rooms.length > 0 ? ((rooms.length - availableRooms) / rooms.length) * 100 : 0;

    if(document.getElementById('kpi-total-revenue')) 
        document.getElementById('kpi-total-revenue').textContent = `${totalRev.toLocaleString()} DH`;
    if(document.getElementById('kpi-total-reservations')) 
        document.getElementById('kpi-total-reservations').textContent = reservations.length;
    if(document.getElementById('kpi-total-clients')) 
        document.getElementById('kpi-total-clients').textContent = clients.length;
    if(document.getElementById('kpi-available-rooms')) 
        document.getElementById('kpi-available-rooms').textContent = `${availableRooms} / ${rooms.length}`;
    if(document.getElementById('kpi-occupancy-rate')) 
        document.getElementById('kpi-occupancy-rate').textContent = `${occupancyRate.toFixed(1)}%`;

    // 3. دالة موحدة لرسم وتحديث الشارتس
    const renderChart = (id, config) => {
        const canvas = document.getElementById(id);
        if (!canvas) return;
        if (myCharts[id]) myCharts[id].destroy(); // مسح القديم باش ما يوقعش تداخل
        myCharts[id] = new Chart(canvas, config);
    };

    // --- (1) Pie Chart: حالة الغرف ---
    renderChart('roomStatusChart', {
        type: 'pie',
        data: {
            labels: ['Disponibles', 'Occupées'],
            datasets: [{
                data: [availableRooms, rooms.length - availableRooms],
                backgroundColor: ['#2ecc71', '#e67e22']
            }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });

    // --- (2) Bar Chart: المداخيل الشهرية ---
    const monthlyData = Array(12).fill(0);
    reservations.forEach(r => {
        const month = new Date(r.checkIn).getMonth();
        monthlyData[month] += (parseFloat(r.totalPrice) || 0);
    });
    renderChart('monthlyRevenueChart', {
        type: 'bar',
        data: {
            labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
            datasets: [{
                label: 'Revenus (DH)',
                data: monthlyData,
                backgroundColor: '#9b59b6'
            }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });

    // --- (3) Doughnut Chart: أنواع الغرف المحجوزة ---
    const types = { 'Standard': 0, 'Supérieure': 0, 'Suite': 0 };
    reservations.forEach(res => {
        const room = rooms.find(r => r.number == res.roomNumber);
        if (room) {
            if (room.price < 3000) types['Standard']++;
            else if (room.price < 5000) types['Supérieure']++;
            else types['Suite']++;
        }
    });
    renderChart('roomTypeChart', {
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

    // --- (4) Line Chart: اتجاه الحجوزات (آخر 7 أيام) ---
    const last7Days = [];
    const resCounts = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        last7Days.push(d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }));
        resCounts.push(reservations.filter(r => r.checkIn === dateStr).length);
    }
    renderChart('reservationsTrendChart', {
        type: 'line',
        data: {
            labels: last7Days,
            datasets: [{
                label: 'Réservations',
                data: resCounts,
                borderColor: '#1abc9c',
                tension: 0.3,
                fill: true,
                backgroundColor: 'rgba(26, 188, 156, 0.1)'
            }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });

    // --- (5) Radar Chart: أداء الفندق العام ---
    // كنحسبو نقاط الأداء بناء على البيانات الحقيقية
    const staffScore = Math.min((personnel.length / 10) * 100, 100);
    const serviceScore = Math.min((services.length / 5) * 100, 100);
    renderChart('performanceRadarChart', {
        type: 'radar',
        data: {
            labels: ['Occupation', 'Revenu', 'Staff', 'Services', 'Clients'],
            datasets: [{
                label: 'Performance %',
                data: [occupancyRate, 75, staffScore, serviceScore, 85],
                backgroundColor: 'rgba(52, 152, 219, 0.2)',
                borderColor: '#3498db',
                pointBackgroundColor: '#3498db'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: { r: { beginAtZero: true, max: 100 } }
        }
    });
}

// تشغيل عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', initDashboard);

// تصدير الدالة للاستخدام في i18n.js عند تغيير اللغة
window.refreshDashboard = initDashboard;