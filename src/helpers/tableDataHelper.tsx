import type { ColumnDef } from "@tanstack/react-table";
import type { Ticket } from "../types/types";
import { Chip } from "@mui/material";

export const getStatusColor = (status: string) => {
  const colors: Record<string, "info" | "warning" | "success" | "default"> = {
    open: "info",
    "in-progress": "warning",
    resolved: "success",
    closed: "default",
  };
  return colors[status] || "default";
};

export const ticketsColumns: ColumnDef<Ticket>[] = [
  { accessorKey: "id", header: "ID", enableSorting: true },
  { accessorKey: "title", header: "Title", enableSorting: true },
  { accessorKey: "customerName", header: "Customer", enableSorting: true },
  {
    accessorKey: "status",
    header: "Status",
    enableSorting: false,
    cell: ({ getValue }) => {
      const status = getValue<string>();
      return (
        <Chip label={status} color={getStatusColor(status)} size="small" />
      );
    },
  },
  {
    accessorKey: "priority",
    header: "Priority",
    enableSorting: false,
    cell: ({ getValue }) => {
      const priority = getValue<string>();
      const colors: Record<string, "default" | "info" | "warning" | "error"> = {
        low: "default",
        medium: "info",
        high: "warning",
        urgent: "error",
      };
      return (
        <Chip
          label={priority}
          color={colors[priority] || "default"}
          size="small"
        />
      );
    },
  },
  {
    accessorKey: "assignee",
    header: "Assignee",
    enableSorting: true,
    cell: ({ getValue }) => getValue() || "Unassigned",
  },
];

export const customerDetailsColumns: ColumnDef<Ticket>[] = [
  { accessorKey: "id", header: "ID", enableSorting: true },
  { accessorKey: "title", header: "Title", enableSorting: true },
  {
    accessorKey: "status",
    header: "Status",
    enableSorting: false,
    cell: ({ getValue }) => {
      const status = getValue<string>();
      return (
        <Chip label={status} color={getStatusColor(status)} size="small" />
      );
    },
  },
  {
    accessorKey: "priority",
    header: "Priority",
    enableSorting: false,
    cell: ({ getValue }) => {
      const priority = getValue<string>();
      const colors: Record<string, "default" | "info" | "warning" | "error"> = {
        low: "default",
        medium: "info",
        high: "warning",
        urgent: "error",
      };
      return (
        <Chip
          label={priority}
          color={colors[priority] || "default"}
          size="small"
        />
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    enableSorting: true,
    cell: ({ getValue }) => new Date(getValue() as string).toLocaleDateString(),
  },
];
