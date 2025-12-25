import React from "react";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Typography,
} from "@mui/material";
import type { Customer } from "../../types/types";
import { useNavigate } from "react-router-dom";

interface CustomerCardProps {
  customer: Customer;
}

const CustomerCard: React.FC<CustomerCardProps> = ({ customer }) => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardActionArea onClick={() => navigate(`/app/customer/${customer.id}`)}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "start",
              mb: 1,
            }}>
            <Typography variant="h6" component="div">
              {customer.name}
            </Typography>
            <Chip
              label={customer.status}
              color={customer.status === "active" ? "success" : "default"}
              size="small"
            />
          </Box>

          <Typography variant="body2" color="text.secondary">
            {customer.company}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {customer.email}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {customer.phone}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default CustomerCard;
