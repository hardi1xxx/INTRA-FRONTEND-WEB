import { Box, Dialog, DialogContent, DialogTitle, IconButton, Slide, SxProps, useMediaQuery } from "@mui/material"
import { Breakpoint, useTheme } from '@mui/material/styles';
import { TransitionProps } from "@mui/material/transitions";
import { GridCloseIcon } from "@mui/x-data-grid";
import React from "react";

interface IDialogs {
    children: React.ReactNode,
    open: boolean,
    title: string,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    dialogWidth?: false | Breakpoint 
}

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const TransitionFromLeft = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="left" ref={ref} {...props} />;
});

export const Dialogs = ({ children, open, title, setOpen, dialogWidth = 'sm' }: IDialogs) => {
    const theme = useTheme()
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const dialogTitleStyle = {
        fontSize: '16px',
        fontWeight: 'bold'
    }

    const sx: SxProps = {
        "& .MuiDialog-container": {
            alignItems: "flex-start"
        }
    }

    const onClose = () => {
        setOpen(false)
    }

    return (
        <Dialog
            open={open}
            maxWidth={dialogWidth}
            fullWidth
            fullScreen={fullScreen}
            TransitionComponent={fullScreen ? TransitionFromLeft : Transition}
            sx={sx}
            disableScrollLock={true}
        >
            <DialogTitle>
                <Box display="flex" alignItems="center">
                    <Box flexGrow={1} style={dialogTitleStyle}>{title}</Box>
                    <Box>
                        <IconButton onClick={onClose}>
                            <GridCloseIcon />
                        </IconButton>
                    </Box>
                </Box>
            </DialogTitle>
            <DialogContent>{children}</DialogContent>
        </Dialog>
    )
}