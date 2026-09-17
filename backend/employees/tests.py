from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import Employee

class EmployeeModelTest(TestCase):
    """Unit tests for the Employee model and string representation."""

    def setUp(self):
        self.employee = Employee.objects.create(
            employee_id="EMP001",
            full_name="Aarav Sharma",
            email="aarav.sharma@example.com",
            phone="9876543210",
            department="Engineering",
            designation="Software Engineer",
            salary=85000.00,
            date_of_joining="2023-01-15",
            employment_type="Full-time",
            address="Whitefield, Bengaluru",
            status="Active"
        )

    def test_employee_creation(self):
        """Test that the employee was created successfully."""
        self.assertEqual(self.employee.employee_id, "EMP001")
        self.assertEqual(self.employee.full_name, "Aarav Sharma")
        self.assertEqual(str(self.employee), "EMP001 - Aarav Sharma (Engineering)")


class EmployeeAPITests(APITestCase):
    """Test suite for the Employee REST API CRUD endpoints."""

    def setUp(self):
        self.valid_payload = {
            "employee_id": "EMP101",
            "full_name": "Rohan Gupta",
            "email": "rohan.gupta@example.com",
            "phone": "9811223344",
            "department": "Engineering",
            "designation": "Backend Developer",
            "salary": 75000.00,
            "date_of_joining": "2023-06-01",
            "employment_type": "Full-time",
            "address": "Pune, Maharashtra",
            "status": "Active"
        }
        self.employee = Employee.objects.create(**self.valid_payload)
        self.list_create_url = reverse('employee-list')
        self.detail_url = reverse('employee-detail', kwargs={'pk': self.employee.pk})

    def test_get_all_employees(self):
        """Test GET /api/employees/ returns 200 OK and list of employees."""
        response = self.client.get(self.list_create_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)

    def test_create_employee_success(self):
        """Test POST /api/employees/ with valid data creates employee."""
        new_payload = {
            "employee_id": "EMP102",
            "full_name": "Neha Joshi",
            "email": "neha.joshi@example.com",
            "phone": "9822334455",
            "department": "Human Resources",
            "designation": "HR Recruiter",
            "salary": 55000.00,
            "date_of_joining": "2023-08-10",
            "employment_type": "Full-time",
            "address": "Mumbai, Maharashtra",
            "status": "Active"
        }
        response = self.client.post(self.list_create_url, new_payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['employee_id'], "EMP102")

    def test_create_employee_duplicate_id_fails(self):
        """Test POST with duplicate employee_id returns 400 Bad Request."""
        duplicate_id_payload = {**self.valid_payload, "email": "unique@example.com"}
        response = self.client.post(self.list_create_url, duplicate_id_payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('employee_id', response.data)

    def test_create_employee_duplicate_email_fails(self):
        """Test POST with duplicate email returns 400 Bad Request."""
        duplicate_email_payload = {**self.valid_payload, "employee_id": "EMP999"}
        response = self.client.post(self.list_create_url, duplicate_email_payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', response.data)

    def test_create_employee_negative_salary_fails(self):
        """Test POST with negative salary returns 400 Bad Request."""
        invalid_salary_payload = {
            **self.valid_payload,
            "employee_id": "EMP103",
            "email": "test.salary@example.com",
            "salary": -5000
        }
        response = self.client.post(self.list_create_url, invalid_salary_payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('salary', response.data)

    def test_get_single_employee(self):
        """Test GET /api/employees/{id}/ returns single employee data."""
        response = self.client.get(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['employee_id'], "EMP101")

    def test_update_employee(self):
        """Test PUT /api/employees/{id}/ updates details."""
        update_payload = {**self.valid_payload, "designation": "Lead Developer", "salary": 90000.00}
        response = self.client.put(self.detail_url, update_payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['designation'], "Lead Developer")

    def test_delete_employee(self):
        """Test DELETE /api/employees/{id}/ removes record and returns 204 No Content."""
        response = self.client.delete(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Employee.objects.filter(pk=self.employee.pk).exists())
