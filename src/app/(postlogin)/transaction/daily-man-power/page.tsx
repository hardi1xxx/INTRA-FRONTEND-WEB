"use client";
/* eslint-disable @next/next/no-img-element */
import ActionButtonResponsive, { ActionButtonResponseType } from "@/components/ActionButtonResponsive";
import DataGridAction, { DataGridActionType } from "@/components/DataGridAction";
import MainPage from "@/components/MainPage";
import { Table, TableAggrid, TableGlobalSearch, TablePagination } from "@/components/Table";
import { dateTimeFormat } from "@/components/helper";
import { RootState } from "@/lib/redux/store";
import { DELETE_DAILY_MANPOWER, EXPORT_DAILY_MANPOWER, GET_DAILY_MANPOWER } from "@/lib/redux/types";
import { Box, CircularProgress, debounce } from "@mui/material";
import { useConfirm } from "material-ui-confirm";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { WithId } from "@/type/services";
import { Add, IosShare } from "@mui/icons-material";
import TableFilter from "./filter";
import { dailyManPowerActions } from "@/lib/redux/slices/transaction/dailyManPower";
import UpsertForm from "./form";
import { UpsertDailyManPowerRequest } from "./schema";
import { ColDef, ICellRendererParams, IRowNode } from "ag-grid-community";
import usePermission from "@/components/use-permission";

export default function Page() {
  const dispatch = useDispatch();
  const confirm = useConfirm();
  const permission = usePermission("transaction/daily-man-power");

  const [openForm, setOpenForm] = useState<boolean>(false);

  const [selectedData, setSelectedData] = useState<UpsertDailyManPowerRequest & WithId>();
 
  const { data, dataTotal, fetching, params, fetchingExport, resetTable, isFiltered } = useSelector((state: RootState) => state.dailyManPower);

  useEffect(() => {
    return () => {
      dispatch(dailyManPowerActions.setIsFiltered(false));
      dispatch(dailyManPowerActions.resetDropdownOptions());
      dispatch(dailyManPowerActions.receiveNo());
      dispatch(dailyManPowerActions.resetParam());
    };
  }, [dispatch]);

  useEffect(() => {
    if (isFiltered && (params.start > 0 && data.length === 0)) {
      dispatch(dailyManPowerActions.setParams({ ...params, start: params.start - params.length }));
      dispatch({ type: GET_DAILY_MANPOWER });
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
      field: "witel",
      headerName: "Witel",
      minWidth: 150,
    },
    {
      field: "total_surveyor",
      headerName: "Total Surveyor",
      minWidth: 100,
    },
    {
      field: "total_drafter",
      headerName: "Total Drafter",
      minWidth: 100,
    },
    {
      field: "total_pt2",
      headerName: "Total PT 2",
      minWidth: 100,
    },
    {
      field: "total_pt3",
      headerName: "Total PT 3",
      minWidth: 100,
    },
    {
      field: "total_order",
      headerName: "Total Order",
      minWidth: 100,
    },
    {
      field: "notes",
      headerName: "Notes",
      minWidth: 150,
    },
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

        if(permission.edit){
          dataActions.item.push({
            text: "Edit",
            onClick: () => {
              setOpenForm(true);
              setSelectedData(row.data!);
            },
          })
        }

        if(permission.delete){
          dataActions.item.push({
            text: "Delete",
            onClick: () => {
              confirm({ description: "Are you sure to delete this data?" })
                .then(() => {
                  dispatch({
                    type: DELETE_DAILY_MANPOWER,
                    payload: { id: row.data!.id },
                  });
                })
                .catch((err) => {});
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
    dispatch({ type: EXPORT_DAILY_MANPOWER });
  };

  return (
    <MainPage title="Daily Man Power">
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
          dispatch(dailyManPowerActions.setParams({ ...params, start: (page - 1) * params.length }));
          if(dataTotal === 0 && data.length === 0) return;
          dispatch({ type: GET_DAILY_MANPOWER });
        }}
        /**
         * page size
         */
        pageSize={params.length}
        onPageSizeChange={(pageSize) => {
          dispatch(dailyManPowerActions.setParams({ ...params, start: 0, length: pageSize }));
          if(dataTotal === 0 && data.length === 0) return;
          dispatch({ type: GET_DAILY_MANPOWER });
        }}
        /**
         * global search
         */
        globalSearch={params.search}
        onGlobalSearchChange={debounce(
          (search) => {
            dispatch(dailyManPowerActions.setParams({ ...params, start: 0, search }));
            if(!isFiltered) return;
            dispatch({ type: GET_DAILY_MANPOWER });
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
          dispatch(dailyManPowerActions.setParams({ ...params, order: sort.map((s) => `${s.column},${s.order}`).join(",") }));
          if(dataTotal === 0 && data.length === 0) return;
          dispatch({ type: GET_DAILY_MANPOWER });
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
                ...(permission.create
                  ? [
                      {
                        color: "primary",
                        variant: "contained",
                        size: "small",
                        onClick: onCreateButtonClick,
                        text: "Create Data",
                        startIcon: <Add />,
                      } satisfies ActionButtonResponseType["items"][number],
                    ]
                  : []),
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
