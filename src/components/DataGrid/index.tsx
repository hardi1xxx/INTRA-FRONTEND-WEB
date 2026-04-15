import { TablePaginationProps, Typography, styled } from "@mui/material";
import { DataGrid, DataGridProps, GridFilterModel, GridPagination, GridPaginationModel, GridSortModel, gridFilteredTopLevelRowCountSelector, gridPageSizeSelector, useGridApiContext, useGridRootProps, useGridSelector } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import MuiPagination from '@mui/material/Pagination';

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
    WebkitFontSmoothing: 'auto',
    letterSpacing: 'normal',
    '& .MuiDataGrid-columnsContainer': {
        backgroundColor: theme.palette.mode === 'light' ? '#fafafa' : '#1d1d1d',
    },
    '& .MuiDataGrid-columnHeader, .MuiDataGrid-cell': {
        borderRight: `1px solid ${theme.palette.mode === 'light' ? '#f0f0f0' : '#303030'
            }`,
    },
    '& .MuiDataGrid-columnsContainer, .MuiDataGrid-cell': {
        borderBottom: `1px solid ${theme.palette.mode === 'light' ? '#f0f0f0' : '#303030'
            }`,
    },
    '& .MuiDataGrid-cell': {
        color:
            theme.palette.mode === 'light' ? 'rgba(0,0,0,.85)' : 'rgba(255,255,255,0.65)',
    },
    '& .MuiPaginationItem-root': {
        borderRadius: 0,
    },
}));

export type CustomDatagridProps = {
    isBorder?: boolean | null,
    serverSideMode?: boolean,
    onServerSidePropsChange?: ({ start, length, order, search }: { start: number, length: number, order: string, search: string }) => void,
    showTotalData?: boolean
}

const getPageCount = (rowCount: number, pageSize: number): number => {
    if (pageSize > 0 && rowCount > 0) {
        return Math.ceil(rowCount / pageSize);
    }

    return 0;
};

function Pagination({
    page,
    onPageChange,
    className,
}: Pick<TablePaginationProps, 'page' | 'onPageChange' | 'className'>) {
    const apiRef = useGridApiContext();
    const rootProps = useGridRootProps();
    const pageSize = useGridSelector(apiRef, gridPageSizeSelector);
    const visibleTopLevelRowCount = useGridSelector(
        apiRef,
        gridFilteredTopLevelRowCountSelector
    );
    const pageCount = getPageCount(
        rootProps.rowCount ?? visibleTopLevelRowCount,
        pageSize
    );

    return (
        <MuiPagination
            sx={{
                '& .MuiPaginationItem-colorPrimary': {
                    borderRadius: '5px !important'
                },
            }}
            color="primary"
            className={className}
            count={pageCount}
            page={page + 1}
            onChange={(event, newPage) => {
                onPageChange(event as any, newPage - 1);
            }}
        />
    );
}

function CustomPagination(props: any) {
    return <GridPagination ActionsComponent={Pagination} {...props} labelRowsPerPage="Rows" />;
}

const CustomDataGrid = ({ ...props }: (DataGridProps) & CustomDatagridProps) => {
    const [paginationModel, setPaginationModel] = useState<GridPaginationModel>(props.initialState?.pagination?.paginationModel as GridPaginationModel)
    const [sortModel, setSortModel] = useState<GridSortModel>([])
    const [filterModel, setFilterModel] = useState<GridFilterModel>({ items: [], quickFilterValues: [] })

    if (props.isBorder == null) {
        props.isBorder = true
    }

    let serverSideProps = {}

    if (props.serverSideMode) {
        serverSideProps = {
            paginationMode: 'server',
            paginationModel: paginationModel,
            onPaginationModelChange: setPaginationModel,
            sortingMode: 'server',
            sortModel: sortModel,
            onSortModelChange: setSortModel,
            filterMode: 'server',
            filterModel: filterModel,
            onFilterModelChange: (model: GridFilterModel) => setFilterModel(model)
        }
    } else {
        serverSideProps = {
            sortingMode: 'client',
            filterMode: 'client',
            paginationMode: 'client'
        }
    }

    useEffect(() => {
        const param = {
            start: (paginationModel?.page || 0) * (paginationModel?.pageSize || 1),
            length: paginationModel?.pageSize || 1,
            search: (filterModel.quickFilterValues || []).length > 0 ? (filterModel.quickFilterValues || []).join(' ') : '',
            order: sortModel.map((value) => `${value.field},${value.sort}`).join('|')
        }
        if (props.onServerSidePropsChange && props.serverSideMode) {
            props.onServerSidePropsChange(param)
        }
    }, [paginationModel, sortModel, filterModel])

    return (
        <>
            {props.isBorder ?
            <StyledDataGrid
                {...props}
                {...serverSideProps}
                slots={{
                    ...props.slots,
                    pagination: CustomPagination,
                }}
                sx={{
                    '& .MuiTablePagination-displayedRows': {
                        display: 'none !important'
                    },
                    '& .MuiTablePagination-root': {
                        width: '100% !important',
                        position: 'relative'
                    },
                    '& .MuiTablePagination-selectLabel': {
                        position: "absolute"
                    },
                    '& .MuiTablePagination-input': {
                        position: "absolute",
                        left: "55px"
                    },
                    '& .MuiDataGrid-footerContainer': {
                        height: '50px !important'
                    }
                }}
            />
            : <DataGrid
                {...props}
                {...serverSideProps}
                slots={{
                    ...props.slots,
                    pagination: CustomPagination,

                }}
                pageSizeOptions={[10, 15, 20]}
                sx={{
                    '& .MuiTablePagination-displayedRows': {
                        display: 'none !important'
                    },
                    '& .MuiTablePagination-root': {
                        width: '100% !important',
                        position: 'relative'
                    },
                    '& .MuiTablePagination-selectLabel': {
                        position: "absolute"
                    },
                    '& .MuiTablePagination-input': {
                        position: "absolute",
                        left: "55px"
                    },
                    '& .MuiDataGrid-footerContainer': {
                        height: '50px !important'
                    }
                }}
            />}
            {props.showTotalData && <Typography
                sx={{
                    position: 'relative',
                    top: '-36px',
                    left: '135px',
                    display: 'inline-block'
                }}
            >
                Total Data: {props.rowCount ?? props.rows.length}
            </Typography>}
        </>
    )
}

export * from "@mui/x-data-grid"

export default CustomDataGrid