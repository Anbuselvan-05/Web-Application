# Employee Management System (EMS)
### College Mini-Project | 2nd Year B.E. Computer Science & Engineering

A complete, functional, CRUD-based web application with a **React** frontend, **Django REST Framework** backend, and **SQLite** database.

---

## 📁 Project Folder Structure

```text
EmployeeManagementSystem/
│
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── populate_sample_data.py
│   ├── employee_management_backend/
│   │   ├── __init__.py
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── asgi.py
│   │   └── wsgi.py
│   │
│   └── employees/
│       ├── __init__.py
│       ├── admin.py
│       ├── apps.py
│       ├── models.py
│       ├── serializers.py
│       ├── views.py
│       ├── urls.py
│       ├── tests.py
│       └── migrations/
│           ├── __init__.py
│           └── 0001_initial.py
│
├── frontend/ (integrated in root for live preview & standalone deployment)
│   ├── package.json
│   ├── index.html
│   ├── vite.config.ts
│   └── src/
│       ├── main.tsx
│       ├── App.tsx
│       ├── api.ts
│       ├── api.js
│       ├── types.ts
│       ├── index.css
│       ├── components/
│       │   ├── Navbar.tsx
│       │   ├── Sidebar.tsx
│       │   ├── Dashboard.tsx
│       │   ├── EmployeeList.tsx
│       │   ├── EmployeeForm.tsx
│       │   ├── EmployeeCard.tsx
│       │   ├── DeleteConfirmModal.tsx
│       │   ├── PostmanTestSuite.tsx
│       │   ├── ProjectReportViewer.tsx
│       │   └── DjangoCodeViewer.tsx
│       └── pages/
│           ├── Home.tsx
│           └── Employees.tsx
│
└── README.md
```

---

## 🛠️ Technology Stack

- **Frontend:** React 19, Tailwind CSS, Lucide Icons, TypeScript / JavaScript
- **Backend:** Python 3.10+, Django 4.2+, Django REST Framework (DRF)
- **Database:** SQLite3 (Django ORM with automatic migrations)
- **API Testing:** Postman Test Suite & Automated in-browser test runner

---

## 🚀 How to Run Locally

### 1. Backend (Django REST Framework)
```bash
# Navigate to backend directory
cd backend

# (Optional but recommended) Create and activate virtual environment
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run migrations to initialize SQLite database
python manage.py makemigrations
python manage.py migrate

# (Optional) Seed sample employee records
python populate_sample_data.py

# Start Django Development Server
python manage.py runserver
```
The Django REST API will be running at `http://127.0.0.1:8000/api/employees/`

---

### 2. Frontend (React + Vite)
```bash
# In the root or frontend directory
npm install

# Run the frontend development server
npm run dev
```
The React frontend dashboard will open at `http://localhost:3000`

---

## 🌐 REST API Endpoints

| HTTP Method | Endpoint | Description | Status Code |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/employees/` | Retrieve list of all employees (supports search & filter) | 200 OK |
| `POST` | `/api/employees/` | Create a new employee record | 201 Created |
| `GET` | `/api/employees/{id}/` | Retrieve single employee record by ID | 200 OK / 404 |
| `PUT` | `/api/employees/{id}/` | Complete update of employee record | 200 OK / 400 |
| `PATCH` | `/api/employees/{id}/` | Partial update of employee fields | 200 OK / 400 |
| `DELETE` | `/api/employees/{id}/` | Delete employee record from database | 204 No Content |
| `GET` | `/api/stats/` | Dashboard metrics & department analytics | 200 OK |
| `POST` | `/api/reset-sample-data/` | Reset database to initial sample records | 201 Created |

---

## 🧪 Postman Test Suite (14 Standard Test Cases)

1. **TC-01:** Create employee with valid data (HTTP 201)
2. **TC-02:** Create employee with missing fields (HTTP 400)
3. **TC-03:** Create employee with duplicate Employee ID (HTTP 400)
4. **TC-04:** Create employee with duplicate email (HTTP 400)
5. **TC-05:** Get all employees list (HTTP 200)
6. **TC-06:** Get employee by ID (HTTP 200)
7. **TC-07:** Update employee details via PUT (HTTP 200)
8. **TC-08:** Update non-existent employee ID (HTTP 404)
9. **TC-09:** Delete employee by ID (HTTP 204)
10. **TC-10:** Delete non-existent employee (HTTP 404)
11. **TC-11:** Test invalid email format validation (HTTP 400)
12. **TC-12:** Test invalid negative salary validation (HTTP 400)
13. **TC-13:** Test dashboard statistics and headcount (HTTP 200)
14. **TC-14:** Test API health check (HTTP 200)
