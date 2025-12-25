import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchTickets, updateTicket } from "../api/ticketsApi";

const useTickets = () => {
  return useQuery({
    queryKey: ["tickets"],
    queryFn: fetchTickets,
  });
};

const useUpdateTicket = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      updateTicket(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tickets"] });
    },
  });
};

export { useTickets, useUpdateTicket };
