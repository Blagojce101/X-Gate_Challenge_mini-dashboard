export interface Customer {
  id: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  status: "active" | "inactive";
  createdAt: string;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: "open" | "in-progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  customerId: string;
  customerName: string;
  assignee: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "agent";
  password: string;
}

export type SafeUser = Omit<User, "password">;

export interface LoginResponse {
  token: string;
  user: SafeUser;
}
