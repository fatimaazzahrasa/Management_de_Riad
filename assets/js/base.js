// تحميل الـ Navbar وتفعيل الـ Dark Mode
fetch("base/navbar.html")
    .then(r => r.text())
    .then(html => {
        document.getElementById("navbar-container").innerHTML = html;

        // --- كود الـ Dark Mode داخل الـ fetch باش يلقى الزر ---
        const darkBtn = document.getElementById("dark-mode-toggle");
        const icon = document.getElementById("mode-icon");

        // التأكد من الحالة المحفوظة في المتصفح
        if (localStorage.getItem("theme") === "dark") {
            document.body.classList.add("dark-mode");
            if (icon) icon.classList.replace("fa-moon", "fa-sun");
        }

        if (darkBtn) {
            darkBtn.addEventListener("click", function(e) {
                e.preventDefault();
                document.body.classList.toggle("dark-mode");
                
                if (document.body.classList.contains("dark-mode")) {
                    if (icon) icon.classList.replace("fa-moon", "fa-sun");
                    localStorage.setItem("theme", "dark");
                } else {
                    if (icon) icon.classList.replace("fa-sun", "fa-moon");
                    localStorage.setItem("theme", "light");
                }
            });
        }
    });

// تحميل الـ Sidebar وتفعيل الرابط الحالي
fetch("base/sidebar.html")
    .then(r => r.text())
    .then(html => {
        document.getElementById("sidebar-container").innerHTML = html;
        
        const path = window.location.pathname;
        const page = path.split("/").pop() || "dashboard.html";

        const menuItems = document.querySelectorAll('.sidebar .navbar-nav a');
        menuItems.forEach(item => {
            const href = item.getAttribute('href');
            if (page === href) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    });

// تحميل الـ Footer
fetch("base/footer.html")
    .then(r => r.text())
    .then(html => {
        document.getElementById("footer-container").innerHTML = html;
    });

// التحكم في فتح وإغلاق السايدبار
document.addEventListener("click", function (e) {
    const toggleBtn = e.target.closest("#togglemenu");
    if (toggleBtn) {
        e.preventDefault();
        const sidebar = document.querySelector(".sidebar");
        const content = document.querySelector(".content");
        
        if (window.innerWidth > 992) {
            sidebar.classList.toggle("collapsed");
            content.classList.toggle("expanded");
        } else {
            sidebar.classList.toggle("open");
        }
    }
});