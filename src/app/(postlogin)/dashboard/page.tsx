import { Box, Typography } from "@mui/material"

// default page after login
const DashboardPage = () => {
    
    return(
        <Box display={'flex'} alignItems={'center'} justifyContent={'center'} flexDirection={'column'} height={'100%'} flexGrow={1} gap={'1rem'}>
            <img src="/images/log.png" style={{width: '420px', maxWidth: '100%'}}/>
            <Typography fontWeight={'bold'} variant="h3">INTRA - Integration Tracking System</Typography>
        </Box>
    )
}

export default DashboardPage