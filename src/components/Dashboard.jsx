import { useEffect, useState } from "react";
import { apiRequest } from "../api.js";

// Page 3: shows employees and salary of the logged in company only
function Dashboard({ company, accessToken, onLogout }) {
  const [searchText, setSearchText] = useState("");
  const [employees, setEmployees] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    role: "",
    basic: "",
    hra: "",
    allowance: "",
    deduction: "",
  });

  function loadEmployees() {
    apiRequest("/employees", {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then(setEmployees)
      .catch((error) => setErrorMessage(error.message));
  }

  useEffect(() => {
    loadEmployees();
  }, [accessToken]);

  // search by name
  const shownEmployees = employees.filter((emp) =>
    emp.name.toLowerCase().includes(searchText.toLowerCase())
  );

  // net salary = basic + hra + allowance - deduction
  function getNetSalary(emp) {
    return emp.basic + emp.hra + emp.allowance - emp.deduction;
  }

  // total salary of all employees
  const totalSalary = employees.reduce(
    (total, employee) => total + getNetSalary(employee),
    0
  );

  function updateForm(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function resetForm() {
    setEditingId(null);
    setForm({
      name: "",
      role: "",
      basic: "",
      hra: "",
      allowance: "",
      deduction: "",
    });
  }

  async function saveEmployee(event) {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const payload = {
      name: form.name.trim(),
      role: form.role.trim(),
      basic: Number(form.basic),
      hra: Number(form.hra),
      allowance: Number(form.allowance),
      deduction: Number(form.deduction),
    };

    try {
      if (editingId) {
        await apiRequest(`/employees/${editingId}`, {
          method: "PUT",
          headers: { Authorization: `Bearer ${accessToken}` },
          body: JSON.stringify(payload),
        });
        setSuccessMessage("Employee updated successfully");
      } else {
        await apiRequest("/employees", {
          method: "POST",
          headers: { Authorization: `Bearer ${accessToken}` },
          body: JSON.stringify(payload),
        });
        setSuccessMessage("Employee added successfully");
      }
      resetForm();
      loadEmployees();
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  function startEdit(employee) {
    setEditingId(employee.id);
    setErrorMessage("");
    setSuccessMessage("");
    setForm({
      name: employee.name,
      role: employee.role,
      basic: String(employee.basic),
      hra: String(employee.hra),
      allowance: String(employee.allowance),
      deduction: String(employee.deduction),
    });
  }

  async function deleteEmployee(employeeId) {
    if (!window.confirm("Delete this employee?")) {
      return;
    }
    setErrorMessage("");
    setSuccessMessage("");
    try {
      await apiRequest(`/employees/${employeeId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setSuccessMessage("Employee deleted successfully");
      if (editingId === employeeId) {
        resetForm();
      }
      loadEmployees();
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{company.name}</h1>
        <button onClick={onLogout} className="border rounded px-4 py-2">
          Logout
        </button>
      </div>

      <p className="mb-1">Total employees: {employees.length}</p>
      <p className="mb-4">Total salary: ₹{totalSalary}</p>
      {errorMessage && <p className="text-red-600 mb-4">{errorMessage}</p>}
      {successMessage && (
        <p className="text-green-600 mb-4">{successMessage}</p>
      )}

      <form onSubmit={saveEmployee} className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <input
          placeholder="Employee name"
          value={form.name}
          onChange={(event) => updateForm("name", event.target.value)}
          className="border rounded p-2"
          required
        />
        <input
          placeholder="Role"
          value={form.role}
          onChange={(event) => updateForm("role", event.target.value)}
          className="border rounded p-2"
          required
        />
        <input
          type="number"
          min="0"
          placeholder="Basic"
          value={form.basic}
          onChange={(event) => updateForm("basic", event.target.value)}
          className="border rounded p-2"
          required
        />
        <input
          type="number"
          min="0"
          placeholder="HRA"
          value={form.hra}
          onChange={(event) => updateForm("hra", event.target.value)}
          className="border rounded p-2"
          required
        />
        <input
          type="number"
          min="0"
          placeholder="Allowance"
          value={form.allowance}
          onChange={(event) => updateForm("allowance", event.target.value)}
          className="border rounded p-2"
          required
        />
        <input
          type="number"
          min="0"
          placeholder="Deduction"
          value={form.deduction}
          onChange={(event) => updateForm("deduction", event.target.value)}
          className="border rounded p-2"
          required
        />
        <button type="submit" className="bg-blue-600 text-white rounded p-2">
          {editingId ? "Update Employee" : "Add Employee"}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={resetForm}
            className="border rounded p-2"
          >
            Cancel Edit
          </button>
        )}
      </form>

      <input
        placeholder="Search employee name"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        className="w-full border rounded p-2 mb-4"
      />

      <div className="overflow-x-auto bg-white border rounded-lg">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="p-2">Name</th>
              <th className="p-2">Role</th>
              <th className="p-2">Basic</th>
              <th className="p-2">HRA</th>
              <th className="p-2">Allowance</th>
              <th className="p-2">Deduction</th>
              <th className="p-2">Net Salary</th>
                <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {shownEmployees.map((emp) => (
              <tr key={emp.id} className="border-b">
                <td className="p-2">{emp.name}</td>
                <td className="p-2">{emp.role}</td>
                <td className="p-2">₹{emp.basic}</td>
                <td className="p-2">₹{emp.hra}</td>
                <td className="p-2">₹{emp.allowance}</td>
                <td className="p-2">₹{emp.deduction}</td>
                <td className="p-2 font-semibold">₹{getNetSalary(emp)}</td>
                <td className="p-2">
                  <button
                    type="button"
                    onClick={() => startEdit(emp)}
                    className="mr-2 text-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteEmployee(emp.id)}
                    className="text-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;
