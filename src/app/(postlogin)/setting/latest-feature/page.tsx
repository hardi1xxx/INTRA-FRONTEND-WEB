'use client'

import MainPage from "@/components/MainPage";
import { Add, IosShare } from "@mui/icons-material";
import { Box, CircularProgress } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { useCallback, useEffect, useRef, useState } from "react";
import { GridRenderCellParams } from "@/components/DataGrid"
import DataGridAction, { DataGridActionType } from "@/components/DataGridAction";
import { useConfirm } from "material-ui-confirm";
import ActionButtonResponsive, { ActionButtonResponseType } from "@/components/ActionButtonResponsive";
import { useDispatch, useSelector } from "react-redux";
import { DELETE_SETTING_LATEST_FEATURE, EXPORT_SETTING_LATEST_FEATURE, GET_SETTING_LATEST_FEATURE } from "@/lib/redux/types";
import { RootState } from "@/lib/redux/store";
import FormLatestFeature from "./form";
import { ColDef, GetRowIdParams, ICellRendererParams } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import AGGrid, { CustomAGGridProps } from "@/components/AGGrid";
import { receiveLatestFeature } from "@/lib/redux/slices/master/latestFeature";
import FilterLatestFeature from "./filter";
import { usePathname } from "next/navigation";
import { checkAccessCreate, checkAccessDelete, checkAccessEdit } from "@/components/helper";

type ColumnLatestFeature = {
    id?: number,
    date_update?: string,
    modul?: string,
    keterangan?: string,
    created_at?: string,
    created_by?: string,
    updated_at?: string,
    updated_by?: string,
    created_nik?: string,
    updated_nik?: string,
    no?: string,
    action?: string
}

