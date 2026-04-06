// Make jobs global before anything else
window.jobs = [];

// ===== Apply Job Function (global) =====
function openApplyModal(jobId) {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
        alert("Please login to apply");
        window.location.href = "login.html";
        return;
    }

    document.getElementById("jobIndex").value = jobId;
    document.getElementById("applicantName").value = "";
    document.getElementById("applicantEmail").value = currentUser.email;
    document.getElementById("applicantLocation").value = "";
    document.getElementById("applicantResume").value = "";
    document.getElementById("applicantCoverLetter").value = "";

    let modalEl = document.getElementById("applyModal");
    let modal = new bootstrap.Modal(modalEl);
    modal.show();
}



// ===== jobs.js =====
document.addEventListener("DOMContentLoaded", function () {

    const jobList = document.getElementById("jobList");
    const searchInput = document.getElementById("searchInput");
    const locationFilter = document.getElementById("locationFilter");

    // ===== Fetch all jobs from backend =====
    function fetchJobs() {
        fetch("http://127.0.0.1:8000/api/jobs/")
            .then(res => res.json())
            .then(data => {
                window.jobs = data; // global jobs
                displayJobs(window.jobs);
            })
            .catch(err => {
                console.error("Failed to fetch jobs", err);
                jobList.innerHTML = "<p class='text-white'>Failed to load jobs.</p>";
            });
    }

    // ===== Display jobs on page =====
    function displayJobs(jobsToShow) {
        jobList.innerHTML = "";
        if (jobsToShow.length === 0) {
            jobList.innerHTML = "<p class='text-white'>No jobs available.</p>";
            return;
        }

        jobsToShow.forEach((job) => {
    jobList.innerHTML += `
    <div class="col-md-4">
        <div class="job-card h-100">

            <h5 class="fw-bold mb-2">${job.title}</h5>

            <p class="mb-1">${job.company}</p>

            <p class="text-white fw-semibold mb-2">
                📍 ${job.location}
            </p>

            <p class="text-success fw-bold mb-2">
                💰 ${job.salary || "Not disclosed"}
            </p>

            <span class="badge ${
                job.job_type === "Full-Time" ? "bg-success" :
                job.job_type === "Part-Time" ? "bg-warning text-dark" :
                job.job_type === "Internship" ? "bg-info text-dark" :
                job.job_type === "Remote" ? "bg-primary" :
                "bg-secondary"
            }">
                ${job.job_type || "N/A"}
            </span>

            <div class="mt-3">
                <button class="btn btn-apply w-100"
                    onclick="openApplyModal(${job.id})">
                    Apply Now
                </button>
            </div>

        </div>
    </div>
    `;
});

    }

    // ===== Filters =====
    function filterJobs() {

    const searchText = searchInput.value.toLowerCase();
    const location = locationFilter.value;
    const type = document.getElementById("typeFilter").value;

    const filtered = window.jobs.filter(job => {

        const matchesTitle =
            job.title.toLowerCase().includes(searchText);

        const matchesLocation =
            location === "" || job.location === location;

        const matchesType =
            type === "" || job.job_type === type;

        return matchesTitle && matchesLocation && matchesType;
    });

    displayJobs(filtered);
}


searchInput.addEventListener("keyup", filterJobs);
locationFilter.addEventListener("change", filterJobs);
typeFilter.addEventListener("change", filterJobs);


   // ===== Submit Application =====
const applyForm = document.getElementById("applyForm");

if (applyForm) {
    applyForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const jobId = document.getElementById("jobIndex").value;
        const job = window.jobs.find(j => j.id == jobId);

        const applicantName = document.getElementById("applicantName").value.trim();
        const applicantEmail = document.getElementById("applicantEmail").value.trim();
        const applicantLocation = document.getElementById("applicantLocation").value.trim();
        const coverLetter = document.getElementById("applicantCoverLetter").value.trim();
        const resumeFile = document.getElementById("applicantResume").files[0];

        const formData = new FormData();
        formData.append("job", job.title);
        formData.append("company", job.company);
        formData.append("applicant_name", applicantName);
        formData.append("applicant_email", applicantEmail);
        formData.append("applicant_location", applicantLocation);
        formData.append("cover_letter", coverLetter);
        formData.append("resume", resumeFile);

        fetch("http://127.0.0.1:8000/api/apply-job/", {
            method: "POST",
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            if (data.message) {
                alert("Application submitted successfully! ✅");
                applyForm.reset();

                const modal = bootstrap.Modal.getInstance(document.getElementById("applyModal"));
                modal.hide();
            } else {
                alert("Error submitting application");
            }
        })
        .catch(err => console.error("Apply error:", err));
    });
}
    // ===== Initial fetch =====
    fetchJobs();
});

