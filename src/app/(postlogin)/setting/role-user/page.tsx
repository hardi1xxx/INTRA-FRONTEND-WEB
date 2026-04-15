'use client'

import DataGridAction from "@/components/DataGridAction"
import NoRowsOverlay from "@/components/DatagridOverlay/NoRowsOverlay"
import MainPage from "@/components/MainPage"
import { RootState } from "@/lib/redux/store"
import { DELETE_ROLE, EXPORT_ROLE, GET_ROLE } from "@/lib/redux/types"
import { Box, LinearProgress } from "@mui/material"
import { useConfirm } from "material-ui-confirm"
import { useCallback, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import FormRole from "./form"
import DataGrid, { GridColDef, GridRenderCellParams, GridRowSelectionModel, useGridApiRef } from "@/components/DataGrid"
import ActionButtonResponsive from "@/components/ActionButtonResponsive"
import { dateTimeFormat } from "@/components/helper"
import FormMenuAccess from "./menuAccess"
import { Add, Delete, IosShare } from "@mui/icons-material"
import DatagridCustomToolbar from "@/components/DataGridCustomToolbar"
import { useAlerts } from "@/components/hooks"

const MasterRoleUserPage = () => {
    const apiRef = useGridApiRef()
    const dispatch = useDispatch()
    const confirm = useConfirm();
    const alert = useAlerts()

    const { role, error, fetching } = useSelector((state: RootState) => state.role)

    const [openFormRole, setOpenFormRole] = useState<boolean>(false)
    const [openFormMenuAccess, setOpenFormMenuAccess] = useState<boolean>(false)

    const [selectedData, setSelectedData] = useState<{
        id?: number,
        object_area?: string,
        category_issue?: string,
        issue?: string,
        status?: number,
        created_at?: string,
        created_nik?: number,
        created_by?: string,
        updated_at?: string,
        updated_nik?: number,
        updated_by?: string,
    }>({})

    const [selectedDatas, setSelectedDatas] = useState<GridRowSelectionModel>([])
    
    // render row number
    const getRowIndex = useCallback<(id: number) => number>(
        (id) => apiRef.current.getAllRowIds().indexOf(id),
        [apiRef],
    );
  
    // column configuration
    const columns: GridColDef[] = [
      {
        field: 'id',
        headerName: 'No.',
        width: 50,
        renderCell:(params: GridRenderCellParams<any>) => {
          return getRowIndex(params.rowNode.id as number) + 1
        }
      
      },
        {
            field: 'role',
            headerName: 'Role',
            minWidth: 150
        },
        {
            field: 'created_at',
            headerName: 'Created At',
            minWidth: 150,
            renderCell: (params) => {
                return dateTimeFormat(params.value)
            }
        },
        {
            field: 'created_nik',
            headerName: 'Created NIK',
            minWidth: 150
        },
        {
            field: 'created_by',
            headerName: 'Created By',
            minWidth: 150,
        },
        {
            field: 'updated_at',
            headerName: 'Updated At',
            minWidth: 150,
            renderCell: (params) => {
                return dateTimeFormat(params.value)
            }
        },
        {
            field: 'updated_nik',
            headerName: 'Updated NIK',
            minWidth: 150,
        },
        {
            field: 'updated_by',
            headerName: 'Updated By',
            minWidth: 150,
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
                                setOpenFormRole(true)
                                setSelectedData(params.row)
                            }
                        },
                        {
                            text: 'Delete',
                            onClick: () => {
                                confirm({ description: "Are you sure to delete this data?" })
                                    .then(() => {
                                        deleteData(params.row.id)
                                    })
                            }
                        },
                        {
                            text: 'Menu Access',
                            onClick: () => {
                                setOpenFormMenuAccess(true)
                                setSelectedData(params.row)
                            }
                        }
                    ]} />
                )
            }
        },
    ]

    // get role data on page load
    useEffect(() => {
        dispatch({ type: GET_ROLE })
    }, [])

    // show modal input
    const onCreateButtonClick = () => {
        setOpenFormRole(true)
        setSelectedData({})
    }

    // delete data
    const deleteData = (id: number) => {
        dispatch({ type: DELETE_ROLE, id: id })
    }

    // delete multiple selected data
    const deleteSelected = () => {
        if (selectedDatas.length === 0) {
            alert.show("Error", "No data selected!")
        } else {
            confirm({ description: "Are you sure to delete selected data?" }).then(() => {
                for (const id of selectedDatas) {
                    dispatch({ type: DELETE_ROLE, id: id })
                }
                setSelectedDatas([])
            }).catch((err: any) => {
                alert.show("Error", err.toString())
            })
        }
    }

    // export excel
    const onExportExcelButtonClick = () => {
        dispatch({ type: EXPORT_ROLE })
    }

    return (
        <MainPage
            title="Master Data Role"
        >
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
                {/* container button group */}
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
                        color: 'error',
                        variant: 'contained',
                        size: 'small',
                        onClick: deleteSelected,
                        text: 'Delete Selected',
                        startIcon: <Delete />
                    },
                    {
                        color: 'secondary',
                        variant: 'contained',
                        size: 'small',
                        onClick: onExportExcelButtonClick,
                        text: 'Export Excel',
                        sx: { color: 'white' },
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
                        onRowSelectionModelChange={(newRowSelectionModel) => setSelectedDatas(newRowSelectionModel)}
                        rowSelectionModel={selectedDatas}
                        checkboxSelection
                        rows={role}
                        columns={columns}
                        pagination={true}
                        pageSizeOptions={[10, 30, 50, 100]}
                        initialState={{
                            pagination: {
                                paginationModel: {
                                    pageSize: 10,
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
                        apiRef={apiRef}
                    />
                </Box>
            </Box>
            <FormRole open={openFormRole} setOpen={setOpenFormRole} data={selectedData} />
            <FormMenuAccess open={openFormMenuAccess} setOpen={setOpenFormMenuAccess} data={selectedData} />
        </MainPage>
    )
}

export default MasterRoleUserPage