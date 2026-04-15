'use client'


import Box from '@mui/material/Box';
import { Card, CardContent, Grid } from '@mui/material';
import Typography from '@mui/material/Typography';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { RootState } from '@/lib/redux/store';
import FormLogin from './form';
import { useSnackbar } from '@/components/hooks';
import { useRouter } from 'next/navigation'

const CardContainer = styled(Grid)(({ theme }) => ({
    [theme.breakpoints.down('md')]: {
        paddingTop: '2rem',
    },
    [theme.breakpoints.up('md')]: {
        paddingTop: '112.5px',
    }
}));

const BoxLogin = styled(Box)(({ theme }) => ({
    [theme.breakpoints.down('md')]: {
        padding: '0px',
        width: '100%'
    },
    [theme.breakpoints.up('md')]: {
        padding: '0px 60px',
        width: 'calc(100% - 120px)'
    }
}));

const AppLogo = styled(`img`)(({theme}) => ({
    [theme.breakpoints.down('md')]: {
        width: '80%'
    },
    [theme.breakpoints.up('md')]: {
        width: '100%'
    }
}))
  


const LoginPage = () => {
    const router = useRouter()
    const snackbar = useSnackbar()
    const {text,severity} = useSelector((state: RootState) => state.notification)

    // if login success redirect to dashboard
    useEffect(() => {
        const showSnackbar = async () => {
            if(text){
                if(severity == 'success'){
                    const res = await snackbar.show(text,severity,500)
                    if(res){
                        window.location.href = '/dashboard'
                    }
                }
                
                if(severity == 'error'){
                    snackbar.show(text,severity,2000)
                }
            }
        }

        showSnackbar()

        return () => {

        }
    },[severity])
        
    return(
        <Grid container minHeight={'100%'} height={'100vh'} className='bg-theme-secondary'>
            <CardContainer container item xs={12} display={'flex'} alignItems={'start'} pt={'112.5px'} justifyContent={'center'}>
                <Card sx={{borderRadius: '15px',maxWidth:'855px'}}>
                    <CardContent>
                        <Grid container item  xs={12} display={'flex'} alignItems={'center'} justifyContent={'center'}>
                            <Grid item lg={6} xs={12} textAlign={'center'}>
                                <Typography variant='h6' component={'h6'} fontWeight={'bold'}>INTRA - Integration Tracking System</Typography>
                                <Typography variant='caption' color={'lightslategray'} fontSize={'0.5rem'}>Development Version 0.0.1</Typography>
                            </Grid>
                            <Grid item lg={6} xs={12} textAlign={'center'}>
                                <figure>
                                    <img src="/images/logo2.png" style={{ width: '260px'}}/>
                                </figure>
                            </Grid>
                        </Grid>
                        <Grid container item  xs={12} display={'flex'} alignItems={'center'} justifyContent={'center'}>
                            <Grid item lg={6} textAlign={'center'}>
                                <AppLogo src="/images/intra.jpg" style={{maxWidth: '500px'}}/>
                            </Grid>
                            <Grid item lg={6} display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'} width={'100%'}>
                                <BoxLogin textAlign={'center'}>
                                    <Typography variant='h6' component={'h6'} fontWeight={'bold'} textAlign={'center'} marginBottom={'1rem'}>Welcome to application,</Typography>
                                    <Typography variant='subtitle1' fontWeight={'bold'} className='text-theme' mb={0}>User Login</Typography>
                                    <Typography variant='caption' color={'lightslategray'} fontSize={'0.5rem'} mb={'1rem'}>Please log in to continue</Typography>

                                    <FormLogin />
                                </BoxLogin>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </CardContainer>
        </Grid>
    )
}

export default LoginPage