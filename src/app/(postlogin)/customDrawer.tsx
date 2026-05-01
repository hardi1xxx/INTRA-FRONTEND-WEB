import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  CircularProgress,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  TooltipProps,
  Typography,
  styled,
  tooltipClasses,
} from "@mui/material";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { menuList, MenuListType } from "./menuList";
import Link from "next/link";

// ================= TOOLTIP =================
const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
    color: "rgba(0,0,0,0.87)",
    boxShadow: theme.shadows[1],
    fontSize: 11,
    borderRadius: 16,
  },
}));

// ================= HELPER =================
const hasMenuAccess = (menuId: string, menuAccess: string[]) => {
  return menuAccess.some(
    (a) => a === menuId || a.startsWith(menuId + "/")
  );
};

const getMenuAccess = (): string[] => {
  try {
    const data = window.localStorage.getItem("intra_auth_menu_access");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

// ================= COMPONENT =================
const CustomDrawer = ({ isCollapsed }: { isCollapsed: boolean }) => {
  const pathname = usePathname();

  const [menuAccess, setMenuAccess] = useState<string[]>([]);
  const [selectedUrl, setSelectedUrl] = useState<string>();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [openedTooltip, setOpenedTooltip] = useState<string>();

  // ================= INIT =================
  useEffect(() => {
    setIsLoading(true);

    const paths = pathname.split("/").filter(Boolean);
    let current = "";
    const expandMap: Record<string, boolean> = {};

    paths.forEach((p) => {
      current += p;
      expandMap[current] = true;
      current += "/";
    });

    setExpanded(expandMap);
    setMenuAccess(getMenuAccess());
    setSelectedUrl(pathname);

    setIsLoading(false);
  }, [pathname]);

  // ================= ACCORDION =================
  const handleChange =
    (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded((prev) => ({
        ...prev,
        [panel]: isExpanded,
      }));
    };

  // ================= DRAWER =================
  const generateDrawer = (menus: MenuListType[], isChild = false) =>
    menus.map((menu) => {
      if (!hasMenuAccess(menu.id, menuAccess)) return null;

      const Icon = menu.icon;

      // NO CHILD
      if (!menu.child) {
        return (
          <List key={menu.id} disablePadding sx={{ mb: isChild ? 0 : 1 }}>
            <Link href={menu.url ?? ""} style={{ textDecoration: "none", color: "inherit" }}>
              <ListItemButton selected={selectedUrl === menu.url}>
                {Icon ? (
                  <ListItemIcon>{Icon}</ListItemIcon>
                ) : (
                  <ListItemIcon sx={{ minWidth: 18 }}>
                    <FiberManualRecordIcon sx={{ width: 6, height: 6 }} />
                  </ListItemIcon>
                )}
                <ListItemText>{menu.text}</ListItemText>
              </ListItemButton>
            </Link>
          </List>
        );
      }

      // WITH CHILD
      const children = menu.child.filter((c) =>
        hasMenuAccess(c.id, menuAccess)
      );

      if (children.length === 0) return null;

      return (
        <Accordion
          key={menu.id}
          expanded={expanded[menu.id] || false}
          onChange={handleChange(menu.id)}
          sx={{ boxShadow: "none", mb: 1 }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box display="flex" alignItems="center">
              {Icon && <ListItemIcon>{Icon}</ListItemIcon>}
              <Typography>{menu.text}</Typography>
            </Box>
          </AccordionSummary>

          <AccordionDetails>
            {generateDrawer(children, true)}
          </AccordionDetails>
        </Accordion>
      );
    });

  // ================= MINI =================
  const generateMiniDrawer = (menus: MenuListType[]) =>
    menus.map((menu) => {
      if (!hasMenuAccess(menu.id, menuAccess)) return null;

      const Icon = menu.icon;

      return (
        <List key={menu.id} disablePadding>
          {!menu.child ? (
            <Link href={menu.url ?? ""}>
              <ListItemButton sx={{ p: 0 }}>
                <ListItemIcon sx={{ width: 46, height: 46, justifyContent: "center" }}>
                  {Icon}
                </ListItemIcon>
              </ListItemButton>
            </Link>
          ) : (
            <LightTooltip
              placement="right-start"
              open={openedTooltip === menu.id}
              onOpen={() => setOpenedTooltip(menu.id)}
              onClose={() => setOpenedTooltip(undefined)}
              title={
                <List>
                  {menu.child.map((child) =>
                    hasMenuAccess(child.id, menuAccess) ? (
                      <Link key={child.id} href={child.url ?? ""}>
                        <ListItemButton>
                          <ListItemText>{child.text}</ListItemText>
                        </ListItemButton>
                      </Link>
                    ) : null
                  )}
                </List>
              }
            >
              <ListItemButton sx={{ p: 0 }}>
                <ListItemIcon sx={{ width: 46, height: 46, justifyContent: "center" }}>
                  {Icon}
                </ListItemIcon>
              </ListItemButton>
            </LightTooltip>
          )}
        </List>
      );
    });

  // ================= STATE =================
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
        <CircularProgress />
      </Box>
    );
  }

  if (menuAccess.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
        <Typography>No Access</Typography>
      </Box>
    );
  }

  return isCollapsed
    ? <>{generateMiniDrawer(menuList)}</>
    : <>{generateDrawer(menuList)}</>;
};

export default CustomDrawer;