import re
from rest_framework import serializers
from .models import Employee

class EmployeeSerializer(serializers.ModelSerializer):
    """
    Serializer for the Employee model.
    Converts between Model instances and JSON representation.
    Enforces strict field-level and cross-field validation rules.
    """

    class Meta:
        model = Employee
        fields = [
            'id',
            'employee_id',
            'full_name',
            'email',
            'phone',
            'department',
            'designation',
            'salary',
            'date_of_joining',
            'employment_type',
            'address',
            'status',
            'created_at'
        ]
        read_only_fields = ['id', 'created_at']

    def validate_employee_id(self, value):
        """Ensure employee_id is non-empty, stripped of extra spaces, and unique."""
        trimmed = value.strip().upper()
        if not trimmed:
            raise serializers.ValidationError("Employee ID cannot be empty.")
        
        # Check uniqueness during creation or update
        instance = self.instance
        qs = Employee.objects.filter(employee_id__iexact=trimmed)
        if instance:
            qs = qs.exclude(pk=instance.pk)
        if qs.exists():
            raise serializers.ValidationError("Employee with this Employee ID already exists.")
        
        return trimmed

    def validate_full_name(self, value):
        """Ensure full name has at least two characters."""
        trimmed = value.strip()
        if len(trimmed) < 2:
            raise serializers.ValidationError("Full Name must be at least 2 characters long.")
        return trimmed

    def validate_email(self, value):
        """Ensure email is lowercased and unique."""
        trimmed = value.strip().lower()
        instance = self.instance
        qs = Employee.objects.filter(email__iexact=trimmed)
        if instance:
            qs = qs.exclude(pk=instance.pk)
        if qs.exists():
            raise serializers.ValidationError("Employee with this email address already exists.")
        return trimmed

    def validate_phone(self, value):
        """Ensure phone number has between 7 and 15 digits."""
        clean = re.sub(r'[\s\-()]', '', value)
        if not re.match(r'^\+?[0-9]{7,15}$', clean):
            raise serializers.ValidationError("Phone number must contain between 7 and 15 digits.")
        return value.strip()

    def validate_salary(self, value):
        """Ensure salary is greater than zero."""
        if value <= 0:
            raise serializers.ValidationError("Salary must be a positive number greater than 0.")
        return value
