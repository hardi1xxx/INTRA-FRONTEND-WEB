import { Box, Card, Chip, CircularProgress, ClickAwayListener, Divider, Grid, IconButton, List, ListItem, ListItemText, Paper, Popper, Tooltip, Typography } from "@mui/material"
import { useEffect, useRef, useState } from "react"
import BrowserUpdatedIcon from '@mui/icons-material/BrowserUpdated';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { GET_SYSTEM_UPDATE } from "@/lib/redux/types";
import { dateTimeFormatWithoutSecond } from "@/components/helper";
import NoRowsOverlay from "@/components/DatagridOverlay/NoRowsOverlay";

const SystemUpdatePopper = () => {
    const { results, fetching } = useSelector((state: RootState) => state.systemUpdate)
    const dispatch = useDispatch()
    const [open, setOpen] = useState(false);
    const [read, setRead] = useState<boolean>(false);
    const notificationButton = useRef(null);

    const id = open ? 'notification-popper' : undefined;

    // get data system update from backend
    useEffect(() => {
        dispatch({ type: GET_SYSTEM_UPDATE })
    }, [dispatch])

    // set read is true
    useEffect(() => {
        if (open && results.length > 0) {
            setRead(true);
        }
    }, [open, results, setRead])

    return (
        <>
            <Tooltip title="System Update">
                <IconButton
                    aria-describedby={id}
                    color="primary"
                    aria-label="update"
                    onClick={() => setOpen(true)}
                    edge="start"
                    ref={notificationButton}
                    sx={{ borderRadius: '8px', backgroundColor: '#007bff', color: 'white', '&:hover': { backgroundColor: '#0069d9' } }}
                >
                    <BrowserUpdatedIcon />
                    <Box position={'absolute'} top={'-5px'} right={'-5px'} display={results.length > 0 && !read ? 'flex' : 'none'} zIndex={5}>
                        <Chip variant="filled" color="error" label={results.length} size="small" />
                    </Box>
                </IconButton>
            </Tooltip>
            {open &&
                <ClickAwayListener onClickAway={() => setOpen(false)}>
                    <Popper
                        id={id}
                        open={open}
                        anchorEl={notificationButton.current}
                        sx={{ zIndex: 9999 }}
                    >
                        <Box sx={{ maxWidth: '300px' }}>
                            <Paper elevation={0} sx={{ zIndex: '1' }}>
                                <Card sx={{
                                    border: 'none rgba(224, 224, 224, 0.596)',
                                    boxShadow: 'rgba(0, 0, 0, 0.2) 0px 8px 10px -5px, rgba(0, 0, 0, 0.14) 0px 16px 24px 2px, rgba(0, 0, 0, 0.12) 0px 6px 30px 5px',
                                    borderRadius: '8px'
                                }}>
                                    <Grid container>
                                        <Grid item xs={12} container padding={'16px 16px 0px 16px'}>
                                            <Grid item xs={12}>
                                                <Typography variant="h6">System Update Feature</Typography>
                                            </Grid>
                                        </Grid>
                                        <Grid item xs={12} sx={{ maxHeight: '300px', overflowX: 'auto' }}>
                                            {fetching ?
                                                <Box
                                                    width={'100%'}
                                                    sx={{ marginBottom: '10px', height: '100px' }}
                                                    display={'flex'}
                                                    alignItems={'center'}
                                                    justifyContent={'center'}
                                                >
                                                    <CircularProgress size={25} />
                                                </Box>
                                                : results.length > 0 ? results.map((item: {
                                                    date_update: string;
                                                    modul: string;
                                                    keterangan: string;
                                                }, index: number) => {
                                                    return (
                                                        <List key={index} sx={{ paddingY: '0px' }}>
                                                            <ListItem sx={{ paddingY: '10px' }}>
                                                                <ListItemText
                                                                    primary={<Typography variant="body1">{dateTimeFormatWithoutSecond(item.date_update)}</Typography>}
                                                                    secondary={<Typography variant="subtitle2">{item.keterangan} - {item.modul}</Typography>}
                                                                />
                                                            </ListItem>
                                                            {index !== results.length - 1 && <Divider />}
                                                        </List>
                                                    )
                                                }) : <Box width={'100%'} sx={{ marginBottom: '10px' }}>
                                                    <NoRowsOverlay />
                                                </Box>}
                                        </Grid>
                                    </Grid>
                                </Card>
                            </Paper>
                        </Box>
                    </Popper>

                </ClickAwayListener>}
        </>
    )
}

export default SystemUpdatePopper