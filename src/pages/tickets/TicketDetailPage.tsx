import { useParams, useNavigate } from "react-router-dom";
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
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchTicket, updateTicket } from "../../api/ticketsApi";

const TicketDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: ticket,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["ticket", id],
    queryFn: () => fetchTicket(id!),
  });

  const mutation = useMutation({
    mutationFn: (data: Partial<any>) => updateTicket(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ticket", id] });
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
    },
  });

  if (isLoading) return <Typography variant="h6">Loading ticket...</Typography>;

  if (isError || !ticket)
    return (
      <Box>
        <Typography variant="h5">Ticket not found</Typography>
        <Button onClick={() => navigate("/app/tickets")} sx={{ mt: 2 }}>
          Back to Tickets
        </Button>
      </Box>
    );

  const getStatusColor = (status: string) => {
    const colors: Record<string, any> = {
      open: "info",
      "in-progress": "warning",
      resolved: "success",
      closed: "default",
    };
    return colors[status] || "default";
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, any> = {
      low: "default",
      medium: "info",
      high: "warning",
      urgent: "error",
    };
    return colors[priority] || "default";
  };

  return (
    <Box>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/app/tickets")}
        sx={{ mb: 2 }}>
        Back to Tickets
      </Button>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          {ticket.title}
        </Typography>

        <Box sx={{ mb: 3, display: "flex", gap: 1 }}>
          <Chip label={`Ticket #${ticket.id}`} />
          <Chip label={ticket.status} color={getStatusColor(ticket.status)} />
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
                    mutation.mutate({ status: e.target.value as any })
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
                    mutation.mutate({ priority: e.target.value as any })
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
                    mutation.mutate({
                      assignee: e.target.value || null,
                    })
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
  );
};

export default TicketDetailPage;
