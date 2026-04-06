// =============================
// ADMIN PAGE LOAD
// =============================
document.addEventListener("DOMContentLoaded", function () {

    const user = JSON.parse(localStorage.getItem("currentUser"));

    if (!user) {
        alert("Please login first");
        window.location.href = "login.html";
        return;
    }

    if (user.role.toLowerCase() !== "admin") {
        alert("Access denied!");
        window.location.href = "jobs.html";
        return;
    }

    loadStats();
    fetchJobs();
    fetchUsers();
    fetchContacts();
    fetchContactMessages();



    const jobForm = document.getElementById("jobForm");

    jobForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const title = document.getElementById("title").value.trim();
        const company = document.getElementById("company").value.trim();
        const location = document.getElementById("location").value.trim();
        const salary = document.getElementById("salary").value.trim();
        const job_type = document.getElementById("job_type").value;
        const description = document.getElementById("description").value.trim();

        if (!title || !company || !location || !salary || !job_type || !description) {
            alert("Please fill all fields");
            return;
        }

        fetch("http://127.0.0.1:8000/api/add-job/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: title,
                company: company,
                location: location,
                salary: salary,
                job_type: job_type,
                description: description
            })
        })
        .then(res => res.json())
        .then(data => {
            console.log("Add Job Response:", data);

            if (data.message) {
                alert("Job added successfully!");
                jobForm.reset();
                fetchJobs();
                loadStats();
            } else {
                alert(JSON.stringify(data));
            }
        })
        .catch(err => console.error("Add job error:", err));
    });

});



// =============================
// LOAD ADMIN STATS
// =============================
function loadStats() {

    fetch("http://127.0.0.1:8000/api/admin-stats/")
    .then(res => res.json())
    .then(data => {
        console.log("Stats:", data);   // 👈 ADD THIS

        document.getElementById("totalJobs").innerText = data.total_jobs;
        document.getElementById("totalUsers").innerText = data.total_users;
        document.getElementById("totalApplications").innerText = data.total_applications;
    })
    .catch(err => console.error("Stats error:", err));
}



// =============================
// FETCH JOBS
// =============================
function fetchJobs() {
    fetch("http://127.0.0.1:8000/api/jobs/")
    .then(res => res.json())
    .then(data => renderAdminJobs(data));
}


// =============================
// RENDER JOB TABLE
// =============================
function renderAdminJobs(jobs) {

    const table = document.getElementById("jobTable");
    table.innerHTML = "";

    jobs.forEach((job, index) => {
        table.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${job.title}</td>
                <td>${job.company}</td>
                <td>${job.location}</td>
                <td>${job.salary || "-"}</td>
                <td>${job.job_type || "-"}</td>
                <td>
                    <button class="btn btn-danger btn-sm"
                        onclick="deleteJob(${job.id})">
                        Delete
                    </button>
                </td>
            </tr>
        `;
    });
}


// =============================
// DELETE JOB
// =============================
function deleteJob(jobId) {

    const user = JSON.parse(localStorage.getItem("currentUser"));

    fetch(`http://127.0.0.1:8000/api/delete-job/${jobId}/`, {
        method: "DELETE",
        // headers: {
        //     "User-Email": user.email
        // }
    })
    .then(res => res.json())
    .then(data => {
        if (data.message) {
            alert("Job deleted successfully");
            fetchJobs();
            loadStats();
        }
    });
}


// =============================
// FETCH USERS
// =============================
function fetchUsers() {

    fetch("http://127.0.0.1:8000/api/users/")
    .then(res => {
        console.log("Status:", res.status);
        return res.json();
    })
    .then(users => {

        console.log("Users received:", users);

        const table = document.getElementById("userTable");

        if (!table) {
            console.error("userTable NOT FOUND");
            return;
        }

        table.innerHTML = "";

        users.forEach((u, index) => {
            table.innerHTML += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${u.name}</td>
                    <td>${u.email}</td>
                    <td>${u.role}</td>
                    <td>
                        <button class="btn btn-danger btn-sm"
                            onclick="deleteUser(${u.id})">
                            Delete
                        </button>
                    </td>
                </tr>
            `;
        });

    })
    .catch(err => console.error("Fetch users error:", err));
}



// =============================
// DELETE USER
// =============================
// =============================
// DELETE USER
// =============================
function deleteUser(userId) {

    if (!confirm("Are you sure you want to delete this user?")) return;

    fetch(`http://127.0.0.1:8000/api/delete-user/${userId}/`, {
        method: "DELETE"
    })
    .then(res => res.json())
    .then(data => {
        if (data.message) {
            alert("User deleted successfully");
            fetchUsers();
            loadStats();
        } else {
            alert(data.error || "Delete failed");
        }
    })
    .catch(err => console.error(err));
}


window.deleteUser = deleteUser;
window.deleteJob = deleteJob;


function fetchContacts(){
    fetch("http://127.0.0.1:8000/api/contact/")
    .then(res => res.json())
    .then(data => {
        const table = document.getElementById("contactTable");
        table.innerHTML = "";

        data.forEach((msg, index) => {
            table.innerHTML += `
            <tr>
                <td>${index+1}</td>
                <td>${msg.name}</td>
                <td>${msg.email}</td>
                <td>${msg.message}</td>
                <td>${new Date(msg.created_at).toLocaleString()}</td>
            </tr>
            `;
        });
    });
}

// =============================
// FETCH CONTACT MESSAGES
// =============================
function fetchContactMessages() {

    fetch("http://127.0.0.1:8000/api/contact-messages/")
    .then(res => res.json())
    .then(messages => {

        const table = document.getElementById("contactTable");
        table.innerHTML = "";

        messages.forEach((msg, index) => {
            table.innerHTML += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${msg.name}</td>
                    <td>${msg.email}</td>
                    <td>${msg.message}</td>
                    <td>${msg.created_at}</td>
                    <td>
                        <button class="btn btn-danger btn-sm"
                            onclick="deleteContact(${msg.id})">
                            Delete
                        </button>
                    </td>
                </tr>
            `;
        });

    })
    .catch(err => console.error("Contact fetch error:", err));
}


function deleteContact(id) {

    if (!confirm("Are you sure you want to delete this message?")) return;

    fetch(`http://127.0.0.1:8000/api/delete-contact/${id}/`, {
        method: "DELETE"
    })
    .then(res => res.json())
    .then(data => {
        if (data.message) {
            alert("Message deleted successfully");
            fetchContactMessages();
        } else {
            alert(data.error || "Delete failed");
        }
    })
    .catch(err => console.error("Delete error:", err));
}
