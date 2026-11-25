import { useState } from "react";
import { apiRequest } from "../api.js";

// Page 2: login page of the selected company
function Login({ company, onSuccess, onBack }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleLogin(event) {
    event.preventDefault();
    setErrorMessage("");
    try {
      const session = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({ company_id: company.id, email, password }),
      });
      onSuccess(session);
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-16 bg-white border rounded-lg p-6">
      <h1 className="text-xl font-bold">{company.name}</h1>
      <p className="text-gray-500 mb-4">Admin Login</p>

      {errorMessage && <p className="text-red-600 mb-2">{errorMessage}</p>}

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded p-2 mb-3"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded p-2 mb-3"
          required
        />

        <button type="submit" className="w-full bg-blue-600 text-white rounded p-2">
          Login
        </button>
      </form>

      <button onClick={onBack} className="w-full mt-3 text-sm text-gray-500">
        Back to company list
      </button>
    </div>
  );
}

export default Login;
