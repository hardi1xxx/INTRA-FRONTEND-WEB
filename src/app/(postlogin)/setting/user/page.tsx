'use client'

import ActionButtonResponsive from "@/components/ActionButtonResponsive";
import DataGrid, { GridColDef, GridRenderCellParams, GridToolbarQuickFilter, GridToolbarQuickFilterProps } from "@/components/DataGrid";
import DataGridAction from "@/components/DataGridAction";
import NoRowsOverlay from "@/components/DatagridOverlay/NoRowsOverlay";
import MainPage from "@/components/MainPage";
import { dateTimeFormat } from "@/components/helper";
import { RootState } from "@/lib/redux/store";
import { DELETE_MASTER_USER, EXPORT_MASTER_USER, GET_MASTER_USER, GET_ROLE } from "@/lib/redux/types";
import { Box, CircularProgress, LinearProgress } from "@mui/material";
import { useConfirm } from "material-ui-confirm";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import FormUser from "./form";
import { Add, IosShare, PersonRounded } from '@mui/icons-material'
import DatagridCustomToolbar from "@/components/DataGridCustomToolbar";

function MasterUserPage() {
  const dispatch = useDispatch()
  const confirm = useConfirm();

  const { rows, fetching, fetchingExport } = useSelector((state: RootState) => state.user)
  const { role } = useSelector((state: RootState) => state.role)

  useEffect(() => {
    dispatch({ type: GET_MASTER_USER })
    if (role.length === 0) {
      dispatch({ type: GET_ROLE })
    }
  }, [])

  const [openForm, setOpenForm] = useState<boolean>(false)

  const [selectedData, setSelectedData] = useState<{
    id?: number,
    name?: string,
    nik?: string,
    email?: string,
    role_id?: string,
    picture?: File,
    picture_url?: string,
  }>({})

  const columns: GridColDef[] = [
    {
      field: 'no',
      headerName: 'No.',
      width: 50
    },
    {
      field: 'nik',
      headerName: 'NIK',
      minWidth: 150,
    },
    {
      field: 'name',
      headerName: 'Name',
      minWidth: 150,
    },
    {
      field: 'role_id',
      headerName: 'Role',
      minWidth: 150,
      renderCell: (params: GridRenderCellParams<any>) => {
        const selectedRole = role.filter((item) => item.id == params.value)
        if (selectedRole.length > 0) {
          return selectedRole[0].role
        }
        return '-'
      }
    },
    {
      field: 'location',
      headerName: 'Location',
      minWidth: 150,
    },
    {
      field: 'picture',
      headerName: 'Photo Profile',
      minWidth: 120,
      align: 'center',
      renderCell: (params: GridRenderCellParams<any>) => {
        return params.value != null ? <img src={`${params.value}?t=${(new Date()).getTime()}`} style={{ width: 40, height: 40, borderRadius: '100%' }} alt={params.row.nik} /> : <PersonRounded width={40} />
      }
    },
    {
      field: 'created_at',
      headerName: 'Created At',
      minWidth: 170,
      renderCell: (params) => {
        return params.value != null ? dateTimeFormat(params.value) : '-'
      }
    },
    {
      field: 'created_nik',
      headerName: 'Created NIK',
      minWidth: 170,
      renderCell: (params) => {
        return params.value ?? '-'
      }
    },
    {
      field: 'created_by',
      headerName: 'Created By',
      minWidth: 170,
      renderCell: (params) => {
        return params.value ?? '-'
      }
    },
    {
      field: 'updated_at',
      headerName: 'Updated At',
      minWidth: 170,
      renderCell: (params) => {
        return params.value != null ? dateTimeFormat(params.value) : '-'
      }
    },
    {
      field: 'updated_nik',
      headerName: 'Updated NIK',
      minWidth: 170,
      renderCell: (params) => {
        return params.value ?? '-'
      }
    },
    {
      field: 'updated_by',
      headerName: 'Updated By',
      minWidth: 170,
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
                  picture: null,
                  picture_url: params.row.picture,
                  role_id: params.row.role_id.toString(),
                })
                setOpenForm(true)
              }
            },
            {
              text: 'Delete',
              onClick: () => {
                confirm({ description: "Are you sure to delete this data?" })
                  .then(() => {
                    dispatch({ type: DELETE_MASTER_USER, id: params.row.id })
                  })
                  .catch((err) => {

                  })
              }
            }
          ]} />
        )
      }
    },
  ]

  const onCreateButtonClick = () => {
    setOpenForm(true)
    setSelectedData({})
  }

  const onExportButtonClick = () => {
    dispatch({ type: EXPORT_MASTER_USER })
  }

  return (
    <MainPage
      title="Master User"
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
          sx={{
            backgroundColor: 'white'
          }}
        >
          <DataGrid
            rows={rows}
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
              toolbar: DatagridCustomToolbar,
            }}
            sx={{ '--DataGrid-overlayHeight': '150px' }}
            loading={fetching}
            disableRowSelectionOnClick
            keepNonExistentRowsSelected
          />
        </Box>
      </Box>
      <FormUser open={openForm} setOpen={setOpenForm} roles={role} data={selectedData} />
    </MainPage>
  )
}

export default MasterUserPage