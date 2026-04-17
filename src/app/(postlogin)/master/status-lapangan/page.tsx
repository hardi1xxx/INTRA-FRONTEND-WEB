"use client";
/* eslint-disable @next/next/no-img-element */
import ActionButtonResponsive, { ActionButtonResponseType } from "@/components/ActionButtonResponsive";
import DataGridAction, { DataGridActionType } from "@/components/DataGridAction";
import MainPage from "@/components/MainPage";
import { Table, TableAggrid, TableGlobalSearch, TablePagination } from "@/components/Table";
import { dateTimeFormat } from "@/components/helper";
import { RootState } from "@/lib/redux/store";
import { DELETE_STATUS_LAPANGAN, EXPORT_STATUS_LAPANGAN, GET_STATUS_LAPANGAN, UPDATE_STATUS_STATUS_LAPANGAN } from "@/lib/redux/types";
import { Box, CircularProgress, debounce } from "@mui/material";
import { useConfirm } from "material-ui-confirm";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { WithId } from "@/type/services";
import { Add, IosShare } from "@mui/icons-material";
import TableFilter from "./filter";
import { statusLapanganActions } from "@/lib/redux/slices/master/statusLapangan";
import UpsertForm from "./form";
import { UpsertStatusLapanganRequest } from "./schema";
import { ColDef, ICellRendererParams, IRowNode } from "ag-grid-community";
import CustomSwitch from "@/components/Switch";
import usePermission from "@/components/use-permission";

export default function Page() {
  const dispatch = useDispatch();
  const confirm = useConfirm();
  // const permission = usePermission("master/status-lapangan");

  const [openForm, setOpenForm] = useState<boolean>(false);

  const [selectedData, setSelectedData] = useState<UpsertStatusLapanganRequest & WithId>();
 
  const { data, dataTotal, fetching, params, fetchingExport, resetTable, isFiltered } = useSelector((state: RootState) => state.statusLapangan);

  useEffect(() => {
    return () => {
      dispatch(statusLapanganActions.setIsFiltered(false));
      dispatch(statusLapanganActions.resetDropdownOptions());
      dispatch(statusLapanganActions.receiveNo());
      dispatch(statusLapanganActions.resetParam());
    };
  }, [dispatch]);

  useEffect(() => {
    if (isFiltered && (params.start > 0 && data.length === 0)) {
      dispatch(statusLapanganActions.setParams({ ...params, start: params.start - params.length }));
      dispatch({ type: GET_STATUS_LAPANGAN });
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
      field: "name",
      headerName: "Name",
      minWidth: 150,
    },
    {
      field: "description",
      headerName: "Description",
      minWidth: 150,
    },
    {
      field: "accessed_by_name",
      headerName: "Accessed By",
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
                    type: DELETE_STATUS_LAPANGAN,
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
    dispatch({ type: EXPORT_STATUS_LAPANGAN });
  };

  const handleToggleChange = (id: number, checked: boolean) => {
      dispatch({
        type: UPDATE_STATUS_STATUS_LAPANGAN,
        payload: { id: id, status: checked ? true : false },
      });
    };

  return (
    <MainPage title="Master Status Lapangan">
      <Table
        /**
         * page data and state
         */
        data={data || []}
        isLoading={fetching || fetchingExport}
        /**
         * current page
         */
        page={dataTotal === 0 ? undefined : params.start / params.length + 1}
        onPageChange={(page) => {
          dispatch(statusLapanganActions.setParams({ ...params, start: (page - 1) * params.length }));
          if(dataTotal === 0 && data.length === 0) return;
          dispatch({ type: GET_STATUS_LAPANGAN });
        }}
        /**
         * page size
         */
        pageSize={params.length}
        onPageSizeChange={(pageSize) => {
          dispatch(statusLapanganActions.setParams({ ...params, start: 0, length: pageSize }));
          if(dataTotal === 0 && data.length === 0) return;
          dispatch({ type: GET_STATUS_LAPANGAN });
        }}
        /**
         * global search
         */
        globalSearch={params.search}
        onGlobalSearchChange={debounce(
          (search) => {
            dispatch(statusLapanganActions.setParams({ ...params, start: 0, search }));
            if(!isFiltered) return;
            dispatch({ type: GET_STATUS_LAPANGAN });
          },
          isFiltered ? 500 : 0
        )}
        /**
         * total page and total data
         */
        totalData={dataTotal}
        /**
         * sort
         */
        sort={params.order ? [{ column: params.order.split(",")[0], order: params.order.split(",")[1] as "asc" | "desc" }] : []}
        onSortChange={(sort) => {
          dispatch(statusLapanganActions.setParams({ ...params, order: sort.map((s) => `${s.column},${s.order}`).join(",") }));
          if(dataTotal === 0 && data.length === 0) return;
          dispatch({ type: GET_STATUS_LAPANGAN });
        }}
      >
        <TableFilter />
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
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <TableGlobalSearch />
            <ActionButtonResponsive
              items={[
                {
                  color: "info",
                  variant: "contained",
                  size: "small",
                  onClick: onExportButtonClick,
                  text: "Export Excel",
                  disabled: fetchingExport || data.length === 0,
                  endIcon: fetchingExport && <CircularProgress color="inherit" size={"1rem"} />,
                  startIcon: <IosShare />,
                },
                // ...(permission.create
                //   ? [
                      {
                        color: "primary",
                        variant: "contained",
                        size: "small",
                        onClick: onCreateButtonClick,
                        text: "Create Data",
                        startIcon: <Add />,
                      } satisfies ActionButtonResponseType["items"][number],
                  //   ]
                  // : []),
              ]}
            />
          </div>
          <TableAggrid columnDefs={columns} />
          <TablePagination />
        </Box>
      </Table>
      <UpsertForm open={openForm} setOpen={setOpenForm} data={selectedData} onUpsert={() => {}} />
    </MainPage>
  );
}
