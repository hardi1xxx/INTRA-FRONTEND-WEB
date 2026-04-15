import { Avatar, Box, Button, Card, CardActions, Chip, Divider, Grid, IconButton, Link, List, ListItem, ListItemIcon, ListItemText, Paper, Popper, Stack, Tooltip, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import BrowserUpdatedIcon from '@mui/icons-material/BrowserUpdated';
import PersonIcon from '@mui/icons-material/Person';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { GET_SYSTEM_UPDATE } from "@/lib/redux/types";
import { dateTimeFormat } from "@/components/helper";
import NoRowsOverlay from "@/components/DatagridOverlay/NoRowsOverlay";

const SystemUpdatePopper = () => {
    const { results } = useSelector((state: RootState) => state.systemUpdate)
    const dispatch = useDispatch()
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    // set anchor element for dropdown on click button system update
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'notification-popper' : undefined;

    // get data system update from backend
    useEffect(() => {
        if (open) {
            dispatch({ type: GET_SYSTEM_UPDATE })
        }
    }, [open])

    return (
        <>
            <Tooltip title="System Update">
                <IconButton
                    aria-describedby={id}
                    color="primary"
                    aria-label="update"
                    onClick={handleClick}
                    edge="start"
                    sx={{ borderRadius: '8px', backgroundColor: '#007bff', color: 'white', '&:hover': { backgroundColor: '#0069d9' } }}
                >
                    <BrowserUpdatedIcon />
                </IconButton>
            </Tooltip>
            <Popper
                id={id}
                open={open}
                anchorEl={anchorEl}
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
                                    {results.length > 0 ? results.map((item: {
                                        date_update: string;
                                        modul: string;
                                        keterangan: string;
                                    }, index: number) => {
                                        return (
                                            <List key={index} sx={{ paddingY: '0px' }}>
                                                <ListItem sx={{ paddingY: '10px' }}>
                                                    <ListItemText
                                                        primary={<Typography variant="body1">{dateTimeFormat(item.date_update)}</Typography>}
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
        </>
    )
}

export default SystemUpdatePopper