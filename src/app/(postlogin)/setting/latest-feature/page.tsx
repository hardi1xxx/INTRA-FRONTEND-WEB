'use client'

import MainPage from "@/components/MainPage";
import { Add, Clear, IosShare, Search } from "@mui/icons-material";
import { Box, Button, CircularProgress, LinearProgress } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { useCallback, useState } from "react";
import DataGrid, { CustomDatagridProps, GridColDef, GridRenderCellParams, useGridApiRef } from "@/components/DataGrid"
import { dateTimeFormat } from "@/components/helper";
import DataGridAction from "@/components/DataGridAction";
import { useConfirm } from "material-ui-confirm";
import ActionButtonResponsive from "@/components/ActionButtonResponsive";
import NoRowsOverlay from "@/components/DatagridOverlay/NoRowsOverlay";
import DatagridCustomToolbar from "@/components/DataGridCustomToolbar";
import { useDispatch, useSelector } from "react-redux";
import { DELETE_SETTING_LATEST_FEATURE, EXPORT_SETTING_LATEST_FEATURE, GET_SETTING_LATEST_FEATURE } from "@/lib/redux/types";
import { RootState } from "@/lib/redux/store";
import FormLatestFeature from "./form";
import CustomRangeDatePicker from "@/components/CustomRangeDatePicker";

