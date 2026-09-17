from django.db.models import Q, Count, Avg, Sum
from rest_framework import status, viewsets
from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import get_object_or_404

from .models import Employee
from .serializers import EmployeeSerializer

class EmployeeViewSet(viewsets.ModelViewSet):
    """
    ViewSet providing all CRUD operations for the Employee model:
    - list (GET /api/employees/) with search, department/status filter, and ordering
    - create (POST /api/employees/)
    - retrieve (GET /api/employees/{id}/)
    - update (PUT /api/employees/{id}/)
    - partial_update (PATCH /api/employees/{id}/)
    - destroy (DELETE /api/employees/{id}/)
    """
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer

    def get_queryset(self):
        """
        Supports dynamic search by employee_id, full_name, email,
        filtering by department and employment status, and sorting.
        """
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
            # Supports e.g. ordering=full_name, -full_name, date_of_joining, -date_of_joining, salary, -salary
            valid_order_fields = [
                'full_name', '-full_name',
                'date_of_joining', '-date_of_joining',
                'salary', '-salary',
                'employee_id', '-employee_id',
                'department', '-department',
                'created_at', '-created_at'
            ]
            if ordering in valid_order_fields:
                queryset = queryset.order_by(ordering)

        return queryset


@api_view(['GET'])
def employee_stats_view(request):
    """
    Returns aggregated metrics for the HR Dashboard:
    - Total employees
    - Active vs Inactive employees
    - Department-wise headcounts and average salaries
    """
    total = Employee.objects.count()
    active = Employee.objects.filter(status='Active').count()
    inactive = Employee.objects.filter(status='Inactive').count()
    total_salary = Employee.objects.aggregate(total_sum=Sum('salary'))['total_sum'] or 0

    dept_stats = (
        Employee.objects.values('department')
        .annotate(
            count=Count('id'),
            avg_salary=Avg('salary')
        )
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
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
def reset_sample_data(request):
    """
    Utility endpoint for testing and demo purposes.
    Populates SQLite database with 6 realistic employee records.
    """
    Employee.objects.all().delete()

    sample_employees = [
        {
            "employee_id": "EMP001",
            "full_name": "Aarav Sharma",
            "email": "aarav.sharma@example.com",
            "phone": "9876543210",
            "department": "Engineering",
            "designation": "Senior Full-Stack Developer",
            "salary": 85000.00,
            "date_of_joining": "2023-01-15",
            "employment_type": "Full-time",
            "address": "42, Tech Corridor, Whitefield, Bengaluru, Karnataka",
            "status": "Active"
        },
        {
            "employee_id": "EMP002",
            "full_name": "Priya Patel",
            "email": "priya.patel@example.com",
            "phone": "9823456781",
            "department": "Human Resources",
            "designation": "HR Operations Specialist",
            "salary": 62000.00,
            "date_of_joining": "2023-04-10",
            "employment_type": "Full-time",
            "address": "15/B, Green Glen Layout, Bellandur, Bengaluru",
            "status": "Active"
        },
        {
            "employee_id": "EMP003",
            "full_name": "Rohan Deshmukh",
            "email": "rohan.deshmukh@example.com",
            "phone": "9765432109",
            "department": "Engineering",
            "designation": "Frontend React Engineer",
            "salary": 72000.00,
            "date_of_joining": "2023-07-01",
            "employment_type": "Full-time",
            "address": "88, Cyber City Heights, Pune, Maharashtra",
            "status": "Active"
        },
        {
            "employee_id": "EMP004",
            "full_name": "Sneha Sen",
            "email": "sneha.sen@example.com",
            "phone": "9123456789",
            "department": "Finance",
            "designation": "Senior Financial Analyst",
            "salary": 68000.00,
            "date_of_joining": "2023-09-18",
            "employment_type": "Full-time",
            "address": "12A, Salt Lake Sector V, Kolkata, West Bengal",
            "status": "Active"
        },
        {
            "employee_id": "EMP005",
            "full_name": "Karthik Rajan",
            "email": "karthik.rajan@example.com",
            "phone": "9445123456",
            "department": "Marketing",
            "designation": "Digital Growth Lead",
            "salary": 59000.00,
            "date_of_joining": "2024-02-01",
            "employment_type": "Full-time",
            "address": "204, Anna Nagar West, Chennai, Tamil Nadu",
            "status": "Inactive"
        },
        {
            "employee_id": "EMP006",
            "full_name": "Ananya Mukherjee",
            "email": "ananya.m@example.com",
            "phone": "9830123456",
            "department": "Engineering",
            "designation": "Software Engineering Intern",
            "salary": 25000.00,
            "date_of_joining": "2024-06-15",
            "employment_type": "Intern",
            "address": "77, College Road, Indiranagar, Bengaluru",
            "status": "Active"
        }
    ]

    created = [Employee.objects.create(**emp) for emp in sample_employees]
    return Response({
        "message": "Database successfully populated with sample data.",
        "count": len(created)
    }, status=status.HTTP_201_CREATED)
