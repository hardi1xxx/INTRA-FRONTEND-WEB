'use client'

import ActionButtonResponsive from "@/components/ActionButtonResponsive"
import CustomRangeDatePicker from "@/components/CustomRangeDatePicker"
import DataGrid, { CustomDatagridProps } from "@/components/DataGrid"
import DataGridAction from "@/components/DataGridAction"
import DatagridCustomToolbar from "@/components/DataGridCustomToolbar"
import NoRowsOverlay from "@/components/DatagridOverlay/NoRowsOverlay"
import MainPage from "@/components/MainPage"
import { dateTimeFormat } from "@/components/helper"
import { RootState } from "@/lib/redux/store"
import { DELETE_LOG_ACTIVITY_BY_ID, DELETE_LOG_ACTIVITY_FILTER, DOWNLOAD_ACTIVITY_BY_ID, DOWNLOAD_ACTIVITY_FILTER, GET_LOG_ACTIVITY } from "@/lib/redux/types"
import { Box, Button, CircularProgress, LinearProgress } from "@mui/material"
import { GridColDef, GridRenderCellParams, useGridApiRef } from "@mui/x-data-grid"
import dayjs from "dayjs"
import { useConfirm } from "material-ui-confirm"
import { useCallback, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

const LogActivityPage = () => {
    const [pageProps, setPageProps] = useState<{
        start: number;
        length: number;
        order: string;
      }>()

      
    const dispatch = useDispatch()
    const confirm = useConfirm()
    const { fetching, logActivity, fetchingExport, param } = useSelector((state: RootState) => state.logActivity)

    const [dateRange, setDateRange] = useState<dayjs.Dayjs[]>([dayjs(new Date()), dayjs(new Date())])

    const apiRef = useGridApiRef();
    
    // to format row number
    const getRowIndex = useCallback<(id: number) => number>(
        (id) => apiRef.current.getAllRowIds().indexOf(id) + (pageProps?.start || 0),
        [apiRef,pageProps],
    );

    // column definition for table log activity
    const columns: GridColDef[] = [
        {
          field: 'id',
          headerName: 'No.',
          width: 90,
          renderCell:(params: GridRenderCellParams<any>) => {
            return getRowIndex(params.rowNode.id as number) + 1
          }
        },
        {
            field: 'action',
            headerName: 'Action',
            minWidth: 200,
            renderCell: (params) => {
              return params.value ?? '-'
            }
        },
        {
            field: 'modul',
            headerName: 'Modul',
            minWidth: 150,
            renderCell: (params) => {
              return params.value ?? '-'
            }
        },
        {
            field: 'submodul',
            headerName: 'Sub Modul',
            minWidth: 150,
            renderCell: (params) => {
              return params.value ?? '-'
            }
        },
        {
            field: 'user',
            headerName: 'User',
            minWidth: 150,
            renderCell: (params) => {
              return params.value ?? '-'
            }
        },
        {
            field: 'created_at',
            headerName: 'Created At',
            minWidth: 200,
            renderCell: (params) => {
              return params.value == null ? '-' : dateTimeFormat(params.value)
            }
        },
        {
            field: 'updated_at',
            headerName: 'Updated At',
            minWidth: 200,
            renderCell: (params) => {
              return params.value == null ? '-' : dateTimeFormat(params.value) 
            }
        },
        {
            field: 'action1',
            headerName: 'Action',
            headerAlign: 'center',
            width: 60,
            align: 'center',
            editable: false,
            sortable: false,
            disableColumnMenu: true,
            renderCell: (params: GridRenderCellParams<any>) => {
              return (
                <DataGridAction item={[
                  {
                    text: 'Export',
                    onClick: () => {
                        onExportByIdButtonClick(params.row.id)
                    }
                  },
                  {
                    text: 'Delete',
                    onClick: () => {
                      confirm({ description: "Are you sure to delete this data?" })
                        .then(() => {
                            onDeleteByIdButton(params.row.id)
                        })
                        .catch((err : any) => {
      
                        })
                    }
                  }
                ]} />
              )
            }
        },
    ]

    // process load data from backend based on selected date
    const onClickSearch = () => {
        dispatch({ type: GET_LOG_ACTIVITY, param: {...param, date_start: dateRange[0]?.format('YYYY-MM-DD'), date_end: dateRange[1]?.format('YYYY-MM-DD')} })
    }
    
    // process load data after reset datepicker
    const onClickReset = () => {
        setDateRange([dayjs(new Date()), dayjs(new Date())])
        onClickSearch()
    }

    // process export excel based on range date
    const onExportButtonClick = () => {
        dispatch({ type: DOWNLOAD_ACTIVITY_FILTER, param: param })
    }

    // process delete all data based on range date
    const onDeleteButton = () => {
        confirm({ description: "Are you sure to delete this data?" }).then(() => {
            dispatch({ type: DELETE_LOG_ACTIVITY_FILTER, param: param })
        })
        .catch((err : any) => {

        })
    }

    // process export excel per record
    const onExportByIdButtonClick = (id: number) => {
        dispatch({ type: DOWNLOAD_ACTIVITY_BY_ID, id: id })
    }

    // process delete data per id
    const onDeleteByIdButton = (id: number) => {
        dispatch({ type: DELETE_LOG_ACTIVITY_BY_ID, id: id })
    }
    
    // load data when pagination change or sorting change
    const onServerSidePropsChange : CustomDatagridProps['onServerSidePropsChange'] = (param) => {
        setPageProps(param)
        dispatch({ type: GET_LOG_ACTIVITY, param: {...param, date_start: dateRange[0]?.format('YYYY-MM-DD'), date_end: dateRange[1]?.format('YYYY-MM-DD')} })
    }

    return(
        <MainPage
            title="Log Activity"
        >
        {/* container for datepicker, search button and reset  */}
        <Box
            sx={{
            backgroundColor: 'white',
            flexDirection: {sm: 'row', xs: 'column'},
            alignItems: {sm: 'center', xs: 'stretch'},
            width: {sm: '550px', xs: 'auto'}
            }}
            display={'flex'}
            p={'20px'}
            borderRadius={'8px'}
            gap={'1rem'}
            alignItems={'center'}
        >
            <Box sx={{width: {sm: '350px', xs: '100%'}}}>
            <CustomRangeDatePicker 
                value={dateRange}
                onChange={(value) => setDateRange(value)}
                startDateLabel="Start Date"
                endDateLabel="End Date"
            />
            </Box>
            <Box display={'flex'} gap={'1rem'} justifyContent={'end'}>
            <Button type="button" variant="contained" color="primary" size="small" onClick={onClickSearch}>Search</Button>
            <Button type="button" variant="contained" color="error" size="small" onClick={onClickReset}>Reset</Button>
            </Box>
        </Box>

        <Box
            sx={{
            backgroundColor: 'white'
            }}
            display={'flex'}
            flexDirection={'column'}
            width={'calc(100% - 40px)'}
            p={'20px'}
            borderRadius={'8px'}
            gap={'1rem'}
            flexGrow={1}
        >
            {/* action button for export and delete based on date range */}
            <ActionButtonResponsive items={[
                {
                    color: 'error',
                    variant: 'contained',
                    size: 'small',
                    onClick: onDeleteButton,
                    text: 'Delete All'
                },
                {
                    color: 'info',
                    variant: 'contained',
                    size: 'small',
                    onClick: onExportButtonClick,
                    text: 'Export',
                    disabled: fetchingExport,
                    endIcon: fetchingExport && <CircularProgress color='inherit' size={'1rem'} />
                },
            ]}
            />
            {/* table data log activity */}
            <Box
            flexGrow={1}
            height={'380px'}
            minHeight={'380px'}
            sx={{
                backgroundColor: 'white'
            }}
            >
                <DataGrid
                    rows={logActivity.data}
                    columns={columns}
                    initialState={{
                    pagination: {
                        paginationModel: {
                        page: 0, 
                        pageSize: 5
                        },
                    },
                    filter: {
                        filterModel: {
                        items: [],
                        quickFilterValues: [''],
                        },
                    },
                    }}
                    slots={{
                    loadingOverlay: LinearProgress,
                    noRowsOverlay: NoRowsOverlay,
                    toolbar: DatagridCustomToolbar,
                    }}
                    density="compact"
                    sx={{ '--DataGrid-overlayHeight': '150px' }}
                    loading={fetching}
                    disableRowSelectionOnClick
                    keepNonExistentRowsSelected
                    
                    pagination
                    serverSideMode
                    onServerSidePropsChange={onServerSidePropsChange}
                    rowCount={logActivity.recordsFiltered || 0}

                    pageSizeOptions={[5,10,20]}

                    apiRef={apiRef}
                />
            </Box>
        </Box>
        </MainPage>
    )
}

export default LogActivityPage