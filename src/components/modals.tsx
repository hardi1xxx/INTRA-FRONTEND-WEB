import { Box, Modal, SxProps, Theme, Typography } from "@mui/material"
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import React from "react";

interface IModals{
    children: React.ReactNode,
    open: boolean,
    title: string,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    width?: string|number
}

const BoxContainer : SxProps<Theme> = {
    height: '100vh',
    width: '100vw',
    position: 'absolute',
    top: 0,
    left: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
}

const BoxModal : SxProps<Theme> = {
    bgcolor: 'background.paper',
    boxShadow: 24,
    margin: '0px 10px',
    maxWidth: '100%',
    p: 2,
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
}

const ModalTitleContainer : SxProps<Theme> = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
}

const Modals = ({children,open,title,setOpen,width}: IModals) => {
    return(
        <Modal
            open={open}
            onClose={() => setOpen(false)}
        >
            <Box sx={BoxContainer}>
                <Box sx={{...BoxModal,width: {sm: width || 'auto', xs: 'calc(100% - 2rem)'}}}>
                    <Box sx={ModalTitleContainer}>
                        <Typography style={{fontWeight: '500', fontSize: '20px'}}>{title}</Typography>
                        <IconButton aria-label="delete" onClick={() => setOpen(false)}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    {children}
                </Box>
            </Box>
        </Modal>
    )
}

export default Modals