/* eslint-disable @next/next/no-img-element */
'use client'

import AGGrid, { CustomAGGridProps } from "@/components/AGGrid"
import ActionButtonResponsive, { ActionButtonResponseType } from "@/components/ActionButtonResponsive"
import CustomRangeDatePicker from "@/components/CustomRangeDatePicker"
import DataGridAction from "@/components/DataGridAction"
import MainPage from "@/components/MainPage"
import { checkAccessDelete, dateTimeFormat } from "@/components/helper"
import { receiveLogNotification } from "@/lib/redux/slices/log/logNotification"
import { RootState } from "@/lib/redux/store"
import { DELETE_LOG_NOTIFICATION_BY_ID, DELETE_LOG_NOTIFICATION_FILTER, DOWNLOAD_NOTIFICATION_BY_ID, DOWNLOAD_NOTIFICATION_FILTER, GET_LOG_NOTIFICATION } from "@/lib/redux/types"
import { LogNotificationDataResponse } from "@/lib/services/log-notification"
import { Clear, Delete, IosShare, PersonRounded, Search } from "@mui/icons-material"
import { Box, Button, CircularProgress, Grid } from "@mui/material"
import { GridRenderCellParams } from "@mui/x-data-grid"
import { ColDef, GetRowIdParams, ICellRendererParams } from "ag-grid-community"
import { AgGridReact } from "ag-grid-react"
import dayjs from "dayjs"
import { useConfirm } from "material-ui-confirm"
import { usePathname } from "next/navigation"
import { useCallback, useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

const UserCellRenderer = (params: ICellRendererParams<any>) => <Box display={'flex'} justifyContent={'start'} alignItems={'center'} gap={1}>
    {params.data.picture != null ? <img src={params.data.picture} alt={params.data.user_name} width={70} height={70} style={{ borderRadius: '100%' }} /> : <PersonRounded sx={{ fontSize: '65px' }} />}
    <span>{params.data.user_name}</span>
</Box>

const ActionCellRenderer = (params: ICellRendererParams<any>) => {
    const dispatch = useDispatch()
    const confirm = useConfirm()

    // process export excel per record
    const onExportByIdButtonClick = (id: number) => {
        dispatch({ type: DOWNLOAD_NOTIFICATION_BY_ID, id: id })
    }

    // process delete data per id
    const onDeleteByIdButton = (id: number) => {
        dispatch({ type: DELETE_LOG_NOTIFICATION_BY_ID, id: id })
    }

    return (
        <DataGridAction item={[
            {
                text: 'Export',
                onClick: () => {
                    onExportByIdButtonClick(params.data.id)
                }
            },
            {
                text: 'Delete',
                onClick: () => {
                    confirm({ description: "Are you sure to delete this data?" })
                        .then(() => {
                            onDeleteByIdButton(params.data.id)
                        })
                }
            }
        ]} />
    )
}

const LogNotificationPage = () => {
    const [pageProps, setPageProps] = useState<{
        start: number;
        length: number;
        order: string;
        search: string;
    }>({
        start: 0,
        length: 10,
        order: "",
        search: "",
    });

    const [resetSearch, setResetSearch] = useState<boolean>(false)
    const pathname = usePathname()

    const dispatch = useDispatch()
    const confirm = useConfirm()
    const { fetching, logNotification, fetchingExport, param } = useSelector((state: RootState) => state.logNotification)
    const [dateRange, setDateRange] = useState<dayjs.Dayjs[]>([dayjs(new Date()), dayjs(new Date())])
    const [isFiltered, setIsFiltered] = useState<boolean>(false);

    // column definition for table log Notification
    const columns: ColDef<LogNotificationDataResponse & { no?: string, option?: string }, any>[] = [
        {
            field: "no",
            headerName: "No.",
            width: 70,
            minWidth: 70,
            pinned: "left",
            sortable: false,
            cellStyle: {
                'align-items': 'center ',
                display: "flex",
            },
            valueGetter: (props) => {
                return (props.node?.rowIndex ?? 0) + pageProps.start + 1;
            },
        },
        {
            field: 'user_name',
            headerName: 'User',
            minWidth: 250,
            cellStyle: {
                'align-items': 'center',
                display: "flex",
            },
            cellRenderer: UserCellRenderer
        },
        {
            field: 'title',
            headerName: 'Action',
            minWidth: 300,
            cellStyle: {
                'align-items': 'center ',
                display: "flex",
            },
            cellRenderer: (params: GridRenderCellParams<any>) => {
                return params.value ?? '-'
            }
        },
        {
            field: 'description',
            headerName: 'Description',
            minWidth: 500,
            cellStyle: {
                'align-items': 'center ',
                display: "flex",
            },
            cellRenderer: (params: GridRenderCellParams<any>) => {
                return params.value ?? '-'
            }
        },
        {
            field: 'created_at',
            headerName: 'Created At',
            minWidth: 200,
            cellStyle: {
                'align-items': 'center ',
                display: "flex",
            },
            cellRenderer: (params: GridRenderCellParams<any>) => {
                return params.value == null ? '-' : dateTimeFormat(params.value)
            }
        },
        {
            field: "option",
            headerName: "Action",
            width: 80,
            pinned: "right",
            editable: false,
            sortable: false,
            cellStyle: {
                'align-items': 'center ',
                display: "flex",
            },
            cellRenderer: ActionCellRenderer
        },
    ]

    // process load data from backend based on selected date
    const onClickSearch = () => {
        dispatch({ type: GET_LOG_NOTIFICATION, param: { ...param, start_date: dateRange[0]?.format('YYYY-MM-DD'), end_date: dateRange[1]?.format('YYYY-MM-DD') } })
        setIsFiltered(true)

    }

    // process load data after reset datepicker
    const onClickReset = () => {
        setDateRange([dayjs(new Date()), dayjs(new Date())])
        // onClickSearch()
        dispatch(receiveLogNotification({
            ...param,
            result: {
                search: null,
                date_start: null,
                date_end: null,
                data: [],
                draw: null,
                recordsTotal: null,
                recordsFiltered: null
            },
        }))
        setResetSearch(true)
        setIsFiltered(false)
    }

    // process export excel based on range date
    const onExportButtonClick = () => {
        dispatch({ type: DOWNLOAD_NOTIFICATION_FILTER, param: param })
    }

    // process delete all data based on range date
    const onDeleteButton = () => {
        confirm({ description: "Are you sure to delete all data?" }).then(() => {
            dispatch({ type: DELETE_LOG_NOTIFICATION_FILTER, param: param })
        })
    }

    // function for parsing get order param
    const getOrderParam = (order: string) => {
        let orderParam = ''
        if (order != '') {
            for (const splitted of order.split('|')) {
                const split = splitted.split(',')
                if (split[1] != 'null' && split[1] != 'undefined') {
                    orderParam += `${split[0]},${split[1]}`
                }
            }
        } else {
            orderParam = 'id,desc'
        }
        return orderParam
    }

    // load data when pagination change or sorting change
    const onServerSidePropsChange: CustomAGGridProps['onServerSidePropsChange'] = (param) => {
        setPageProps({
            start: param.start,
            length: param.length,
            order: getOrderParam(param.order),
            search: param.search,
        })
        setResetSearch(false)
        if (isFiltered) {
            dispatch({
                type: GET_LOG_NOTIFICATION,
                param: {
                    ...param,
                    start_date: dateRange[0]?.format('YYYY-MM-DD'),
                    end_date: dateRange[1]?.format('YYYY-MM-DD')
                }
            })
        } else {
            dispatch(receiveLogNotification({
                params: {
                    search: null,
                    start_date: null,
                    end_date: null,
                    data: [],
                    draw: null,
                    recordsTotal: null,
                    recordsFiltered: null
                },
                result: {
                    search: null,
                    date_start: null,
                    date_end: null,
                    data: [],
                    draw: null,
                    recordsTotal: null,
                    recordsFiltered: null
                },
            }))
        }
    }

    const [actionButtons, setActionButtons] = useState<ActionButtonResponseType>({ items: [] })

    useEffect(() => {
        const temp: ActionButtonResponseType = {
            items: []
        }
        if (checkAccessDelete(pathname.substring(1))) {
            temp.items.push({
                color: 'error',
                variant: 'contained',
                size: 'small',
                onClick: onDeleteButton,
                text: 'Delete All',
                startIcon: <Delete />
            })
        }
        setActionButtons(temp)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const gridRef = useRef<AgGridReact>(null);
    const getRowId = useCallback((params: GetRowIdParams<any>): any => {
        return params.data.id ?? 0;
    }, []);

    return (
        <MainPage
            title="Notification"
        >
            {/* container for datepicker, search button and reset  */}
            <Box
                sx={{
                    backgroundColor: "white",
                    height: "auto",
                }}
                display={"flex"}
                flexDirection={"column"}
                paddingX={"10px"}
                paddingY={"10px"}
                borderRadius={"8px"}
                gap={"1rem"}
            >
                <Box display={"flex"} flexDirection={"column"} width={"100%"} gap={"1rem"}>
                    <Grid container columnSpacing={"0.5rem"} rowSpacing={"0.7rem"}>
                        <Grid item xs={4} sx={{ display: { sm: 'flex', xs: 'block' } }} alignItems={'center'}>
                            <CustomRangeDatePicker
                                value={dateRange}
                                onChange={(value) => setDateRange(value)}
                                startDateLabel="Start Date"
                                endDateLabel="End Date"
                            />
                        </Grid>
                        <Grid item xs={8} display={'flex'} justifyContent={'end'} alignItems={'center'}>
                            <Box display={'flex'} justifyContent={'end'} width={'100%'} gap={'1rem'}>
                                <Button
                                    variant="contained"
                                    size="small"
                                    color="info"
                                    startIcon={<Clear />}
                                    onClick={onClickReset}
                                >Clear</Button>
                                <Button
                                    variant="contained"
                                    size="small"
                                    startIcon={<Search />}
                                    onClick={onClickSearch}
                                    disabled={fetching}
                                    endIcon={fetching && <CircularProgress color='inherit' size={'1rem'} />}
                                >Search</Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Box>

            <Box
                sx={{
                    backgroundColor: "white",
                }}
                display={"flex"}
                flexDirection={"column"}
                // width={"calc(100% - 40px)"}
                p={"10px"}
                paddingY={"15px"}
                pb={"20px"}
                borderRadius={"8px"}
                gap={"1rem"}
            >
                {/* action button for export and delete based on date range */}
                <ActionButtonResponsive items={[
                    ...actionButtons.items,
                    {
                        color: 'info',
                        variant: 'contained',
                        size: 'small',
                        onClick: onExportButtonClick,
                        text: 'Export Excel',
                        disabled: fetchingExport || logNotification.data.length == 0,
                        endIcon: fetchingExport && <CircularProgress color='inherit' size={'1rem'} />,
                        startIcon: <IosShare />,
                    },
                ]}
                />
                {/* table data log Notification */}
                <Box
                    flexGrow={1}
                    height={'380px'}
                    sx={{
                        backgroundColor: 'white'
                    }}
                >
                    <AGGrid
                        gridRef={gridRef}
                        rowData={logNotification.data}
                        columnDefs={columns}
                        totalData={logNotification.recordsFiltered ?? 0}
                        getRowId={getRowId}
                        isLoading={fetching}
                        showSearchInput
                        serverSideMode
                        onServerSidePropsChange={onServerSidePropsChange}
                        resetSearch={resetSearch}
                        rowHeight={80}
                    />
                </Box>
            </Box>
        </MainPage>
    )
}

export default LogNotificationPage