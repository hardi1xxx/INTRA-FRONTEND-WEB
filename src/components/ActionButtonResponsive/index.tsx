import { Box, Button, ButtonPropsColorOverrides, ButtonPropsSizeOverrides, ButtonPropsVariantOverrides, Menu, MenuItem, SxProps, Theme } from '@mui/material';
import { OverridableStringUnion } from '@mui/types';
import { MouseEventHandler, ReactNode } from 'react';
import { useState } from "react";
import MoreVertIcon from '@mui/icons-material/MoreVert';

export type ActionButtonResponseType = {
    items: {
        text: string,
        onClick: () => void
        variant? : OverridableStringUnion<'text' | 'outlined' | 'contained', ButtonPropsVariantOverrides>
        color?: OverridableStringUnion<'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning',ButtonPropsColorOverrides>;
        type?: "submit" | "reset" | "button" | undefined
        size?: OverridableStringUnion<'small' | 'medium' | 'large', ButtonPropsSizeOverrides>
        sx? : SxProps<Theme>
        disabled?: boolean
        endIcon?: ReactNode
        startIcon?: ReactNode
    }[]
}

const ActionButtonResponsive = ({items}: ActionButtonResponseType) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return(
        <>
            <Box
                display={'flex'}
                flexDirection={'row'}
                justifyContent={'flex-end'}
                width={'100%'}
                gap={'1rem'}
                sx={{display: {md: 'flex', xs: 'none'}}}
            >
                {
                    items.map((value,index) => {
                        return(
                            <Button key={index} {...value}>
                                {value.text}
                            </Button>
                        )
                    })
                }
            </Box>
            <Box
                display={'flex'}
                flexDirection={'row'}
                justifyContent={'flex-end'}
                width={'100%'}
                gap={'1rem'}
                sx={{display: {md: 'none', xs: 'flex'}}}
            >
                <Button
                    aria-controls={open ? 'more-action' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}
                    endIcon={<MoreVertIcon />}
                    variant='contained'
                >
                    Action
                </Button>
                <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
                >
                    {
                        items.map((value, index) => (
                            <MenuItem key={index} onClick={() => {
                                value.onClick()
                                handleClose()
                            }}>{value.text}</MenuItem>
                        ))
                    }
                </Menu>
            </Box>
        </>
    )
}

export default ActionButtonResponsive