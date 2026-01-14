import { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Button,
  Select,
  MenuItem,
  useTheme,
  Typography,
} from "@mui/material";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import type { ColumnDef, SortingState } from "@tanstack/react-table";

export interface TableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  pageSizeOptions?: number[];
  initialPageSize?: number;
  onRowClick?: (row: TData) => void;
  searchValue?: string;
}

export function Table<TData extends object>({
  data,
  columns,
  pageSizeOptions = [5, 10, 25, 50],
  initialPageSize = 10,
  onRowClick,
  searchValue = "",
}: TableProps<TData>) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );
  const initialPage = Math.max(Number(searchParams.get("page") || 1) - 1, 0);
  const initialPageSizeFromUrl = Number(
    searchParams.get("pageSize") || initialPageSize
  );
  const initialSortParam = searchParams.get("sort") || "";
  const [pageIndex, setPageIndex] = useState<number>(initialPage);
  const [pageSize, setPageSize] = useState<number>(initialPageSizeFromUrl);
  const [sorting, setSorting] = useState<SortingState>(
    initialSortParam
      ? initialSortParam.split(",").map((s) => {
          const [id, dir] = s.split(":");
          return { id, desc: dir === "desc" };
        })
      : []
  );

  const filteredData = useMemo(() => {
    if (!searchValue) return data;
    const lowerSearch = searchValue.toLowerCase();
    return data.filter((row) =>
      Object.values(row).some((val) =>
        String(val).toLowerCase().includes(lowerSearch)
      )
    );
  }, [data, searchValue]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { pagination: { pageIndex, pageSize }, sorting },
    onPaginationChange: (updater) => {
      const newState =
        typeof updater === "function"
          ? updater({ pageIndex, pageSize })
          : updater;
      setPageIndex(newState.pageIndex);
      setPageSize(newState.pageSize);

      const sortParam = sorting
        .map((s) => `${s.id}:${s.desc ? "desc" : "asc"}`)
        .join(",");

      navigate(
        `?page=${newState.pageIndex + 1}&pageSize=${newState.pageSize}${
          sortParam ? `&sort=${sortParam}` : ""
        }`,
        { replace: true }
      );
    },
    onSortingChange: (updater) => {
      const newSorting: SortingState =
        typeof updater === "function" ? updater(sorting) : updater;
      setSorting(newSorting);

      const sortParam = newSorting
        .map((s) => `${s.id}:${s.desc ? "desc" : "asc"}`)
        .join(",");

      navigate(
        `?page=${pageIndex + 1}&pageSize=${pageSize}&sort=${sortParam}`,
        {
          replace: true,
        }
      );
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const pageCount = table.getPageCount();

  const renderPageButtons = () =>
    Array.from({ length: pageCount }, (_, i) => (
      <Button
        key={i}
        variant={i === pageIndex ? "contained" : "outlined"}
        color={i === pageIndex ? "primary" : "inherit"}
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
                      "&:hover .sort-arrow": { opacity: canSort ? 1 : 0 },
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
          {table.getRowModel().rows.length === 0 ? (
            <Box component="tr">
              <Box
                component="td"
                colSpan={columns.length}
                sx={{
                  padding: "20px",
                  textAlign: "center",
                  color: isDark ? "#aaa" : "#555",
                }}>
                <Typography variant="caption" fontSize={15}>
                  No data matches your search.
                </Typography>
              </Box>
            </Box>
          ) : (
            table.getRowModel().rows.map((row) => (
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
                    sx={{
                      padding: "14px 10px",
                      borderBottom: "1px solid #eee",
                    }}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Box>
                ))}
              </Box>
            ))
          )}
        </Box>
      </Box>

      {/* Pagination */}
      {pageCount > 1 && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            p: 1,
            flexWrap: "wrap",
          }}>
          <Button
            onClick={() => table.setPageIndex(pageIndex - 1)}
            disabled={pageIndex === 0}
            size="small">
            {"<"}
          </Button>

          {renderPageButtons()}

          <Button
            onClick={() => table.setPageIndex(pageIndex + 1)}
            disabled={pageIndex >= pageCount - 1}
            size="small">
            {">"}
          </Button>

          <Box sx={{ ml: 2 }}>
            <Select
              size="small"
              value={pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}>
              {pageSizeOptions.map((size) => (
                <MenuItem key={size} value={size}>
                  Show {size}
                </MenuItem>
              ))}
            </Select>
          </Box>
        </Box>
      )}
    </Paper>
  );
}
