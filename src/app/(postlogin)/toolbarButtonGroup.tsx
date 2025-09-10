import { Box, CircularProgress, IconButton, Tooltip } from "@mui/material"
import { useEffect, useState } from "react"
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import Logout from '@mui/icons-material/Logout';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { LOGOUT } from "@/lib/redux/types";
import { useConfirm } from "material-ui-confirm";
import NotificationPopper from "./notificationPopper";
import SystemUpdatePopper from "./systemUpdatePopper";

const ToolbarButtonGroup = () => {
    const confirm = useConfirm()
    const [fullScreen, setFullScreen] = useState(false)
    const {fetching} = useSelector((state:RootState) => state.auth)

    const dispatch = useDispatch()

    // process fullscreen
    useEffect(() => {
        let fullScreenElement
        if(fullScreen){
          fullScreenElement = document.body.requestFullscreen()
        }else{
          if(document.fullscreenElement){
            document.exitFullscreen()
          }
        }
    },[fullScreen])

    // logout process
    const handleLogout = async () => {
        confirm({
        title: 'Confirmation',
        description: 'Are you sure to logout'
        }).then(() => {
        dispatch({type: LOGOUT})
        })    
    }

    return(
        <Box display={'flex'} gap={'1rem'}>
            <SystemUpdatePopper />
            {/* <NotificationPopper /> */}
            <Tooltip title="Toogle Fullscreen Mode">
                <IconButton
                color="primary"
                aria-label="fullscreen"
                onClick={() => setFullScreen(!fullScreen)}
                edge="start"
                sx={{ borderRadius: '8px', backgroundColor: '#2d50b0', color: 'white', '&:hover': {backgroundColor: '#223c85'}}}
                >
                {
                    fullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />
                }
                </IconButton>
            </Tooltip>
            <Tooltip title="Logout">
                <IconButton
                color="error"
                aria-label="logout"
                onClick={handleLogout}
                disabled={fetching}
                edge="start"
                sx={{ borderRadius: '8px', backgroundColor: '#dc3545', color: 'white', '&:hover': {backgroundColor: '#c82333'}}}
                >
                    {fetching ? <CircularProgress size={'1rem'}/> : <Logout />}
                </IconButton>
            </Tooltip>
        </Box>
    )
}

export default ToolbarButtonGroup