// ======================
// SIGNUP
// ======================
// ======================
// SIGNUP
// ======================
let signupForm = document.getElementById("signupForm");

if (signupForm) {
    signupForm.addEventListener("submit", function (e) {
        e.preventDefault();

        let name = document.getElementById("name").value.trim();
        let email = document.getElementById("email").value.trim();
        let password = document.getElementById("password").value.trim();
        let role = document.getElementById("role")?.value || "user";

        fetch("http://127.0.0.1:8000/api/signup/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password, role })
        })
        .then(async res => {
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Signup failed");
            }

            return data;
        })
        .then(data => {
             // Save user in localStorage
    localStorage.setItem("currentUser", JSON.stringify({
        email: data.email,
        role: data.role
    }));

    // Redirect to Jobs page
    window.location.href = "jobs.html";
        })
        .catch(error => {
    document.getElementById("messageBox").innerHTML =
        `<div class="alert alert-danger">
            ${error.message}
        </div>`;
});


    });
}


// ======================
// LOGIN
// ======================
let loginForm = document.getElementById("loginForm");
if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();

        let email = document.getElementById("loginEmail").value.trim();
        let password = document.getElementById("loginPassword").value.trim();

        fetch("http://127.0.0.1:8000/api/login/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        })
        .then(res => {
            if (!res.ok) throw new Error("Login failed");
            return res.json();
        })
        .then(data => {

            // ✅ SAVE SESSION HERE
            localStorage.setItem("currentUser", JSON.stringify({
                email: data.email,
                role: data.role
            }));

            if (data.role?.toLowerCase() === "admin") {
                window.location.href = "admin.html";
            } else {
                window.location.href = "jobs.html";
            }

        })
        .catch(err => {
            alert("Invalid credentials");
        });
    });
}

