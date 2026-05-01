"use client";
/* eslint-disable @next/next/no-img-element */
import ActionButtonResponsive, { ActionButtonResponseType } from "@/components/ActionButtonResponsive";
import DataGridAction, { DataGridActionType } from "@/components/DataGridAction";
import MainPage from "@/components/MainPage";
import { Table, TableAggrid, TableGlobalSearch, TablePagination } from "@/components/Table";
import { dateTimeFormat } from "@/components/helper";
import { RootState } from "@/lib/redux/store";
import { DELETE_WITEL, EXPORT_WITEL, GET_WITEL, UPDATE_STATUS_WITEL } from "@/lib/redux/types";
import { Box, CircularProgress, debounce } from "@mui/material";
import { useConfirm } from "material-ui-confirm";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { WithId } from "@/type/services";
import { Add, IosShare } from "@mui/icons-material";
import TableFilter from "./filter";
import { witelActions } from "@/lib/redux/slices/master/witel";
import UpsertForm from "./form";
import { UpsertWitelRequest } from "./schema";
import { ColDef, ICellRendererParams, IRowNode } from "ag-grid-community";
import CustomSwitch from "@/components/Switch";
import usePermission from "@/components/use-permission";
import { AgGridReact } from "ag-grid-react";
import { CustomDatagridProps } from "@/components/DataGrid";
import AGGrid from "@/components/AGGrid";

