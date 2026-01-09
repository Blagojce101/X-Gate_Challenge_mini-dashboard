import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";
import { Box, Button, Typography } from "@mui/material";

interface Props {
  children: React.ReactNode;
}

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const ErrorFallback = ({ error, resetErrorBoundary }: ErrorFallbackProps) => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        p: 3,
      }}>
      <Box>
        <Typography variant="h4" gutterBottom>
          Something went wrong
        </Typography>

        <Typography color="text.secondary" sx={{ mb: 3 }}>
          {error.message || "An unexpected error occurred."}
        </Typography>

        <Button variant="contained" onClick={resetErrorBoundary}>
          Try again
        </Button>
      </Box>
    </Box>
  );
};

export const ErrorBoundary = ({ children }: Props) => {
  return (
    <ReactErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        window.location.reload();
      }}>
      {children}
    </ReactErrorBoundary>
  );
};
