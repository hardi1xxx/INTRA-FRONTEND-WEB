"use client";
/* eslint-disable @next/next/no-img-element */
import ActionButtonResponsive, { ActionButtonResponseType } from "@/components/ActionButtonResponsive";
import DataGridAction, { DataGridActionType } from "@/components/DataGridAction";
import MainPage from "@/components/MainPage";
import { Table, TableAggrid, TableGlobalSearch, TablePagination } from "@/components/Table";
import { dateTimeFormat } from "@/components/helper";
import { RootState } from "@/lib/redux/store";
import { DELETE_REPORT_PT3, EXPORT_REPORT_PT3, GET_REPORT_PT3, IMPORT_REPORT_PT3 } from "@/lib/redux/types";
import { Box, CircularProgress, debounce } from "@mui/material";
import { useConfirm } from "material-ui-confirm";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { WithId } from "@/type/services";
import { Add, IosShare } from "@mui/icons-material";
import TableFilter from "./filter";
import { reportPT3Actions } from "@/lib/redux/slices/report/reportPT3";
import UpsertForm from "./form";
import { UpsertReportPT3Request } from "./schema";
import { ColDef, ICellRendererParams, IRowNode } from "ag-grid-community";
import usePermission from "@/components/use-permission";

export default function Page() {
  const dispatch = useDispatch();
  const confirm = useConfirm();
  // const permission = usePermission("report/pt3");

  const [openForm, setOpenForm] = useState<boolean>(false);

  const [selectedData, setSelectedData] = useState<UpsertReportPT3Request & WithId>();
 
  const { data, dataTotal, fetching, params, fetchingExport, resetTable, isFiltered } = useSelector((state: RootState) => state.reportPT3);

  useEffect(() => {
    return () => {
      dispatch(reportPT3Actions.setIsFiltered(false));
      dispatch(reportPT3Actions.resetDropdownOptions());
      dispatch(reportPT3Actions.receiveNo());
      dispatch(reportPT3Actions.resetParam());
    };
  }, [dispatch]);

  useEffect(() => {
    if (isFiltered && (params.start > 0 && data.length === 0)) {
      dispatch(reportPT3Actions.setParams({ ...params, start: params.start - params.length }));
      dispatch({ type: GET_REPORT_PT3 });
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
    { field: "id_ihld", headerName: "Id Ihld", minWidth: 150 },
    { field: "tematik", headerName: "Tematik", minWidth: 150 },
    { field: "status_osm", headerName: "Status Osm", minWidth: 150 },
    { field: "lop", headerName: "Lop", minWidth: 150 },
    { field: "sto", headerName: "Sto", minWidth: 150 },
    { field: "witel", headerName: "Witel", minWidth: 150 },
    { field: "id_pid", headerName: "Id Pid", minWidth: 150 },
    { field: "id_sap", headerName: "Id Sap", minWidth: 150 },

    { field: "jumlah_odp_drm", headerName: "Jumlah Odp Drm", minWidth: 150 },
    { field: "jumlah_port_drm", headerName: "Jumlah Port Drm", minWidth: 150 },
    { field: "jumlah_odp_real", headerName: "Jumlah Odp Real", minWidth: 150 },
    { field: "jumlah_port_real", headerName: "Jumlah Port Real", minWidth: 150 },
    { field: "kalkulasi_port", headerName: "Kalkulasi Port", minWidth: 150 },
    { field: "dev_port", headerName: "Dev Port", minWidth: 150 },
    { field: "nilai_material_drm", headerName: "Nilai Material Drm", minWidth: 150 },

    { field: "status_fisik", headerName: "Status Fisik", minWidth: 150 },
    { field: "status_lapangan", headerName: "Status Lapangan", minWidth: 150 },
    { field: "keterangan", headerName: "Keterangan", minWidth: 150 },

    { field: "komit_fi_awal", headerName: "Komit Fi Awal", minWidth: 150 },
    { field: "komit_fi_update", headerName: "Komit Fi Update", minWidth: 150 },
    {
      field: "finish_instalasi",
      headerName: "Finish Instalasi",
      minWidth: 170,
      cellRenderer: (row: ICellRendererParams) => dateTimeFormat(row.value),
    },
    { field: "finish_instal_diagram_hari", headerName: "Finish Instal Diagram Hari", minWidth: 150 },

    { field: "komit_gl_awal", headerName: "Komit Gl Awal", minWidth: 150 },
    { field: "komit_golive_update", headerName: "Komit Golive Update", minWidth: 150 },
    {
      field: "golive",
      headerName: "Golive",
      minWidth: 170,
      cellRenderer: (row: ICellRendererParams) => dateTimeFormat(row.value),
    },
    { field: "tanggal_golive_diagram_hari", headerName: "Tanggal Golive Diagram Hari", minWidth: 150 },

    {
      field: "tanggal_perizinan",
      headerName: "Tanggal Perizinan",
      minWidth: 170,
      cellRenderer: (row: ICellRendererParams) => dateTimeFormat(row.value),
    },
    { field: "nama_mitra", headerName: "Nama Mitra", minWidth: 150 },
    { field: "pembayaran_cc", headerName: "Pembayaran Cc", minWidth: 150 },
    {
      field: "tgl_eprop",
      headerName: "Tgl Eprop",
      minWidth: 170,
      cellRenderer: (row: ICellRendererParams) => dateTimeFormat(row.value),
    },
    { field: "day", headerName: "Day", minWidth: 150 },

    { field: "weekly_gl", headerName: "Weekly Gl", minWidth: 150 },
    { field: "weekly_komit_gl", headerName: "Weekly Komit Gl", minWidth: 150 },
    { field: "durasi_perizinan", headerName: "Durasi Perizinan", minWidth: 150 },
    { field: "po", headerName: "Po", minWidth: 150 },
    { field: "regional_area", headerName: "Regional Area", minWidth: 150 },

    { field: "m_golive", headerName: "M Golive", minWidth: 150 },
    { field: "y_golive", headerName: "Y Golive", minWidth: 150 },

    { field: "status_tomps", headerName: "Status Tomps", minWidth: 150 },
    {
      field: "tanggal",
      headerName: "Tanggal",
      minWidth: 170,
      cellRenderer: (row: ICellRendererParams) => dateTimeFormat(row.value),
    },

    { field: "status_ihld_0608", headerName: "Status Ihld 0608", minWidth: 150 },
    { field: "status_ihld_1108", headerName: "Status Ihld 1108", minWidth: 150 },
    { field: "status_ihld", headerName: "Status Ihld", minWidth: 150 },
    { field: "status_eproposal", headerName: "Status Eproposal", minWidth: 150 },
    { field: "status_proyek", headerName: "Status Proyek", minWidth: 150 },

    { field: "telkomsel_branch", headerName: "Telkomsel Branch", minWidth: 150 },
    { field: "batch", headerName: "Batch", minWidth: 150 },
    { field: "status_lop_ed", headerName: "Status Lop Ed", minWidth: 150 },
    { field: "status_lop_kons2025", headerName: "Status Lop Kons2025", minWidth: 150 },
    { field: "status_smile", headerName: "Status Smile", minWidth: 150 },

    { field: "bast_material", headerName: "Bast Material", minWidth: 150 },
    { field: "bast_jasa", headerName: "Bast Jasa", minWidth: 150 },

    { field: "durasi_eprop_to_fi", headerName: "Durasi Eprop To Fi", minWidth: 150 },
    { field: "durasi_fi_to_golive", headerName: "Durasi Fi To Golive", minWidth: 150 },
    { field: "durasi_eprop_to_golive", headerName: "Durasi Eprop To Golive", minWidth: 150 },

    { field: "bulan_submit_to_eprop", headerName: "Bulan Submit To Eprop", minWidth: 150 },
    { field: "year_submit_to_eprop", headerName: "Year Submit To Eprop", minWidth: 150 },
    { field: "sla_pt3", headerName: "Sla Pt3", minWidth: 150 },
    { field: "branch", headerName: "Branch", minWidth: 150 },
    { field: "idsw", headerName: "Idsw", minWidth: 150 },
    { field: "bulan_golive", headerName: "Bulan Golive", minWidth: 150 },

    /** Default timestamp */
    {
      field: "created_at",
      headerName: "Created At",
      minWidth: 170,
      cellRenderer: (row: ICellRendererParams) => dateTimeFormat(row.value),
    },
    { field: "created_by", headerName: "Created By", minWidth: 150 },
    { field: "created_nik", headerName: "Created Nik", minWidth: 150 },
    {
      field: "updated_at",
      headerName: "Updated At",
      minWidth: 170,
      cellRenderer: (row: ICellRendererParams) => dateTimeFormat(row.value),
    },
    { field: "updated_by", headerName: "Updated By", minWidth: 150 },
    { field: "updated_nik", headerName: "Updated Nik", minWidth: 150 },

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
                    type: DELETE_REPORT_PT3,
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
    dispatch({ type: EXPORT_REPORT_PT3 });
  };

  // function import excel
  const onImportButtonClick = () => {
    dispatch({ type: IMPORT_REPORT_PT3 });
  };

  return (
    <MainPage title="Report PT3">
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
          dispatch(reportPT3Actions.setParams({ ...params, start: (page - 1) * params.length }));
          if(dataTotal === 0 && data.length === 0) return;
          dispatch({ type: GET_REPORT_PT3 });
        }}
        /**
         * page size
         */
        pageSize={params.length}
        onPageSizeChange={(pageSize) => {
          dispatch(reportPT3Actions.setParams({ ...params, start: 0, length: pageSize }));
          if(dataTotal === 0 && data.length === 0) return;
          dispatch({ type: GET_REPORT_PT3 });
        }}
        /**
         * global search
         */
        globalSearch={params.search}
        onGlobalSearchChange={debounce(
          (search) => {
            dispatch(reportPT3Actions.setParams({ ...params, start: 0, search }));
            if(!isFiltered) return;
            dispatch({ type: GET_REPORT_PT3 });
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
          dispatch(reportPT3Actions.setParams({ ...params, order: sort.map((s) => `${s.column},${s.order}`).join(",") }));
          if(dataTotal === 0 && data.length === 0) return;
          dispatch({ type: GET_REPORT_PT3 });
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
                        color: "error",
                        variant: "contained",
                        size: "small",
                        onClick: onImportButtonClick,
                        text: "Import Data",
                        startIcon: <Add />,
                      } satisfies ActionButtonResponseType["items"][number],
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
