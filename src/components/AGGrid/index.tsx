// ag grid
import { AgGridReact, AgGridReactProps } from 'ag-grid-react';
import { Box, Grid, MenuItem, Pagination as MuiPagination, styled, Select, SelectChangeEvent, TextField, Typography, useMediaQuery, useTheme } from '@mui/material';
import { ColDef, SortChangedEvent } from 'ag-grid-community';
import { useEffect, useMemo, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

const StyledPagination = styled(MuiPagination)(({ theme }) => ({
    "& .MuiPaginationItem-root": {
        [theme.breakpoints.down("md")]: {
            height: "1.8rem",
            width: "1.8rem"
        }
    }
}));

export type CustomAGGridProps = {
    serverSideMode?: boolean,
    gridRef: React.RefObject<AgGridReact<any>>,
    onServerSidePropsChange?: ({ start, length, order, search }: { start: number, length: number, order: string, search: string }) => void,
    showTotalData?: boolean,
    totalData: number,
    isLoading: boolean,
    showSearchInput?: boolean,
}

const AGGrid = ({ ...props }: (AgGridReactProps) & CustomAGGridProps) => {
    const [length, setLength] = useState<number | null>(null)
    const [page, setPage] = useState<number>(1)
    const [paginationTotalPage, setPaginationTotalPage] = useState<number | null>(null)
    const [search, setSearch] = useState<string>('')
    const [order, setOrder] = useState<string | undefined>('')
    const [isReadyGrid, setIsReadyGrid] = useState<boolean>(false)
    const theme = useTheme()
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'))

    const onChangePageSize = (event: SelectChangeEvent<number>) => {
        setLength(event.target.value as number);
        props.gridRef.current!.api.setGridOption(
            "paginationPageSize",
            event.target.value as number,
        );
    };

    const onChangePagination = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
        props.gridRef.current!.api.paginationGoToPage(value - 1)
    };

    const onChangeSearch = useDebouncedCallback(
        async (event: React.ChangeEvent<HTMLInputElement>) => {
            props.gridRef.current!.api.setGridOption(
                "quickFilterText",
                event.target.value,
            );

            if (!props.serverSideMode) {
                setPaginationTotalPage(props.gridRef.current!.api.paginationGetTotalPages())
            }
            setPage(1)
            props.gridRef.current!.api.paginationGoToPage(0)
            setSearch(event.target.value)
        }, 500
    );

    const onSortChanged = (event: SortChangedEvent) => {
        setOrder(event.columns?.map((value) => `${value.getColId()},${value.getSort()}`).join('|'))
    };

    useEffect(() => {
        const params = {
            start: ((page - 1) * (length ?? (props.paginationPageSize ?? 10))),
            length: (length ?? (props.paginationPageSize ?? 10)),
            search: search,
            order: order ?? '',
        }

        if (props.serverSideMode && props.onServerSidePropsChange) {
            props.onServerSidePropsChange(params)
        }
    }, [length, page, search, order])

    useEffect(() => {
        if (isReadyGrid) {
            if (props.isLoading) {
                props.gridRef.current?.api.showLoadingOverlay()
            } else {
                if (props.rowData && props.rowData!.length > 0) {
                    props.gridRef.current?.api.hideOverlay()
                }
            }
            setOrder(props.gridRef.current?.api.getColumnState().filter((item) => item.sort != null).map((value) => `${value.colId},${value.sort}`).join('|'))
        }
    }, [isReadyGrid, props.isLoading])

    const defaultColDef = useMemo<ColDef>(() => {
        return {

        };
    }, []);
    
    return (
        <Box
            flexGrow={1}
            height={'380px'}
            minHeight={'380px'}
            sx={{
                fontFamily: "'Roboto',sans-serif",
            }}
        >
            <Box
                className="ag-theme-quartz"
                sx={{ height: { md: '82%', lg: '87%', xs: '75%' }, position: 'relative' }}
            >
                {props.showSearchInput && <div>
                    <TextField
                        variant="outlined"
                        placeholder="Search"
                        size="small"
                        sx={{
                            position: 'absolute',
                            top: '-52px'
                        }}
                        onChange={onChangeSearch}
                    />
                </div>}
                <AgGridReact
                    {...props}
                    ref={props.gridRef}
                    pagination
                    suppressPaginationPanel
                    paginationPageSize={props.paginationPageSize ?? 10}
                    paginationPageSizeSelector={props.paginationPageSizeSelector ?? [10, 50, 100]}
                    defaultColDef={defaultColDef}
                    onSortChanged={onSortChanged}
                    overlayLoadingTemplate={'<div aria-live="polite" aria-atomic="true" style="position:absolute;top:0;left:0;right:0; bottom:0; background: url(https://ag-grid.com/images/ag-grid-loading-spinner.svg) center no-repeat" aria-label="loading"></div>'}
                    overlayNoRowsTemplate={'<span aria-live="polite" aria-atomic="true" style="padding: 10px;">No Data Found</span>'}
                    onGridReady={(params) => {
                        setIsReadyGrid(true)
                    }}
                    animateRows={!props.serverSideMode}
                />
                <Grid container spacing={'1rem'} sx={{ marginTop: '5px' }}>
                    <Grid item xs={12} md={5}>
                        <Grid container display="flex" alignItems="center" spacing={'1rem'}>
                            <Grid item xs={12} display="flex" justifyContent={{ xs: 'center', md: 'start' }} alignItems="center">
                                <Box>
                                    <Box
                                        sx={{
                                            display: 'inline-block',
                                            paddingLeft: '10px',
                                            paddingRight: '10px'
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                display: 'inline-block',
                                                marginRight: '10px'
                                            }}
                                        >
                                            Rows
                                        </Typography>
                                        <Select variant="outlined" value={length ?? (props.paginationPageSize ?? 10)} size="small" onChange={onChangePageSize}>
                                            {props.paginationPageSizeSelector != null ? (props.paginationPageSizeSelector as number[]).map((item: number) => <MenuItem key={item} value={item}>{item}</MenuItem>) : [10, 50, 100].map((item: number) => <MenuItem key={item} value={item}>{item}</MenuItem>)}
                                        </Select>
                                    </Box>
                                    <Typography
                                        sx={{
                                            display: 'inline-block',
                                            paddingLeft: '10px',
                                            marginTop: isSmallScreen ? '10px' : '0px'
                                        }}
                                    >
                                        Total Data: {props.totalData}
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} md={7}>
                        <Box display={'flex'} justifyContent={{ xs: 'center', md: 'end' }} width={'100%'} gap={'1rem'}>
                            <StyledPagination page={page} onChange={onChangePagination} count={paginationTotalPage ?? Math.ceil(props.totalData / (length ?? (props.paginationPageSize ?? 10)))} color="primary" shape='rounded' siblingCount={isSmallScreen ? 0 : 1} />
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    )
}

export default AGGrid