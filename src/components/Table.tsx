import { useState } from "react";
import { Box, Paper, Button, Select, useTheme, MenuItem } from "@mui/material";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import type { ColumnDef } from "@tanstack/react-table";
import type { SortingState } from "@tanstack/react-table";

export interface TableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  pageSizeOptions?: number[];
  initialPageSize?: number;
  onRowClick?: (row: TData) => void;
}

export function Table<TData extends object>({
  data,
  columns,
  pageSizeOptions = [5, 10, 25, 50],
  initialPageSize = 10,
  onRowClick,
}: TableProps<TData>) {
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(initialPageSize);
  const [sorting, setSorting] = useState<SortingState>([]);
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const table = useReactTable({
    data,
    columns,
    state: { pagination: { pageIndex, pageSize }, sorting },
    onPaginationChange: (updater) => {
      const newState =
        typeof updater === "function"
          ? updater({ pageIndex, pageSize })
          : updater;
      setPageIndex(newState.pageIndex);
      setPageSize(newState.pageSize);
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const pageCount = table.getPageCount();
  const currentPage = table.getState().pagination.pageIndex;

  const renderPageButtons = () =>
    Array.from({ length: pageCount }, (_, i) => (
      <Button
        key={i}
        variant={i === currentPage ? "contained" : "outlined"}
        color={i === currentPage ? "primary" : "inherit"}
        size="small"
        onClick={() => table.setPageIndex(i)}
        sx={{ minWidth: 32, mx: 0.5 }}>
        {i + 1}
      </Button>
    ));

  return (
    <Paper>
      <Box component="table" sx={{ width: "100%", borderCollapse: "collapse" }}>
        <Box component="thead">
          {table.getHeaderGroups().map((headerGroup) => (
            <Box
              component="tr"
              key={headerGroup.id}
              sx={{ borderBottom: "1px solid #ccc" }}>
              {headerGroup.headers.map((header) => {
                const canSort = header.column.getCanSort();
                return (
                  <Box
                    component="th"
                    key={header.id}
                    sx={{
                      padding: "14px 10px",
                      textAlign: "left",
                      cursor: canSort ? "pointer" : "default",
                      position: "relative",
                      "&:hover .sort-arrow": {
                        opacity: canSort ? 1 : 0,
                      },
                    }}
                    onClick={
                      canSort
                        ? header.column.getToggleSortingHandler()
                        : undefined
                    }>
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      <Box
                        component="span"
                        className="sort-arrow"
                        sx={{
                          fontSize: "0.7em",
                          opacity: header.column.getIsSorted() ? 1 : 0,
                          transition: "opacity 0.2s",
                        }}>
                        {{
                          asc: " ▲",
                          desc: " ▼",
                        }[header.column.getIsSorted() as string] ?? " ⇵"}
                      </Box>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          ))}
        </Box>

        <Box component="tbody">
          {table.getRowModel().rows.map((row) => (
            <Box
              component="tr"
              key={row.id}
              sx={{
                cursor: onRowClick ? "pointer" : "default",
                "&:hover": onRowClick
                  ? { backgroundColor: isDark ? "#595959ff" : "#f0eeeeff" }
                  : {},
              }}
              onClick={() => onRowClick?.(row.original)}>
              {row.getVisibleCells().map((cell) => (
                <Box
                  component="td"
                  key={cell.id}
                  sx={{ padding: "14px 10px", borderBottom: "1px solid #eee" }}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Box>
              ))}
            </Box>
          ))}
        </Box>
      </Box>

      {/* Pagination */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          p: 1,
          flexWrap: "wrap",
        }}>
        <Button
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
          size="small">
          {"<"}
        </Button>

        {renderPageButtons()}

        <Button
          onClick={() => table.setPageIndex(pageCount - 1)}
          disabled={!table.getCanNextPage()}
          size="small">
          {">"}
        </Button>

        <Box sx={{ ml: 2 }}>
          <Select
            size="small"
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}>
            {pageSizeOptions.map((size) => (
              <MenuItem key={size} value={size}>
                Show {size}
              </MenuItem>
            ))}
          </Select>
        </Box>
      </Box>
    </Paper>
  );
}
