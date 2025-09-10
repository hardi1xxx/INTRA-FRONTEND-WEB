"use client";

import ActionButtonResponsive, { ActionButtonResponseType } from "@/components/ActionButtonResponsive";
import DataGridAction, { DataGridActionType } from "@/components/DataGridAction";
import MainPage from "@/components/MainPage";
import { RootState } from "@/lib/redux/store";
import { DELETE_MASTER_DEPARTEMENT_USER, EXPORT_MASTER_DEPARTEMENT_USER, GET_MASTER_DEPARTEMENT_USER, UPDATE_STATUS_MASTER_DEPARTEMENT_USER } from "@/lib/redux/types";
import { Box, CircularProgress } from "@mui/material";
import { useConfirm } from "material-ui-confirm";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Add, IosShare } from "@mui/icons-material";
import FilterWidget from "./filter";
import UpsertForm from "./form";
import { WithId } from "@/type/services";
import { UpsertDepartementUserRequest } from "@/lib/services/master/departementUser";
import { departementUserActions } from "@/lib/redux/slices/master/departementUser";
import { ColDef, ICellRendererParams } from "ag-grid-community";
import CustomSwitch from "@/components/Switch";
import AGGrid, { CustomAGGridProps } from "@/components/AGGrid";
import { AgGridReact } from "ag-grid-react";
import { usePathname } from "next/navigation";
import { checkAccessCreate, checkAccessDelete, checkAccessEdit } from "@/components/helper";

function Page() {
  const dispatch = useDispatch();
  const confirm = useConfirm();
  const pathname = usePathname()

  const { data, dataTotal, fetching, params, fetchingExport, resetTable } = useSelector((state: RootState) => state.departementUser);
  const [isFiltered, setIsFiltered] = useState<boolean>(false);

  const gridRef = useRef<AgGridReact>(null);

  const [openForm, setOpenForm] = useState<boolean>(false);

  const [selectedData, setSelectedData] = useState<UpsertDepartementUserRequest & WithId>();

  const columns: ColDef<Record<string, any>>[] = [
    {
      field: "no",
      headerName: "No.",
      width: 55,
      sortable: false,
      pinned: "left",
      valueGetter: (props) => {
        return (props.node?.rowIndex ?? 0) + params.start + 1;
      },
    },
    {
      field: "departement",
      headerName: "Department",
      minWidth: 200,
      cellRenderer: (row: ICellRendererParams) => {
        return row.value ?? '-'
      },
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 120,
      cellRenderer: (row: ICellRendererParams) => {
        if (checkAccessEdit(pathname.substring(1))) {
          return (
            <CustomSwitch
              checked={row.data.status == "1" || row.data.status == "active"}
              onChange={(event) => {
                handleToggleChange(row.data.id, event.target.checked);
              }}
            />
          );
        } else {
          return row.data.status == "1" || row.data.status == "active" ? 'Active' : 'Inactive'
        }
      },
    },
    {
      field: "created_at",
      headerName: "Created At",
      minWidth: 180,
      cellRenderer: (row: ICellRendererParams) => {
        return row.value ?? '-'
      },
    },
    {
      field: "created_nik",
      headerName: "Created NIK",
      minWidth: 180,
      cellRenderer: (row: ICellRendererParams) => {
        return row.value ?? '-'
      },
    },
    {
      field: "created_by",
      headerName: "Created By",
      minWidth: 180,
      cellRenderer: (row: ICellRendererParams) => {
        return row.value ?? '-'
      },
    },
    {
      field: "updated_at",
      headerName: "Updated At",
      minWidth: 180,
      cellRenderer: (row: ICellRendererParams) => {
        return row.value ?? '-'
      },
    },
    {
      field: "updated_nik",
      headerName: "Updated NIK",
      minWidth: 180,
      cellRenderer: (row: ICellRendererParams) => {
        return row.value ?? '-'
      },
    },
    {
      field: "updated_by",
      headerName: "Updated By",
      minWidth: 180,
      cellRenderer: (row: ICellRendererParams) => {
        return row.value ?? '-'
      },
    },
    // Group button action
    {
      field: "action",
      headerName: "Action",
      pinned: "right",
      width: 75,
      sortable: false,
      cellRenderer: (row: ICellRendererParams) => {
        const dataActions: DataGridActionType = {
          item: []
        }
        if (checkAccessEdit(pathname.substring(1))) {
          dataActions.item.push({
            text: "Edit",
            onClick: () => {
              setOpenForm(true);
              setSelectedData(row.data);
            },
          })
        }
        if (checkAccessDelete(pathname.substring(1))) {
          dataActions.item.push({
            text: "Delete",
            onClick: () => {
              confirm({ description: "Are you sure to delete this data?" })
                .then(() => {
                  dispatch({
                    type: DELETE_MASTER_DEPARTEMENT_USER,
                    payload: { id: row.data!.id },
                  });
                })
                .catch((err) => { });
            },
          })
        }
        if (dataActions.item.length > 0) {
          return (
            (
              <DataGridAction
                item={dataActions.item}
              />
            )
          )
        } else {
          return (
            <Box sx={{ textAlign: 'center' }}>-</Box>
          )
        }
      },
    },
  ];

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
      orderParam = 'created_at,asc'
    }
    return orderParam
  }

  // function for get data with serverside method
  const onServerSidePropsChange: CustomAGGridProps["onServerSidePropsChange"] = (data) => {
    dispatch(departementUserActions.setParams({
      ...params,
      order: getOrderParam(data.order),
      start: data.start,
      length: data.length,
      search: data.search,
    }));
    if (isFiltered) {
      dispatch({ type: GET_MASTER_DEPARTEMENT_USER });
    } else {
      dispatch(departementUserActions.receiveNo());
      dispatch(departementUserActions.resetDropdownOptions());
    }
  };

  // function create button
  const onCreateButtonClick = () => {
    setOpenForm(true);
    setSelectedData(undefined);
  };

  // function export excel
  const onExportButtonClick = () => {
    dispatch({ type: EXPORT_MASTER_DEPARTEMENT_USER });
  };

  const handleToggleChange = (id: number, checked: boolean) => {
    dispatch({
      type: UPDATE_STATUS_MASTER_DEPARTEMENT_USER,
      payload: { id: id, status: checked ? 1 : 0 },
    });
  };

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
    <MainPage title="Setting Department User">
      <FilterWidget setIsFiltered={setIsFiltered} />

      <Box
        sx={{
          backgroundColor: "white",
        }}
        display={"flex"}
        flexDirection={"column"}
        px={"10px"}
        pt={"15px"}
        pb={"20px"}
        borderRadius={"8px"}
        gap={"1rem"}
        flexGrow={0.1}
      >
        <ActionButtonResponsive
          items={[{
            color: "info",
            variant: "contained",
            size: "small",
            onClick: onExportButtonClick,
            text: "Export Excel",
            disabled: fetchingExport || data.length == 0,
            endIcon: fetchingExport && <CircularProgress color="inherit" size={"1rem"} />,
            startIcon: <IosShare />,
          },
          ...actionButtons.items,
          ]}
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
            rowData={data} 
            columnDefs={columns} 
            totalData={dataTotal} 
            isLoading={fetching}
            height={"562px"} 
            showSearchInput 
            serverSideMode 
            onServerSidePropsChange={onServerSidePropsChange} 
            resetSearch={resetTable} 
          />
        </Box>
      </Box>
      <UpsertForm open={openForm} setOpen={setOpenForm} data={selectedData} setIsFiltered={setIsFiltered} />
    </MainPage>
  );
}

export default Page;
