"use client";
/* eslint-disable @next/next/no-img-element */
import DataGridAction, { DataGridActionType } from "@/components/DataGridAction";
import MainPage from "@/components/MainPage";
import { dateTimeFormat } from "@/components/helper";
import { RootState } from "@/lib/redux/store";
import { DELETE_BRANCH, EXPORT_BRANCH, GET_BRANCH, UPDATE_STATUS_BRANCH } from "@/lib/redux/types";
import { Box, CircularProgress } from "@mui/material";
import { useConfirm } from "material-ui-confirm";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { WithId } from "@/type/services";
import { Add, IosShare } from "@mui/icons-material";
import TableFilter from "./filter";
import { branchActions } from "@/lib/redux/slices/master/branch";
import UpsertForm from "./form";
import { UpsertBranchRequest } from "./schema";
import { ColDef, ICellRendererParams, IRowNode } from "ag-grid-community";
import CustomSwitch from "@/components/Switch";
import { AgGridReact } from "ag-grid-react";
import { CustomDatagridProps } from "@/components/DataGrid";
import AGGrid from "@/components/AGGrid";

export default function Page() {
  const dispatch = useDispatch();
  const confirm = useConfirm();
  // const permission = usePermission("master/status-lapangan");

  const [openForm, setOpenForm] = useState<boolean>(false);
  const [resetSearch, setResetSearch] = useState<boolean>(false);

  const gridRef = useRef<AgGridReact>(null);

  const [selectedData, setSelectedData] = useState<UpsertBranchRequest & WithId>();
 
  const { data, dataTotal, fetching, params, fetchingExport, resetTable, isFiltered } = useSelector((state: RootState) => state.branch);

  useEffect(() => {
    return () => {
      dispatch(branchActions.setIsFiltered(false));
      dispatch(branchActions.resetDropdownOptions());
      dispatch(branchActions.receiveNo());
      dispatch(branchActions.resetParam());
    };
  }, [dispatch]);

  useEffect(() => {
    if (isFiltered && (params.start > 0 && data.length === 0)) {
      dispatch(branchActions.setParams({ ...params, start: params.start - params.length }));
      dispatch({ type: GET_BRANCH });
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
      field: "regional_code",
      headerName: "Regional Code",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "regional_name",
      headerName: "Regional Name",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "area_code",
      headerName: "Area Code",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "area_name",
      headerName: "Area Name",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "branch_code",
      headerName: "Branch Code",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "branch_name",
      headerName: "Branch Name",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "description",
      headerName: "Description",
      flex: 1,
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
                    type: DELETE_BRANCH,
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
    dispatch({ type: EXPORT_BRANCH });
  };

  const handleToggleChange = (id: number, checked: boolean) => {
      dispatch({
        type: UPDATE_STATUS_BRANCH,
        payload: { id: id, status: checked ? true : false },
      });
    };
    
  // function for get data with serverside method
  const onServerSidePropsChange: CustomDatagridProps["onServerSidePropsChange"] = (data) => {
    const combined = params.length !== data.length ? { ...params, ...data, start: 0 } : { ...params, ...data };
    dispatch(branchActions.setParams(combined));
    setResetSearch(false);
    if (isFiltered) {
      dispatch({ type: GET_BRANCH });
    } else {
      dispatch(branchActions.receiveNo());
    }
  };

  return (
    <MainPage title="Master Branch">
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
              {
                color: "primary",
                variant: "contained",
                size: "small",
                onClick: onCreateButtonClick,
                text: "Create Data",
                startIcon: <Add />,
              }
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
