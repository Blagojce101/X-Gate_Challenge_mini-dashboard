import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Divider,
  InputAdornment,
  CircularProgress,
} from "@mui/material";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchTicket, updateTicket } from "../../api/ticketsApi";
import type { Ticket } from "../../types/types";
import { useState } from "react";

const TicketDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [savingField, setSavingField] = useState<string | null>(null);

  const navigateBack = location.state?.from ?? "/app/tickets";

  const {
    data: ticket,
    isLoading,
    isError,
  } = useQuery<Ticket>({
    queryKey: ["ticket", id],
    queryFn: () => fetchTicket(id!),
  });

  const mutation = useMutation({
    mutationFn: (data: Partial<Ticket>) => updateTicket(id!, data),
    onMutate: async (newData) => {
      if (!ticket) return { previousTicket: null };

      await queryClient.cancelQueries({ queryKey: ["ticket", id] });

      const previousTicket = queryClient.getQueryData<Ticket>(["ticket", id]);

      queryClient.setQueryData<Ticket>(["ticket", id], {
        ...ticket,
        ...newData,
      });

      return { previousTicket };
    },
    onError: (_err, _newData, context) => {
      if (context?.previousTicket) {
        queryClient.setQueryData(["ticket", id], context.previousTicket);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["ticket", id] });
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      setSavingField(null);
    },
  });

  const updateTicketField = (field: Partial<Ticket>, fieldName: string) => {
    setSavingField(fieldName);
    mutation.mutate({ ...field, updatedAt: new Date().toISOString() });
  };

  if (isError)
    return (
      <Grid
        container
        sx={{
          width: "100%",
          height: "84vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}>
        <Typography variant="h5">Ticket not found</Typography>
        <Button onClick={() => navigate(navigateBack)} sx={{ mt: 2 }}>
          Back to Tickets
        </Button>
      </Grid>
    );

  const getStatusColor = (status: string) => {
    const colors: Record<string, "info" | "warning" | "success" | "default"> = {
      open: "info",
      "in-progress": "warning",
      resolved: "success",
      closed: "default",
    };
    return colors[status] || "default";
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, "default" | "info" | "warning" | "error"> = {
      low: "default",
      medium: "info",
      high: "warning",
      urgent: "error",
    };
    return colors[priority] || "default";
  };

  return (
    <>
      {isLoading || !ticket ? (
        <Grid
          container
          sx={{
            width: "100%",
            height: "83vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}>
          <CircularProgress />
        </Grid>
      ) : (
        <Box>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
              {ticket.title}
            </Typography>

            <Box sx={{ mb: 3, display: "flex", gap: 1 }}>
              <Chip label={`Ticket #${ticket.id}`} />
              <Chip
                label={ticket.status}
                color={getStatusColor(ticket.status)}
              />
              <Chip
                label={ticket.priority}
                color={getPriorityColor(ticket.priority)}
              />
            </Box>

            <Divider sx={{ my: 3 }} />

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 8 }}>
                <Typography variant="h6" gutterBottom>
                  Description
                </Typography>
                <Typography variant="body1" paragraph>
                  {ticket.description}
                </Typography>

                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                  Customer Information
                </Typography>
                <Typography variant="body2">
                  <strong>Name:</strong> {ticket.customerName}
                </Typography>
                <Typography variant="body2">
                  <strong>Customer ID:</strong> {ticket.customerId}
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <Paper elevation={2} sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Ticket Details
                  </Typography>

                  {/* STATUS */}
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={ticket.status}
                      label="Status"
                      size="small"
                      onChange={(e) =>
                        updateTicketField({ status: e.target.value }, "status")
                      }
                      endAdornment={
                        savingField === "status" ? (
                          <InputAdornment position="end" sx={{ mr: 3 }}>
                            <CircularProgress size={16} thickness={4} />
                          </InputAdornment>
                        ) : null
                      }>
                      <MenuItem value="open">Open</MenuItem>
                      <MenuItem value="in-progress">In Progress</MenuItem>
                      <MenuItem value="resolved">Resolved</MenuItem>
                      <MenuItem value="closed">Closed</MenuItem>
                    </Select>
                  </FormControl>

                  {/* PRIORITY */}
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Priority</InputLabel>
                    <Select
                      value={ticket.priority}
                      label="Priority"
                      size="small"
                      onChange={(e) =>
                        updateTicketField(
                          { priority: e.target.value },
                          "priority"
                        )
                      }
                      endAdornment={
                        savingField === "priority" ? (
                          <InputAdornment position="end" sx={{ mr: 3 }}>
                            <CircularProgress size={16} thickness={4} />
                          </InputAdornment>
                        ) : null
                      }>
                      <MenuItem value="low">Low</MenuItem>
                      <MenuItem value="medium">Medium</MenuItem>
                      <MenuItem value="high">High</MenuItem>
                      <MenuItem value="urgent">Urgent</MenuItem>
                    </Select>
                  </FormControl>

                  {/* ASSIGNEE */}
                  <FormControl fullWidth>
                    <InputLabel>Assignee</InputLabel>
                    <Select
                      value={ticket.assignee || ""}
                      label="Assignee"
                      size="small"
                      onChange={(e) =>
                        updateTicketField(
                          { assignee: e.target.value || null },
                          "assignee"
                        )
                      }
                      endAdornment={
                        savingField === "assignee" ? (
                          <InputAdornment position="end" sx={{ mr: 3 }}>
                            <CircularProgress size={16} thickness={4} />
                          </InputAdornment>
                        ) : null
                      }>
                      <MenuItem value="">Unassigned</MenuItem>
                      <MenuItem value="Admin User">Admin User</MenuItem>
                      <MenuItem value="Support Agent">Support Agent</MenuItem>
                    </Select>
                  </FormControl>

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="caption" display="block">
                    Created: {new Date(ticket.createdAt).toLocaleString()}
                  </Typography>
                  <Typography variant="caption" display="block">
                    Updated: {new Date(ticket.updatedAt).toLocaleString()}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      )}
    </>
  );
};

export default TicketDetailPage;
