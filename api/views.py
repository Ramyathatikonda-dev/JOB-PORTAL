from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.hashers import make_password, check_password
from django.http import JsonResponse
from .models import User, Job, JobApplication
from .serializers import UserSerializer, JobSerializer


# Signup
@api_view(['POST'])
def signup(request):
    data = request.data.copy()

    email = data.get('email', '').lower()

    # 🔥 Check if email already exists
    if User.objects.filter(email=email).exists():
        return Response(
            {"error": "Email already registered. Please login."},
            status=400
        )

    data['email'] = email
    data['password'] = make_password(data.get('password'))
    data['role'] = data.get('role', 'user')

    serializer = UserSerializer(data=data)

    if serializer.is_valid():
        user = serializer.save()
        return Response({
            "message": "User created successfully",
            "email": user.email,
            "role": user.role
        })

    return Response(serializer.errors, status=400)

@api_view(['POST'])
def login(request):
    email = request.data.get('email', '').lower()
    password = request.data.get('password')

    user = User.objects.filter(email=email).first()

    if user and check_password(password, user.password):
        return Response({
            "email": user.email,
            "role": user.role
        })

    return Response({"error": "Invalid credentials"}, status=400)

# Get all jobs
@api_view(['GET'])
def get_jobs(request):

    # If no jobs exist, create professional sample jobs
    if Job.objects.count() == 0:

        Job.objects.create(
            title="Frontend Developer",
            company="TechNova Solutions",
            location="Hyderabad",
            salary="₹6 LPA - ₹10 LPA",
            job_type="Full-Time",
            description="Looking for a React.js developer with strong UI skills."
        )

        Job.objects.create(
            title="Backend Developer",
            company="CodeCraft Pvt Ltd",
            location="Bangalore",
            salary="₹8 LPA - ₹14 LPA",
            job_type="Full-Time",
            description="Python Django backend developer required."
        )

        Job.objects.create(
            title="UI/UX Designer",
            company="PixelSoft",
            location="Mumbai",
            salary="₹5 LPA - ₹9 LPA",
            job_type="Part-Time",
            description="Creative designer with Figma experience."
        )

        Job.objects.create(
            title="Data Analyst Intern",
            company="DataWorks",
            location="Chennai",
            salary="₹15,000/month",
            job_type="Internship",
            description="SQL and Python knowledge required."
        )

        Job.objects.create(
            title="Remote Full Stack Developer",
            company="InnovateX Global",
            location="Remote",
            salary="₹12 LPA - ₹18 LPA",
            job_type="Remote",
            description="MERN stack developer with 2+ years experience."
        )

    jobs = Job.objects.all().order_by("-posted_at")
    serializer = JobSerializer(jobs, many=True)
    return Response(serializer.data)


# Add job (Admin)
@api_view(['POST'])
def add_job(request):
    serializer = JobSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Job added"})
    return Response(serializer.errors)

@api_view(['DELETE'])
def delete_job(request, job_id):
    try:
        job = Job.objects.get(id=job_id)
        job.delete()
        return Response({"message": "Job deleted"})
    except Job.DoesNotExist:
        return Response({"error": "Job not found"}, status=404)

@api_view(['GET'])
def admin_stats(request):
    total_jobs = Job.objects.count()
    total_users = User.objects.count()
    total_applications = JobApplication.objects.count()
    
    return Response({
        "total_jobs": total_jobs,
        "total_users": total_users,
        "total_applications": total_applications
    })


@api_view(['GET'])
def get_users(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)

@api_view(['DELETE'])
def delete_user(request, user_id):
    try:
        user = User.objects.get(id=user_id)
        user.delete()
        return Response({"message": "User deleted successfully"})
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=404)

@api_view(['POST'])
def apply_job(request):
    try:
        resume = request.FILES.get('resume')  # 👈 get uploaded file

        JobApplication.objects.create(
            job=request.data.get('job'),
            company=request.data.get('company'),
            applicant_name=request.data.get('applicant_name'),
            applicant_email=request.data.get('applicant_email'),
            applicant_location=request.data.get('applicant_location'),
            resume_file=resume,  # 👈 SAVE FILE HERE
            cover_letter=request.data.get('cover_letter', '')
        )

        return Response({"message": "Application submitted successfully"})
    except Exception as e:
        return Response({"error": str(e)}, status=400)




def get_applications(request):
    applications = JobApplication.objects.all().values()
    return JsonResponse(list(applications), safe=False)


from .models import ContactMessage
from .serializers import ContactMessageSerializer

@api_view(['POST'])
def contact_message(request):
    serializer = ContactMessageSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Message sent successfully"})
    return Response(serializer.errors, status=400)


from .models import ContactMessage
from .serializers import ContactMessageSerializer


@api_view(['GET'])
def get_contact_messages(request):
    messages = ContactMessage.objects.all().order_by("-created_at")
    serializer = ContactMessageSerializer(messages, many=True)
    return Response(serializer.data)

@api_view(['DELETE'])
def delete_contact_message(request, message_id):
    try:
        message = ContactMessage.objects.get(id=message_id)
        message.delete()
        return Response({"message": "Message deleted successfully"})
    except ContactMessage.DoesNotExist:
        return Response({"error": "Message not found"}, status=404)
