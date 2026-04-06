from django.urls import path
from . import views
from .views import signup, login, get_jobs, add_job, delete_job, admin_stats, get_users, delete_user, apply_job
from .views import apply_job, get_applications




urlpatterns = [
    path('signup/', views.signup),
    path('login/', views.login),
    path('jobs/', views.get_jobs),
    path('add-job/', views.add_job),
    path('delete-job/<int:job_id>/', views.delete_job),
        path('admin-stats/', views.admin_stats),
        path('delete-user/<int:user_id>/', views.delete_user),
        path('users/', views.get_users),
       path('apply-job/', apply_job, name='apply_job'),
    path('applications/', get_applications),
    path('contact/', views.contact_message),
path("contact-messages/", views.get_contact_messages),
path("delete-contact/<int:message_id>/", views.delete_contact_message),



]
