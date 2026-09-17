from django.contrib import admin
from .models import Employee

@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    """
    Django Admin panel configuration for Employee model.
    Enables rich search, filtering, and field grouping for HR staff.
    """
    list_display = [
        'employee_id',
        'full_name',
        'department',
        'designation',
        'salary',
        'employment_type',
        'status',
        'date_of_joining'
    ]
    list_filter = ['department', 'status', 'employment_type', 'date_of_joining']
    search_fields = ['employee_id', 'full_name', 'email', 'phone', 'designation']
    ordering = ['-created_at']
    readonly_fields = ['created_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('employee_id', 'full_name', 'email', 'phone', 'address')
        }),
        ('Employment Details', {
            'fields': ('department', 'designation', 'employment_type', 'status', 'date_of_joining')
        }),
        ('Compensation & System Audit', {
            'fields': ('salary', 'created_at')
        }),
    )
