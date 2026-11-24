// STEP 1: List of 10 companies
export const companies = [
  { id: 1, name: "Tata Consultancy Services", city: "Mumbai" },
  { id: 2, name: "Infosys", city: "Bengaluru" },
  { id: 3, name: "Wipro", city: "Bengaluru" },
  { id: 4, name: "Accenture India", city: "Pune" },
  { id: 5, name: "Google India", city: "Hyderabad" },
  { id: 6, name: "Microsoft India", city: "Hyderabad" },
  { id: 7, name: "Amazon India", city: "Bengaluru" },
  { id: 8, name: "IBM India", city: "Pune" },
  { id: 9, name: "Cognizant", city: "Chennai" },
  { id: 10, name: "Capgemini India", city: "Mumbai" },
  { id: 11, name: "Shekru Lab", city: "Maharashtra" },
];

// STEP 2: One admin for each company (companyId tells which company he belongs to)
export const admins = [
  { companyId: 1, email: "admin@tcs.com", password: "1234" },
  { companyId: 2, email: "admin@infosys.com", password: "1234" },
  { companyId: 3, email: "admin@wipro.com", password: "1234" },
  { companyId: 4, email: "admin@accenture.com", password: "1234" },
  { companyId: 5, email: "admin@google.com", password: "1234" },
  { companyId: 6, email: "admin@microsoft.com", password: "1234" },
  { companyId: 7, email: "admin@amazon.com", password: "1234" },
  { companyId: 8, email: "admin@ibm.com", password: "1234" },
  { companyId: 9, email: "admin@cognizant.com", password: "1234" },
  { companyId: 10, email: "admin@capgemini.com", password: "1234" },
  { companyId: 11, email: "admin@shekrulab.com", password: "1234" },
];

// STEP 3: Employees (every employee has companyId)
// First we make a small list of names, then we copy it for every company
const names = ["Amit Patil", "Sneha Joshi", "Rahul More", "Priya Deshmukh", "Kiran Dhangar"];
const roles = ["Manager", "Accountant", "Developer", "HR", "Sales Officer"];
const basics = [60000, 40000, 50000, 35000, 30000];

export const employees = [];

for (let c = 0; c < companies.length; c++) {
  for (let i = 0; i < names.length; i++) {
    employees.push({
      id: employees.length + 1,
      companyId: companies[c].id,
      name: names[i],
      role: roles[i],
      basic: basics[i] + c * 1000,
      hra: basics[i] * 0.2,
      allowance: 3000,
      deduction: 2000,
    });
  }
}
