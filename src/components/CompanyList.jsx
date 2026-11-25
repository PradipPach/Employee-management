import { useEffect, useState } from "react";
import { apiRequest } from "../api.js";

// Page 1: shows the available companies
function CompanyList({ onSelect }) {
  const [companies, setCompanies] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    apiRequest("/companies")
      .then(setCompanies)
      .catch((error) => setErrorMessage(error.message));
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold">Employee Management</h1>
      <p className="text-gray-500 mb-4">Select your company</p>

      {errorMessage && <p className="text-red-600 mb-4">{errorMessage}</p>}
      {!errorMessage && companies.length === 0 && (
        <p className="text-gray-500 mb-4">Loading companies...</p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {companies.map((company) => (
          <div
            key={company.id}
            onClick={() => onSelect(company)}
            className="bg-white border rounded-lg p-4 cursor-pointer hover:border-blue-500"
          >
            <h2 className="font-semibold">{company.name}</h2>
            <p className="text-sm text-gray-500">{company.city}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CompanyList;
