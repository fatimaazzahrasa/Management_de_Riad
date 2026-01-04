document.getElementById("btnLogin").onclick = function () {

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    const users = storage.getUsers();
    const errorMsg = document.getElementById("errorMsg");


    const found = users.find(user =>
        user.email === email && user.password === password
    );

    if (found) {
        
        localStorage.setItem("currentUser", JSON.stringify(found));


        window.location.href = "dashboard.html";

    } else {

        errorMsg.style.display = "block";
    }
};
