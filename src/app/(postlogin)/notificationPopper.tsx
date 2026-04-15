import { Avatar, Box, Button, Card, CardActions, Chip, Divider, Grid, IconButton, Link, List, ListItem, ListItemIcon, ListItemText, Paper, Popper, Stack, Tooltip, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonIcon from '@mui/icons-material/Person';
import { useDispatch, useSelector } from "react-redux";
import { ALL_NOTIFICATIONS, GET_UNREAD_NOTIFICATIONS, READ_NOTIFICATIONS } from "@/lib/redux/types";
import { RootState } from "@/lib/redux/store";
import { timeDiff } from "@/components/helper";
import NoRowsOverlay from "@/components/DatagridOverlay/NoRowsOverlay";
import { redirect, useRouter } from "next/navigation";

const NotificationPopper = () => {
    const dispatch = useDispatch()
    const router = useRouter()
    const {auth} = useSelector((state: RootState) => state.auth)
    const {notifications} = useSelector((state: RootState) => state.notifications)
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    // set anchor element for dropdown on click button notification
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    };

    // init notification data on page load
    useEffect(() => {
        dispatch({type: GET_UNREAD_NOTIFICATIONS})
    },[])

    const open = Boolean(anchorEl);
    const id = open ? 'notification-popper' : undefined;

    // set notification to read 
    useEffect(() => {
        if(!open && notifications.length > 0){
            dispatch({type: READ_NOTIFICATIONS})
        }
    },[open])

    return(
        <>
            <Tooltip title="Notification">
                <IconButton
                aria-describedby={id}
                color="error"
                aria-label="notification"
                onClick={handleClick}
                edge="start"
                sx={{ borderRadius: '8px', backgroundColor: '#17a2b8', color: 'white', '&:hover': {backgroundColor: '#138496'}}}
                
                >
                    <NotificationsIcon/>
                    <Box position={'absolute'} top={'-5px'} right={'-5px'} display={notifications.length > 0 ? 'flex' : 'none'} zIndex={5}>
                        <Chip variant="filled" color="error" label={notifications.length} size="small"/>
                    </Box>
                </IconButton>
            </Tooltip>
            <Popper
                id={id}
                open={open}
                anchorEl={anchorEl}
                sx={{zIndex: 9999}}
            >
                <Box sx={{maxWidth: '300px', width: {sm: '300px', xs: '100%'}}}>
                    <Paper elevation={0} sx={{zIndex: '1'}}>
                        <Card sx={{
                            border: 'none rgba(224, 224, 224, 0.596)',
                            boxShadow: 'rgba(0, 0, 0, 0.2) 0px 8px 10px -5px, rgba(0, 0, 0, 0.14) 0px 16px 24px 2px, rgba(0, 0, 0, 0.12) 0px 6px 30px 5px',
                            borderRadius: '8px'
                        }}>
                            <Grid container>
                                <Grid item xs={12} container padding={'16px 16px 0px 16px'}>
                                    <Grid item xs={6}>
                                        <Stack direction={'row'} alignItems={'center'} gap={'8px'}>
                                            <Typography variant="h6">All Unread Notification</Typography>
                                        </Stack>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} sx={{maxHeight: 'calc(100vh - 300px)', overflow: 'auto'}}>
                                    {
                                        notifications.map((value) => (
                                            <List key={'notification-'+value.id}>
                                                <ListItem
                                                    secondaryAction={<Typography variant="caption">{timeDiff(value.created_at,new Date())}</Typography>}
                                                    sx={{
                                                        '&>.MuiListItemSecondaryAction-root' : {
                                                            top: '0'
                                                        }
                                                    }}
                                                >
                                                    <ListItemIcon sx={{paddingRight: '8px'}}>
                                                        <Avatar>
                                                            {
                                                                value.picture != null ? <img src={`${value.picture}?t=${(new Date()).getTime()}`} style={{ width: 40, height: 40, borderRadius: '100%' }} alt={value.user_nik} /> : <PersonIcon width={40} />
                                                            }
                                                        </Avatar>
                                                    </ListItemIcon>
                                                    <ListItemText 
                                                        primary={<Typography variant="body1">{value.user_name}</Typography>}
                                                        secondary={<Typography variant="subtitle2">{value.description}</Typography>}
                                                    />
                                                </ListItem>
                                                <Divider />
                                            </List>
                                        ))
                                    }
                                    {
                                        notifications.length == 0 && <Box width={'100%'}>
                                            <NoRowsOverlay />
                                        </Box>
                                    }
                                </Grid>
                            </Grid>
                            <CardActions sx={{padding: '10px', display: 'flex',alignItems: 'center', justifyContent: 'center'}}>
                                <Button color="primary" type="button" size="small" onClick={() => router.push('/notifications')}>View All Notifications</Button>
                            </CardActions>
                        </Card>
                    </Paper>
                </Box>
            </Popper> 
        </>
    )
}

export default NotificationPopper