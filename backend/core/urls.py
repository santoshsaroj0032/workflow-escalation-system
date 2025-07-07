from django.urls import path
from .views import (
    RegisterView, LoginView, LogoutView, ForgotPasswordView,
    IncidentListCreateView, IncidentDetailView
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('forgot-password/', ForgotPasswordView.as_view(), name='forgot-password'),
    path('incidents/', IncidentListCreateView.as_view(), name='incident-list'),
    path('incidents/<str:incident_id>/', IncidentDetailView.as_view(), name='incident-detail'),
]