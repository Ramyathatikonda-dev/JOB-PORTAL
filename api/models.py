from django.db import models

class User(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=100)

    role = models.CharField(max_length=20, default="user")  # 👈 ADD THIS

    def __str__(self):
        return self.email


class Job(models.Model):
    JOB_TYPES = (
        ('Full-Time', 'Full-Time'),
        ('Part-Time', 'Part-Time'),
        ('Internship', 'Internship'),
        ('Remote', 'Remote'),
    )

    title = models.CharField(max_length=200)
    company = models.CharField(max_length=200)
    location = models.CharField(max_length=200)
    salary = models.CharField(max_length=100)
    job_type = models.CharField(max_length=20, choices=JOB_TYPES)
    description = models.TextField()
    posted_at = models.DateTimeField(auto_now_add=True)


class JobApplication(models.Model):
    job = models.CharField(max_length=200)
    company = models.CharField(max_length=200)
    applicant_name = models.CharField(max_length=200)
    applicant_email = models.EmailField()
    applicant_location = models.CharField(max_length=200)
    resume_file = models.FileField(upload_to="resumes/", blank=True)
    cover_letter = models.TextField(blank=True)
    applied_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.applicant_name} applied to {self.job}"
    

class ContactMessage(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.email
