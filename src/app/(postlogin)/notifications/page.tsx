/* eslint-disable @next/next/no-img-element */
'use client'

import MainPage from "@/components/MainPage"
import { Avatar, Box, CircularProgress, Divider, Grid, List, ListItem, ListItemIcon, ListItemText, Typography } from "@mui/material"
import { DataNotificationType } from '@/lib/services/notifications'
import { useEffect, useState } from "react"
import { timeDiff } from "@/components/helper"
import NoRowsOverlay from "@/components/DatagridOverlay/NoRowsOverlay"
import { getAllNotifications, getNotifications } from "@/lib/services"
import PersonIcon from '@mui/icons-material/Person'
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/lib/redux/store"
import { errorHandler } from "@/lib/redux/sagas/errorHandler"
import { setTextNotification } from "@/lib/redux/slices/notification"

const NotificationPage = () => {
    const { auth } = useSelector((state: RootState) => state.auth)
    const [notifications, setNotifications] = useState<DataNotificationType[]>([])
    const timestamp = (new Date()).getTime()
    const dispatch = useDispatch()
    const [isLoading, setIsLoading] = useState<boolean>(false)

    // load all notification on page load
    useEffect(() => {
        setIsLoading(true)
        const call = async () => {
            try {
                let res = []
                if (auth.role === 'Superadmin') {
                    res = await getAllNotifications(true)
                } else {
                    res = await getNotifications()
                }
                setNotifications(res)
                setIsLoading(false)
            } catch (error: any) {
                const { message, statusCode } = errorHandler(error)
                dispatch(setTextNotification({ text: message, severity: "error", responseCode: statusCode }))
                setIsLoading(false)
            }
        }

        call()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <MainPage
            title="All Notification"
        >
            <Box
                sx={{
                    backgroundColor: 'white'
                }}
                display={'flex'}
                flexDirection={'column'}
                width={'calc(100% - 40px)'}
                height={'calc(100vh - 400px)'}
                overflow={'auto'}
                p={'20px'}
                borderRadius={'8px'}
                gap={'1rem'}
                flexGrow={1}
            >
                <Grid container sx={{ height: '100%' }}>
                    <Grid item xs={12}>
                        {
                            // list of notification
                            notifications.map((value, index) => (
                                <List key={'notification-all-' + value.id}>
                                    <ListItem
                                        secondaryAction={<Typography variant="caption">{timeDiff(value.created_at, new Date())}</Typography>}
                                        sx={{
                                            '&>.MuiListItemSecondaryAction-root': {
                                                top: '0'
                                            }
                                        }}
                                    >
                                        <ListItemIcon sx={{ paddingRight: '8px' }}>
                                            <Avatar>
                                                {
                                                    value.picture != null ? <img src={`${value.picture}?t=${timestamp}`} style={{ width: 40, height: 40, borderRadius: '100%' }} alt={value.user_nik} /> : <PersonIcon width={40} />
                                                }
                                            </Avatar>
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={<Typography variant="body1">{value.user_name}</Typography>}
                                            secondary={<Typography variant="subtitle2">{value.description}</Typography>}
                                        />
                                    </ListItem>
                                    {
                                        notifications.length - 1 != index && <Divider />
                                    }

                                </List>
                            ))
                        }
                        {
                            // show no data found when data is empty
                            notifications.length == 0 && !isLoading && <Box width={'100%'}
                                sx={{ height: '100%' }}
                                display={'flex'}
                                alignItems={'center'}
                                justifyContent={'center'}
                            >
                                <NoRowsOverlay />
                            </Box>
                        }
                        {
                            // show loading indicator
                            isLoading && <Box width={'100%'}
                                sx={{ height: '100%' }}
                                display={'flex'}
                                alignItems={'center'}
                                justifyContent={'center'}
                            >
                                <CircularProgress size={50} />
                            </Box>
                        }
                    </Grid>
                </Grid>
            </Box>
        </MainPage>
    )
}

export default NotificationPage