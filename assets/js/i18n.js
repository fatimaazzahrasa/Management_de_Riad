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
        personnel: "الموظفين"
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
        personnel: "Personnel"
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
        personnel: "Staff"
    }
};

// ✅ 2. دالة تطبيق الترجمة
function applyTranslations(lang) {
    const t = translations[lang];
    if (!t) return;

    // ترجمة عناصر صفحة الـ Login (إلى كانت كاينة)
    if (document.getElementById("title")) document.getElementById("title").innerText = t.title;
    if (document.getElementById("labelEmail")) document.getElementById("labelEmail").innerText = t.email;
    if (document.getElementById("labelPass")) document.getElementById("labelPass").innerText = t.pass;
    if (document.getElementById("btnLogin")) document.getElementById("btnLogin").innerText = t.btn;
    if (document.getElementById("errorMsg")) document.getElementById("errorMsg").innerText = t.error;

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