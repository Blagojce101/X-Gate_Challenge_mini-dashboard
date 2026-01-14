import { useState } from "react";
import { Box, Grid, Typography, TextField } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { fetchCustomers } from "../../api/customersApi";
import type { Customer } from "../../types/types";
import CustomerCard from "./CustomerCard";
import { useDebounce } from "../../hooks/useDebounce";
import SkeletonCustomerCard from "./SkeletonCustomerCard";

const CustomersPage = () => {
  const [search, setSearch] = useState<string>("");
  const debouncedSearch = useDebounce(search, 400);

  const {
    data: customers = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["customers"],
    queryFn: fetchCustomers,
  });

  if (isError)
    return (
      <Typography variant="h6" color="error">
        Failed to load customers
      </Typography>
    );

  const filteredCustomers = customers.filter((customer: Customer) => {
    const normalizedSearch = debouncedSearch.toLowerCase();
    return (
      customer.name.toLowerCase().includes(normalizedSearch) ||
      customer.email.toLowerCase().includes(normalizedSearch) ||
      customer.company.toLowerCase().includes(normalizedSearch)
    );
  });

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Customers
      </Typography>

      <TextField
        label="Search customers"
        variant="outlined"
        size="small"
        fullWidth
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 3 }}
      />

      <Grid container spacing={3}>
        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
                <SkeletonCustomerCard />
              </Grid>
            ))
          : filteredCustomers.map((customer: Customer) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={customer.id}>
                <CustomerCard customer={customer} />
              </Grid>
            ))}
      </Grid>
    </Box>
  );
};

export default CustomersPage;
