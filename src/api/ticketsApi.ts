import { API_URL } from "./api";
import type { Ticket } from "../types/types";

export async function fetchTickets() {
  const res = await fetch(`${API_URL}/tickets`);
  if (!res.ok) throw new Error("Failed to fetch tickets");
  return res.json() as Promise<Ticket[]>;
}

export async function fetchTicket(id: string) {
  const res = await fetch(`${API_URL}/tickets/${id}`);
  if (!res.ok) throw new Error("Ticket not found");
  return res.json() as Promise<Ticket>;
}

export async function updateTicket(id: string, data: Partial<Ticket>) {
  const payload = { ...data, updatedAt: new Date().toISOString() };

  const res = await fetch(`${API_URL}/tickets/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Failed to update ticket");
  return res.json() as Promise<Ticket>;
}
