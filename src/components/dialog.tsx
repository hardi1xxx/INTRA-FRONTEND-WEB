import { Box, Dialog, DialogContent, DialogTitle, IconButton, Paper, PaperProps, Slide, SxProps, useMediaQuery } from "@mui/material"
import { Breakpoint, useTheme } from '@mui/material/styles';
import { TransitionProps } from "@mui/material/transitions";
import { GridCloseIcon } from "@mui/x-data-grid";
import Draggable from 'react-draggable';
import React from "react";

interface IDialogs {
    children: React.ReactNode,
    open: boolean,
    title: string,
    setOpen: ((open: boolean) => void),
    dialogWidth?: false | Breakpoint,
    useFullScreen?: boolean,
    onCloseAction?: () => void
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

function PaperComponent(props: PaperProps) {
    return (
        <Draggable
            handle="#draggable-dialog-title"
            cancel={'[class*="MuiDialogContent-root"]'}
        >
            <Paper {...props} />
        </Draggable>
    );
}

export const Dialogs = ({ children, open, title, setOpen, onCloseAction, dialogWidth = 'sm', useFullScreen }: IDialogs) => {
    const theme = useTheme()
    const mediumScreen = useMediaQuery(theme.breakpoints.down('md'));

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
        onCloseAction?.()
        setOpen(false)
    }

    return (
        <Dialog
            open={open}
            maxWidth={dialogWidth}
            fullWidth
            fullScreen={useFullScreen || mediumScreen}
            TransitionComponent={(useFullScreen || mediumScreen) ? TransitionFromLeft : Transition}
            sx={sx}
            disableScrollLock={true}
            PaperComponent={PaperComponent}
            aria-labelledby="draggable-dialog-title"
        >
            <DialogTitle style={{ cursor: 'move' }}>
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