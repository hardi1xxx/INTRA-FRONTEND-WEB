"use client";

import { Box, Breadcrumbs, Typography } from "@mui/material";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Home from "@mui/icons-material/Home";
import { titleCase } from "../helper";

type MainPageType = {
  children: ReactNode;
  title?: string;
  breadcrumbFontSize?: string;
};

const MainPage = ({ title, children, breadcrumbFontSize = '12px' }: MainPageType) => {
  const pathname = usePathname();

  return (
    <>
      <Box
        border={"4px"}
        sx={{
          backgroundColor: "white",
          display: "flex",
          flexDirection: { sm: "row", xs: "column-reverse" },
          gap: "1rem",
          justifyContent: "space-between",
          padding: "1rem",
          borderRadius: "8px",
          bgcolor: "#2d50b0",
        }}
      >
        <Typography variant="h3" fontWeight={500} color={"white"}>
          {title}
        </Typography>
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" sx={{ color: "white" }} />}>
          {pathname.split("/").map((value, index) => (
            <Typography key={index} color="white" sx={{ display: "flex", alignItems: "center", fontSize: breadcrumbFontSize }}>
              {value === "" ? <Home fontSize="small" /> : titleCase(value)}
            </Typography>
          ))}
        </Breadcrumbs>
      </Box>
      {children}
    </>
  );
};

export default MainPage;
