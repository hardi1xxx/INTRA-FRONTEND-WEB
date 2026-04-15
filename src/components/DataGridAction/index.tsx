import { IconButton, Menu, MenuItem } from "@mui/material";
import { MouseEvent, useState } from "react";
import MoreVertIcon from '@mui/icons-material/MoreVert';

type DataGridActionType = {
    item: {
        text: string,
        onClick : (event : MouseEvent<HTMLLIElement>) => void
    }[]
}

const DataGridAction = ({item} : DataGridActionType) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    
    return(
        <div>
            <IconButton
                aria-controls={open ? 'more-action' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
            >
                <MoreVertIcon />
            </IconButton>
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
                    item.map((value, index) => (
                        <MenuItem key={index} onClick={(event) => {
                            value.onClick(event)
                            handleClose()
                        }}>{value.text}</MenuItem>
                    ))
                }
            </Menu>
        </div>
  
    )
}

export default DataGridAction