from django.db import models
from django.core.validators import MinValueValidator

class Employee(models.Model):
    """
    Employee Model representing company staff member records.
    Contains personal, employment, and salary details with database-level constraints.
    """
    EMPLOYMENT_TYPE_CHOICES = [
        ('Full-time', 'Full-time'),
        ('Part-time', 'Part-time'),
        ('Intern', 'Intern'),
    ]

    STATUS_CHOICES = [
        ('Active', 'Active'),
        ('Inactive', 'Inactive'),
    ]

    DEPARTMENT_CHOICES = [
        ('Engineering', 'Engineering'),
        ('Human Resources', 'Human Resources'),
        ('Finance', 'Finance'),
        ('Marketing', 'Marketing'),
        ('Sales', 'Sales'),
        ('Design', 'Design'),
        ('Operations', 'Operations'),
    ]

    # Primary key is auto-generated id BigAutoField
    employee_id = models.CharField(
        max_length=20,
        unique=True,
        help_text="Unique identification code (e.g. EMP001)",
        db_index=True
    )
    full_name = models.CharField(
        max_length=100,
        help_text="Employee's full legal name"
    )
    email = models.EmailField(
        unique=True,
        help_text="Unique corporate or personal email address",
        db_index=True
    )
    phone = models.CharField(
        max_length=20,
        help_text="Primary contact phone number"
    )
    department = models.CharField(
        max_length=50,
        choices=DEPARTMENT_CHOICES,
        default='Engineering',
        help_text="Assigned company department"
    )
    designation = models.CharField(
        max_length=100,
        help_text="Job title/designation within the company"
    )
    salary = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0.01)],
        help_text="Monthly or annual compensation in currency units (must be > 0)"
    )
    date_of_joining = models.DateField(
        help_text="Official joining date"
    )
    employment_type = models.CharField(
        max_length=20,
        choices=EMPLOYMENT_TYPE_CHOICES,
        default='Full-time',
        help_text="Contract type: Full-time, Part-time, or Intern"
    )
    address = models.TextField(
        blank=True,
        default='',
        help_text="Residential postal address"
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='Active',
        help_text="Current employment status (Active or Inactive)"
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text="Timestamp when this record was created in the database"
    )

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Employee'
        verbose_name_plural = 'Employees'

    def __str__(self):
        return f"{self.employee_id} - {self.full_name} ({self.department})"
