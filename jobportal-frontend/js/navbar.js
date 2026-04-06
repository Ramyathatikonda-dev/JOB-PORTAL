document.addEventListener("DOMContentLoaded", function () {

    let authArea = document.getElementById("authArea");

    if (!authArea) return; // Prevent error if element not found

    let currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (currentUser) {

        let adminLink = currentUser.role === "admin"
            ? `<a href="admin.html" class="btn btn-warning me-2">Admin</a>`
            : "";

        authArea.innerHTML = `
            ${adminLink}
            <span class="text-white me-2">${currentUser.email}</span>
            <button class="btn btn-danger btn-sm" onclick="logout()">Logout</button>
        `;

    } else {

        authArea.innerHTML = `
            <a href="login.html" class="btn btn-warning me-2">Login</a>
            <a href="signup.html" class="btn btn-light">Signup</a>
        `;
    }

});

function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "index.html";
}
