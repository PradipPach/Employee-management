import { useState } from "react";
import CompanyList from "./components/CompanyList.jsx";
import Login from "./components/Login.jsx";
import Dashboard from "./components/Dashboard.jsx";
import LogoutPage from "./components/LogoutPage.jsx";

// App decides which page to show.
// page can be: "companies", "login", "dashboard", "logout"
function App() {
  const [page, setPage] = useState("companies");
  const [selectedCompany, setSelectedCompany] = useState(null); // company clicked in the list
  const [loggedInCompany, setLoggedInCompany] = useState(null); // company of logged in admin

  // when user clicks a company
  function handleSelectCompany(company) {
    setSelectedCompany(company);
    setPage("login");
  }

  // when login is correct
  function handleLoginSuccess(company) {
    setLoggedInCompany(company);
    setPage("dashboard");
  }

  // when user clicks logout
  function handleLogout() {
    setLoggedInCompany(null);
    setSelectedCompany(null);
    setPage("logout");
  }

  if (page === "companies") {
    return <CompanyList onSelect={handleSelectCompany} />;
  }

  if (page === "login") {
    return (
      <Login
        company={selectedCompany}
        onSuccess={handleLoginSuccess}
        onBack={() => setPage("companies")}
      />
    );
  }

  if (page === "dashboard") {
    return <Dashboard company={loggedInCompany} onLogout={handleLogout} />;
  }

  return <LogoutPage onGoHome={() => setPage("companies")} />;
}

export default App;
