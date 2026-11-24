import { useState } from "react";
import { admins } from "../data.js";

// Page 2: login page of the selected company
function Login({ company, onSuccess, onBack }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  function handleLogin() {
    // find admin of THIS company with same email and password
    const admin = admins.find(
      (a) => a.companyId === company.id && a.email === email && a.password === password
    );

    if (admin) {
      onSuccess(company); // login ok
    } else {
      setErrorMessage("Wrong email or password");
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-16 bg-white border rounded-lg p-6">
      <h1 className="text-xl font-bold">{company.name}</h1>
      <p className="text-gray-500 mb-4">Admin Login</p>

      {errorMessage && <p className="text-red-600 mb-2">{errorMessage}</p>}

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border rounded p-2 mb-3"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full border rounded p-2 mb-3"
      />

      <button
        onClick={handleLogin}
        className="w-full bg-blue-600 text-white rounded p-2"
      >
        Login
      </button>

      <button onClick={onBack} className="w-full mt-3 text-sm text-gray-500">
        Back to company list
      </button>
    </div>
  );
}

export default Login;
