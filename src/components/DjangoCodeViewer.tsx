import React, { useState } from 'react';
import { Code2, Copy, Check, FileCode, Terminal, ExternalLink } from 'lucide-react';

export const DjangoCodeViewer: React.FC = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const files = [
    {
      id: 'models',
      name: 'employees/models.py',
      description: 'Employee database model definition with Django ORM constraints',
      code: `from django.db import models
from django.core.validators import MinValueValidator

class Employee(models.Model):
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
        return f"{self.employee_id} - {self.full_name} ({self.department})"`
    },
    {
      id: 'serializers',
      name: 'employees/serializers.py',
      description: 'DRF Serializer with validation rules (unique ID/email, positive salary, valid phone)',
      code: `import re
from rest_framework import serializers
from .models import Employee

class EmployeeSerializer(serializers.ModelSerializer):
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
        trimmed = value.strip().upper()
        if not trimmed:
            raise serializers.ValidationError("Employee ID cannot be empty.")
        
        instance = self.instance
        qs = Employee.objects.filter(employee_id__iexact=trimmed)
        if instance:
            qs = qs.exclude(pk=instance.pk)
        if qs.exists():
            raise serializers.ValidationError("Employee with this Employee ID already exists.")
        return trimmed

    def validate_full_name(self, value):
        trimmed = value.strip()
        if len(trimmed) < 2:
            raise serializers.ValidationError("Full Name must be at least 2 characters long.")
        return trimmed

    def validate_email(self, value):
        trimmed = value.strip().lower()
        instance = self.instance
        qs = Employee.objects.filter(email__iexact=trimmed)
        if instance:
            qs = qs.exclude(pk=instance.pk)
        if qs.exists():
            raise serializers.ValidationError("Employee with this email address already exists.")
        return trimmed

    def validate_phone(self, value):
        clean = re.sub(r'[\s\-()]', '', value)
        if not re.match(r'^\\+?[0-9]{7,15}$', clean):
            raise serializers.ValidationError("Phone number must contain between 7 and 15 digits.")
        return value.strip()

    def validate_salary(self, value):
        if value <= 0:
            raise serializers.ValidationError("Salary must be a positive number greater than 0.")
        return value`
    },
    {
      id: 'views',
      name: 'employees/views.py',
      description: 'ModelViewSet handling all CRUD operations, filtering, search, ordering & stats',
      code: `from django.db.models import Q, Count, Avg, Sum
from rest_framework import status, viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Employee
from .serializers import EmployeeSerializer

class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer

    def get_queryset(self):
        queryset = Employee.objects.all()

        search = self.request.query_params.get('search', None)
        department = self.request.query_params.get('department', None)
        status_param = self.request.query_params.get('status', None)
        ordering = self.request.query_params.get('ordering', None)

        if search:
            queryset = queryset.filter(
                Q(employee_id__icontains=search) |
                Q(full_name__icontains=search) |
                Q(email__icontains=search)
            )

        if department and department != 'All':
            queryset = queryset.filter(department__iexact=department)

        if status_param and status_param != 'All':
            queryset = queryset.filter(status__iexact=status_param)

        if ordering:
            valid_order_fields = [
                'full_name', '-full_name',
                'date_of_joining', '-date_of_joining',
                'salary', '-salary',
                'employee_id', '-employee_id'
            ]
            if ordering in valid_order_fields:
                queryset = queryset.order_by(ordering)

        return queryset

@api_view(['GET'])
def employee_stats_view(request):
    total = Employee.objects.count()
    active = Employee.objects.filter(status='Active').count()
    inactive = Employee.objects.filter(status='Inactive').count()
    total_salary = Employee.objects.aggregate(total_sum=Sum('salary'))['total_sum'] or 0

    dept_stats = (
        Employee.objects.values('department')
        .annotate(count=Count('id'), avg_salary=Avg('salary'))
        .order_by('-count')
    )

    departments_list = []
    for d in dept_stats:
        dept_name = d['department']
        active_in_dept = Employee.objects.filter(department=dept_name, status='Active').count()
        departments_list.append({
            'name': dept_name,
            'count': d['count'],
            'activeCount': active_in_dept,
            'avgSalary': round(float(d['avg_salary'] or 0), 2)
        })

    return Response({
        'totalEmployees': total,
        'activeEmployees': active,
        'inactiveEmployees': inactive,
        'totalSalary': float(total_salary),
        'departments': departments_list
    }, status=status.HTTP_200_OK)`
    },
    {
      id: 'urls',
      name: 'employees/urls.py',
      description: 'DRF DefaultRouter registering employee CRUD endpoints',
      code: `from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EmployeeViewSet, employee_stats_view, reset_sample_data

router = DefaultRouter()
router.register(r'employees', EmployeeViewSet, basename='employee')

urlpatterns = [
    path('', include(router.urls)),
    path('stats/', employee_stats_view, name='employee-stats'),
    path('reset-sample-data/', reset_sample_data, name='reset-sample-data'),
]`
    },
    {
      id: 'settings',
      name: 'employee_management_backend/settings.py',
      description: 'Django configuration with SQLite3, DRF, and CORS settings',
      code: `from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
SECRET_KEY = 'django-insecure-ems-college-project-key'
DEBUG = True
ALLOWED_HOSTS = ['*']

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    'employees.apps.EmployeesConfig',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'employee_management_backend.urls'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

CORS_ALLOW_ALL_ORIGINS = True`
    }
  ];

  const [selectedFile, setSelectedFile] = useState(files[0]);

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Django Backend Source Code</h1>
            <span className="bg-indigo-50 text-indigo-700 text-xs px-2.5 py-0.5 rounded-full font-medium border border-indigo-200">
              Python 3 + DRF + SQLite
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Browse all backend source files created in the project repository for local Python/Django execution.
          </p>
        </div>

        <button
          onClick={() => handleCopy(selectedFile.code, selectedFile.id)}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors"
        >
          {copiedKey === selectedFile.id ? (
            <Check className="w-3.5 h-3.5" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
          <span>{copiedKey === selectedFile.id ? 'Copied File' : 'Copy File Content'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* File Navigator List */}
        <div className="lg:col-span-1 bg-white p-3 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1">
            Backend Files
          </p>
          {files.map((file) => {
            const isSelected = selectedFile.id === file.id;
            return (
              <button
                key={file.id}
                onClick={() => setSelectedFile(file)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-mono transition-all flex items-center gap-2.5 ${
                  isSelected
                    ? 'bg-indigo-50 text-indigo-700 font-bold border border-indigo-200'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <FileCode className="w-4 h-4 shrink-0 text-slate-400" />
                <span className="truncate">{file.name}</span>
              </button>
            );
          })}
        </div>

        {/* Code Content Box */}
        <div className="lg:col-span-3 bg-slate-950 rounded-xl border border-slate-800 shadow-sm overflow-hidden flex flex-col">
          <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
              <Terminal className="w-4 h-4 text-indigo-400" />
              <span className="font-semibold text-white">{selectedFile.name}</span>
            </div>
            <span className="text-[11px] text-slate-400 hidden sm:inline">
              {selectedFile.description}
            </span>
          </div>

          <div className="p-4 overflow-x-auto">
            <pre className="text-xs font-mono text-slate-200 leading-relaxed">
              <code>{selectedFile.code}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
