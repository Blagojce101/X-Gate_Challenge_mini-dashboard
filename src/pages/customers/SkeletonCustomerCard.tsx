import { Card, CardContent, Skeleton, Box, Typography } from "@mui/material";

const SkeletonCustomerCard = () => {
  return (
    <Card>
      <CardContent style={{ padding: "16px" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "start",
            mb: 1,
          }}>
          <Skeleton variant="text" width="65%" height={32} />
          <Skeleton
            variant="rounded"
            width={50}
            height={24}
            sx={{ borderRadius: 12 }}
          />
        </Box>

        <Typography variant="body2" component="div">
          <Skeleton width="90%" />
        </Typography>

        <Typography variant="body2" component="div">
          <Skeleton width="75%" />
        </Typography>

        <Typography variant="body2" component="div">
          <Skeleton width="60%" />
        </Typography>
      </CardContent>
    </Card>
  );
};

export default SkeletonCustomerCard;
