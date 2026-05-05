"use client";

import { Tooltip, Icon } from "@mui/material";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import MenuIcon from '@mui/icons-material/Menu';
import { ConfirmProvider } from "material-ui-confirm";
import { RootState } from "@/lib/redux/store";
import { Box, Container, Drawer, IconButton, List, Skeleton, Toolbar, Typography, useMediaQuery, Button } from "@mui/material";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import { styled, ThemeProvider, useTheme } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import CustomDrawer from "./customDrawer";
import UserMenu, { UserMenuMini } from "./userMenu";
// defaultTheme
import colors from "@/assets/scss/_themes-vars.module.scss";
import AlertsProvider from "@/components/AlertContext";
import { checkAccessShow } from "@/components/helper";
import themes from "@/components/themes";
import { toggleOpenDrawer } from "@/lib/redux/slices/customization";
import { setTextNotification } from "@/lib/redux/slices/notification";
import { LOGOUT } from "@/lib/redux/types";
import { KeyboardDoubleArrowLeft, KeyboardDoubleArrowRight, WarningAmberRounded, ChevronLeft, KeyboardArrowRight } from "@mui/icons-material";
import { lighten } from "@mui/material/styles";
import Image from "next/image";
import { redirect, usePathname, useRouter } from "next/navigation";
import React from "react";
import { useDispatch } from "react-redux";
import ToolbarButtonGroup from "./toolbarButtonGroup";
import { capitalizeFirstLetter } from "@/components/helper";
import { PageHeaderProvider, usePageHeader } from "./PageHeaderContext";
import DataGridAction from "@/components/DataGridAction";
import CustomStatusChip from "@/components/CustomStatusChip";

const drawerWidth = 220;

// Main element
const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme, open }) => ({
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

// App bar element
const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

export default function PostLoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const theme = useTheme();
  const [showSessionExpiredModal, setShowSessionExpiredModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!checkAccessShow(pathname)) {
      redirect("/forbidden");
    }
  }, [pathname]);

  const customization = useSelector((state: RootState) => state.customization);

  const xsScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [useDarwer, setUseDrawer] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    const isDetail =
      pathname.includes("detail-stock-opname") ||
      pathname.includes("detail-physical-inventory-fusion") ||
      pathname.includes("approval-stock-opname/manage-submit/detail") ||
      pathname.includes("approval-stock-opname/review-confirmation/detail") ||
      pathname.includes("approval-stock-opname/manage-submit/send-to-oracle");
    setUseDrawer(!isDetail);
  }, [pathname]);

  const handleDrawerToggle = () => {
    dispatch(toggleOpenDrawer());
  };

  const drawers = (
    <Box
      display="flex"
      flexDirection="column"
      height="100%"
      minHeight={0}
      justifyContent="space-between"
      sx={{ flex: 1 }}
    >
      <Box
        flex={1}
        minHeight={0}
        overflow="auto"
        paddingX="16px"
        className="sidebar-menu-scroll"
        sx={{ display: "flex", flexDirection: "column" }}
      >
        <List sx={{ flex: 1, minHeight: 0 }} id="drawers">
          <CustomDrawer isCollapsed={false} />
        </List>
      </Box>
      <Box flexShrink={0} sx={{ padding: "4px 16px 16px", marginTop: "auto" }}>
        <UserMenu />
      </Box>
    </Box>
  );

  const miniDrawers = (
    <Box
      display="flex"
      flexDirection="column"
      height="100%"
      minHeight={0}
      justifyContent="space-between"
      sx={{ flex: 1 }}
    >
      <Box
        flex={1}
        minHeight={0}
        overflow="auto"
        paddingX="16px"
        className="sidebar-menu-scroll"
        sx={{ display: "flex", flexDirection: "column" }}
      >
        <List
          sx={{
            flex: 1,
            minHeight: 0,
            gap: "6px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            "& svg": { fontSize: "20px" },
            "& .MuiListItemButton-root": { minHeight: "36px", padding: "6px 0" },
          }}
          id="mini-drawers"
        >
          <CustomDrawer isCollapsed={true} />
        </List>
      </Box>
      <Box
        flexShrink={0}
        display="flex"
        flexDirection="column"
        gap="1rem"
        paddingX="16px"
        sx={{ borderTop: "none !important", marginTop: "auto" }}
      >
        <List sx={{ gap: "8px", display: "flex", flexDirection: "column" }}>
          <UserMenuMini />
        </List>
      </Box>
    </Box>
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ConfirmProvider>
        <ThemeProvider theme={themes(customization)}>
          <AlertsProvider>
            <PageHeaderProvider pathname={pathname}>
              <PostLoginLayoutContent
                useDarwer={useDarwer}
                customization={customization}
                xsScreen={xsScreen}
                drawerWidth={drawerWidth}
                handleDrawerToggle={handleDrawerToggle}
                drawers={drawers}
                miniDrawers={miniDrawers}
              >
                {children}
              </PostLoginLayoutContent>
            </PageHeaderProvider>
          </AlertsProvider>
        </ThemeProvider>
      </ConfirmProvider>
    </LocalizationProvider>
  );
}

