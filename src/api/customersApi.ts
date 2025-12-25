import { API_URL } from "./api";

export async function fetchCustomers() {
  const res = await fetch(`${API_URL}/customers`);
  if (!res.ok) throw new Error("Failed to fetch customers");
  return res.json();
}

export async function fetchCustomer(id: string) {
  const res = await fetch(`${API_URL}/customers/${id}`);
  if (!res.ok) throw new Error("Customer not found");
  return res.json();
}

export async function fetchCustomerTickets(id: string) {
  const res = await fetch(`${API_URL}/tickets?customerId=${id}`);
  if (!res.ok) throw new Error("Failed to fetch tickets");
  return res.json();
}
