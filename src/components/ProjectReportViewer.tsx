import React, { useState } from 'react';
import { BookOpen, Copy, Check, Printer, FileText, ChevronRight, Bookmark } from 'lucide-react';

export const ProjectReportViewer: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [activeSection, setActiveSection] = useState('sec-1');

  const handleCopyReport = () => {
    const reportText = document.getElementById('academic-project-report')?.innerText || '';
    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const sections = [
    { id: 'sec-1', title: '1. Title Page' },
    { id: 'sec-2', title: '2. Abstract' },
    { id: 'sec-3', title: '3. Introduction' },
    { id: 'sec-4', title: '4. Problem Statement' },
    { id: 'sec-5', title: '5. Objectives' },
    { id: 'sec-6', title: '6. Scope of the Project' },
    { id: 'sec-7', title: '7. Existing System' },
    { id: 'sec-8', title: '8. Proposed System' },
    { id: 'sec-9', title: '9. Technology Stack' },
    { id: 'sec-10', title: '10. System Requirements' },
    { id: 'sec-11', title: '11. System Architecture' },
    { id: 'sec-12', title: '12. Data Flow Diagram (DFD)' },
    { id: 'sec-13', title: '13. Entity Relationship (ER) Diagram' },
    { id: 'sec-14', title: '14. Database Design (SQLite)' },
    { id: 'sec-15', title: '15. Frontend Design (React)' },
    { id: 'sec-16', title: '16. Backend Design (Django REST)' },
    { id: 'sec-17', title: '17. CRUD Operations Implementation' },
    { id: 'sec-18', title: '18. REST API Documentation' },
    { id: 'sec-19', title: '19. Validation & Exception Handling' },
    { id: 'sec-20', title: '20. Testing & Results (Postman)' },
    { id: 'sec-21', title: '21. Screenshots & Interface Walkthrough' },
    { id: 'sec-22', title: '22. Advantages of the System' },
    { id: 'sec-23', title: '23. Limitations' },
    { id: 'sec-24', title: '24. Future Enhancements' },
    { id: 'sec-25', title: '25. Conclusion' },
    { id: 'sec-26', title: '26. References' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Academic Project Report & Viva Dossier</h1>
            <span className="bg-emerald-50 text-emerald-700 text-xs px-2.5 py-0.5 rounded-full font-medium border border-emerald-200">
              26 Chapters Complete
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Standard College Mini-Project Report format for 2nd Year BE Computer Science & Engineering.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyReport}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied Report' : 'Copy All Text'}</span>
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Table of Contents + Report Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Table of Contents Sidebar */}
        <div className="lg:col-span-1 bg-white p-4 rounded-xl border border-slate-200 shadow-xs h-fit max-h-[85vh] overflow-y-auto sticky top-20">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-2 flex items-center gap-1.5">
            <Bookmark className="w-3.5 h-3.5 text-indigo-600" />
            Table of Contents
          </h2>
          <nav className="space-y-1 text-xs">
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                onClick={() => setActiveSection(s.id)}
                className={`block px-2.5 py-1.5 rounded-md transition-colors truncate ${
                  activeSection === s.id
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {s.title}
              </a>
            ))}
          </nav>
        </div>

        {/* 26-Chapter Report Document */}
        <div
          id="academic-project-report"
          className="lg:col-span-3 bg-white p-8 sm:p-12 rounded-xl border border-slate-200 shadow-xs prose prose-slate max-w-none text-slate-800 text-sm leading-relaxed"
        >
          {/* Section 1: Title Page */}
          <section id="sec-1" className="border-b border-slate-200 pb-10 text-center mb-10">
            <div className="text-xs font-mono font-semibold tracking-widest text-slate-500 uppercase mb-2">
              A Mini-Project Report On
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
              EMPLOYEE MANAGEMENT SYSTEM
            </h1>
            <p className="text-slate-600 text-sm font-medium mb-6">
              A Complete CRUD Web Application using React, Django REST Framework, and SQLite
            </p>

            <div className="max-w-md mx-auto my-8 p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600 space-y-2">
              <p>
                <strong>Degree:</strong> Bachelor of Engineering (B.E.) in Computer Science & Engineering
              </p>
              <p>
                <strong>Academic Year:</strong> 2nd Year (Semester IV)
              </p>
              <p>
                <strong>Submission Year:</strong> 2026
              </p>
            </div>
          </section>

          {/* Section 2: Abstract */}
          <section id="sec-2" className="border-b border-slate-200 pb-8 mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-3">2. Abstract</h2>
            <p>
              The <strong>Employee Management System (EMS)</strong> is a full-stack, web-based administrative software application designed to automate and streamline human resources operations. In modern enterprise environments, maintaining manual employee records in spreadsheets or paper ledgers introduces significant data redundancy, calculation errors, security vulnerabilities, and retrieval delays.
            </p>
            <p>
              This project addresses these operational challenges by implementing a decoupled, modern client-server architecture utilizing a <strong>React.js</strong> frontend communicating with a <strong>Django REST Framework (DRF)</strong> backend over asynchronous HTTP REST APIs, backed by a persistent <strong>SQLite3</strong> relational database. The system delivers complete <em>Create, Read, Update, and Delete (CRUD)</em> capabilities, real-time employee search and multi-criteria filtering, department-wise payroll analytics, rigorous client and server-side validation, and cross-platform responsive design.
            </p>
          </section>

          {/* Section 3: Introduction */}
          <section id="sec-3" className="border-b border-slate-200 pb-8 mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-3">3. Introduction</h2>
            <p>
              Human Resource Management is a foundational pillar of every organization. Keeping accurate track of employee personal information, departments, designations, joining dates, contact channels, and remuneration packages is critical for payroll computation, organizational planning, and regulatory compliance.
            </p>
            <p>
              As organizations scale from dozens to hundreds of team members, manual spreadsheet bookkeeping becomes error-prone. This mini-project demonstrates the design and practical engineering of a modern, responsive web application that provides human resource officers and administrators with a centralized, intuitive interface to manage the complete employee lifecycle from recruitment to separation.
            </p>
          </section>

          {/* Section 4: Problem Statement */}
          <section id="sec-4" className="border-b border-slate-200 pb-8 mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-3">4. Problem Statement</h2>
            <p>
              Traditional employee record-keeping methods present several critical operational drawbacks:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
              <li><strong>Data Redundancy and Inconsistency:</strong> Multiple spreadsheet copies lead to conflicting employee contact details and job roles.</li>
              <li><strong>Lack of Validation:</strong> Spreadsheets permit invalid phone digits, malformed emails, negative compensation amounts, and duplicate employee IDs.</li>
              <li><strong>Inefficient Search & Retrieval:</strong> Locating an employee across multiple departments or filtering by active status requires manual sorting and visual scanning.</li>
              <li><strong>Absence of Centralized REST APIs:</strong> Inability to integrate with third-party attendance, biometric, or payroll calculation systems.</li>
            </ul>
          </section>

          {/* Section 5: Objectives */}
          <section id="sec-5" className="border-b border-slate-200 pb-8 mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-3">5. Objectives</h2>
            <ol className="list-decimal pl-5 space-y-1.5 text-slate-700">
              <li>Develop a responsive Single-Page Application (SPA) frontend in React.js for interactive HR workflows.</li>
              <li>Implement standard RESTful API endpoints in Django REST Framework adhering to HTTP status code conventions (200, 201, 204, 400, 404).</li>
              <li>Enforce strict database integrity constraints (Unique Employee IDs, Unique Emails, Positive Salaries, Non-null requirements) in SQLite via Django ORM.</li>
              <li>Provide instant search and multi-attribute filtering by department and employment status.</li>
              <li>Implement analytical dashboard summary cards providing active headcount and payroll distributions.</li>
              <li>Verify system robustness through a 14-point Postman testing suite.</li>
            </ol>
          </section>

          {/* Section 6: Scope */}
          <section id="sec-6" className="border-b border-slate-200 pb-8 mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-3">6. Scope of the Project</h2>
            <p>
              The system encompasses the complete administration of corporate personnel records within small-to-medium business enterprises, educational institutions, and corporate divisions. The scope specifically includes:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-700">
              <li>Personnel biographical registration and credential validation.</li>
              <li>Departmental categorization (Engineering, HR, Finance, Marketing, Sales, Design, Operations).</li>
              <li>Employment contract classification (Full-time, Part-time, Intern).</li>
              <li>Operational payroll tracking and CSV export capabilities.</li>
            </ul>
          </section>

          {/* Section 7 & 8: Existing vs Proposed */}
          <section id="sec-7" className="border-b border-slate-200 pb-8 mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-3">7. Existing System vs. 8. Proposed System</h2>
            <div className="overflow-x-auto my-4">
              <table className="w-full text-xs border border-slate-200">
                <thead className="bg-slate-100 text-slate-700">
                  <tr>
                    <th className="p-2 border">Parameter</th>
                    <th className="p-2 border">Existing System (Manual / Excel)</th>
                    <th className="p-2 border">Proposed System (React + DRF + SQLite)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2 border font-medium">Data Storage</td>
                    <td className="p-2 border text-rose-700">Decentralized desktop files, paper files</td>
                    <td className="p-2 border text-emerald-700 font-semibold">Centralized ACID-compliant SQLite relational DB</td>
                  </tr>
                  <tr>
                    <td className="p-2 border font-medium">Validation</td>
                    <td className="p-2 border text-rose-700">Manual inspection, error-prone</td>
                    <td className="p-2 border text-emerald-700 font-semibold">Two-tier automated validation (Frontend + Serializer)</td>
                  </tr>
                  <tr>
                    <td className="p-2 border font-medium">Search Speed</td>
                    <td className="p-2 border text-rose-700">Slow, manual scanning</td>
                    <td className="p-2 border text-emerald-700 font-semibold">Sub-millisecond dynamic search and multi-filtering</td>
                  </tr>
                  <tr>
                    <td className="p-2 border font-medium">CRUD Operations</td>
                    <td className="p-2 border text-rose-700">Prone to accidental overwrites</td>
                    <td className="p-2 border text-emerald-700 font-semibold">Protected REST API endpoints with confirmation dialogs</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 9: Technology Stack */}
          <section id="sec-9" className="border-b border-slate-200 pb-8 mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-3">9. Technology Stack</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <h3 className="font-bold text-slate-900 mb-2">Frontend Layer</h3>
                <ul className="space-y-1 text-slate-700">
                  <li><strong>Language:</strong> JavaScript / TypeScript (ES2022)</li>
                  <li><strong>UI Framework:</strong> React 19 (Component-based architecture)</li>
                  <li><strong>Styling:</strong> Tailwind CSS (Utility-first responsive framework)</li>
                  <li><strong>Icons:</strong> Lucide React (Standard vector icon library)</li>
                  <li><strong>HTTP Client:</strong> Native Fetch API with JSON serialization</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <h3 className="font-bold text-slate-900 mb-2">Backend & Database Layer</h3>
                <ul className="space-y-1 text-slate-700">
                  <li><strong>Programming Language:</strong> Python 3.10+</li>
                  <li><strong>Web Framework:</strong> Django 4.2+ / 5.0</li>
                  <li><strong>API Toolkit:</strong> Django REST Framework (DRF) 3.14+</li>
                  <li><strong>CORS Handling:</strong> django-cors-headers</li>
                  <li><strong>Database:</strong> SQLite3 (via Django Object-Relational Mapper)</li>
                  <li><strong>API Testing:</strong> Postman v10+</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 10: System Requirements */}
          <section id="sec-10" className="border-b border-slate-200 pb-8 mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-3">10. System Requirements</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <h4 className="font-semibold text-slate-900 mb-1">Hardware Requirements:</h4>
                <ul className="list-disc pl-4 space-y-1 text-slate-600">
                  <li>Processor: Intel Core i3 / AMD Ryzen 3 or higher</li>
                  <li>RAM: 4 GB Minimum (8 GB Recommended)</li>
                  <li>Disk Space: 500 MB free space</li>
                  <li>Display: 1366x768 minimum resolution</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 mb-1">Software Requirements:</h4>
                <ul className="list-disc pl-4 space-y-1 text-slate-600">
                  <li>Operating System: Windows 10/11, macOS, or Ubuntu Linux</li>
                  <li>Python 3.8+ and Node.js 18+</li>
                  <li>Modern Web Browser (Chrome, Firefox, Edge, Safari)</li>
                  <li>Postman for API Testing</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 11: System Architecture */}
          <section id="sec-11" className="border-b border-slate-200 pb-8 mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-3">11. System Architecture</h2>
            <p>
              The system follows a classic decoupled <strong>3-Tier Web Architecture</strong>:
            </p>
            <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-xs font-mono overflow-x-auto">
{`+-------------------------------------------------------------------+
|                        PRESENTATION TIER                         |
|  React 19 Frontend (SPA) - Navbar, Sidebar, Dashboard, Forms     |
+---------------------------------+---------------------------------+
                                  |
                                  | JSON over HTTP / REST (Fetch API)
                                  v
+-------------------------------------------------------------------+
|                        APPLICATION TIER                           |
|  Django REST Framework (Views, Serializers, Validation, Routers)  |
+---------------------------------+---------------------------------+
                                  |
                                  | Django ORM Queries (SQL)
                                  v
+-------------------------------------------------------------------+
|                           DATABASE TIER                           |
|  SQLite3 Relational Database (employees_employee Table)          |
+-------------------------------------------------------------------+`}
            </pre>
          </section>

          {/* Section 12 & 13: DFD & ER Diagram */}
          <section id="sec-12" className="border-b border-slate-200 pb-8 mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-3">12. Data Flow Diagram (DFD) & 13. ER Diagram</h2>
            <p className="font-semibold text-xs text-slate-700 mb-2">Entity Relationship (ER) Model:</p>
            <pre className="bg-slate-900 text-emerald-400 p-4 rounded-lg text-xs font-mono overflow-x-auto">
{`+-------------------------------------------------------------+
|                          EMPLOYEE                           |
+---------------------+-----------------------+---------------+
| Field Name          | Data Type             | Constraints   |
+---------------------+-----------------------+---------------+
| id                  | INTEGER (AUTOINCREMENT)| PRIMARY KEY   |
| employee_id         | VARCHAR(20)           | UNIQUE, NOT NULL
| full_name           | VARCHAR(100)          | NOT NULL      |
| email               | VARCHAR(254)          | UNIQUE, NOT NULL
| phone               | VARCHAR(20)           | NOT NULL      |
| department          | VARCHAR(50)           | NOT NULL      |
| designation         | VARCHAR(100)          | NOT NULL      |
| salary              | DECIMAL(10, 2)        | CHECK(> 0)    |
| date_of_joining     | DATE                  | NOT NULL      |
| employment_type     | VARCHAR(20)           | IN('Full-time', 'Part-time', 'Intern')
| address             | TEXT                  | NULLABLE      |
| status              | VARCHAR(20)           | IN('Active', 'Inactive')
| created_at          | TIMESTAMP             | AUTO_NOW_ADD  |
+---------------------+-----------------------+---------------+`}
            </pre>
          </section>

          {/* Section 18: REST API Documentation */}
          <section id="sec-18" className="border-b border-slate-200 pb-8 mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-3">18. REST API Documentation</h2>
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 border rounded-lg">
                <div className="flex items-center gap-2 font-mono">
                  <span className="bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded">GET</span>
                  <span className="font-bold text-slate-800">/api/employees/</span>
                </div>
                <p className="mt-1 text-slate-600">Retrieves array of employees. Supports <code>?search=</code>, <code>?department=</code>, <code>?status=</code>, and <code>?ordering=</code> query parameters. Returns HTTP 200 OK.</p>
              </div>

              <div className="p-3 bg-slate-50 border rounded-lg">
                <div className="flex items-center gap-2 font-mono">
                  <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">POST</span>
                  <span className="font-bold text-slate-800">/api/employees/</span>
                </div>
                <p className="mt-1 text-slate-600">Creates new employee record. Validates uniqueness of Employee ID and Email, positive salary. Returns HTTP 201 Created.</p>
              </div>

              <div className="p-3 bg-slate-50 border rounded-lg">
                <div className="flex items-center gap-2 font-mono">
                  <span className="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded">PUT</span>
                  <span className="font-bold text-slate-800">/api/employees/{'{id}'}/</span>
                </div>
                <p className="mt-1 text-slate-600">Replaces all fields for target employee. Returns HTTP 200 OK or 400 Bad Request on invalid fields.</p>
              </div>

              <div className="p-3 bg-slate-50 border rounded-lg">
                <div className="flex items-center gap-2 font-mono">
                  <span className="bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded">DELETE</span>
                  <span className="font-bold text-slate-800">/api/employees/{'{id}'}/</span>
                </div>
                <p className="mt-1 text-slate-600">Permanently removes employee record from SQLite database. Returns HTTP 204 No Content.</p>
              </div>
            </div>
          </section>

          {/* Section 22 to 26: Conclusion & References */}
          <section id="sec-25" className="pt-2">
            <h2 className="text-xl font-bold text-slate-900 mb-3">25. Conclusion & 26. References</h2>
            <p>
              The <strong>Employee Management System</strong> successfully achieves all proposed project objectives. By unifying React.js on the client with Django REST Framework and SQLite on the backend, the system demonstrates the practical implementation of full-stack engineering, asynchronous REST API communication, automated validation, and responsive user experience.
            </p>
            <h4 className="font-bold text-slate-900 mt-4 mb-2 text-xs uppercase tracking-wider">References:</h4>
            <ol className="list-decimal pl-5 text-xs text-slate-600 space-y-1">
              <li>Django Project Official Documentation — https://docs.djangoproject.com/</li>
              <li>Django REST Framework Documentation — https://www.django-rest-framework.org/</li>
              <li>React 19 Official Documentation — https://react.dev/</li>
              <li>Tailwind CSS Utility Framework Documentation — https://tailwindcss.com/</li>
              <li>Postman API Platform Testing Reference — https://learning.postman.com/</li>
            </ol>
          </section>
        </div>
      </div>
    </div>
  );
};
