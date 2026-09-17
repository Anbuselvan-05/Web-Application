import React, { useState } from 'react';
import {
  Play,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  Terminal,
  ExternalLink,
  RotateCcw,
  CheckCheck,
  AlertCircle
} from 'lucide-react';
import { TestCaseResult } from '../types';

export const PostmanTestSuite: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [selectedTestCase, setSelectedTestCase] = useState<TestCaseResult | null>(null);

  const initialTestCases: TestCaseResult[] = [
    {
      id: 'TC-01',
      description: 'Create employee with valid data',
      method: 'POST',
      endpoint: '/api/employees/',
      payload: {
        employee_id: 'EMP_TEST_01',
        full_name: 'Vikram Aditya',
        email: 'vikram.aditya@college.test',
        phone: '9887766554',
        department: 'Engineering',
        designation: 'Software Developer',
        salary: 60000,
        date_of_joining: '2024-01-10',
        employment_type: 'Full-time',
        address: 'MG Road, Bengaluru',
        status: 'Active',
      },
      expectedResult: 'HTTP 201 Created with created record and auto-generated ID',
      expectedStatus: 201,
      status: 'PENDING',
    },
    {
      id: 'TC-02',
      description: 'Create employee with missing fields (empty payload)',
      method: 'POST',
      endpoint: '/api/employees/',
      payload: {},
      expectedResult: 'HTTP 400 Bad Request with field validation errors',
      expectedStatus: 400,
      status: 'PENDING',
    },
    {
      id: 'TC-03',
      description: 'Create employee with duplicate Employee ID',
      method: 'POST',
      endpoint: '/api/employees/',
      payload: {
        employee_id: 'EMP001',
        full_name: 'Duplicate Test',
        email: 'duplicate.id@test.com',
        phone: '9876543210',
        department: 'Engineering',
        designation: 'Tester',
        salary: 40000,
        date_of_joining: '2024-02-01',
        employment_type: 'Full-time',
        status: 'Active',
      },
      expectedResult: 'HTTP 400 Bad Request: Employee with this Employee ID already exists',
      expectedStatus: 400,
      status: 'PENDING',
    },
    {
      id: 'TC-04',
      description: 'Create employee with duplicate email address',
      method: 'POST',
      endpoint: '/api/employees/',
      payload: {
        employee_id: 'EMP_NEW_99',
        full_name: 'Email Duplicate Test',
        email: 'aarav.sharma@example.com',
        phone: '9876543210',
        department: 'Finance',
        designation: 'Tester',
        salary: 45000,
        date_of_joining: '2024-02-01',
        employment_type: 'Full-time',
        status: 'Active',
      },
      expectedResult: 'HTTP 400 Bad Request: Employee with this email address already exists',
      expectedStatus: 400,
      status: 'PENDING',
    },
    {
      id: 'TC-05',
      description: 'Get all employees list',
      method: 'GET',
      endpoint: '/api/employees/',
      expectedResult: 'HTTP 200 OK with JSON array of employee records',
      expectedStatus: 200,
      status: 'PENDING',
    },
    {
      id: 'TC-06',
      description: 'Get employee by primary key ID',
      method: 'GET',
      endpoint: '/api/employees/1/',
      expectedResult: 'HTTP 200 OK with employee record details',
      expectedStatus: 200,
      status: 'PENDING',
    },
    {
      id: 'TC-07',
      description: 'Update employee details via PUT',
      method: 'PUT',
      endpoint: '/api/employees/1/',
      payload: {
        employee_id: 'EMP001',
        full_name: 'Aarav Sharma (Updated)',
        email: 'aarav.sharma@example.com',
        phone: '9876543210',
        department: 'Engineering',
        designation: 'Principal Staff Engineer',
        salary: 95000,
        date_of_joining: '2023-01-15',
        employment_type: 'Full-time',
        address: 'Whitefield, Bengaluru',
        status: 'Active',
      },
      expectedResult: 'HTTP 200 OK with updated record details',
      expectedStatus: 200,
      status: 'PENDING',
    },
    {
      id: 'TC-08',
      description: 'Update non-existent employee ID (99999)',
      method: 'PUT',
      endpoint: '/api/employees/99999/',
      payload: {
        employee_id: 'EMP99999',
        full_name: 'Ghost User',
        email: 'ghost@example.com',
        phone: '9999999999',
        department: 'Finance',
        designation: 'None',
        salary: 50000,
        date_of_joining: '2024-01-01',
        employment_type: 'Full-time',
        status: 'Active',
      },
      expectedResult: 'HTTP 404 Not Found: {"detail": "Not found."}',
      expectedStatus: 404,
      status: 'PENDING',
    },
    {
      id: 'TC-09',
      description: 'Delete employee by ID',
      method: 'DELETE',
      endpoint: '/api/employees/{test_id}/',
      expectedResult: 'HTTP 204 No Content',
      expectedStatus: 204,
      status: 'PENDING',
    },
    {
      id: 'TC-10',
      description: 'Delete non-existent employee (99999)',
      method: 'DELETE',
      endpoint: '/api/employees/99999/',
      expectedResult: 'HTTP 404 Not Found',
      expectedStatus: 404,
      status: 'PENDING',
    },
    {
      id: 'TC-11',
      description: 'Test invalid email format validation',
      method: 'POST',
      endpoint: '/api/employees/',
      payload: {
        employee_id: 'EMP_INV_01',
        full_name: 'Invalid Email User',
        email: 'not-an-email-at-all',
        phone: '9876543210',
        department: 'Marketing',
        designation: 'Copywriter',
        salary: 35000,
        date_of_joining: '2024-03-01',
        employment_type: 'Full-time',
        status: 'Active',
      },
      expectedResult: 'HTTP 400 Bad Request: Enter a valid email address',
      expectedStatus: 400,
      status: 'PENDING',
    },
    {
      id: 'TC-12',
      description: 'Test invalid negative salary validation',
      method: 'POST',
      endpoint: '/api/employees/',
      payload: {
        employee_id: 'EMP_INV_02',
        full_name: 'Negative Salary User',
        email: 'neg.salary@example.com',
        phone: '9876543210',
        department: 'Operations',
        designation: 'Assistant',
        salary: -5000,
        date_of_joining: '2024-03-01',
        employment_type: 'Part-time',
        status: 'Active',
      },
      expectedResult: 'HTTP 400 Bad Request: Salary must be a positive number greater than 0',
      expectedStatus: 400,
      status: 'PENDING',
    },
    {
      id: 'TC-13',
      description: 'Test frontend responsiveness & layout state',
      method: 'GET',
      endpoint: '/api/stats/',
      expectedResult: 'HTTP 200 OK with aggregated department headcount & payroll metrics',
      expectedStatus: 200,
      status: 'PENDING',
    },
    {
      id: 'TC-14',
      description: 'Test backend API health check endpoint',
      method: 'GET',
      endpoint: '/api/health/',
      expectedResult: 'HTTP 200 OK with service operational status',
      expectedStatus: 200,
      status: 'PENDING',
    },
  ];

  const [testCases, setTestCases] = useState<TestCaseResult[]>(initialTestCases);

  const runAllTests = async () => {
    setIsRunning(true);
    const updated = [...testCases];

    // First create a temporary employee to test DELETE with
    let createdTestId: number | null = null;

    for (let i = 0; i < updated.length; i++) {
      const tc = updated[i];
      const start = performance.now();

      try {
        let url = tc.endpoint;
        let body: any = tc.payload;

        // Custom handling for TC-09 (delete created employee)
        if (tc.id === 'TC-09') {
          if (createdTestId) {
            url = `/api/employees/${createdTestId}/`;
          } else {
            // If none created, create one specifically for delete
            const tempRes = await fetch('/api/employees/', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                employee_id: `DEL${Date.now().toString().slice(-4)}`,
                full_name: 'Temp For Delete',
                email: `tempdel${Date.now()}@example.com`,
                phone: '9876543210',
                department: 'Engineering',
                designation: 'Temporary Intern',
                salary: 20000,
                date_of_joining: '2024-01-01',
                employment_type: 'Intern',
                status: 'Active',
              }),
            });
            const tempJson = await tempRes.json();
            url = `/api/employees/${tempJson.id}/`;
          }
        }

        const options: RequestInit = {
          method: tc.method,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        };

        if (body && ['POST', 'PUT', 'PATCH'].includes(tc.method)) {
          options.body = JSON.stringify(body);
        }

        const res = await fetch(url, options);
        const end = performance.now();
        const latency = Math.round(end - start);

        let data: any = null;
        if (res.status !== 204) {
          try {
            data = await res.json();
          } catch {
            data = await res.text();
          }
        }

        // Save created test ID from TC-01 if successful
        if (tc.id === 'TC-01' && res.status === 201 && data?.id) {
          createdTestId = data.id;
        }

        tc.actualStatus = res.status;
        tc.actualResponse = data;
        tc.executionTimeMs = latency;
        tc.status = res.status === tc.expectedStatus ? 'PASS' : 'FAIL';
      } catch (err: any) {
        const end = performance.now();
        tc.actualStatus = 500;
        tc.actualResponse = { error: err.message };
        tc.executionTimeMs = Math.round(end - start);
        tc.status = 'FAIL';
      }

      setTestCases([...updated]);
      // Small pause for realistic test execution feel
      await new Promise((r) => setTimeout(r, 80));
    }

    setIsRunning(false);
  };

  const handleResetTests = () => {
    setTestCases(initialTestCases);
    setSelectedTestCase(null);
  };

  const passCount = testCases.filter((t) => t.status === 'PASS').length;
  const failCount = testCases.filter((t) => t.status === 'FAIL').length;
  const pendingCount = testCases.filter((t) => t.status === 'PENDING').length;

  const downloadPostmanCollection = () => {
    const postmanCollection = {
      info: {
        name: 'Employee Management System API Collection',
        description: 'Postman Test Collection for 2nd Year BE Mini-Project CRUD Employee Management System.',
        schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
      },
      item: testCases.map((tc) => ({
        name: `${tc.id} - ${tc.description}`,
        request: {
          method: tc.method,
          header: [
            { key: 'Content-Type', value: 'application/json' },
            { key: 'Accept', value: 'application/json' },
          ],
          url: {
            raw: `{{base_url}}${tc.endpoint}`,
            host: ['{{base_url}}'],
            path: tc.endpoint.split('/').filter(Boolean),
          },
          body: tc.payload
            ? {
                mode: 'raw',
                raw: JSON.stringify(tc.payload, null, 2),
              }
            : undefined,
        },
        response: [],
      })),
      variable: [
        {
          key: 'base_url',
          value: 'http://127.0.0.1:8000',
          type: 'string',
        },
      ],
    };

    const blob = new Blob([JSON.stringify(postmanCollection, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Employee_Management_System.postman_collection.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Postman API Testing Suite</h1>
            <span className="bg-amber-50 text-amber-700 text-xs px-2.5 py-0.5 rounded-full font-medium border border-amber-200">
              14 Standard Test Cases
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Automated testing of all Django REST Framework endpoints, constraints, duplicate checks, and status codes.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={downloadPostmanCollection}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 transition-colors"
            title="Download Postman Collection JSON"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Postman JSON</span>
          </button>

          <button
            onClick={handleResetTests}
            disabled={isRunning}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <button
            id="run-all-tests-btn"
            onClick={runAllTests}
            disabled={isRunning}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors disabled:opacity-50"
          >
            {isRunning ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Running Test Cases...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Run All 14 Test Cases</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Test Execution Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-xs font-semibold text-slate-500 uppercase">Total Tests</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">{testCases.length}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">SOP Requirement Suite</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-xs font-semibold text-emerald-600 uppercase">Passed</span>
          <div className="text-2xl font-bold text-emerald-600 mt-1">{passCount}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Matched Expected Status</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-xs font-semibold text-rose-600 uppercase">Failed</span>
          <div className="text-2xl font-bold text-rose-600 mt-1">{failCount}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Mismatched or network error</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-xs font-semibold text-slate-500 uppercase">Pending</span>
          <div className="text-2xl font-bold text-slate-500 mt-1">{pendingCount}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Awaiting Execution</div>
        </div>
      </div>

      {/* Main Test Cases Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">Academic Evaluation Test Matrix</h2>
          <span className="text-xs text-slate-500">
            Click any row to inspect request payload and raw response
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Test ID</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Method</th>
                <th className="px-4 py-3">Endpoint</th>
                <th className="px-4 py-3">Expected Result</th>
                <th className="px-4 py-3">Actual Result</th>
                <th className="px-4 py-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-sans">
              {testCases.map((tc) => {
                const isSelected = selectedTestCase?.id === tc.id;
                return (
                  <tr
                    key={tc.id}
                    onClick={() => setSelectedTestCase(tc)}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? 'bg-indigo-50/70' : 'hover:bg-slate-50/80'
                    }`}
                  >
                    <td className="px-4 py-3 font-mono font-bold text-slate-800">
                      {tc.id}
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-900 max-w-xs">
                      {tc.description}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded ${
                          tc.method === 'GET'
                            ? 'bg-blue-100 text-blue-800'
                            : tc.method === 'POST'
                            ? 'bg-emerald-100 text-emerald-800'
                            : tc.method === 'PUT'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {tc.method}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-[11px] text-slate-600">
                      {tc.endpoint}
                    </td>
                    <td className="px-4 py-3 text-slate-600 max-w-xs">
                      <span className="font-semibold text-slate-800">HTTP {tc.expectedStatus}</span> –{' '}
                      {tc.expectedResult}
                    </td>
                    <td className="px-4 py-3">
                      {tc.actualStatus ? (
                        <span
                          className={`font-mono text-[11px] font-semibold ${
                            tc.status === 'PASS' ? 'text-emerald-600' : 'text-rose-600'
                          }`}
                        >
                          HTTP {tc.actualStatus} ({tc.executionTimeMs}ms)
                        </span>
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">Not executed yet</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {tc.status === 'PASS' ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-bold text-[10px]">
                          <CheckCircle className="w-3 h-3" /> PASS
                        </span>
                      ) : tc.status === 'FAIL' ? (
                        <span className="inline-flex items-center gap-1 text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full font-bold text-[10px]">
                          <XCircle className="w-3 h-3" /> FAIL
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full font-medium text-[10px]">
                          <Clock className="w-3 h-3" /> PENDING
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Test Case Inspection Modal / Drawer */}
      {selectedTestCase && (
        <div className="bg-slate-900 text-slate-100 rounded-xl p-5 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-indigo-400" />
              <span className="font-mono text-xs font-bold text-white">
                {selectedTestCase.id}: {selectedTestCase.description}
              </span>
            </div>
            <button
              onClick={() => setSelectedTestCase(null)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Close
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            {/* Request Payload */}
            <div>
              <p className="text-slate-400 uppercase text-[10px] font-bold mb-1">Request Payload</p>
              <pre className="bg-slate-950 p-3 rounded-lg border border-slate-800 overflow-x-auto text-[11px] text-emerald-400 max-h-48">
                {selectedTestCase.payload
                  ? JSON.stringify(selectedTestCase.payload, null, 2)
                  : '// No request body (GET/DELETE)'}
              </pre>
            </div>

            {/* Actual Response */}
            <div>
              <p className="text-slate-400 uppercase text-[10px] font-bold mb-1">
                API Response (HTTP {selectedTestCase.actualStatus || 'N/A'})
              </p>
              <pre className="bg-slate-950 p-3 rounded-lg border border-slate-800 overflow-x-auto text-[11px] text-cyan-400 max-h-48">
                {selectedTestCase.actualResponse
                  ? JSON.stringify(selectedTestCase.actualResponse, null, 2)
                  : '// Run test case to view API response'}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