function PostLoginLayoutContent({
  useDarwer,
  customization,
  xsScreen,
  drawerWidth,
  handleDrawerToggle,
  drawers,
  miniDrawers,
  children,
}: {
  useDarwer: boolean;
  customization: { isOpenDrawer: boolean };
  xsScreen: boolean;
  drawerWidth: number;
  handleDrawerToggle: () => void;
  drawers: React.ReactNode;
  miniDrawers: React.ReactNode;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { pageTitle, breadcrumbPath, pageStatus, pageStatusVariant, pageActions, pageHeaderLoading } = usePageHeader();

  return (
    <Container
              component="main"
              disableGutters
              maxWidth={false}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                backgroundColor: "#ffffff",
                transform: "scale(0.85)",
                transformOrigin: "top left",
                width: "117.65%", // 1 / 0.75
                height: "117vh",
                overflow: "hidden",
              }}
            >
              {/* top bar */}
              {useDarwer ? (
                <AppBar
                  position="fixed"
                  open={customization.isOpenDrawer}
                  sx={{
                    width: { sm: `calc(100% - ${customization.isOpenDrawer ? drawerWidth : 57}px) !important` },
                    boxShadow: 'none',
                    backgroundColor: 'white',
                    borderBottom: 'none !important',
                  }}
                >
                  <Toolbar
                    sx={{
                      minHeight: '50px !important',
                      height: '50px !important',
                      paddingY: 0,
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <Box
                      sx={{ flexGrow: 1 }}
                    >
                      <IconButton
                        onClick={handleDrawerToggle}
                        size='small'
                        sx={{
                          border: `1px solid ${colors.primary200}`,
                          background: lighten(colors.primary200, 0.7),
                          borderRadius: '40%',
                          zIndex: 10
                        }}
                      >
                        {
                          customization.isOpenDrawer ?
                            <KeyboardDoubleArrowLeft fontSize='small' sx={{ color: colors.primaryMain }} /> :
                            <KeyboardDoubleArrowRight fontSize='small' sx={{ color: colors.primaryMain }} />
                        }
                        
                      </IconButton>
                      {/* <BreadcrumbsComponent /> */}
                    </Box>
                    <ToolbarButtonGroup />
                  </Toolbar>
                </AppBar>
              ) : (
                <AppBar
                  position="fixed"
                  open={customization.isOpenDrawer}
                  sx={{
                    width: { sm: `calc(100% - 5px) !important` },
                    boxShadow: 'none',
                    backgroundColor: 'white',
                    borderBottom: 'none !important',
                  }}
                >
                  <Toolbar
                    sx={{
                      minHeight: '50px !important',
                      height: '50px !important',
                      paddingY: 0,
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <Box
                      sx={{ flexGrow: 1, display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 3 }}
                    >
                      <Button
                        onClick={() => { router.back() }}
                        size='small'
                        sx={{
                          border: `1px solid ${colors.primary200}`,
                          borderRadius: '40%',
                          zIndex: 10,
                          px: 2
                        }}
                        startIcon={<ChevronLeft sx={{ color: colors.primaryMain }} />}
                      >
                        <Typography color='primary'>
                          Back
                        </Typography>
                      </Button>
                      {pageHeaderLoading ? (
                        <Skeleton variant="rounded" width={220} height={24} sx={{ borderRadius: 1 }} />
                      ) : (
                        <>
                          <Typography fontSize={18} color='#000' fontWeight={'bold'}>
                            {pageTitle}
                          </Typography>
                          {pageStatus && (
                            <CustomStatusChip
                              label={pageStatus}
                              variantColor={pageStatusVariant}
                              sx={{ borderRadius: "20px", height: "26px", fontSize: "12px" }}
                            />
                          )}
                        </>
                      )}
                    </Box>
                    <Box
                      sx={{
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                          columnGap: '3px'
                      }}
                    >
                      {pageHeaderLoading ? (
                        <Skeleton variant="rounded" width={280} height={18} sx={{ borderRadius: 1 }} />
                      ) : (
                        <>
                          {
                            breadcrumbPath.map((item: string, index: number) => {
                              if (item == '>') {
                                return <Icon key={index + 1} fontSize={'small'}>
                                  <KeyboardArrowRight fontSize={'small'} sx={{color:'#7C878E'}} />
                                </Icon>
                              }
                              return <Typography
                                key={index + 1}
                                fontSize={'13px'}
                                color={'#7C878E'}
                                >
                                {capitalizeFirstLetter(item)}
                              </Typography>
                            })
                          }
                        </>
                      )}
                    </Box>
                    {!pageHeaderLoading && pageActions.length > 0 && <DataGridAction item={pageActions} />}
                  </Toolbar>
                </AppBar>
              )}
              
              {/* drawer menu */}
              {useDarwer && (
                <Box
                  component="nav"
                  sx={{
                    width: { sm: drawerWidth },
                    flexShrink: { sm: 0 }
                  }}
                  aria-label="mailbox folders"
                >
                  {/* Navbar for mobile */}
                  {
                    xsScreen && <Drawer
                      variant="temporary"
                      open={customization.isOpenDrawer}
                      onClose={handleDrawerToggle}
                      ModalProps={{
                        keepMounted: true,
                      }}
                      sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': {
                          boxSizing: 'border-box',
                          width: drawerWidth,
                          overflowY: 'unset',
                          display: 'flex',
                          flexDirection: 'column',
                        },
                      }}
                    >

                      <Toolbar
                        sx={{
                          paddingLeft: '16px !important',
                          paddingRight: '16px !important',
                          flexShrink: 0,
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            borderRadius: '8px',
                            border: '1px solid #E6E6E7',
                            width: '100%',
                            padding: '12px',
                            justifyContent: 'space-between'
                          }}
                        >
                          <Box display={'flex'} flexDirection={'row'} alignItems={'center'} columnGap={1}>
                            <Typography fontSize={18} fontWeight={'bold'} color='primary'>
                              <b>INTRA</b>System
                            </Typography>
                          </Box>
                        </Box>
                      </Toolbar>
                      <Box sx={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
                        {drawers}
                      </Box>
                    </Drawer>
                  }
                  {
                    !xsScreen && <Drawer
                      variant="persistent"
                      sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': {
                          boxSizing: 'border-box',
                          width: drawerWidth + 20,
                          overflowY: 'unset',
                          display: 'flex',
                          flexDirection: 'column',
                          borderRight: 'none !important',
                        },
                      }}
                      open={customization.isOpenDrawer}
                    >
                      <Toolbar
                        sx={{
                          paddingLeft: '16px !important',
                          paddingRight: '16px !important',
                          flexShrink: 0,
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            height: '48px',
                            position: 'relative',
                            width: '100%',
                            paddingX: '12px',
                            borderRadius: '8px',
                            // border: '1px solid #E6E6E7',
                          }}
                        >
                          <Box
                            display="flex"
                            flexDirection="row"
                            alignItems="center"
                            columnGap={1}
                            sx={{ width: 'fit-content' }}
                          >
                            <Image
                              src="/images/logo-mini.png"
                              alt="Logo"
                              width={35}
                              height={35}
                              style={{ objectFit: 'contain' }}
                              priority
                            />
                            <Typography
                              variant="h6"
                              fontWeight="bold"
                              sx={{
                                color: '#30318B',
                                fontSize: '1rem',
                              }}
                            >
                              Integrated Tracking System
                            </Typography>
                          </Box>
                        </Box>
                      </Toolbar>
                      <Box sx={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
                        {drawers}
                      </Box>
                    </Drawer>
                  }

                  {
                    !xsScreen && <Drawer
                      variant="persistent"
                      sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': {
                          boxSizing: 'border-box',
                          width: 78,
                          overflowY: 'unset',
                          display: 'flex',
                          flexDirection: 'column',
                          borderRight: 'none !important',
                        },
                      }}
                      open={!customization.isOpenDrawer}
                    >
                      <Toolbar
                        sx={{
                          paddingLeft: '16px !important',
                          paddingRight: '16px !important',
                          display: 'flex',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            position: 'relative',
                          }}
                        >
                          <Image
                            src="/images/logo-mini.png"
                            alt="Logo Mini"
                            width={35}
                            height={35}
                            style={{ objectFit: 'contain' }}
                            priority
                          />
                        </Box>

                      </Toolbar>
                      <Box sx={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
                        {miniDrawers}
                      </Box>
                    </Drawer>
                  }
                </Box>
              )}

              {/* content */}
              <Main
                open={customization.isOpenDrawer}
                sx={{
                  marginLeft: { sm: useDarwer ? `calc(${customization.isOpenDrawer ? drawerWidth + 70 : 129}px)` : 10, xs: '10px' },
                  marginRight: { sm: '70px', xs: '10px' },
                  width: { sm: useDarwer ? `calc(100% - ${customization.isOpenDrawer ? drawerWidth + 70 : 129}px - 20px)` : `calc(100% - 90px)`, xs: 'calc(100% - 40px)' },
                  height: 'calc(100vh - 165px)',
                  overflow: 'auto',
                  flexGrow: 1,
                  p: "20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  marginTop: "52px",
                  backgroundColor: "#eef2f6",
                  borderRadius: "15px",
                }}
              >
                {children}
              </Main>
              <Box
                sx={{
                  marginLeft: { sm: useDarwer ?`calc(${customization.isOpenDrawer ? drawerWidth + 20 : 81}px)` : 4, xs: '10px' },
                  marginRight: { sm: '102px', xs: '10px' },
                  width: { sm: useDarwer ? `calc(100% - ${customization.isOpenDrawer ? drawerWidth + 20 : 81}px - 20px)` : `calc(100% - 55px)`, xs: 'calc(100% - 40px)' },
                  height: '40px',
                  background: 'white',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingRight: '16px',
                  paddingLeft: '96px'
                }}
              >
                <Typography
                  fontSize={13}
                  sx={{
                    color: "#5A646B",
                    mt: 1,
                  }}
                >
                  © 2025.Intra Team
                </Typography>

                <Typography
                  fontSize={13}
                  sx={{
                    color: "#5A646B",
                    mt: 1,
                  }}
                >
                  Version 0.0.1
                </Typography>
              </Box>
    </Container>
  );
}
