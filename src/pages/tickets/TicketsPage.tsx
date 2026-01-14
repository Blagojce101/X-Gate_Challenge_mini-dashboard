import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Skeleton,
} from "@mui/material";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Table } from "../../components/Table/Table";
import { useTickets } from "../../hooks/useTickets";
import { useDebounce } from "../../hooks/useDebounce";
import type { Ticket } from "../../types/types";
import { ticketsColumns } from "../../helpers/tableDataHelper";
import SkeletonTable from "../../components/Table/SkeletonTable";

const TicketsPage = () => {
  const navigate = useNavigate();
  const { data: tickets = [], isLoading, error } = useTickets();
  const [search, setSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const debouncedSearch = useDebounce(search, 400);

  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket: Ticket) => {
      const matchesSearch =
        ticket.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        ticket.description
          .toLowerCase()
          .includes(debouncedSearch.toLowerCase()) ||
        ticket.customerName
          .toLowerCase()
          .includes(debouncedSearch.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || ticket.status === statusFilter;

      const matchesPriority =
        priorityFilter === "all" || ticket.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tickets, debouncedSearch, statusFilter, priorityFilter]);

  if (error) return <Typography>Error loading tickets</Typography>;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Tickets
      </Typography>

      {/* Filters */}
      <Box sx={{ mb: 3, display: "flex", gap: 2, flexWrap: "wrap" }}>
        {isLoading ? (
          <>
            <Skeleton
              variant="rounded"
              height={40}
              sx={{ flexGrow: 1, minWidth: 200 }}
            />
            <Skeleton variant="rounded" width={150} height={40} />
            <Skeleton variant="rounded" width={150} height={40} />
          </>
        ) : (
          <>
            <TextField
              label="Search tickets"
              variant="outlined"
              size="small"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ flexGrow: 1, minWidth: 200 }}
            />

            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Status</InputLabel>
              <Select
                size="small"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}>
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="open">Open</MenuItem>
                <MenuItem value="in-progress">In Progress</MenuItem>
                <MenuItem value="resolved">Resolved</MenuItem>
                <MenuItem value="closed">Closed</MenuItem>
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Priority</InputLabel>
              <Select
                size="small"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}>
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="urgent">Urgent</MenuItem>
              </Select>
            </FormControl>
          </>
        )}
      </Box>

      {isLoading ? (
        <SkeletonTable columnsCount={5} />
      ) : (
        <Table
          data={filteredTickets}
          columns={ticketsColumns}
          initialPageSize={10}
          onRowClick={(ticket) =>
            navigate(`/app/tickets/${ticket.id}`, {
              state: { from: location.pathname + location.search },
            })
          }
        />
      )}
    </Box>
  );
};

export default TicketsPage;
