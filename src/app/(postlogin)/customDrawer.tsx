import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Accordion, AccordionDetails, AccordionSummary, Box, CircularProgress, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Tooltip, TooltipProps, Typography, styled, tooltipClasses } from "@mui/material";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { MenuListType, menuList } from "./menuList";
import Link from "next/link";
import { getCookie } from "cookies-next";

// tooltip component
const LightTooltip = styled(({ className, ...props }: TooltipProps) => <Tooltip {...props} classes={{ popper: className }} />)(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
    color: "rgba(0, 0, 0, 0.87)",
    boxShadow: theme.shadows[1],
    fontSize: 11,
    borderRadius: "16px",
  },
}));

const CustomDrawer = ({ isCollapsed }: { isCollapsed: boolean }): any => {
  const pathname = usePathname();
  const [selectedUrl, setSelectedUrl] = useState<string>();
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const [openedTooltip, setOpenedTooltip] = useState<string>();

  // event when dropdown menu clicked
  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    if (isExpanded) {
      setExpanded({ ...expanded, [panel]: true });
    } else {
      const newExpanded = { ...expanded };
      delete newExpanded[panel];
      setExpanded(newExpanded);
    }
  };

  // close other opened menu when click new menu
  useEffect(() => {
    const newExpanded: { [key: string]: boolean } = {};
    for (const [key, _] of Object.entries(expanded)) {
      newExpanded[key] = selectedUrl?.includes(key) || false;
    }
    setExpanded(newExpanded);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUrl]);

  // init expanded menu when page loaded
  useEffect(() => {
    setIsLoading(true)
    let pathnameBreakdowns = pathname.split("/");
    pathnameBreakdowns = pathnameBreakdowns.filter((value, index) => value != "");

    let paths = "";
    let expandedInsert: { [key: string]: boolean } = {};
    for (const path of pathnameBreakdowns) {
      paths += path;
      expandedInsert[paths] = true;
      paths += "/";
    }
    setExpanded(expandedInsert);

    setSelectedUrl(pathname);
    setIsLoading(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // generate drawer menu element
  const generateDrawer = (menus: MenuListType[]) =>
    menus.map((value) => {
      const Icon = value.icon;

      // kalau tidak punya child → langsung render
      if (!value.child) {
        return (
          <List key={value.id} disablePadding>
            <Link
              href={value.url ?? ""}
              style={{ width: "100%", textDecoration: "none", color: "inherit" }}
              onClick={() => setSelectedUrl(value.url)}
            >
              <ListItemButton selected={selectedUrl === value.url}>
                {Icon ? (
                  <ListItemIcon>{Icon}</ListItemIcon>
                ) : (
                  <ListItemIcon sx={{ minWidth: 18 }}>
                    <FiberManualRecordIcon sx={{ width: 6, height: 6 }} />
                  </ListItemIcon>
                )}
                <ListItemText>{value.text}</ListItemText>
              </ListItemButton>
            </Link>
          </List>
        );
      }

      // kalau punya child → accordion
      return (
        <Accordion
          key={value.id}
          disableGutters
          expanded={expanded[value.id] || false}
          onChange={handleChange(value.id)}
          sx={{ boxShadow: "none" }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            {Icon && <ListItemIcon>{Icon}</ListItemIcon>}
            <Typography>{value.text}</Typography>
          </AccordionSummary>

          <AccordionDetails>
            {generateDrawer(value.child)}
          </AccordionDetails>
        </Accordion>
      );
    }
  );

  const renderTooltipMenu = (menus: MenuListType[]) => (
    <List>
      {menus.map((menu) => {
        if (menu.child) {
          return (
            <LightTooltip
              key={menu.id}
              placement="right-start"
              title={renderTooltipMenu(menu.child)}
            >
              <ListItem secondaryAction={<ChevronRightIcon />}>
                <ListItemText>{menu.text}</ListItemText>
              </ListItem>
            </LightTooltip>
          );
        }

        return (
          <Link key={menu.id} href={menu.url ?? ""} style={{ textDecoration: "none", color: "inherit" }}>
            <ListItemButton onClick={() => setSelectedUrl(menu.url)}>
              <ListItemText>{menu.text}</ListItemText>
            </ListItemButton>
          </Link>
        );
      })}
    </List>
  );

  // generate mini drawer menu element
  const generateMiniDrawer = (menus: MenuListType[]) =>
    menus.map((value) => {
      const Icon = value.icon;

      return (
        <List key={value.id} disablePadding>
          {!value.child ? (
            <Link href={value.url ?? ""} style={{ textDecoration: "none", color: "inherit" }}>
              <ListItemButton onClick={() => setSelectedUrl(value.url)}>
                <ListItemIcon>{Icon}</ListItemIcon>
              </ListItemButton>
            </Link>
          ) : (
            <LightTooltip
              placement="right-start"
              title={renderTooltipMenu(value.child)}
            >
              <ListItemButton>
                <ListItemIcon>{Icon}</ListItemIcon>
              </ListItemButton>
            </LightTooltip>
          )}
        </List>
      );
    }
  );

  // set loading when generate menu
  if (isLoading) {
    return (
      <Box width={"100%"} height={"100%"} display={"flex"} flexDirection={"column"} alignItems={"center"} justifyContent={"center"} gap={"1rem"}>
        <CircularProgress color="primary" size={"4rem"} />
        <Typography variant="h6">Loading Menu Please Wait</Typography>
      </Box>
    );
  }

  if (!isCollapsed) {
    return <>{generateDrawer(menuList)}</>;
  } else {
    return <>{generateMiniDrawer(menuList)}</>;
  }
};

export default CustomDrawer;
