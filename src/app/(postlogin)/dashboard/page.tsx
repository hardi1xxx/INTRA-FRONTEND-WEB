/* eslint-disable @next/next/no-img-element */
import { Box, Typography } from "@mui/material";

// default page after login
const DashboardPage = () => {
  return (
    <Box display={"flex"} alignItems={"center"} justifyContent={"center"} flexDirection={"column"} height={"100%"} flexGrow={1} gap={"1rem"}>
      <img src="/images/logo.png" style={{ width: "420px", maxWidth: "100%" }} alt="logo" />
      <Typography fontWeight={"bold"} variant="h3">
        Integrated Tracking System
      </Typography>
    </Box>
  );
};

export default DashboardPage;
