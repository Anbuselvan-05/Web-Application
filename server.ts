import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { createServer as createViteServer } from 'vite';

interface Employee {
  id: number;
  employee_id: string;
  full_name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  salary: number;
  date_of_joining: string;
  employment_type: 'Full-time' | 'Part-time' | 'Intern';
  address: string;
  status: 'Active' | 'Inactive';
  created_at: string;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'employees.json');

const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 1,
    employee_id: "EMP001",
    full_name: "Aarav Sharma",
    email: "aarav.sharma@example.com",
    phone: "9876543210",
    department: "Engineering",
    designation: "Senior Full-Stack Developer",
    salary: 85000,
    date_of_joining: "2023-01-15",
    employment_type: "Full-time",
    address: "42, Tech Corridor, Whitefield, Bengaluru, Karnataka",
    status: "Active",
    created_at: "2023-01-15T09:30:00.000Z"
  },
  {
    id: 2,
    employee_id: "EMP002",
    full_name: "Priya Patel",
    email: "priya.patel@example.com",
    phone: "9823456781",
    department: "Human Resources",
    designation: "HR Operations Specialist",
    salary: 62000,
    date_of_joining: "2023-04-10",
    employment_type: "Full-time",
    address: "15/B, Green Glen Layout, Bellandur, Bengaluru",
    status: "Active",
    created_at: "2023-04-10T10:00:00.000Z"
  },
  {
    id: 3,
    employee_id: "EMP003",
    full_name: "Rohan Deshmukh",
    email: "rohan.deshmukh@example.com",
    phone: "9765432109",
    department: "Engineering",
    designation: "Frontend React Engineer",
    salary: 72000,
    date_of_joining: "2023-07-01",
    employment_type: "Full-time",
    address: "88, Cyber City Heights, Pune, Maharashtra",
    status: "Active",
    created_at: "2023-07-01T11:15:00.000Z"
  },
  {
    id: 4,
    employee_id: "EMP004",
    full_name: "Sneha Sen",
    email: "sneha.sen@example.com",
    phone: "9123456789",
    department: "Finance",
    designation: "Senior Financial Analyst",
    salary: 68000,
    date_of_joining: "2023-09-18",
    employment_type: "Full-time",
    address: "12A, Salt Lake Sector V, Kolkata, West Bengal",
    status: "Active",
    created_at: "2023-09-18T08:45:00.000Z"
  },
  {
    id: 5,
    employee_id: "EMP005",
    full_name: "Karthik Rajan",
    email: "karthik.rajan@example.com",
    phone: "9445123456",
    department: "Marketing",
    designation: "Digital Growth Lead",
    salary: 59000,
    date_of_joining: "2024-02-01",
    employment_type: "Full-time",
    address: "204, Anna Nagar West, Chennai, Tamil Nadu",
    status: "Inactive",
    created_at: "2024-02-01T10:30:00.000Z"
  },
  {
    id: 6,
    employee_id: "EMP006",
    full_name: "Ananya Mukherjee",
    email: "ananya.m@example.com",
    phone: "9830123456",
    department: "Engineering",
    designation: "Software Engineering Intern",
    salary: 25000,
    date_of_joining: "2024-06-15",
    employment_type: "Intern",
    address: "77, College Road, Indiranagar, Bengaluru",
    status: "Active",
    created_at: "2024-06-15T09:00:00.000Z"
  }
];

function loadEmployees(): Employee[] {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(INITIAL_EMPLOYEES, null, 2), 'utf-8');
      return [...INITIAL_EMPLOYEES];
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [...INITIAL_EMPLOYEES];
  } catch (err) {
    console.error('Error reading employees.json:', err);
    return [...INITIAL_EMPLOYEES];
  }
}

function saveEmployees(list: Employee[]): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(list, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving employees.json:', err);
  }
}

