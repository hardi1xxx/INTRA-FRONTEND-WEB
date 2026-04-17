'use client'

import { ThemeProvider, useTheme } from '@mui/material/styles';
import { Box, Container, Drawer, IconButton, List, Toolbar, Tooltip, Typography, useMediaQuery } from "@mui/material";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import MenuIcon from '@mui/icons-material/Menu';
import { ConfirmProvider } from "material-ui-confirm";
import { RootState } from "@/lib/redux/store";
import { styled } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import CustomDrawer from "./customDrawer";
import UserMenu, { UserMenuMini } from "./userMenu";
// defaultTheme
import themes from '@/components/themes';
import AlertsProvider from '@/components/AlertContext';
import ToolbarButtonGroup from './toolbarButtonGroup';
import React from 'react';
import { redirect, usePathname } from 'next/navigation';
import { checkAccessShow } from '@/components/helper';

const drawerWidth = 260;

// Main element
const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    transition: theme.transitions.create('margin', {
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
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    transition: theme.transitions.create(['margin', 'width'], {
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
  const pathname = usePathname()
  // useEffect(() => {
  //   if (!checkAccessShow(pathname)) {
  //     redirect('/forbidden')
  //   }
  // }, [pathname])
  
  const theme = useTheme()
  const customization = useSelector((state: RootState) => state.customization);

  const [mobileOpen, setMobileOpen] = useState(true)
  
  const xsScreen = useMediaQuery(theme.breakpoints.down('sm'));

  

  const handleDrawerToggle = () => {
      setMobileOpen(!mobileOpen);
  };

  // menu drawer
  const drawers = (
    <Box display={'flex'} flexDirection={'column'} justifyContent={'space-between'} height={'100%'}>
      <div>
        <Box height={'calc(100vh - 238px)'} overflow={'auto'} paddingX={'16px'}>
          <List sx={{height: 'calc(100% - 1rem)'}}>
            <CustomDrawer isCollapsed={false} />
          </List>
        </Box>
      </div>
      <div>
        <UserMenu />
      </div>
    </Box>
  );
  // mini menu
  const miniDrawers = (
    <Box display={'flex'} flexDirection={'column'} justifyContent={'space-between'} height={'100%'}>
      <div>
        {/* <Divider /> */}
        <Box height={'calc(100vh - 238px)'} overflow={'auto'} paddingX={'16px'}>
          <List sx={{height: 'calc(100% - 1rem)', gap: '8px', display: 'flex', flexDirection: 'column'}}>
            <CustomDrawer isCollapsed={true} />
          </List>
        </Box>
      </div>
      <div>
        <Box overflow={'auto'} display={'flex'} flexDirection={'column'} gap={'1rem'} paddingX={'16px'}>
          <List sx={{height: 'calc(100% - 1rem)', gap: '8px', display: 'flex', flexDirection: 'column'}}>
            <UserMenuMini />
          </List>
        </Box>
      </div>
    </Box>
  )

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ConfirmProvider>
        <ThemeProvider theme={themes(customization)}>
          <AlertsProvider>
            <Container component="main" disableGutters maxWidth={false} sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                backgroundColor: 'white',
                minHeight: '100vh'
            }}>
              {/* top bar */}
              <AppBar 
                position="fixed" 
                open={mobileOpen}
                sx={{
                  width: { sm: `100%` },
                  // ml: { sm: ` ${mobileOpen ? drawerWidth : 0}px` },
                  boxShadow: 'none',
                  backgroundColor: 'white'
                }}
              >
                <Toolbar>
                  <Typography variant="h5" noWrap component="div" fontWeight={'bold'}>
                    {xsScreen ? 'Intra' : 'Integrated Tracking System'}
                  </Typography>
                  <Box
                  sx={{ flexGrow: 1 }}
                  >
                    <Tooltip title="Toogle Menu">
                      <IconButton
                        color="primary"
                        aria-label="open drawer"
                        onClick={handleDrawerToggle}
                        edge="end"
                        sx={{  ml: 2, borderRadius: '8px', backgroundColor: '#2d50b0', color: 'white', '&:hover': {backgroundColor: '#223c85'}}}
                      >
                        <MenuIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <ToolbarButtonGroup />
                </Toolbar>
              </AppBar>
              {/* drawer menu */}
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
                    open={!mobileOpen}
                    // onTransitionEnd={handleDrawerTransitionEnd}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                      keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                      display: { xs: 'block', sm: 'none' },
                      '& .MuiDrawer-paper': { 
                        boxSizing: 'border-box', 
                        width: drawerWidth, 
                        overflowY: 'unset',
                      },
                    }}
                  >
                    <Toolbar>
                      <Typography variant="h5" noWrap component="div" fontWeight={'bold'}>
                        Ways of Waste System
                      </Typography>
                    </Toolbar>
                    {drawers}
                  </Drawer>
                }
                  {/* Navbar for desktop expanded */}
                {
                  !xsScreen && <Drawer
                      variant="persistent"
                      sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { 
                          boxSizing: 'border-box', 
                          width: drawerWidth, 
                          overflowY: 'unset', 
                          borderRight: 'none',
                          height:'calc(100% - 80px)',
                          marginTop:'80px',
                        },
                      }}
                      open={mobileOpen}
                    >
                      {drawers}
                    </Drawer>
                }
                {/* Navbar for desktop colapsed */}
                {
                  !xsScreen && <Drawer
                    variant="persistent"
                    sx={{
                      display: { xs: 'none', sm: 'block' },
                      '& .MuiDrawer-paper': { 
                        boxSizing: 'border-box', 
                        width: 78, 
                        overflowY: 'unset', 
                        borderRight: 'none',
                        height:'calc(100% - 80px)',
                        marginTop:'80px',
                      },
                    }}
                    open={!mobileOpen}
                  >
                    {miniDrawers}
                  </Drawer>
                }
              </Box>
              {/* content */}
              <Main 
                open={mobileOpen}
                sx={{ 
                  marginLeft: { sm: `calc(${mobileOpen ? drawerWidth : 78}px)`, xs: '10px'},
                  marginRight: {sm : '20px',xs : '10px'},
                  width: { sm: `calc(100% - ${mobileOpen ? drawerWidth + 20 : 98}px - 40px)`, xs: 'calc(100% - 40px)' }, 
                  flexGrow: 1, 
                  p: '20px', 
                  display: 'flex', 
                  flexDirection: 'column',
                  gap: '10px',
                  marginTop: '80px',
                  backgroundColor: '#eef2f6',
                  borderTopLeftRadius: {sm: '8px', xs: 'none' },
                  borderTopRightRadius: {sm: '8px', xs: 'none' }
                }}
                >
                  {children}
              </Main>
            </Container>
          </AlertsProvider>
        </ThemeProvider>
      </ConfirmProvider>
    </LocalizationProvider>
  );
}
