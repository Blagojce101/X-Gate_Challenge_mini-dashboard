import { Box, Paper, Skeleton } from "@mui/material";

interface SkeletonTableProps {
  columnsCount: number;
  rowsCount?: number;
}

const SkeletonTable = ({
  columnsCount,
  rowsCount = 10,
}: SkeletonTableProps) => {
  return (
    <Paper>
      <Box component="table" sx={{ width: "100%", borderCollapse: "collapse" }}>
        <Box component="thead">
          <Box component="tr">
            {Array.from({ length: columnsCount }).map((_, i) => (
              <Box component="th" key={i} sx={{ padding: "14px 10px" }}>
                <Skeleton width="60%" />
              </Box>
            ))}
          </Box>
        </Box>

        <Box component="tbody">
          {Array.from({ length: rowsCount }).map((_, rowIndex) => (
            <Box component="tr" key={rowIndex}>
              {Array.from({ length: columnsCount }).map((_, colIndex) => (
                <Box
                  component="td"
                  key={colIndex}
                  sx={{
                    padding: "14px 10px",
                    borderBottom: "1px solid #eee",
                  }}>
                  <Skeleton height={20} />
                </Box>
              ))}
            </Box>
          ))}
        </Box>
      </Box>
    </Paper>
  );
};

export default SkeletonTable;
