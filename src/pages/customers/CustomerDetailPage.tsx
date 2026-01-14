import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Chip,
  Divider,
  CircularProgress,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { fetchCustomer, fetchCustomerTickets } from "../../api/customersApi";
import { Table } from "../../components/Table/Table";
import { customerDetailsColumns } from "../../helpers/tableDataHelper";

const CustomerDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data: customer,
    isLoading: isCustomerLoading,
    isError: isCustomerError,
  } = useQuery({
    queryKey: ["customer", id],
    queryFn: () => {
      if (!id) throw new Error("Invalid customer ID");
      return fetchCustomer(id);
    },
    enabled: Boolean(id),
  });

  const {
    data: tickets = [],
    isLoading: isTicketsLoading,
    isError: isTicketsError,
  } = useQuery({
    queryKey: ["customerTickets", id],
    queryFn: () => {
      if (!id) throw new Error("Invalid customer ID");
      return fetchCustomerTickets(id);
    },
    enabled: Boolean(id),
  });

  if (isCustomerError)
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
        <Typography variant="h5">Customer not found</Typography>
        <Button onClick={() => navigate("/app/customers")} sx={{ mt: 2 }}>
          Back to Customers
        </Button>
      </Grid>
    );

  return (
    <>
      {isCustomerLoading || isTicketsLoading || !customer ? (
        <Grid
          container
          sx={{
            width: "100%",
            height: "84vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}>
          <CircularProgress />
        </Grid>
      ) : (
        <Box>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "start",
                mb: 2,
              }}>
              <Typography variant="h4">{customer.name}</Typography>
              <Chip
                label={customer.status}
                color={customer.status === "active" ? "success" : "default"}
              />
            </Box>

            <Divider sx={{ my: 2 }} />

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body2" color="text.secondary">
                  Email
                </Typography>
                <Typography variant="body1">{customer.email}</Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body2" color="text.secondary">
                  Phone
                </Typography>
                <Typography variant="body1">{customer.phone}</Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body2" color="text.secondary">
                  Company
                </Typography>
                <Typography variant="body1">{customer.company}</Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body2" color="text.secondary">
                  Customer Since
                </Typography>
                <Typography variant="body1">
                  {new Date(customer.createdAt).toLocaleDateString()}
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          <Typography variant="h5" gutterBottom>
            Related Tickets ({tickets.length})
          </Typography>

          {isTicketsError ? (
            <Typography color="error">Failed to load tickets</Typography>
          ) : (
            <Table
              data={tickets}
              columns={customerDetailsColumns}
              initialPageSize={5}
              onRowClick={(row) => navigate(`/app/tickets/${row.id}`)}
            />
          )}
        </Box>
      )}
    </>
  );
};
export default CustomerDetailPage;
