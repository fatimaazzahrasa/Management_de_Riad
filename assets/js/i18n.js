// ===============================
//  i18n.js  (Internationalization)
//  ترجمة الصفحات AR + FR
// ===============================


// ✅ النصوص لكل لغة
const translations = {
    ar: {
        title: "تسجيل الدخول",
        email: "البريد الإلكتروني",
        pass: "كلمة المرور",
        btn: "دخول",
        error: "البريد أو كلمة المرور غير صحيحة"
    },

    fr: {
        title: "Connexion",
        email: "Adresse e-mail",
        pass: "Mot de passe",
        btn: "Se connecter",
        error: "E-mail ou mot de passe incorrect"
    },
    en: {
        title: "Login",
        email: "Email address",
        pass: "Password",
        btn: "Sign in",
        error: "Email or password is incorrect"
    }
};


// ✅ عنصر اختيار اللغة
const langSelect = document.getElementById("lang");


// ✅ حدث تغيير اللغة
langSelect.onchange = function () {
    const lang = langSelect.value;

    // تحديث النصوص حسب اللغة المختارة
    document.getElementById("title").innerText = translations[lang].title;
    document.getElementById("labelEmail").innerText = translations[lang].email;
    document.getElementById("labelPass").innerText = translations[lang].pass;

    document.getElementById("btnLogin").innerText = translations[lang].btn;

    document.getElementById("errorMsg").innerText = translations[lang].error;
};


// ✅ تحميل اللغة الافتراضية عند فتح الصفحة
window.onload = function () {
    const defaultLang = langSelect.value; // ar أو fr
    const t = translations[defaultLang];

    document.getElementById("title").innerText = t.title;
    document.getElementById("labelEmail").innerText = t.email;
    document.getElementById("labelPass").innerText = t.pass;
    document.getElementById("btnLogin").innerText = t.btn;
    document.getElementById("errorMsg").innerText = t.error;
};

