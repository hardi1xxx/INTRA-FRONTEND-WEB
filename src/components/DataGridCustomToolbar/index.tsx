import { Box } from "@mui/material"
import { GridToolbarQuickFilter, GridToolbarQuickFilterProps } from "@mui/x-data-grid"

const DatagridCustomToolbar = (props: GridToolbarQuickFilterProps) => {
    return(
        <Box
        sx={{
            position: 'absolute',
            top: '-52px',
            width: {sm: 'auto', xs: '50%'}
        }}
        >
            <GridToolbarQuickFilter {...props} variant="outlined" size="small" debounceMs={500}/>
        </Box>
    )
}

export default DatagridCustomToolbar