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
  const [menuAccess, setMenuAccess] = useState<string[]>([]);
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
    setMenuAccess(JSON.parse(window.localStorage.getItem("intra_auth_menu_access") ?? "[]"));

    setSelectedUrl(pathname);
    setIsLoading(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // generate drawer menu element
  const generateDrawer = (menus: MenuListType[]) =>
    menus.map((value) => {
      const Icon = value.icon;

      // Cek apakah menu memiliki child yang bisa diakses
      const hasAccessibleChild = value.child?.some(child =>
        menuAccess.some(access => access?.includes?.(child.id))
      );

      // Jika tidak ada child yang bisa diakses, jangan tampilkan parent
      if (!hasAccessibleChild && value.child) {
        return null;
      }

      if (!value.child) {
        if (menuAccess.find((valueMenuAccess: string) => valueMenuAccess == value.id)) {
          return (
            <List key={value.id} component="nav" id={value.id} disablePadding>
              <Link
                href={value.url ?? ""}
                passHref
                style={{
                  width: "100%",
                  textDecoration: "none",
                  color: "inherit",
                }}
                onClick={() => {
                  setSelectedUrl(value.url);
                }}
              >
                <ListItemButton selected={selectedUrl == value.url}>
                  {Icon ? (
                    <ListItemIcon>{Icon}</ListItemIcon>
                  ) : (
                    <ListItemIcon sx={{ my: "auto", minWidth: 18 }}>
                      <FiberManualRecordIcon
                        sx={{
                          width: expanded[value.id] ? 8 : 6,
                          height: expanded[value.id] ? 8 : 6,
                          minWidth: "18px",
                        }}
                        fontSize={"medium"}
                      />
                    </ListItemIcon>
                  )}
                  <ListItemText>{value.text}</ListItemText>
                </ListItemButton>
              </Link>
            </List>
          );
        }
      }

      const filteredChildren = (value.child || []).filter((child) =>
        menuAccess.some((access) => access === child.id || access.startsWith(child.id + "/"))
      );
      
      if (
        menuAccess.some((access) => access === value.id || access?.startsWith?.(value.id + "/"))
      ) {
        return (
          <Accordion
            key={value.id}
            id={value.id}
            disableGutters
            sx={{ boxShadow: "none" }}
            expanded={expanded[value.id] || false}
            onChange={handleChange(value.id)}
            className="accordion-custom"
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ color: expanded[value.id] ? "white" : undefined }} />}
              aria-controls={`${value.id}-content`}
              className={expanded[value.id] ? "selected-accordion" : ""}
              id={`${value.id}-header`}
            >
              {Icon && <ListItemIcon sx={{ color: expanded[value.id] ? "white" : undefined }}>{Icon}</ListItemIcon>}
              <Typography fontWeight={expanded[value.id] ? "600" : "400"}>{value.text}</Typography>
            </AccordionSummary>
            <AccordionDetails
              style={{
                paddingRight: filteredChildren.some((child) => child.child) ? 0 : undefined,
              }}
            >
              {generateDrawer(filteredChildren)}
            </AccordionDetails>
          </Accordion>
        );
      } else {
        return null;
      }      
    });

  // generate mini drawer menu element
  const generateMiniDrawer = (menus: MenuListType[]) =>
    menus.map((value) => {
      const Icon = value.icon;

      // Cek apakah menu memiliki child yang bisa diakses
      const hasAccessibleChild = value.child?.some(child =>
        menuAccess.some(access => access?.includes?.(child.id))
      );

      // Jika tidak ada child yang bisa diakses, jangan tampilkan parent
      if (!hasAccessibleChild && value.child) {
        return null;
      }

      if (menuAccess.some((valueMenuAccess: string) => valueMenuAccess?.includes?.(value.id))) {
        return (
          <List key={value.id} component="nav" id={value.id} disablePadding>
            {!value.child && (
              <Link
                href={value.url ?? ""}
                passHref
                style={{ textDecoration: "none", color: "inherit" }}
                onClick={() => {
                  setSelectedUrl(value.url);
                }}
              >
                <ListItemButton selected={(value.url ?? "").includes(selectedUrl ?? "")} sx={{ padding: "0px" }}>
                  <ListItemIcon
                    sx={{
                      height: "46px",
                      width: "46px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {Icon}
                  </ListItemIcon>
                </ListItemButton>
              </Link>
            )}
            {value.child && (
              <LightTooltip
                placement="right-start"
                open={value.id == openedTooltip}
                onClose={() => {
                  setOpenedTooltip(undefined);
                }}
                onOpen={() => setOpenedTooltip(value.id)}
                title={
                  <List>
                    {value.child.map((valueChild) => {
                       if (!menuAccess.some((valueMenuAccess: string) => valueMenuAccess.includes(valueChild.id))) {
                        return null;
                       }
                      if (valueChild.child) {
                        return (
                          <LightTooltip
                            key={valueChild.id}
                            placement="right-start"
                            title={
                              <List>
                                {valueChild.child.map((valueGrandChild) => {
                                  // START 1
                                  if (!menuAccess.some((valueMenuAccess: string) => valueMenuAccess.includes(valueGrandChild.id))) {
                                    return null;
                                   }
                                  if (valueGrandChild.child) {
                                    return (
                                      <LightTooltip
                                        key={valueGrandChild.id}
                                        placement="right-start"
                                        title={
                                          <List>
                                            
                                            {valueGrandChild.child.map((valueGrandChild1) => {
                                              // START 2
                                              if (!menuAccess.some((valueMenuAccess: string) => valueMenuAccess.includes(valueGrandChild1.id))) {
                                                return null;
                                               }
                                              if (valueGrandChild1.child) {
                                                return (
                                                  <LightTooltip
                                                    key={valueGrandChild1.id}
                                                    placement="right-start"
                                                    title={
                                                      <List>
                                                        {valueGrandChild1.child.map((valueGrandChild2) => (
                                                          <Link
                                                            key={valueGrandChild2.id}
                                                            href={valueGrandChild2.url ?? ""}
                                                            passHref
                                                            style={{
                                                              width: "100%",
                                                              textDecoration: "none",
                                                              color: "inherit",
                                                            }}
                                                            onClick={() => {
                                                              setSelectedUrl(valueGrandChild2.url);
                                                            }}
                                                          >
                                                            <ListItemButton>
                                                              <ListItemIcon sx={{ my: "auto", minWidth: 18 }}>
                                                                <FiberManualRecordIcon
                                                                  sx={{
                                                                    width: expanded[value.id] ? 8 : 6,
                                                                    height: expanded[value.id] ? 8 : 6,
                                                                    minWidth: "18px",
                                                                  }}
                                                                  fontSize={"medium"}
                                                                />
                                                              </ListItemIcon>
                                                              <ListItemText>{valueGrandChild2.text}</ListItemText>
                                                            </ListItemButton>
                                                          </Link>
                                                        ))}
                                                      </List>
                                                    }
                                                  >
                                                    <ListItem secondaryAction={<ChevronRightIcon />}>
                                                      <ListItemIcon sx={{ my: "auto", minWidth: 18 }}>
                                                        <FiberManualRecordIcon
                                                          sx={{
                                                            width: expanded[value.id] ? 8 : 6,
                                                            height: expanded[value.id] ? 8 : 6,
                                                            minWidth: "18px",
                                                          }}
                                                          fontSize={"medium"}
                                                        />
                                                      </ListItemIcon>
                                                      <ListItemText>{valueGrandChild1.text}</ListItemText>
                                                    </ListItem>
                                                  </LightTooltip>
                                                );
                                              }
                                              return (
                                                <Link
                                                  key={valueGrandChild1.id}
                                                  href={valueGrandChild1.url ?? ""}
                                                  passHref
                                                  style={{
                                                    width: "100%",
                                                    textDecoration: "none",
                                                    color: "inherit",
                                                  }}
                                                  onClick={() => {
                                                    setSelectedUrl(valueGrandChild1.url);
                                                  }}
                                                >
                                                  <ListItemButton selected={selectedUrl == valueGrandChild1.url}>
                                                    <ListItemIcon sx={{ my: "auto", minWidth: 18 }}>
                                                      <FiberManualRecordIcon
                                                        sx={{
                                                          width: expanded[value.id] ? 8 : 6,
                                                          height: expanded[value.id] ? 8 : 6,
                                                          minWidth: "18px",
                                                        }}
                                                        fontSize={"medium"}
                                                      />
                                                    </ListItemIcon>
                                                    <ListItemText>{valueGrandChild1.text}</ListItemText>
                                                  </ListItemButton>
                                                </Link>
                                              );
                                              // END 2
                                            })}
                                          </List>
                                        }
                                      >
                                        <ListItem secondaryAction={<ChevronRightIcon />}>
                                          <ListItemIcon sx={{ my: "auto", minWidth: 18 }}>
                                            <FiberManualRecordIcon
                                              sx={{
                                                width: expanded[value.id] ? 8 : 6,
                                                height: expanded[value.id] ? 8 : 6,
                                                minWidth: "18px",
                                              }}
                                              fontSize={"medium"}
                                            />
                                          </ListItemIcon>
                                          <ListItemText>{valueGrandChild.text}</ListItemText>
                                        </ListItem>
                                      </LightTooltip>
                                    );
                                  }
                                  return (
                                    <Link
                                      key={valueGrandChild.id}
                                      href={valueGrandChild.url ?? ""}
                                      passHref
                                      style={{
                                        width: "100%",
                                        textDecoration: "none",
                                        color: "inherit",
                                      }}
                                      onClick={() => {
                                        setSelectedUrl(valueGrandChild.url);
                                      }}
                                    >
                                      <ListItemButton selected={selectedUrl == valueGrandChild.url}>
                                        <ListItemIcon sx={{ my: "auto", minWidth: 18 }}>
                                          <FiberManualRecordIcon
                                            sx={{
                                              width: expanded[value.id] ? 8 : 6,
                                              height: expanded[value.id] ? 8 : 6,
                                              minWidth: "18px",
                                            }}
                                            fontSize={"medium"}
                                          />
                                        </ListItemIcon>
                                        <ListItemText>{valueGrandChild.text}</ListItemText>
                                      </ListItemButton>
                                    </Link>
                                  );
                                  // END 1
                                })}
                              </List>
                            }
                          >
                            <ListItem secondaryAction={<ChevronRightIcon />}>
                              <ListItemIcon sx={{ my: "auto", minWidth: 18 }}>
                                <FiberManualRecordIcon
                                  sx={{
                                    width: expanded[value.id] ? 8 : 6,
                                    height: expanded[value.id] ? 8 : 6,
                                    minWidth: "18px",
                                  }}
                                  fontSize={"medium"}
                                />
                              </ListItemIcon>
                              <ListItemText>{valueChild.text}</ListItemText>
                            </ListItem>
                          </LightTooltip>
                        );
                      }
                      return (
                        <Link
                          key={valueChild.id}
                          href={valueChild.url ?? ""}
                          passHref
                          style={{
                            width: "100%",
                            textDecoration: "none",
                            color: "inherit",
                          }}
                          onClick={() => {
                            setSelectedUrl(valueChild.url);
                          }}
                        >
                          <ListItemButton selected={selectedUrl == valueChild.url}>
                            <ListItemIcon sx={{ my: "auto", minWidth: 18 }}>
                              <FiberManualRecordIcon
                                sx={{
                                  width: expanded[value.id] ? 8 : 6,
                                  height: expanded[value.id] ? 8 : 6,
                                  minWidth: "18px",
                                }}
                                fontSize={"medium"}
                              />
                            </ListItemIcon>
                            <ListItemText>{valueChild.text}</ListItemText>
                          </ListItemButton>
                        </Link>
                      );
                    })}
                  </List>
                }
              >
                <ListItemButton onClick={() => setOpenedTooltip(value.id)} selected={expanded[value.id]} sx={{ padding: "0px" }}>
                  <ListItemIcon
                    sx={{
                      height: "46px",
                      width: "46px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {Icon}
                  </ListItemIcon>
                </ListItemButton>
              </LightTooltip>
            )}
          </List>
        );
      } else {
        return null;
      }
    });
  // set loading when generate menu
  if (isLoading) {
    return (
      <Box width={"100%"} height={"100%"} display={"flex"} flexDirection={"column"} alignItems={"center"} justifyContent={"center"} gap={"1rem"}>
        <CircularProgress color="primary" size={"4rem"} />
        <Typography variant="h6">Loading Menu Please Wait</Typography>
      </Box>
    );
  }

  if (menuAccess.length == 0) {
    return (
      <Box width={"100%"} height={"100%"} display={"flex"} flexDirection={"column"} alignItems={"center"} justifyContent={"center"} gap={"1rem"}>
        <Typography variant="h6">No Data Access</Typography>
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
