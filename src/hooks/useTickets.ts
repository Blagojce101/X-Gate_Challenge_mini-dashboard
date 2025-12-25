import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchTickets, updateTicket } from "../api/ticketsApi";
import type { Ticket } from "../types/types";

const useTickets = () => {
  return useQuery<Ticket[], Error>({
    queryKey: ["tickets"],
    queryFn: fetchTickets,
  });
};

const useUpdateTicket = () => {
  const qc = useQueryClient();

  return useMutation<Ticket, Error, { id: string; data: Partial<Ticket> }>({
    mutationFn: ({ id, data }) => updateTicket(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tickets"] });
    },
  });
};

export { useTickets, useUpdateTicket };
