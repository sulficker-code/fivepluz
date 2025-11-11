// const API_URL = "http://localhost:5000/api/customers"; 
const API_URL = process.env.REACT_APP_API_URL


// Fetch customers with pagination + search
export const getCustomers = async (page = 1, search = "") => {
  const res = await fetch(`${API_URL}/api/customers?page=${page}&search=${search}`);
  if (!res.ok) throw new Error("Failed to fetch customers");
  return res.json(); // returns { data, pagination }
};


// Create new customer
export const createCustomer = async (data) => {
  const res = await fetch(`${API_URL}/api/customers`,{
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create customer");
  return res.json();
};

// Get invoices for one customer
export const getCustomerInvoices = async (id) => {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) throw new Error("Failed to fetch invoices");
  return res.json();
};


// Delete a customer
export const deleteCustomer = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete customer");
  return res.json();
};

// Update a customer
export async function updateCustomer(id, payload) {
  const res = await fetch(`${API_URL}/api/customers/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to update customer");
  return res.json();
}

