from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EmployeeViewSet, employee_stats_view, reset_sample_data

# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register(r'employees', EmployeeViewSet, basename='employee')

# The API URLs are determined automatically by the router.
urlpatterns = [
    path('', include(router.urls)),
    path('stats/', employee_stats_view, name='employee-stats'),
    path('reset-sample-data/', reset_sample_data, name='reset-sample-data'),
]
