import type { User, LoginResponse } from "../types/types";
import { API_URL } from "./api";

export async function loginUser(
  email: string,
  password: string
): Promise<LoginResponse> {
  const res = await fetch(`${API_URL}/users`);
  if (!res.ok) throw new Error("Failed to fetch users");

  const users: User[] = await res.json();

  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) throw new Error("Invalid email or password");

  const { password: _, ...safeUser } = user;

  return {
    user: safeUser,
    token: `mock-token-${user.id}-${Date.now()}`,
  };
}
