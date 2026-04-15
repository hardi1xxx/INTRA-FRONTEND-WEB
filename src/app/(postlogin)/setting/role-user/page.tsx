'use client'

import MainPage from "@/components/MainPage"
import { RootState } from "@/lib/redux/store"
import { DELETE_ROLE, EXPORT_ROLE, GET_MENU_ACCESS_MOBILE, GET_ROLE } from "@/lib/redux/types"
import { Box, CircularProgress } from "@mui/material"
import { useConfirm } from "material-ui-confirm"
import { useCallback, useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import FormRole from "./form"
import ActionButtonResponsive, { ActionButtonResponseType } from "@/components/ActionButtonResponsive"
import { checkAccessCreate, checkAccessDelete, checkAccessEdit, dateTimeFormat, titleCase } from "@/components/helper"
import FormMenuAccess from "./menuAccess"
import { Add, IosShare } from "@mui/icons-material"
import { DataRole } from "@/lib/redux/slices/master/role"
import { ColDef, GetRowIdParams, ICellRendererParams } from "ag-grid-community"
import { GridRenderCellParams } from "@mui/x-data-grid"
import DataGridAction, { DataGridActionType } from "@/components/DataGridAction"
import { AgGridReact } from "ag-grid-react"
import AGGrid from "@/components/AGGrid"
import { MenuListType } from "../../menuList"
import FormMenuAccessMobile from "./menuAccessMobile"
import { usePathname } from "next/navigation"

const MasterRoleUserPage = () => {
    const dispatch = useDispatch()
    const confirm = useConfirm();
    const pathname = usePathname()

    const { role, fetching, fetchingExport } = useSelector((state: RootState) => state.role)
    const { rows } = useSelector((state: RootState) => state.menuAccessMobile)

    const [openFormRole, setOpenFormRole] = useState<boolean>(false)
    const [openFormMenuAccess, setOpenFormMenuAccess] = useState<boolean>(false)
    const [openFormMenuAccessMobile, setOpenFormMenuAccessMobile] = useState<boolean>(false)
    const [menuMobileList, setMenuMobileList] = useState<MenuListType[]>([])

    const [selectedData, setSelectedData] = useState<DataRole>({})

    // get role data on page load
    useEffect(() => {
        dispatch({ type: GET_ROLE })
        dispatch({ type: GET_MENU_ACCESS_MOBILE })
    }, [dispatch])

    useEffect(() => {
        const menuMobile: MenuListType[] = [];
        const items = [...rows]
        items.sort((a, b) => (a.menu ?? "").localeCompare(b.menu ?? ""))
        for (const row of items) {
            const menu = row.menu?.split('/') ?? []
            if (menu.length > 1) {
                // get parent
                if (menuMobile.length > 0) {
                    menuMobile.map(val => {
                        if (val.id == menu[0]) {
                            if (val.child && val.child?.length > 0) {
                                val.child?.push({
                                    id: row.menu ?? "",
                                    text: titleCase(menu[menu.length - 1] ?? ""),
                                    url: row.menu ?? "",
                                    canCreate: true,
                                    canEdit: true,
                                    canDelete: true,
                                })
                            } else {
                                val.child = [{
                                    id: row.menu ?? "",
                                    text: titleCase(menu[menu.length - 1] ?? ""),
                                    url: row.menu ?? "",
                                    canCreate: true,
                                    canEdit: true,
                                    canDelete: true,
                                }]
                            }
                        }
                    })
                } else {
                    menuMobile.push({
                        id: row.menu ?? "",
                        text: titleCase(row.menu ?? ""),
                        url: row.menu ?? "",
                        canCreate: true,
                        canEdit: true,
                        canDelete: true,
                    })
                }
            } else {
                menuMobile.push({
                    id: row.menu ?? "",
                    text: titleCase(row.menu ?? ""),
                    url: row.menu ?? "",
                    canCreate: true,
                    canEdit: true,
                    canDelete: true,
                })
            }
        }
        setMenuMobileList(menuMobile)
    }, [rows])

    // show modal input
    const onCreateButtonClick = () => {
        setOpenFormRole(true)
        setSelectedData({})
    }

    // define columns table
    const columns: ColDef<DataRole & { no?: string, action?: string }, any>[] = [
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
            field: 'role',
            headerName: 'Role',
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
                            setOpenFormRole(true)
                        }
                    })
                    dataActions.item.push({
                        text: 'Menu Access',
                        onClick: () => {
                            setOpenFormMenuAccess(true)
                            setSelectedData(params.data)
                        }
                    })
                    dataActions.item.push({
                        text: 'Menu Access Mobile',
                        onClick: () => {
                            setOpenFormMenuAccessMobile(true)
                            setSelectedData(params.data)
                        }
                    })
                }
                if (checkAccessDelete(pathname.substring(1))) {
                    dataActions.item.push({
                        text: 'Delete',
                        onClick: () => {
                            confirm({ description: "Are you sure to delete this data?" })
                                .then(() => {
                                    dispatch({ type: DELETE_ROLE, id: params.data.id })
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
        dispatch({ type: EXPORT_ROLE, search: gridRef.current!.api.getQuickFilter() ?? '' })
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
            title="Setting Role User"
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
                    disabled: fetchingExport || role.length === 0,
                    endIcon: fetchingExport && <CircularProgress color='inherit' size={'1rem'} />,
                    startIcon: <IosShare />
                }, ...actionButtons.items]} />
                <Box
                    flexGrow={1}
                    height={'550px'}
                    sx={{
                        backgroundColor: 'white'
                    }}
                >
                    <AGGrid
                        gridRef={gridRef}
                        rowData={role}
                        columnDefs={columns}
                        totalData={role.length}
                        getRowId={getRowId}
                        isLoading={fetching}
                        height={"562px"}
                        showSearchInput
                    />
                </Box>
            </Box>
            <FormRole open={openFormRole} setOpen={setOpenFormRole} data={selectedData} />
            <FormMenuAccess open={openFormMenuAccess} setOpen={setOpenFormMenuAccess} data={selectedData} />
            <FormMenuAccessMobile open={openFormMenuAccessMobile} setOpen={setOpenFormMenuAccessMobile} data={selectedData} menuList={menuMobileList} />
        </MainPage>
    )
}

export default MasterRoleUserPage