const SettingLatestFeaturePage = () => {
    const dispatch = useDispatch();
    const confirm = useConfirm();
    const pathname = usePathname()

    const { params, rows, recordsTotal, fetching, fetchingExport } = useSelector((state: RootState) => state.latestFeature)
    const [resetSearch, setResetSearch] = useState<boolean>(false)
    const [isFiltered, setIsFiltered] = useState<boolean>(false);
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

    const [openForm, setOpenForm] = useState<boolean>(false);
    const [selectedData, setSelectedData] = useState<{
        id?: number,
        date_update?: Dayjs,
        modul?: string,
        keterangan?: string,
    }>({});

    // define columns table
    const columns: ColDef<ColumnLatestFeature, any>[] = [
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
            field: "modul",
            headerName: "Modul",
            minWidth: 150,
        },
        {
            field: "keterangan",
            headerName: "Information",
            minWidth: 250,
        },
        {
            field: "date_update",
            headerName: "Date Update",
            minWidth: 200,
        },
        {
            field: "created_at",
            headerName: "Created At",
            minWidth: 170,
            cellRenderer: (params: GridRenderCellParams<any>) => {
                return params.value ?? "-";
            },
        },
        {
            field: "created_nik",
            headerName: "Created Nik",
            minWidth: 170,
            cellRenderer: (params: GridRenderCellParams<any>) => {
                return params.value ?? "-";
            },
        },
        {
            field: "created_by",
            headerName: "Created By",
            minWidth: 170,
            cellRenderer: (params: GridRenderCellParams<any>) => {
                return params.value ?? "-";
            },
        },
        {
            field: "updated_at",
            headerName: "Updated At",
            minWidth: 170,
            cellRenderer: (params: GridRenderCellParams<any>) => {
                return params.value ?? "-";
            },
        },
        {
            field: "updated_nik",
            headerName: "Updated Nik",
            minWidth: 170,
            cellRenderer: (params: GridRenderCellParams<any>) => {
                return params.value ?? "-";
            },
        },
        {
            field: "updated_by",
            headerName: "Updated By",
            minWidth: 170,
            cellRenderer: (params: GridRenderCellParams<any>) => {
                return params.value ?? "-";
            },
        },
        // action button
        {
            field: "action",
            headerName: "Action",
            width: 80,
            minWidth: 80,
            pinned: "right",
            editable: false,
            sortable: false,
            cellRenderer: (params: ICellRendererParams<any>) => {
                const dataActions: DataGridActionType = {
                    item: []
                }
                if (checkAccessEdit(pathname.substring(1))) {
                    dataActions.item.push({
                        text: 'Edit',
                        onClick: () => {
                            setSelectedData({
                                date_update: dayjs(params.data.date_update),
                                id: params.data.id,
                                keterangan: params.data.keterangan,
                                modul: params.data.modul
                            })
                            setOpenForm(true)
                        }
                    })
                }
                if (checkAccessDelete(pathname.substring(1))) {
                    dataActions.item.push({
                        text: 'Delete',
                        onClick: () => {
                            confirm({ description: "Are you sure to delete this data?" })
                                .then(() => {
                                    dispatch({ type: DELETE_SETTING_LATEST_FEATURE, id: params.data.id })
                                })
                                .catch((err) => {

                                })
                        }
                    })
                }
                if (dataActions.item.length > 0) {
                    return (
                        <DataGridAction item={dataActions.item} />
                    )
                } else {
                    return (
                        <Box sx={{ textAlign: 'center' }}>-</Box>
                    )
                }
            }
        },
    ]

    // function create button
    const onCreateButtonClick = () => {
        setOpenForm(true);
        setSelectedData({});
    };

    // function export excel
    const onExportButtonClick = () => {
        dispatch({ type: EXPORT_SETTING_LATEST_FEATURE });
    };

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
        }
        return orderParam
    }

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
                type: GET_SETTING_LATEST_FEATURE,
                params: {
                    ...params,
                    start: data.start,
                    length: data.length,
                    search: data.search,
                    order_param: getOrderParam(data.order),
                },
            });
        } else {
            dispatch(receiveLatestFeature({
                data: [],
                recordsFiltered: 0,
                params: {
                    type: "table",
                    column: "",
                    filter_param: "",
                    order_param: "",
                    start: 0,
                    length: 10,
                    search: "",
                }
            }))
        }
    }

    const [actionButtons, setActionButtons] = useState<ActionButtonResponseType>({ items: [] })

    useEffect(() => {
        const temp: ActionButtonResponseType = {
            items: []
        }
        if (checkAccessCreate(pathname.substring(1))) {
            temp.items.push({
                color: "primary",
                variant: "contained",
                size: "small",
                onClick: onCreateButtonClick,
                text: "Create Data",
                startIcon: <Add />,
            })
        }
        setActionButtons(temp)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    return (
        <MainPage
            title="Setting Latest Feature"
        >
            <FormLatestFeature open={openForm} setOpen={setOpenForm} data={selectedData} setIsFiltered={setIsFiltered} />

            <FilterLatestFeature pageProps={pageProps} setIsFiltered={setIsFiltered} setResetSearch={setResetSearch} />

            <Box
                sx={{
                    backgroundColor: "white",
                }}
                display={"flex"}
                flexDirection={"column"}
                p={"10px"}
                paddingY={"15px"}
                pb={"20px"}
                borderRadius={"8px"}
                gap={"1rem"}
            >
                <ActionButtonResponsive
                    items={[{
                        color: "info",
                        variant: "contained",
                        size: "small",
                        onClick: onExportButtonClick,
                        text: "Export Excel",
                        disabled: fetchingExport || rows.length === 0,
                        endIcon: fetchingExport && <CircularProgress color="inherit" size={"1rem"} />,
                        startIcon: <IosShare />,
                    },
                    ...actionButtons.items]}
                />
                <Box
                    flexGrow={1}
                    height={"550px"}
                    sx={{
                        backgroundColor: "white",
                    }}
                >
                    <AGGrid
                        gridRef={gridRef}
                        rowData={rows}
                        columnDefs={columns}
                        totalData={recordsTotal}
                        getRowId={getRowId}
                        isLoading={fetching}
                        height={"562px"}
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

export default SettingLatestFeaturePage