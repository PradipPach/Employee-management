import { useEffect, useState } from "react";
import { apiRequest } from "../api.js";

// Page 3: shows employees and salary of the logged in company only
function Dashboard({ company, accessToken, onLogout }) {
  const [searchText, setSearchText] = useState("");
  const [employees, setEmployees] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    apiRequest("/employees", {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then(setEmployees)
      .catch((error) => setErrorMessage(error.message));
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;
