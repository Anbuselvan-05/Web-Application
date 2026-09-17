#!/usr/bin/env python
"""
Standalone script to populate the SQLite database with initial employee data.
Usage:
    python populate_sample_data.py
"""
import os
import sys
import django

# Setup django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'employee_management_backend.settings')
django.setup()

from employees.models import Employee

def seed_database():
    print("Seeding database with sample employee records...")
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

    for data in sample_employees:
        emp = Employee.objects.create(**data)
        print(f" Created employee: {emp.employee_id} - {emp.full_name}")

    print(f"\nSuccessfully seeded {len(sample_employees)} employees into SQLite!")

if __name__ == '__main__':
    seed_database()
