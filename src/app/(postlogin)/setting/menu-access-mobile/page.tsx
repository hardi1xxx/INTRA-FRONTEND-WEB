'use client'

import AGGrid from "@/components/AGGrid";
import ActionButtonResponsive, { ActionButtonResponseType } from "@/components/ActionButtonResponsive";
import DataGridAction, { DataGridActionType } from "@/components/DataGridAction";
import MainPage from "@/components/MainPage";
import { checkAccessCreate, checkAccessDelete, checkAccessEdit, dateTimeFormat } from "@/components/helper";
import { DataMenuAccessMobile } from "@/lib/redux/slices/master/menuAccessMobile";
import { RootState } from "@/lib/redux/store";
import { DELETE_MENU_ACCESS_MOBILE, GET_MENU_ACCESS_MOBILE, EXPORT_MENU_ACCESS_MOBILE } from "@/lib/redux/types";
import { Add, IosShare } from "@mui/icons-material";
import { Box, CircularProgress } from "@mui/material";
import { GridRenderCellParams } from "@mui/x-data-grid";
import { ColDef, GetRowIdParams, ICellRendererParams } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useConfirm } from "material-ui-confirm";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import FormMenuAccessMobile from "./form";
import { usePathname } from "next/navigation";

const MenuAccessMobilePage = () => {
    const dispatch = useDispatch()
    const confirm = useConfirm();
    const pathname = usePathname()

    const { rows, fetching, fetchingExport } = useSelector((state: RootState) => state.menuAccessMobile)

    const [openForm, setOpenForm] = useState<boolean>(false)

    const [selectedData, setSelectedData] = useState<DataMenuAccessMobile>({})

    // get menu access mobile on page load
    useEffect(() => {
        dispatch({ type: GET_MENU_ACCESS_MOBILE })
    }, [dispatch])

    // show modal input
    const onCreateButtonClick = () => {
        setOpenForm(true)
        setSelectedData({})
    }

    // define columns table
    const columns: ColDef<DataMenuAccessMobile & { no?: string, action?: string }, any>[] = [
        {
            field: "no",
            headerName: "No.",
            width: 70,
            minWidth: 70,
            pinned: 'left',
            sortable: false,
            valueGetter: (props) => {
                return (props.node?.rowIndex ?? 0) + 1;
            },
        },
        {
            field: 'menu',
            headerName: 'Menu',
            minWidth: 210,
            comparator: (valueA: any, valueB: any) => valueA.toLowerCase().localeCompare(valueB.toLowerCase()),
        },
        {
            field: 'created_at',
            headerName: 'Created At',
            minWidth: 200,
            cellRenderer: (params: GridRenderCellParams<any>) => {
                return params.value != null ? dateTimeFormat(params.value) : '-'
            },
            getQuickFilterText: (params) => {
                return '';
            }
        },
        {
            field: 'created_nik',
            headerName: 'Created Nik',
            minWidth: 200,
            cellRenderer: (params: GridRenderCellParams<any>) => {
                return params.value ?? '-'
            },
            getQuickFilterText: (params) => {
                return '';
            }
        },
        {
            field: 'created_by',
            headerName: 'Created By',
            minWidth: 200,
            comparator: (valueA: any, valueB: any) => {
                const valA = valueA ?? ''
                const valB = valueB ?? ''
                return valA.toLowerCase().localeCompare(valB.toLowerCase())
            },
            cellRenderer: (params: GridRenderCellParams<any>) => {
                return params.value ?? '-'
            },
            getQuickFilterText: (params) => {
                return '';
            }
        },
        {
            field: 'updated_at',
            headerName: 'Updated At',
            minWidth: 200,
            cellRenderer: (params: GridRenderCellParams<any>) => {
                return params.value != null ? dateTimeFormat(params.value) : '-'
            },
            getQuickFilterText: (params) => {
                return '';
            }
        },
        {
            field: 'updated_nik',
            headerName: 'Updated Nik',
            minWidth: 200,
            cellRenderer: (params: GridRenderCellParams<any>) => {
                return params.value ?? '-'
            },
            getQuickFilterText: (params) => {
                return '';
            }
        },
        {
            field: 'updated_by',
            headerName: 'Updated By',
            minWidth: 200,
            comparator: (valueA: any, valueB: any) => {
                const valA = valueA ?? ''
                const valB = valueB ?? ''
                return valA.toLowerCase().localeCompare(valB.toLowerCase())
            },
            cellRenderer: (params: GridRenderCellParams<any>) => {
                return params.value ?? '-'
            },
            getQuickFilterText: (params) => {
                return '';
            }
        },
        // action button
        {
            field: 'action',
            headerName: 'Action',
            width: 80,
            pinned: 'right',
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
                            setSelectedData(params.data)
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
                                    dispatch({ type: DELETE_MENU_ACCESS_MOBILE, id: params.data.id })
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

    // export excel
    const onExportExcelButtonClick = () => {
        dispatch({ type: EXPORT_MENU_ACCESS_MOBILE, payload: { search: gridRef.current!.api.getQuickFilter() ?? '' } })
    }

    const gridRef = useRef<AgGridReact>(null)
    const getRowId = useCallback((params: GetRowIdParams<any>): any => {
        return params.data.id ?? 0
    }, []);

    const [actionButtons, setActionButtons] = useState<ActionButtonResponseType>({ items: [] })

    useEffect(() => {
        const temp: ActionButtonResponseType = {
            items: []
        }
        if (checkAccessCreate(pathname.substring(1))) {
            temp.items.push({
                color: 'primary',
                variant: 'contained',
                size: 'small',
                onClick: onCreateButtonClick,
                text: 'Create Data',
                startIcon: <Add />
            })
        }
        setActionButtons(temp)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    return (
        <MainPage
            title="Setting Menu Access Mobile"
        >
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
                {/* container button group */}
                <ActionButtonResponsive items={[{
                    color: 'info',
                    variant: 'contained',
                    size: 'small',
                    onClick: onExportExcelButtonClick,
                    text: 'Export Excel',
                    disabled: fetchingExport || rows.length === 0,
                    endIcon: fetchingExport && <CircularProgress color='inherit' size={'1rem'} />,
                    startIcon: <IosShare />
                }, ...actionButtons.items]}
                />
                <Box
                    flexGrow={1}
                    height={'550px'}
                    sx={{
                        backgroundColor: 'white'
                    }}
                >
                    <AGGrid
                        gridRef={gridRef}
                        rowData={rows}
                        columnDefs={columns}
                        totalData={rows.length}
                        getRowId={getRowId}
                        isLoading={fetching}
                        height={"562px"}
                        showSearchInput
                    />
                </Box>
            </Box>
            <FormMenuAccessMobile setOpen={setOpenForm} open={openForm} data={selectedData} />
        </MainPage>
    )
}

export default MenuAccessMobilePage