export default function Page() {
  const dispatch = useDispatch();
  const confirm = useConfirm();
  // const permission = usePermission("master/witel");

  const [openForm, setOpenForm] = useState<boolean>(false);
  const [resetSearch, setResetSearch] = useState<boolean>(false);

  const gridRef = useRef<AgGridReact>(null);

  const [selectedData, setSelectedData] = useState<UpsertWitelRequest & WithId>();
 
  const { data, dataTotal, fetching, params, fetchingExport, resetTable, isFiltered } = useSelector((state: RootState) => state.witel);

  useEffect(() => {
    return () => {
      dispatch(witelActions.setIsFiltered(false));
      dispatch(witelActions.resetDropdownOptions());
      dispatch(witelActions.receiveNo());
      dispatch(witelActions.resetParam());
    };
  }, [dispatch]);

  useEffect(() => {
    if (isFiltered && (params.start > 0 && data.length === 0)) {
      dispatch(witelActions.setParams({ ...params, start: params.start - params.length }));
      dispatch({ type: GET_WITEL });
    }
  }, [data, params, dispatch, isFiltered]);

  // define columns table
  const columns: ColDef[] = [
    {
      field: "no",
      headerName: "No.",
      minWidth: 60,
      maxWidth: 60,
      sortable: false,
      pinned: "left",
      valueGetter: (props) => {
        return (props.node?.rowIndex ?? 0) + params.start + 1;
      },
    },
    {
      field: "regional",
      headerName: "Regional",
      minWidth: 150,
    },
    {
      field: "witel",
      headerName: "Witel",
      minWidth: 150,
    },
    {
      field: "sto",
      headerName: "STO",
      minWidth: 150,
    },
    ...( [
      {
        field: "status",
        headerName: "Status",
        minWidth: 150,
        cellRenderer: (row: ICellRendererParams) =>
          // permission.edit ? (
            <CustomSwitch
              checked={row.data.status == true || row.data.status == "active"}
              onChange={(event) =>
                handleToggleChange(row.data.id, event.target.checked)
              }
            />
          // ) : row.data.status
          // ? "Active"
          // : "Inactive",
      },
    ]),
    {
      field: "created_at",
      headerName: "Created At",
      minWidth: 170,
      cellRenderer: (row: ICellRendererParams) => {
        return dateTimeFormat(row.value);
      },
    },
    {
      field: "created_nik",
      headerName: "Created NIK",
      minWidth: 170,
    },
    {
      field: "created_by",
      headerName: "Created By",
      minWidth: 170
    },
    {
      field: "updated_at",
      headerName: "Updated At",
      minWidth: 170,
      cellRenderer: (row: ICellRendererParams) => {
        return dateTimeFormat(row.value);
      },
    },
    {
      field: "updated_nik",
      headerName: "Updated NIK",
      minWidth: 170
    },
    {
      field: "updated_by",
      headerName: "Updated By",
      minWidth: 170
    },
    // Group button action
    {
      field: "action",
      headerName: "Action",
      pinned: "right",
      minWidth: 90,
      maxWidth: 90,
      sortable: false,
      cellRenderer: (row: ICellRendererParams) => {
        const dataActions: DataGridActionType = {
          item: []
        }

        // if(permission.edit){
          dataActions.item.push({
            text: "Edit",
            onClick: () => {
              setOpenForm(true);
              setSelectedData(row.data!);
            },
          })
        // }

        // if(permission.delete){
          dataActions.item.push({
            text: "Delete",
            onClick: () => {
              confirm({ description: "Are you sure to delete this data?" })
                .then(() => {
                  dispatch({
                    type: DELETE_WITEL,
                    payload: { id: row.data!.id },
                  });
                })
                .catch((err) => {});
            },
          })
        // }

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
      }
    },
  ];

  //   function create button
  const onCreateButtonClick = () => {
    setOpenForm(true);
    setSelectedData(undefined);
  };

  // function export excel
  const onExportButtonClick = () => {
    dispatch({ type: EXPORT_WITEL });
  };

  const handleToggleChange = (id: number, checked: boolean) => {
      dispatch({
        type: UPDATE_STATUS_WITEL,
        payload: { id: id, status: checked ? true : false },
      });
    };

    // function for get data with serverside method
    const onServerSidePropsChange: CustomDatagridProps["onServerSidePropsChange"] = (data) => {
      const combined = params.length !== data.length ? { ...params, ...data, start: 0 } : { ...params, ...data };
      dispatch(witelActions.setParams(combined));
      setResetSearch(false);
      if (isFiltered) {
        dispatch({ type: GET_WITEL });
      } else {
        dispatch(witelActions.receiveNo());
      }
    };

  return (
    <MainPage title="Master Witel">
      <TableFilter setResetSearch={setResetSearch} />

      <Box
        sx={{
          backgroundColor: "white",
          // height: "auto",
        }}
        display={"inline-flex"}
        flexDirection={"column"}
        borderRadius={"12px"}
        gap={"1rem"}
      // flexGrow={0.1}
      >
        <Box
          flexGrow={1}
          borderRadius={"12px"}
          sx={{
            backgroundColor: "white",
          }}
        >
          <AGGrid
            gridRef={gridRef} 
            actionButton={[
              {
                color: "info",
                variant: "contained",
                size: "small",
                onClick: onExportButtonClick,
                text: "Export Excel",
                disabled: fetchingExport || data.length <= 0,
                endIcon: fetchingExport && <CircularProgress color="inherit" size={"1rem"} />,
                startIcon: <IosShare />,
              },
              // ...(permission.create
              //   ? [
              //       {
              //         color: "primary",
              //         variant: "contained",
              //         size: "small",
              //         onClick: onCreateButtonClick,
              //         text: "Create Data",
              //         startIcon: <Add />,
              //       } satisfies ActionButtonResponseType["items"][number],
              //     ]
              //   : []),
            ]}
            rowData={data} 
            columnDefs={columns} 
            totalData={dataTotal} 
            isLoading={fetching}
            showSearchInput 
            serverSideMode 
            onServerSidePropsChange={onServerSidePropsChange} 
            resetSearch={resetSearch} 
          />
        </Box>
      </Box>
      <UpsertForm open={openForm} setOpen={setOpenForm} data={selectedData} onUpsert={() => {}} />
    </MainPage>
  );
}
