/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import { Dialogs } from "@/components/dialog"
import { RootState } from "@/lib/redux/store"
import { GET_USER_BY_ID } from "@/lib/redux/types"
import { Box, Grid, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

type DetailUserType = {
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    id?: number
}

const DetailUser = ({ open, setOpen, id }: DetailUserType) => {
    const dispatch = useDispatch()
    const { fetchingDetail, user } = useSelector((state: RootState) => state.user)
    const [errorImageSign, setErrorImageSign] = useState<boolean>(false)

    useEffect(() => {
        if (open) {
            setErrorImageSign(false)
            dispatch({ type: GET_USER_BY_ID, id: id ?? 0 })
        }
    }, [open])

    return <Dialogs
        open={open}
        setOpen={setOpen}
        title="Detail User"
    >
        <Grid container spacing={'1rem'}>
            <Grid item xs={12} sm={6} md={4}>
                <Typography color={'grey'}>NIK</Typography>
                <Typography>{fetchingDetail ? 'Loading' : user?.nik ?? "-"}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <Typography color={'grey'}>Name</Typography>
                <Typography>{fetchingDetail ? 'Loading' : user?.name ?? "-"}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <Typography color={'grey'}>Role</Typography>
                <Typography>{fetchingDetail ? 'Loading' : user?.role_name ?? "-"}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <Typography color={'grey'}>Email</Typography>
                <Typography>{fetchingDetail ? 'Loading' : user?.email ?? "-"}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <Typography color={'grey'}>Phone Number</Typography>
                <Typography>{fetchingDetail ? 'Loading' : user?.phone_number ?? "-"}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <Typography color={'grey'}>Job Position</Typography>
                <Typography>{fetchingDetail ? 'Loading' : user?.job_position_name ?? "-"}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <Typography color={'grey'}>Departement</Typography>
                <Typography>{fetchingDetail ? 'Loading' : user?.departement_name ?? "-"}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <Typography color={'grey'}>Is Web?</Typography>
                {/* <Typography>{fetchingDetail ? 'Loading' : (user?.is_web ? 'Yes' : 'No') ?? "-"}</Typography> */}
                <Typography>{fetchingDetail ? 'Loading' : (user == null ? '-' : user?.is_web ? 'Active' : 'Inactive')}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <Typography color={'grey'}>Is App?</Typography>
                {/* <Typography>{fetchingDetail ? 'Loading' : (user?.is_app ? 'Yes' : 'No') ?? "-"}</Typography> */}
                <Typography>{fetchingDetail ? 'Loading' : (user == null ? '-' : user?.is_app ? 'Active' : 'Inactive')}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <Typography color={'grey'}>Profile Picture</Typography>
                {
                    fetchingDetail ? <Typography>Loading</Typography> : user?.picture != null
                        ? <Box
                            alignItems={"left"}
                            display={'flex'}
                            flexDirection={'column'}
                            gap={'1rem'}>
                            <img src={((process.env.NEXT_PUBLIC_TARGET_API)?.replace('/api', '/storage/') + (user.picture || ''))}
                                style={{
                                    objectFit: 'cover',
                                    objectPosition: 'bottom',
                                    maxWidth: 'calc(100vh - 800px)',
                                    maxHeight: 'calc(100vh - 800px)',
                                }}
                                alt="Profile Pic" />
                        </Box>
                        : <Typography>-</Typography>
                }
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <Typography color={'grey'}>Picture Sign</Typography>
                {
                    fetchingDetail ? <Typography>Loading</Typography> : user?.picture_sign != null && !errorImageSign
                        ? <Box
                            alignItems={"left"}
                            display={'flex'}
                            flexDirection={'column'}
                            gap={'1rem'}>
                            <img src={((process.env.NEXT_PUBLIC_TARGET_API)?.replace('/api', '/storage/') + (user.picture_sign || ''))}
                                style={{
                                    objectFit: 'cover',
                                    objectPosition: 'bottom',
                                    maxWidth: 'calc(100vh - 800px)',
                                    maxHeight: 'calc(100vh - 800px)',
                                }}
                                alt="Picture Sign"
                                onError={({ currentTarget }) => {
                                    currentTarget.onerror = null; // prevents looping
                                    currentTarget.src = "https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available_87543-11093.jpg";
                                    setErrorImageSign(true)
                                }} />
                        </Box>
                        : <Typography>-</Typography>
                }
            </Grid>
        </Grid>
    </Dialogs>
}

export default DetailUser