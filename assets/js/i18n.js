// ✅ 1. الترجمات (زدت ليك ترجمة الـ Sidebar والـ Navbar)
const translations = {
    
    ar: {
        title: "تسجيل الدخول",
        email: "البريد الإلكتروني",
        pass: "كلمة المرور",
        btn: "دخول",
        error: "البريد أو كلمة المرور غير صحيحة",
        logout: "تسجيل الخروج",
        dashboard: "لوحة التحكم",
        chambres: "الغرف",
        clients: "الزبناء",
        services: "الخدمات",
        reservations: "الحجوزات",
        personnel: "الموظفين",
        // العناوين الجديدة للرسوم البيانية
        chart_status: "حالة الغرف",
        chart_revenue: "المداخيل الشهرية",
        chart_type: "الحجوزات حسب الصنف",
        chart_trend: "اتجاه الحجوزات (7 أيام)",
        chart_performance: "أداء الفندق العام",
        dash_title: "لوحة التحكم",
        kpi_rev: "إجمالي المداخيل",
        kpi_res: "الحجوزات",
        kpi_cli: "الزبناء المسجلين",
        kpi_av_rooms: "الغرف المتاحة",
        kpi_occ: "نسبة الملء",
        kpi_avg: "متوسط السعر / الليلة"
    },
    fr: {
        title: "Connexion",
        email: "Adresse e-mail",
        pass: "Mot de passe",
        btn: "Se connecter",
        error: "E-mail ou mot de passe incorrect",
        logout: "Déconnexion",
        dashboard: "Dashboard",
        chambres: "Chambres",
        clients: "Clients",
        services: "Services",
        reservations: "Réservations",
        personnel: "Personnel",
        chart_status: "Statut des Chambres",
        chart_revenue: "Revenus Mensuels",
        chart_type: "Réservations par Type",
        chart_trend: "Tendance (7 jours)",
        chart_performance: "Performance Globale",
        dash_title: "Tableau de Bord",
        kpi_rev: "Total des Revenus",
        kpi_res: "Réservations",
        kpi_cli: "Clients Enregistrés",
        kpi_av_rooms: "Chambres Disponibles",
        kpi_occ: "Taux d'Occupation",
        kpi_avg: "Prix Moyen / Nuit"
    },
    en: {
        title: "Login",
        email: "Email address",
        pass: "Password",
        btn: "Sign in",
        error: "Email or password is incorrect",
        logout: "Logout",
        dashboard: "Dashboard",
        chambres: "Rooms",
        clients: "Clients",
        services: "Services",
        reservations: "Reservations",
        personnel: "Staff", 
        chart_status: "Room Status",
        chart_revenue: "Monthly Revenue",
        chart_type: "Reservations by Type",
        chart_trend: "Trend (7 days)",
        chart_performance: "Overall Performance",
        dash_title: "Dashboard",
        kpi_rev: "Total Revenue",
        kpi_res: "Reservations",
        kpi_cli: "Registered Clients",
        kpi_av_rooms: "Available Rooms",
        kpi_occ: "Occupancy Rate",
        kpi_avg: "Avg Price / Night"
    }
};

// ✅ 2. دالة تطبيق الترجمة
function applyTranslations(lang) {
    const t = translations[lang];
    if (!t) return;
document.body.dir = (lang === 'ar') ? 'rtl' : 'ltr';
    // ترجمة عناصر صفحة الـ Login (إلى كانت كاينة)
    if (document.getElementById("title")) document.getElementById("title").innerText = t.title;
    if (document.getElementById("labelEmail")) document.getElementById("labelEmail").innerText = t.email;
    if (document.getElementById("labelPass")) document.getElementById("labelPass").innerText = t.pass;
    if (document.getElementById("btnLogin")) document.getElementById("btnLogin").innerText = t.btn;
    if (document.getElementById("errorMsg")) document.getElementById("errorMsg").innerText = t.error;
    if (document.getElementById('t-chart-status')) document.getElementById('t-chart-status').textContent = t.chart_status;
if (document.getElementById('t-chart-revenue')) document.getElementById('t-chart-revenue').textContent = t.chart_revenue;
if (document.getElementById('t-chart-type')) document.getElementById('t-chart-type').textContent = t.chart_type;
    if (document.getElementById('t-chart-trend')) document.getElementById('t-chart-trend').textContent = t.chart_trend;
if (document.getElementById('t-chart-performance')) document.getElementById('t-chart-performance').textContent = t.chart_performance;
if (document.getElementById('t-dash-title')) document.getElementById('t-dash-title').textContent = t.dash_title;
    if (document.getElementById('t-kpi-rev')) document.getElementById('t-kpi-rev').textContent = t.kpi_rev;
    if (document.getElementById('t-kpi-res')) document.getElementById('t-kpi-res').textContent = t.kpi_res;
    if (document.getElementById('t-kpi-cli')) document.getElementById('t-kpi-cli').textContent = t.kpi_cli;
    if (document.getElementById('t-kpi-av-rooms')) document.getElementById('t-kpi-av-rooms').textContent = t.kpi_av_rooms;
    if (document.getElementById('t-kpi-occ')) document.getElementById('t-kpi-occ').textContent = t.kpi_occ;
    if (document.getElementById('t-kpi-avg')) document.getElementById('t-kpi-avg').textContent = t.kpi_avg;

    // ترجمة الـ Navbar (Déconnexion)
    const logoutBtn = document.querySelector(".logout-link");
    if (logoutBtn) {
        logoutBtn.innerHTML = `<i class="fa-solid fa-sign-out-alt"></i> ${t.logout}`;
    }

    // ترجمة الـ Sidebar (باستعمال الـ href لتمييز الروابط)
    const sideLinks = document.querySelectorAll(".navbar-nav a");
    sideLinks.forEach(link => {
        const href = link.getAttribute("href");
        const span = link.querySelector("span");
        if (span) {
            if (href.includes("dashboard")) span.innerText = t.dashboard;
            if (href.includes("chambres")) span.innerText = t.chambres;
            if (href.includes("clients")) span.innerText = t.clients;
            if (href.includes("services")) span.innerText = t.services;
            if (href.includes("reservations")) span.innerText = t.reservations;
            if (href.includes("personnel")) span.innerText = t.personnel;
        }
    });

    // تغيير اتجاه الصفحة (RTL لـ AR)
    document.body.dir = (lang === 'ar') ? 'rtl' : 'ltr';
    localStorage.setItem("selectedLang", lang);
}

// ✅ 3. مراقبة الـ Navbar حتى تظهر
function initLanguage() {
    const savedLang = localStorage.getItem("selectedLang") || "fr";
    
    // محاولة إيجاد عنصر الـ Select
    const langSelect = document.getElementById("lang");

    if (langSelect) {
        langSelect.value = savedLang;
        applyTranslations(savedLang);

        langSelect.onchange = function () {
            applyTranslations(this.value);
        };
    } else {
        // إلى مالقاش langSelect (مثلا Navbar مزال ماتحملاتش)، كيتسنى شوية ويعاود
        setTimeout(initLanguage, 100);
    }
}

// تشغيل عند التحميل
window.addEventListener('DOMContentLoaded', initLanguage);