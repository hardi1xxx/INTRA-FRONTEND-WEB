import { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Save } from "@mui/icons-material";
import { AutocompleteInputChangeReason, Box, Button, CircularProgress, debounce, FormControl, FormHelperText, Grid, InputLabel, MenuItem, TextField } from "@mui/material";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

import { Dialogs } from "@/components/dialog";
import FormBuilder from "@/components/FormBuilder";
import { IFormLayout } from "@/components/FormBuilder/interfaces";
import { RootState } from "@/lib/redux/store";
import { CREATE_REPORT_PT3, UPDATE_REPORT_PT3 } from "@/lib/redux/types";
import { WithId } from "@/type/services";
import { UpsertReportPT3Request, upsertReportPT3Schema } from "./schema";
import { TextControlWidget } from "@/components/Input/TextControlWidget";
import { AutoCompleteWidget } from "@/components/Input/AutoCompleteWidget";
import { reportPT3Actions } from "@/lib/redux/slices/report/reportPT3";

type FormType = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  data?: UpsertReportPT3Request & WithId;
  onUpsert?: () => void;
  readonly?: boolean;
};

const UpsertForm = ({ open, setOpen, data, ...props }: FormType) => {
  const dispatch = useDispatch();
  const { fetching } = useSelector((state: RootState) => state.reportPT3);
  const { severity } = useSelector((state: RootState) => state.notification);
  const { handleSubmit, reset, ...form } = useForm({
    resolver: yupResolver(upsertReportPT3Schema),
    defaultValues: {
      id_ihld: "",
      tematik: "",
      status_osm: "",
      lop: "",
      sto: "",
      witel: "",
      id_pid: "",
      id_sap: "",
      jumlah_odp_drm: "",
      jumlah_port_drm: "",
      jumlah_odp_real: "",
      jumlah_port_real: "",
      kalkulasi_port: "",
      dev_port: "",
      nilai_material_drm: "",
      status_fisik: "",
      status_lapangan: "",
      keterangan: "",
      komit_fi_awal: "",
      komit_fi_update: "",
      finish_instalasi: "",
      finish_instal_diagram_hari: "",
      komit_gl_awal: "",
      komit_golive_update: "",
      golive: "",
      tanggal_golive_diagram_hari: "",
      tanggal_perizinan: "",
      nama_mitra: "",
      pembayaran_cc: "",
      tgl_eprop: "",
      day: "",
      weekly_gl: "",
      weekly_komit_gl: "",
      durasi_perizinan: "",
      po: "",
      regional_area: "",
      m_golive: "",
      y_golive: "",
      status_tomps: "",
      tanggal: "",
      status_ihld_0608: "",
      status_ihld_1108: "",
      status_ihld: "",
      status_eproposal: "",
      status_proyek: "",
      telkomsel_branch: "",
      batch: "",
      status_lop_ed: "",
      status_lop_kons2025: "",
      status_smile: "",
      bast_material: "",
      bast_jasa: "",
      durasi_eprop_to_fi: "",
      durasi_fi_to_golive: "",
      durasi_eprop_to_golive: "",
      bulan_submit_to_eprop: "",
      year_submit_to_eprop: "",
      sla_pt3: "",
      branch: "",
      idsw: "",
      bulan_golive: "",
    },
  });

  useEffect(() => {
    if (data) {
      reset({
        ...data,
        komit_fi_awal: data.komit_fi_awal || null,
        komit_fi_update: data.komit_fi_update || null,
        finish_instalasi: data.finish_instalasi || null,
        komit_gl_awal: data.komit_gl_awal || null,
        komit_golive_update: data.komit_golive_update || null,
        golive: data.golive || null,
        tanggal_perizinan: data.tanggal_perizinan || null,
        tgl_eprop: data.tgl_eprop || null,
        tanggal: data.tanggal || null,
      });
    }
  }, [data, reset]);

  useEffect(() => {
    if (severity == "success") {
      reset();
      setOpen(false);
      props.onUpsert?.();
      dispatch(reportPT3Actions.setIsFiltered(true));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [severity]);

  const onSubmit: SubmitHandler<UpsertReportPT3Request> = (values) => {
    if (data?.id) {
      dispatch({
        type: UPDATE_REPORT_PT3,
        payload: { id: data.id, ...values },
      });
    } else {
      dispatch({ type: CREATE_REPORT_PT3, payload: { ...values } });
    }
  };

  return (
    <Dialogs open={open} title={`Form ${data?.id ? "Edit" : "Add"}`} setOpen={setOpen}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={"1rem"} justifyContent={"center"}>
          <Grid item xs={12} md={4}>
            <TextControlWidget control={form.control} name="id_ihld" label="ID Ihld" type="text" maxLength={225} autoFocus disabled={props.readonly} labelOnTextField />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextControlWidget control={form.control} name="tematik" label="Tematik" type="text" maxLength={225} disabled={props.readonly} labelOnTextField />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextControlWidget control={form.control} name="status_osm" label="Status Osm" type="text" maxLength={225} disabled={props.readonly} labelOnTextField />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextControlWidget control={form.control} name="lop" label="Lop" type="text" maxLength={225} disabled={props.readonly} labelOnTextField />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextControlWidget control={form.control} name="sto" label="Sto" type="text" maxLength={225} disabled={props.readonly} labelOnTextField />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextControlWidget control={form.control} name="witel" label="Witel" type="text" maxLength={225} disabled={props.readonly} labelOnTextField />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextControlWidget control={form.control} name="id_pid" label="Id Pid" type="text" maxLength={225} disabled={props.readonly} labelOnTextField />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextControlWidget control={form.control} name="id_sap" label="Id Sap" type="text" maxLength={225} disabled={props.readonly} labelOnTextField />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextControlWidget control={form.control} name="jumlah_odp_drm" label="Jumlah Odp Drm" type="text" maxLength={225} disabled={props.readonly} labelOnTextField />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextControlWidget control={form.control} name="jumlah_port_drm" label="Jumlah Port Drm" type="text" maxLength={225} disabled={props.readonly} labelOnTextField />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextControlWidget control={form.control} name="jumlah_odp_real" label="Jumlah Odp Real" type="text" maxLength={225} disabled={props.readonly} labelOnTextField />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextControlWidget control={form.control} name="jumlah_port_real" label="Jumlah Port Real" type="text" maxLength={225} disabled={props.readonly} labelOnTextField />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextControlWidget control={form.control} name="kalkulasi_port" label="Kalkulasi Port" type="text" maxLength={225} disabled={props.readonly} labelOnTextField />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextControlWidget control={form.control} name="dev_port" label="Dev Port" type="text" maxLength={225} disabled={props.readonly} labelOnTextField />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextControlWidget control={form.control} name="nilai_material_drm" label="Nilai Material Drm" type="text" maxLength={225} disabled={props.readonly} labelOnTextField />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextControlWidget control={form.control} name="status_fisik" label="Status Fisik" type="text" maxLength={225} disabled={props.readonly} labelOnTextField />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextControlWidget control={form.control} name="status_lapangan" label="Status Lapangan" type="text" maxLength={225} disabled={props.readonly} labelOnTextField />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextControlWidget control={form.control} name="keterangan" label="Keterangan" type="text" maxLength={225} disabled={props.readonly} labelOnTextField />
          </Grid>

          <Grid item xs={12} md={4}>
            <Controller
              name="komit_fi_awal"
              control={form.control}
              render={({ field, fieldState }) => (
                <DatePicker
                  label="Komit FI Awal"
                  value={field.value ? dayjs(field.value) : null}
                  onChange={(date) =>
                    field.onChange(date ? dayjs(date).format("YYYY-MM-DD") : null)
                  }
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: "small",
                      error: !!fieldState.error,
                      helperText: fieldState.error?.message,
                    },
                  }}
                  disabled={props.readonly}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Controller
              name="komit_fi_update"
              control={form.control}
              render={({ field, fieldState }) => (
                <DatePicker
                  label="Komit FI Update"
                  value={field.value ? dayjs(field.value) : null}
                  onChange={(date) =>
                    field.onChange(date ? dayjs(date).format("YYYY-MM-DD") : null)
                  }
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: "small",
                      error: !!fieldState.error,
                      helperText: fieldState.error?.message,
                    },
                  }}
                  disabled={props.readonly}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Controller
              name="finish_instalasi"
              control={form.control}
              render={({ field, fieldState }) => (
                <DatePicker
                  label="Finish Instalasi"
                  value={field.value ? dayjs(field.value) : null}
                  onChange={(date) =>
                    field.onChange(date ? dayjs(date).format("YYYY-MM-DD") : null)
                  }
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: "small",
                      error: !!fieldState.error,
                      helperText: fieldState.error?.message,
                    },
                  }}
                  disabled={props.readonly}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextControlWidget control={form.control} name="finish_instal_diagram_hari" label="Finish Instal Diagram Hari" type="text" maxLength={225} disabled={props.readonly} labelOnTextField />
          </Grid>

          <Grid item xs={12} md={4}>
            <Controller
              name="komit_gl_awal"
              control={form.control}
              render={({ field, fieldState }) => (
                <DatePicker
                  label="Komit GL Awal"
                  value={field.value ? dayjs(field.value) : null}
                  onChange={(date) =>
                    field.onChange(date ? dayjs(date).format("YYYY-MM-DD") : null)
                  }
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: "small",
                      error: !!fieldState.error,
                      helperText: fieldState.error?.message,
                    },
                  }}
                  disabled={props.readonly}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Controller
              name="komit_golive_update"
              control={form.control}
              render={({ field, fieldState }) => (
                <DatePicker
                  label="Komit Golive Update"
                  value={field.value ? dayjs(field.value) : null}
                  onChange={(date) =>
                    field.onChange(date ? dayjs(date).format("YYYY-MM-DD") : null)
                  }
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: "small",
                      error: !!fieldState.error,
                      helperText: fieldState.error?.message,
                    },
                  }}
                  disabled={props.readonly}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Controller
              name="golive"
              control={form.control}
              render={({ field, fieldState }) => (
                <DatePicker
                  label="Golive"
                  value={field.value ? dayjs(field.value) : null}
                  onChange={(date) =>
                    field.onChange(date ? dayjs(date).format("YYYY-MM-DD") : null)
                  }
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: "small",
                      error: !!fieldState.error,
                      helperText: fieldState.error?.message,
                    },
                  }}
                  disabled={props.readonly}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextControlWidget control={form.control} name="tanggal_golive_diagram_hari" label="Tanggal Golive Diagram Hari" type="text" maxLength={225} disabled={props.readonly} labelOnTextField />
          </Grid>

          <Grid item xs={12} md={4}>
            <Controller
              name="tanggal_perizinan"
              control={form.control}
              render={({ field, fieldState }) => (
                <DatePicker
                  label="Tanggal Perizinan"
                  value={field.value ? dayjs(field.value) : null}
                  onChange={(date) =>
                    field.onChange(date ? dayjs(date).format("YYYY-MM-DD") : null)
                  }
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: "small",
                      error: !!fieldState.error,
                      helperText: fieldState.error?.message,
                    },
                  }}
                  disabled={props.readonly}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextControlWidget control={form.control} name="nama_mitra" label="Nama Mitra" type="text" maxLength={225} disabled={props.readonly} labelOnTextField />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextControlWidget control={form.control} name="pembayaran_cc" label="Pembayaran Cc" type="text" maxLength={225} disabled={props.readonly} labelOnTextField />
          </Grid>
          <Grid item xs={12} md={4}>
            <Controller
              name="tgl_eprop"
              control={form.control}
              render={({ field, fieldState }) => (
                <DatePicker
                  label="Tgl Eprop"
                  value={field.value ? dayjs(field.value) : null}
                  onChange={(date) =>
                    field.onChange(date ? dayjs(date).format("YYYY-MM-DD") : null)
                  }
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: "small",
                      error: !!fieldState.error,
                      helperText: fieldState.error?.message,
                    },
                  }}
                  disabled={props.readonly}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextControlWidget control={form.control} name="day" label="Day" type="text" maxLength={225} disabled={props.readonly} labelOnTextField />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextControlWidget control={form.control} name="weekly_gl" label="Weekly Gl" type="text" maxLength={225} disabled={props.readonly} labelOnTextField />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextControlWidget control={form.control} name="weekly_komit_gl" label="Weekly Komit Gl" type="text" maxLength={225} disabled={props.readonly} labelOnTextField />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextControlWidget control={form.control} name="durasi_perizinan" label="Durasi Perizinan" type="text" maxLength={225} disabled={props.readonly} labelOnTextField />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextControlWidget control={form.control} name="po" label="Po" type="text" maxLength={225} disabled={props.readonly} labelOnTextField />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextControlWidget control={form.control} name="regional_area" label="Regional Area" type="text" maxLength={225} disabled={props.readonly} labelOnTextField />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextControlWidget control={form.control} name="m_golive" label="M Golive" type="text" maxLength={225} disabled={props.readonly} labelOnTextField />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextControlWidget control={form.control} name="y_golive" label="Y Golive" type="text" maxLength={225} disabled={props.readonly} labelOnTextField />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextControlWidget control={form.control} name="status_tomps" label="Status Tomps" type="text" maxLength={225} disabled={props.readonly} labelOnTextField />
          </Grid>
          <Grid item xs={12} md={4}>
            <Controller
              name="tanggal"
              control={form.control}
              render={({ field, fieldState }) => (
                <DatePicker
                  label="Tanggal"
                  value={field.value ? dayjs(field.value) : null}
                  onChange={(date) =>
                    field.onChange(date ? dayjs(date).format("YYYY-MM-DD") : null)
                  }
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: "small",
                      error: !!fieldState.error,
                      helperText: fieldState.error?.message,
                    },
                  }}
                  disabled={props.readonly}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextControlWidget control={form.control} name="status_ihld_0608" label="Status Ihld 0608" type="text" maxLength={225} disabled={props.readonly} labelOnTextField />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextControlWidget control={form.control} name="status_ihld_1108" label="Status Ihld 1108" type="text" maxLength={225} disabled={props.readonly} labelOnTextField />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextControlWidget control={form.control} name="status_ihld" label="Status Ihld" type="text" maxLength={225} disabled={props.readonly} labelOnTextField />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextControlWidget control={form.control} name="status_eproposal" label="Status Eproposal" type="text" maxLength={225} disabled={props.readonly} labelOnTextField />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextControlWidget control={form.control} name="status_proyek" label="Status Proyek" type="text" maxLength={225} disabled={props.readonly} labelOnTextField />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextControlWidget control={form.control} name="telkomsel_branch" label="Telkomsel Branch" type="text" maxLength={225} disabled={props.readonly} labelOnTextField />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextControlWidget control={form.control} name="batch" label="Batch" type="text" maxLength={225} disabled={props.readonly} labelOnTextField />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextControlWidget control={form.control} name="status_lop_ed" label="Status Lop Ed" type="text" maxLength={225} disabled={props.readonly} labelOnTextField />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextControlWidget control={form.control} name="status_lop_kons2025" label="Status Lop Kons2025" type="text" maxLength={225} disabled={props.readonly} labelOnTextField />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextControlWidget control={form.control} name="status_smile" label="Status Smile" type="text" maxLength={225} disabled={props.readonly} labelOnTextField />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextControlWidget control={form.control} name="bast_material" label="Bast Material" type="text" maxLength={225} disabled={props.readonly} labelOnTextField />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextControlWidget control={form.control} name="bast_jasa" label="Bast Jasa" type="text" maxLength={225} disabled={props.readonly} labelOnTextField />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextControlWidget control={form.control} name="durasi_eprop_to_fi" label="Durasi Eprop To Fi" type="text" maxLength={225} disabled={props.readonly} labelOnTextField />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextControlWidget control={form.control} name="durasi_fi_to_golive" label="Durasi Fi To Golive" type="text" maxLength={225} disabled={props.readonly} labelOnTextField />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextControlWidget control={form.control} name="durasi_eprop_to_golive" label="Durasi Eprop To Golive" type="text" maxLength={225} disabled={props.readonly} labelOnTextField />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextControlWidget control={form.control} name="bulan_submit_to_eprop" label="Bulan Submit To Eprop" type="text" maxLength={225} disabled={props.readonly} labelOnTextField />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextControlWidget control={form.control} name="year_submit_to_eprop" label="Year Submit To Eprop" type="text" maxLength={225} disabled={props.readonly} labelOnTextField />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextControlWidget control={form.control} name="sla_pt3" label="Sla Pt3" type="text" maxLength={225} disabled={props.readonly} labelOnTextField />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextControlWidget control={form.control} name="branch" label="Branch" type="text" maxLength={225} disabled={props.readonly} labelOnTextField />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextControlWidget control={form.control} name="idsw" label="Idsw" type="text" maxLength={225} disabled={props.readonly} labelOnTextField />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextControlWidget control={form.control} name="bulan_golive" label="Bulan Golive" type="text" maxLength={225} disabled={props.readonly} labelOnTextField />
          </Grid>
        </Grid>
        {!props.readonly && (
          <Box display={"flex"} flexDirection={"row-reverse"} justifyContent={"end"} width={"100%"} marginTop={"1rem"} gap={"1rem"}>
            <Button color="primary" variant="contained" size="small" type="submit" startIcon={<Save />} endIcon={fetching && <CircularProgress color="inherit" size={"1rem"} />} disabled={fetching}>
              Submit
            </Button>
          </Box>
        )}
      </form>
    </Dialogs>
  );
};

export default UpsertForm;
