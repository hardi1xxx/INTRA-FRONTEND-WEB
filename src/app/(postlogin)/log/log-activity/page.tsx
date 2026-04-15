'use client'

import AGGrid, { CustomAGGridProps } from "@/components/AGGrid"
import ActionButtonResponsive, { ActionButtonResponseType } from "@/components/ActionButtonResponsive"
import CustomRangeDatePicker from "@/components/CustomRangeDatePicker"
import DataGridAction from "@/components/DataGridAction"
import MainPage from "@/components/MainPage"
import { checkAccessDelete, dateTimeFormat } from "@/components/helper"
import { receiveLogActivity } from "@/lib/redux/slices/log/logActivity"
import { RootState } from "@/lib/redux/store"
import { DELETE_LOG_ACTIVITY_BY_ID, DELETE_LOG_ACTIVITY_FILTER, DOWNLOAD_ACTIVITY_FILTER, GET_LOG_ACTIVITY } from "@/lib/redux/types"
import { LogActivityDataResponse } from "@/lib/services/log-activity"
import { Clear, Delete, IosShare, Search } from "@mui/icons-material"
import { Box, Button, CircularProgress, Grid } from "@mui/material"
import { GridRenderCellParams } from "@mui/x-data-grid"
import { ColDef, GetRowIdParams, ICellRendererParams } from "ag-grid-community"
import { AgGridReact } from "ag-grid-react"
import dayjs from "dayjs"
import { useConfirm } from "material-ui-confirm"
import { usePathname } from "next/navigation"
import { useCallback, useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

const LogActivityPage = () => {
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
    const { fetching, logActivity, fetchingExport, param } = useSelector((state: RootState) => state.logActivity)
    const [isFiltered, setIsFiltered] = useState<boolean>(false);
    const [dateRange, setDateRange] = useState<dayjs.Dayjs[]>([dayjs(new Date()), dayjs(new Date())])

    // process load data from backend based on selected date
    const onClickSearch = () => {
        dispatch({
            type: GET_LOG_ACTIVITY,
            param: {
                ...param,
                start_date: dateRange[0]?.format('YYYY-MM-DD'),
                end_date: dateRange[1]?.format('YYYY-MM-DD'),
                start: pageProps.start,
                length: pageProps.length,
                search: pageProps.search,
                order: pageProps.order,
            }
        })
        setIsFiltered(true)
    }

    // process load data after reset datepicker
    const onClickReset = () => {
        setDateRange([dayjs(new Date()), dayjs(new Date())])
        dispatch(receiveLogActivity({
            ...param,
            result: {
                search: null,
                start_date: null,
                end_date: null,
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
        dispatch({ type: DOWNLOAD_ACTIVITY_FILTER, param: param })
    }

    // process delete all data based on range date
    const onDeleteButton = () => {
        confirm({ description: "Are you sure to delete all data?" }).then(() => {
            dispatch({ type: DELETE_LOG_ACTIVITY_FILTER, param: param })
        })
            .catch((err: any) => {

            })
    }

    // define columns table
    const columns: ColDef<LogActivityDataResponse & { no?: string, option?: string }, any>[] = [
        {
            field: "no",
            headerName: "No.",
            width: 70,
            minWidth: 70,
            pinned: "left",
            sortable: false,
            valueGetter: (props) => {
                return (props.node?.rowIndex ?? 0) + pageProps.start + 1;
            },
        },
        {
            field: "action",
            headerName: "Action",
            minWidth: 150,
            cellRenderer: (params: GridRenderCellParams<any>) => {
                return params.value ?? "-";
            },
        },
        {
            field: "modul",
            headerName: "Modul",
            minWidth: 150,
            cellRenderer: (params: GridRenderCellParams<any>) => {
                return params.value ?? "-";
            },
        },
        {
            field: "submodul",
            headerName: "Sub Modul",
            minWidth: 150,
            cellRenderer: (params: GridRenderCellParams<any>) => {
                return params.value ?? "-";
            },
        },
        {
            field: "description",
            headerName: "Description",
            minWidth: 250,
            cellRenderer: (params: GridRenderCellParams<any>) => {
                return params.value ?? "-";
            },
        },
        {
            field: "user",
            headerName: "User",
            minWidth: 150,
            cellRenderer: (params: GridRenderCellParams<any>) => {
                return params.value ?? "-";
            },
        },
        {
            field: "created_at",
            headerName: "Created At",
            minWidth: 200,
            cellRenderer: (params: GridRenderCellParams<any>) => {
                return params.value != null ? dateTimeFormat(params.value) : "-";
            },
        },
        {
            field: "updated_at",
            headerName: "Updated At",
            minWidth: 200,
            cellRenderer: (params: GridRenderCellParams<any>) => {
                return params.value != null ? dateTimeFormat(params.value) : "-";
            },
        },
        {
            field: "option",
            headerName: "Action",
            width: 80,
            pinned: "right",
            editable: false,
            sortable: false,
            cellRenderer: (params: ICellRendererParams<any>) => {
                if (checkAccessDelete(pathname.substring(1))) {
                    return (
                        <DataGridAction item={[
                            {
                                text: 'Delete',
                                onClick: () => {
                                    confirm({ description: "Are you sure to delete this data?" })
                                        .then(() => {
                                            dispatch({ type: DELETE_LOG_ACTIVITY_BY_ID, id: params.data.id })
                                        })
                                        .catch((err) => {
    
                                        })
                                }
                            }
                        ]} />
                    )
                } else {
                    return (
                        <Box sx={{ textAlign: 'center' }}>-</Box>
                    )
                }
            }
        }
    ]

    const gridRef = useRef<AgGridReact>(null);
    const getRowId = useCallback((params: GetRowIdParams<any>): any => {
        return params.data.id ?? 0;
    }, []);

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

    // function for get data with serverside method
    const onServerSidePropsChange: CustomAGGridProps["onServerSidePropsChange"] = (data) => {
        setPageProps({
            start: data.start,
            length: data.length,
            order: getOrderParam(data.order),
            search: data.search,
        });
        setResetSearch(false)
        if (isFiltered) {
            dispatch({
                type: GET_LOG_ACTIVITY,
                param: {
                    ...param,
                    start_date: dateRange[0]?.format('YYYY-MM-DD'),
                    end_date: dateRange[1]?.format('YYYY-MM-DD'),
                    start: data.start,
                    length: data.length,
                    search: data.search,
                    order: getOrderParam(data.order),
                }
            })
        } else {
            dispatch(receiveLogActivity({
                result: {
                    search: null,
                    start_date: null,
                    end_date: null,
                    data: [],
                    draw: null,
                    recordsTotal: 0,
                    recordsFiltered: 0
                },
                params: {
                    search: null,
                    start_date: null,
                    end_date: null,
                    data: [],
                    draw: null,
                    recordsTotal: null,
                    recordsFiltered: null
                }
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

    return (
        <MainPage
            title="Log Activity"
        >
            {/* container for datepicker, search button and reset  */}
            <Box
                sx={{
                    backgroundColor: "white",
                    height: "auto",
                }}
                display={"flex"}
                flexDirection={"column"}
                // width={"calc(100% - 40px)"}
                paddingX={"10px"}
                paddingY={"10px"}
                borderRadius={"8px"}
                gap={"1rem"}
            >
                <Box display={"flex"} flexDirection={"column"} width={"100%"} gap={"1rem"}>
                    <Grid container columnSpacing={"0.5rem"} rowSpacing={"0.5rem"}>
                        <Grid item xs={12} md={12} lg={6}>
                            <CustomRangeDatePicker
                                value={dateRange}
                                onChange={(value) => setDateRange(value)}
                                startDateLabel="Start Date"
                                endDateLabel="End Date"
                            />
                        </Grid>
                        <Grid item xs={12} md={12} lg={6} display={'flex'} alignItems={'center'}>
                            <Box display={'flex'} justifyContent={'end'} width={'100%'} gap={'1rem'}>
                                <Button
                                    color="info"
                                    variant='contained'
                                    size="small"
                                    onClick={onClickReset}
                                    startIcon={<Clear />}>
                                    Clear
                                </Button>
                                <Button
                                    color="primary"
                                    variant='contained'
                                    size="small"
                                    onClick={onClickSearch}
                                    startIcon={<Search />}>
                                    Search
                                </Button>
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
            // flexGrow={0.1}
            >
                {/* action button for export and delete based on date range */}
                <ActionButtonResponsive items={[
                    {
                        color: 'info',
                        variant: 'contained',
                        size: 'small',
                        onClick: onExportButtonClick,
                        text: 'Export Excel',
                        disabled: fetchingExport || logActivity.data.length == 0,
                        endIcon: fetchingExport && <CircularProgress color='inherit' size={'1rem'} />,
                        startIcon: <IosShare />,
                    },
                    ...actionButtons.items,
                ]}
                />
                <Box
                    flexGrow={1}
                    height={"380px"}
                    sx={{
                        backgroundColor: "white",
                    }}
                >
                    <AGGrid
                        gridRef={gridRef}
                        rowData={logActivity.data}
                        columnDefs={columns}
                        totalData={logActivity.recordsFiltered ?? 0}
                        getRowId={getRowId}
                        isLoading={fetching}
                        showSearchInput
                        serverSideMode
                        onServerSidePropsChange={onServerSidePropsChange}
                        resetSearch={resetSearch}
                    />
                </Box>
            </Box>
        </MainPage>
    )
}

export default LogActivityPage