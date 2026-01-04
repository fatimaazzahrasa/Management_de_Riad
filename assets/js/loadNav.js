fetch("assets/components/navbar.html")
    .then(r => r.text())
    .then(html => {
        document.getElementById("navbar").innerHTML = html;
    });


fetch("assets/components/sidebar.html")
    .then(r => r.text())
    .then(html => {
        document.getElementById("sidebar").innerHTML = html;
    });


document.addEventListener("click", function (e) {
    if (e.target.id === "menuBtn") {
        document.getElementById("sidebar").classList.toggle("active");
    }
});
