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
    }
};



const langSelect = document.getElementById("lang");



langSelect.onchange = function () {
    const lang = langSelect.value;


    document.getElementById("title").innerText = translations[lang].title;
    document.getElementById("labelEmail").innerText = translations[lang].email;
    document.getElementById("labelPass").innerText = translations[lang].pass;

    document.getElementById("btnLogin").innerText = translations[lang].btn;

    document.getElementById("errorMsg").innerText = translations[lang].error;
};



window.onload = function () {
    const defaultLang = langSelect.value; 
    const t = translations[defaultLang];

    document.getElementById("title").innerText = t.title;
    document.getElementById("labelEmail").innerText = t.email;
    document.getElementById("labelPass").innerText = t.pass;
    document.getElementById("btnLogin").innerText = t.btn;
    document.getElementById("errorMsg").innerText = t.error;
};