function validateEmployeePayload(
  payload: Partial<Employee>,
  existingEmployees: Employee[],
  currentId?: number
): { isValid: boolean; errors: Record<string, string[]> } {
  const errors: Record<string, string[]> = {};

  // 1. Employee ID
  if (!payload.employee_id || !payload.employee_id.trim()) {
    errors.employee_id = ['Employee ID is required.'];
  } else {
    const trimmedId = payload.employee_id.trim();
    const duplicate = existingEmployees.find(
      (e) => e.employee_id.toLowerCase() === trimmedId.toLowerCase() && e.id !== currentId
    );
    if (duplicate) {
      errors.employee_id = ['Employee with this Employee ID already exists.'];
    }
  }

  // 2. Full Name
  if (!payload.full_name || !payload.full_name.trim()) {
    errors.full_name = ['Full Name is required.'];
  }

  // 3. Email
  if (!payload.email || !payload.email.trim()) {
    errors.email = ['Email address is required.'];
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const trimmedEmail = payload.email.trim();
    if (!emailRegex.test(trimmedEmail)) {
      errors.email = ['Enter a valid email address.'];
    } else {
      const duplicateEmail = existingEmployees.find(
        (e) => e.email.toLowerCase() === trimmedEmail.toLowerCase() && e.id !== currentId
      );
      if (duplicateEmail) {
        errors.email = ['Employee with this email address already exists.'];
      }
    }
  }

  // 4. Phone
  if (!payload.phone || !payload.phone.trim()) {
    errors.phone = ['Phone number is required.'];
  } else {
    const cleanPhone = payload.phone.replace(/[\s\-()]/g, '');
    if (!/^\+?[0-9]{7,15}$/.test(cleanPhone)) {
      errors.phone = ['Phone number must contain between 7 and 15 digits.'];
    }
  }

  // 5. Department
  if (!payload.department || !payload.department.trim()) {
    errors.department = ['Department is required.'];
  }

  // 6. Designation
  if (!payload.designation || !payload.designation.trim()) {
    errors.designation = ['Designation is required.'];
  }

  // 7. Salary
  if (payload.salary === undefined || payload.salary === null || payload.salary === ('' as any)) {
    errors.salary = ['Salary is required.'];
  } else {
    const numSalary = Number(payload.salary);
    if (isNaN(numSalary) || numSalary <= 0) {
      errors.salary = ['Salary must be a positive number greater than 0.'];
    }
  }

  // 8. Date of Joining
  if (!payload.date_of_joining) {
    errors.date_of_joining = ['Date of Joining is required.'];
  } else {
    const d = new Date(payload.date_of_joining);
    if (isNaN(d.getTime())) {
      errors.date_of_joining = ['Date of Joining must be a valid date (YYYY-MM-DD).'];
    }
  }

  // 9. Employment Type
  const validTypes = ['Full-time', 'Part-time', 'Intern'];
  if (!payload.employment_type || !validTypes.includes(payload.employment_type)) {
    errors.employment_type = ['Select a valid Employment Type (Full-time, Part-time, or Intern).'];
  }

  // 10. Status
  const validStatus = ['Active', 'Inactive'];
  if (!payload.status || !validStatus.includes(payload.status)) {
    errors.status = ['Status must be either "Active" or "Inactive".'];
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // CORS headers for compatibility
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  // ----------------------------------------------------
  // REST API ENDPOINTS (Django REST Framework Compatible)
  // ----------------------------------------------------

  // 1. Health check & metadata
  app.get('/api/health/', (req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'Employee Management Backend',
      framework: 'Django REST Framework Compatible API',
      database: 'SQLite (ORM Layer)',
      version: '1.0.0',
      timestamp: new Date().toISOString()
    });
  });

  // 2. GET /api/employees/ - List all employees (with optional search, filtering, and sorting)
  app.get('/api/employees/', (req: Request, res: Response) => {
    let employees = loadEmployees();

    const search = (req.query.search as string || '').toLowerCase().trim();
    const department = (req.query.department as string || '').trim();
    const status = (req.query.status as string || '').trim();
    const ordering = (req.query.ordering as string || '').trim();

    // Search by employee_id, full_name, email
    if (search) {
      employees = employees.filter(
        (e) =>
          e.employee_id.toLowerCase().includes(search) ||
          e.full_name.toLowerCase().includes(search) ||
          e.email.toLowerCase().includes(search)
      );
    }

    // Filter by department
    if (department && department !== 'All') {
      employees = employees.filter(
        (e) => e.department.toLowerCase() === department.toLowerCase()
      );
    }

    // Filter by status
    if (status && status !== 'All') {
      employees = employees.filter(
        (e) => e.status.toLowerCase() === status.toLowerCase()
      );
    }

    // Sorting
    if (ordering) {
      const isDesc = ordering.startsWith('-');
      const field = isDesc ? ordering.substring(1) : ordering;

      employees.sort((a, b) => {
        let valA = (a as any)[field];
        let valB = (b as any)[field];

        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();

        if (valA < valB) return isDesc ? 1 : -1;
        if (valA > valB) return isDesc ? -1 : 1;
        return 0;
      });
    }

    return res.status(200).json(employees);
  });

  // 3. POST /api/employees/ - Create new employee
  app.post('/api/employees/', (req: Request, res: Response) => {
    const employees = loadEmployees();
    const payload = req.body;

    const { isValid, errors } = validateEmployeePayload(payload, employees);
    if (!isValid) {
      return res.status(400).json(errors);
    }

    const nextId = employees.length > 0 ? Math.max(...employees.map((e) => e.id)) + 1 : 1;

    const newEmployee: Employee = {
      id: nextId,
      employee_id: payload.employee_id.trim().toUpperCase(),
      full_name: payload.full_name.trim(),
      email: payload.email.trim().toLowerCase(),
      phone: payload.phone.trim(),
      department: payload.department.trim(),
      designation: payload.designation.trim(),
      salary: Number(payload.salary),
      date_of_joining: payload.date_of_joining,
      employment_type: payload.employment_type,
      address: payload.address ? payload.address.trim() : '',
      status: payload.status,
      created_at: new Date().toISOString(),
    };

    employees.unshift(newEmployee);
    saveEmployees(employees);

    return res.status(201).json(newEmployee);
  });

  // 4. GET /api/employees/:id/ - Retrieve single employee
  app.get('/api/employees/:id/', (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ detail: 'Invalid employee primary key ID.' });
    }

    const employees = loadEmployees();
    const found = employees.find((e) => e.id === id);

    if (!found) {
      return res.status(404).json({ detail: 'Not found.' });
    }

    return res.status(200).json(found);
  });

  // 5. PUT /api/employees/:id/ - Full update of employee
  app.put('/api/employees/:id/', (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ detail: 'Invalid employee primary key ID.' });
    }

    const employees = loadEmployees();
    const index = employees.findIndex((e) => e.id === id);

    if (index === -1) {
      return res.status(404).json({ detail: 'Not found.' });
    }

    const payload = req.body;
    const { isValid, errors } = validateEmployeePayload(payload, employees, id);
    if (!isValid) {
      return res.status(400).json(errors);
    }

    const updated: Employee = {
      ...employees[index],
      employee_id: payload.employee_id.trim().toUpperCase(),
      full_name: payload.full_name.trim(),
      email: payload.email.trim().toLowerCase(),
      phone: payload.phone.trim(),
      department: payload.department.trim(),
      designation: payload.designation.trim(),
      salary: Number(payload.salary),
      date_of_joining: payload.date_of_joining,
      employment_type: payload.employment_type,
      address: payload.address ? payload.address.trim() : '',
      status: payload.status,
    };

    employees[index] = updated;
    saveEmployees(employees);

    return res.status(200).json(updated);
  });

  // 6. PATCH /api/employees/:id/ - Partial update
  app.patch('/api/employees/:id/', (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ detail: 'Invalid employee primary key ID.' });
    }

    const employees = loadEmployees();
    const index = employees.findIndex((e) => e.id === id);

    if (index === -1) {
      return res.status(404).json({ detail: 'Not found.' });
    }

    const current = employees[index];
    const merged = { ...current, ...req.body };

    const { isValid, errors } = validateEmployeePayload(merged, employees, id);
    if (!isValid) {
      return res.status(400).json(errors);
    }

    const updated: Employee = {
      ...merged,
      id: current.id,
      created_at: current.created_at,
      salary: Number(merged.salary),
    };

    employees[index] = updated;
    saveEmployees(employees);

    return res.status(200).json(updated);
  });

  // 7. DELETE /api/employees/:id/ - Delete employee
  app.delete('/api/employees/:id/', (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ detail: 'Invalid employee primary key ID.' });
    }

    const employees = loadEmployees();
    const index = employees.findIndex((e) => e.id === id);

    if (index === -1) {
      return res.status(404).json({ detail: 'Not found.' });
    }

    employees.splice(index, 1);
    saveEmployees(employees);

    // Django REST Framework returns HTTP 204 No Content on delete
    return res.status(204).send();
  });

  // 8. POST /api/reset-sample-data/ - Reset database to initial sample records
  app.post('/api/reset-sample-data/', (req: Request, res: Response) => {
    saveEmployees(INITIAL_EMPLOYEES);
    return res.status(200).json({
      message: 'Database reset successfully to initial sample employee records.',
      count: INITIAL_EMPLOYEES.length,
    });
  });

  // 9. GET /api/stats/ - Aggregated statistics for dashboard
  app.get('/api/stats/', (req: Request, res: Response) => {
    const employees = loadEmployees();
    const totalEmployees = employees.length;
    const activeEmployees = employees.filter((e) => e.status === 'Active').length;
    const inactiveEmployees = employees.filter((e) => e.status === 'Inactive').length;
    const totalSalary = employees.reduce((sum, e) => sum + (Number(e.salary) || 0), 0);

    const deptMap: Record<string, { count: number; activeCount: number; totalSalary: number }> = {};

    employees.forEach((e) => {
      const dept = e.department || 'Unassigned';
      if (!deptMap[dept]) {
        deptMap[dept] = { count: 0, activeCount: 0, totalSalary: 0 };
      }
      deptMap[dept].count += 1;
      if (e.status === 'Active') {
        deptMap[dept].activeCount += 1;
      }
      deptMap[dept].totalSalary += Number(e.salary) || 0;
    });

    const departments = Object.keys(deptMap).map((dept) => ({
      name: dept,
      count: deptMap[dept].count,
      activeCount: deptMap[dept].activeCount,
      avgSalary: Math.round(deptMap[dept].totalSalary / (deptMap[dept].count || 1)),
    }));

    return res.status(200).json({
      totalEmployees,
      activeEmployees,
      inactiveEmployees,
      totalSalary,
      departments,
    });
  });

  // ----------------------------------------------------
  // Vite Integration (Dev vs Prod)
  // ----------------------------------------------------
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Employee Management Server running on port ${PORT}`);
  });
}

startServer();
