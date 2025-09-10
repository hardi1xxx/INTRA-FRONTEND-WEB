"use client";

import ActionButtonResponsive, { ActionButtonResponseType } from "@/components/ActionButtonResponsive";
import { CustomDatagridProps, GridRenderCellParams } from "@/components/DataGrid";
import DataGridAction, { DataGridActionType } from "@/components/DataGridAction";
import MainPage from "@/components/MainPage";
import { checkAccessCreate, checkAccessDelete, checkAccessEdit, dateTimeFormat } from "@/components/helper";
import { RootState } from "@/lib/redux/store";
import { DELETE_MASTER_JOB_POSITION, EXPORT_MASTER_JOB_POSITION, GET_MASTER_JOB_POSITION, UPDATE_STATUS_MASTER_JOB_POSITION } from "@/lib/redux/types";
import { Box, CircularProgress } from "@mui/material";
import { useConfirm } from "material-ui-confirm";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Add, IosShare } from "@mui/icons-material";
import { AgGridReact } from "ag-grid-react";
import FilterWidget from "./filter";
import { jobPositionActions } from "@/lib/redux/slices/master/job-position";
import UpsertForm from "./form";
import { UpsertJobPositionRequest } from "./schema";
import AGGrid from "@/components/AGGrid";
import { ColDef, ICellRendererParams, IRowNode } from "ag-grid-community";
import CustomSwitch from "@/components/Switch";
import { usePathname } from "next/navigation";

function MasterJobPositionPage() {
  const dispatch = useDispatch();
  const confirm = useConfirm();
  const pathname = usePathname()

  const { data, dataTotal, fetching, params, fetchingExport } = useSelector((state: RootState) => state.jobPosition);
  const [isFiltered, setIsFiltered] = useState<boolean>(false);
  const [resetSearch, setResetSearch] = useState<boolean>(false);

  const gridRef = useRef<AgGridReact>(null);

  const [openForm, setOpenForm] = useState<boolean>(false);

  const [selectedData, setSelectedData] = useState<UpsertJobPositionRequest & { id: number }>();

  // define column
  const columns: ColDef<Record<string, any>>[] = [
    {
      field: "no",
      headerName: "No.",
      width: 70,
      sortable: false,
      pinned: "left",
      valueGetter: (props) => {
        return (props.node?.rowIndex ?? 0) + params.start + 1;
      },
    },
    {
      field: "job_position",
      headerName: "Job Position",
      minWidth: 150,
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 100,
      cellRenderer: (row: IRowNode) => {
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
        return dateTimeFormat(row.value);
      },
    },
    {
      field: "created_nik",
      headerName: "Created NIK",
      minWidth: 180,
      cellRenderer: (params: GridRenderCellParams<any>) => {
        return params.value ?? "-";
      },
    },
    {
      field: "created_by",
      headerName: "Created By",
      minWidth: 180,
      cellRenderer: (params: GridRenderCellParams<any>) => {
        return params.value ?? "-";
      },
    },
    {
      field: "updated_at",
      headerName: "Updated At",
      minWidth: 180,
      cellRenderer: (params: GridRenderCellParams<any>) => {
        return params.value != null ? dateTimeFormat(params.value) : "-";
      },
    },
    {
      field: "updated_nik",
      headerName: "Updated NIK",
      minWidth: 180,
      cellRenderer: (params: GridRenderCellParams<any>) => {
        return params.value ?? "-";
      },
    },
    {
      field: "updated_by",
      headerName: "Updated By",
      minWidth: 180,
      cellRenderer: (params: GridRenderCellParams<any>) => {
        return params.value ?? "-";
      },
    },
    // Group button action
    {
      field: "action",
      headerName: "Action",
      pinned: "right",
      width: 80,
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
              setSelectedData(row.data!);
            },
          })
        }
        if (checkAccessDelete(pathname.substring(1))) {
          dataActions.item.push({
            text: "Delete",
            onClick: () => {
              confirm({ description: "Are you sure to delete this data ?" })
                .then(() => {
                  dispatch({
                    type: DELETE_MASTER_JOB_POSITION,
                    payload: { id: row.data.id },
                  });
                })
                .catch((err) => { });
            },
          })
        }
        if (dataActions.item.length > 0) {
          return (
            <DataGridAction
              item={dataActions.item}
            />
          )
        }
        return (
          <Box sx={{ textAlign: 'center' }}>-</Box>
        )
      },
    },
  ];

  // function for get data with serverside method
  const onServerSidePropsChange: CustomDatagridProps["onServerSidePropsChange"] = (data) => {
    const combined = params.length !== data.length ? { ...params, ...data, start: 0 } : { ...params, ...data };
    setResetSearch(false);
    dispatch(jobPositionActions.setParam(combined));
    if (isFiltered) {
      dispatch({ type: GET_MASTER_JOB_POSITION });
    } else {
      dispatch(jobPositionActions.receiveNo());
    }
  };

  // function create button
  const onCreateButtonClick = () => {
    setOpenForm(true);
    setSelectedData(undefined);
  };

  // function export excel
  const onExportButtonClick = () => {
    dispatch({ type: EXPORT_MASTER_JOB_POSITION });
  };

  const handleToggleChange = (id: number, checked: boolean) => {
    dispatch({
      type: UPDATE_STATUS_MASTER_JOB_POSITION,
      payload: { id: id, status: checked ? 1 : 0 },
    });
  };

  const onUpsert = () => {
    setIsFiltered(true);
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
      },)
    }
    setActionButtons(temp)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  return (
    <MainPage title="Job Position">
      <FilterWidget setIsFiltered={setIsFiltered} setResetSearch={setResetSearch} />

      <Box
        sx={{
          backgroundColor: "white",
          // height: "auto",
        }}
        display={"inline-flex"}
        flexDirection={"column"}
        // width={"calc(100% - 40px)"}
        p={"15px 10px 20px 10px"}
        borderRadius={"8px"}
        gap={"1rem"}
      // flexGrow={0.1}
      >
        <ActionButtonResponsive
          items={[{
            color: "info",
            variant: "contained",
            size: "small",
            onClick: onExportButtonClick,
            text: "Export Excel",
            disabled: fetchingExport || data.length <= 0,
            endIcon: fetchingExport && <CircularProgress color="inherit" size={"1rem"} />,
            startIcon: <IosShare />,
          },
          ...actionButtons.items
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
            resetSearch={resetSearch} 
          />
        </Box>
      </Box>
      <UpsertForm open={openForm} setOpen={setOpenForm} data={selectedData} onUpsert={onUpsert} />
    </MainPage>
  );
}

export default MasterJobPositionPage;