const SettingLatestFeaturePage = () => {
    const {
        rows,
        fetching,
        fetchingExport,
        params,
        recordsTotal,
    } = useSelector((state: RootState) => state.latestFeature)
    const dispatch = useDispatch()
    const confirm = useConfirm()
    const [dateRange, setDateRange] = useState<dayjs.Dayjs[]>([dayjs(new Date()), dayjs(new Date())])
    const [pageProps, setPageProps] = useState<{
        start: number;
        length: number;
        order: string;
    }>({
        start: 0,
        length: 10,
        order: ''
    })
    const [selectedData, setSelectedData] = useState<{
        id?: number,
        date_update?: Dayjs,
        modul?: string,
        keterangan?: string,
    }>({})
    const [openForm, setOpenForm] = useState<boolean>(false)

    const apiRef = useGridApiRef();

    const columns: GridColDef[] = [
        {
            field: "no",
            headerName: "No.",
            width: 50,
            renderCell: (params: GridRenderCellParams<any>) => {
                return getRowIndex(params.rowNode.id as number) + 1
            }
        },
        {
            field: "modul",
            headerName: "Modul",
            width: 200,
        },
        {
            field: "keterangan",
            headerName: "Information",
            width: 200,
        },
        {
            field: "date_update",
            headerName: "Date Update",
            width: 200,
            renderCell: (params) => {
                return params.value != null ? dateTimeFormat(params.value) : '-'
            }
        },
        {
            field: 'created_at',
            headerName: 'Created At',
            minWidth: 170,
            resizable: true,
            renderCell: (params) => {
                return params.value != null ? dateTimeFormat(params.value) : '-'
            }
        },
        {
            field: 'created_nik',
            headerName: 'Created NIK',
            minWidth: 170,
            resizable: true,
            renderCell: (params) => {
                return params.value ?? '-'
            }
        },
        {
            field: 'created_by',
            headerName: 'Created By',
            minWidth: 170,
            resizable: true,
            renderCell: (params) => {
                return params.value ?? '-'
            }
        },
        {
            field: 'updated_at',
            headerName: 'Updated At',
            minWidth: 170,
            resizable: true,
            renderCell: (params) => {
                return params.value != null ? dateTimeFormat(params.value) : '-'
            }
        },
        {
            field: 'updated_nik',
            headerName: 'Updated NIK',
            minWidth: 170,
            resizable: true,
            renderCell: (params) => {
                return params.value ?? '-'
            }
        },
        {
            field: 'updated_by',
            headerName: 'Updated By',
            minWidth: 170,
            resizable: true,
            renderCell: (params) => {
                return params.value ?? '-'
            }
        },
        {
            field: 'action',
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
                            text: 'Edit',
                            onClick: () => {
                                setSelectedData({
                                    ...params.row,
                                    date_update: dayjs(params.row.date_update)
                                })
                                setOpenForm(true)
                            }
                        },
                        {
                            text: 'Delete',
                            onClick: () => {
                                confirm({ description: "Are you sure to delete this data?" })
                                    .then(() => {
                                        dispatch({ type: DELETE_SETTING_LATEST_FEATURE, id: params.row.id })
                                    })
                                    .catch((err: any) => {

                                    })
                            }
                        }
                    ]} />
                )
            }
        }
    ]

    const getRowIndex = useCallback<(id: number) => number>(
        (id) => apiRef.current.getAllRowIds().indexOf(id) + (pageProps?.start || 0),
        [apiRef, pageProps],
    );

    const onClickSearch = () => {
        dispatch({
            type: GET_SETTING_LATEST_FEATURE,
            data: {
                ...params,
                start_date: dateRange[0]?.format('YYYY-MM-DD'),
                end_date: dateRange[1]?.format('YYYY-MM-DD')
            }
        })
    }

    const onClickReset = () => {
        setDateRange([dayjs(new Date()), dayjs(new Date())])
    }

    const onServerSidePropsChange: CustomDatagridProps['onServerSidePropsChange'] = (param) => {
        setPageProps(param)
        dispatch({
            type: GET_SETTING_LATEST_FEATURE,
            data: {
                ...param,
                start_date: dateRange[0]?.format('YYYY-MM-DD'),
                end_date: dateRange[1]?.format('YYYY-MM-DD')
            }
        })
    }

    const onExportButtonClick = () => {
        dispatch({
            type: EXPORT_SETTING_LATEST_FEATURE,
            data: {
                start_date: params.start_date,
                end_date: params.end_date,
            }
        })
    }

    const onCreateButtonClick = () => {
        setSelectedData({})
        setOpenForm(true)
    }

    return (
        <MainPage
            title="Setting Latest Feature"
        >
            <FormLatestFeature open={openForm} setOpen={setOpenForm} data={selectedData} />
            <Box
                sx={{
                    backgroundColor: 'white',
                    flexDirection: { sm: 'row', xs: 'column' },
                    alignItems: { sm: 'center', xs: 'stretch' },
                    width: { sm: '550px', xs: 'auto' }
                }}
                display={'flex'}
                p={'20px'}
                borderRadius={'8px'}
                gap={'1rem'}
                alignItems={'center'}
            >
                <Box sx={{ width: { sm: '350px', xs: '100%' } }}>
                    <CustomRangeDatePicker 
                        value={dateRange}
                        onChange={(value) => setDateRange(value)}
                        startDateLabel="Start Date"
                        endDateLabel="End Date"
                    />
                </Box>
                <Box display={'flex'} gap={'1rem'} justifyContent={'end'}>
                    <Button
                        color="primary"
                        variant='contained'
                        size="small"
                        type="submit"
                        onClick={onClickSearch}
                        startIcon={<Search />}>
                        Search
                    </Button>
                    <Button
                        color="info"
                        variant='contained'
                        size="small"
                        onClick={onClickReset}
                        startIcon={<Clear />}>
                        Reset
                    </Button>
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
                <ActionButtonResponsive items={[
                    {
                        color: 'primary',
                        variant: 'contained',
                        size: 'small',
                        onClick: onCreateButtonClick,
                        text: 'Create',
                        startIcon: <Add />
                    },
                    {
                        color: 'info',
                        variant: 'contained',
                        size: 'small',
                        onClick: onExportButtonClick,
                        text: 'Export',
                        disabled: fetchingExport,
                        endIcon: fetchingExport && <CircularProgress color='inherit' size={'1rem'} />,
                        startIcon: <IosShare />
                    },
                ]}
                />
                <Box
                    flexGrow={1}
                    height={'380px'}
                    minHeight={'380px'}
                    sx={{
                        backgroundColor: 'white'
                    }}
                >
                    <DataGrid
                        apiRef={apiRef}
                        columns={columns}
                        rows={rows}
                        pagination
                        pageSizeOptions={[10, 30, 50, 100]}
                        initialState={{
                            pagination: { paginationModel: { pageSize: 10, page: 0, } },
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
                            toolbar: DatagridCustomToolbar
                        }}
                        density="compact"
                        sx={{ '--DataGrid-overlayHeight': '150px' }}
                        loading={fetching}
                        disableRowSelectionOnClick
                        keepNonExistentRowsSelected
                        
                        serverSideMode
                        onServerSidePropsChange={onServerSidePropsChange}
                        rowCount={recordsTotal}
                    />
                </Box>
            </Box>
        </MainPage>
    )
}

export default SettingLatestFeaturePage