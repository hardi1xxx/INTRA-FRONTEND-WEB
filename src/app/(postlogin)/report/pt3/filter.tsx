"use client";
import React, { SyntheticEvent, useEffect, useState } from "react";
import { useTable } from "@/components/Table";
import { Clear, Search } from "@mui/icons-material";
import { AutocompleteInputChangeReason, Box, Button, debounce, FormControl, FormHelperText, Grid, MenuItem, TextField } from "@mui/material";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import { RootState } from "@/lib/redux/store";
import { yupResolver } from "@hookform/resolvers/yup";
import { GET_REPORT_PT3, GET_REPORT_PT3_DROPDOWN } from "@/lib/redux/types";
import { reportPT3Actions } from "@/lib/redux/slices/report/reportPT3";
import { parseStatus } from "@/lib/services/parseStatus";
import { FilterAutoComplete } from "@/components/Input/FilterAutoComplete";

export default function TableFilter() {
  const dispatch = useDispatch();
  const { dropdownOptions, dropdownOptionsLoading, params } = useSelector((state: RootState) => state.reportPT3);

  const schema = yup.object({
    tematik: yup.string().optional().nullable(),
    status_osm: yup.string().optional().nullable(),
    witel: yup.string().optional().nullable(),
    year_submit_to_eprop: yup.string().optional().nullable(),
    batch: yup.string().optional().nullable(),
    regional_area: yup.string().optional().nullable(),
  });

  const {
    control: controller_filter,
    formState: { errors },
    handleSubmit,
    reset,
    ...form
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      tematik:"",
      status_osm:"",
      witel:"",
      year_submit_to_eprop:"",
      batch:"",
      regional_area:"",
    },
  });

  const onSubmit: SubmitHandler<yup.InferType<typeof schema>> = (data) => {
    dispatch(reportPT3Actions.setIsFiltered(true));
    dispatch(reportPT3Actions.setParams({ ...params, ...data, start: 0 }));
    dispatch({ type: GET_REPORT_PT3 });
  };

  const onClear = () => {
    dispatch(reportPT3Actions.setIsFiltered(false));
    reset();
    dispatch(reportPT3Actions.resetDropdownOptions());
    dispatch(reportPT3Actions.clearParams());
    dispatch(reportPT3Actions.receiveNo());
  };

  const onInputChange = (field: string) => (event: SyntheticEvent<Element, Event>, value: string, reason: AutocompleteInputChangeReason) => {
    if (reason === "input") {
      if (value.length >= 1) {
        const filter = form.getValues();
        dispatch({
          type: GET_REPORT_PT3_DROPDOWN,
          payload: {
            ...filter,
            column: field,
            [field]: value,
          },
        });
      } else {
        dispatch(reportPT3Actions.resetDropdownOptions());
      }
    } else if (reason === "clear") {
      form.setValue(field as any, "");
      dispatch(reportPT3Actions.resetDropdownOptions());
    }
  };

  const onClose = (field: keyof yup.InferType<typeof schema>) => {
    return () => {
      const selected = form.getValues(field);
      const options = (dropdownOptions[field] ?? []).filter((item) => item.value == selected);
      dispatch(
        reportPT3Actions.receiveDropdownOptions({
          column: field,
          options: options,
        })
      );
    };
  };

  return (
    <Box
      sx={{
        backgroundColor: "white",
        height: "auto",
      }}
      display={"flex"}
      flexDirection={"column"}
      paddingX={"10px"}
      paddingY={"10px"}
      borderRadius={"8px"}
      gap={"1rem"}
      flexGrow={0.1}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box display={"flex"} flexDirection={"column"} width={"100%"} gap={"1rem"}>
          <Grid container columnSpacing={"0.5rem"} rowSpacing={"0.5rem"}>
            {/* Tematik */}
            <Grid item xs={12} md={3}>
              <Box marginY={0}>
                <FilterAutoComplete
                  control={controller_filter}
                  field="tematik"
                  label="Tematik"
                  loading={dropdownOptionsLoading}
                  error={errors["tematik"]?.message}
                  options={(dropdownOptions.tematik ?? []).map((item) => item.value.toString())}
                  onInputChange={debounce(onInputChange("tematik"), 500)}
                  onClose={onClose("tematik")}
                />
              </Box>
            </Grid>
            {/* Status OSM */}
            <Grid item xs={12} md={3}>
              <Box marginY={0}>
                <FilterAutoComplete
                  control={controller_filter}
                  field="status_osm"
                  label="Status OSM"
                  loading={dropdownOptionsLoading}
                  error={errors["status_osm"]?.message}
                  options={(dropdownOptions.status_osm ?? []).map((item) => item.value.toString())}
                  onInputChange={debounce(onInputChange("status_osm"), 500)}
                  onClose={onClose("status_osm")}
                />
              </Box>
            </Grid>
            {/* Witel */}
            <Grid item xs={12} md={3}>
              <Box marginY={0}>
                <FilterAutoComplete
                  control={controller_filter}
                  field="witel"
                  label="Witel"
                  loading={dropdownOptionsLoading}
                  error={errors["witel"]?.message}
                  options={(dropdownOptions.witel ?? []).map((item) => item.value.toString())}
                  onInputChange={debounce(onInputChange("witel"), 500)}
                  onClose={onClose("witel")}
                />
              </Box>
            </Grid>
            {/* Tahun */}
            <Grid item xs={12} md={3}>
              <Box marginY={0}>
                <FilterAutoComplete
                  control={controller_filter}
                  field="year_submit_to_eprop"
                  label="Tahun"
                  loading={dropdownOptionsLoading}
                  error={errors["year_submit_to_eprop"]?.message}
                  options={(dropdownOptions.year_submit_to_eprop ?? []).map((item) => item.value.toString())}
                  onInputChange={debounce(onInputChange("year_submit_to_eprop"), 500)}
                  onClose={onClose("year_submit_to_eprop")}
                />
              </Box>
            </Grid>
            {/* Batch */}
            <Grid item xs={12} md={3}>
              <Box marginY={0}>
                <FilterAutoComplete
                  control={controller_filter}
                  field="batch"
                  label="Batch"
                  loading={dropdownOptionsLoading}
                  error={errors["batch"]?.message}
                  options={(dropdownOptions.batch ?? []).map((item) => item.value.toString())}
                  onInputChange={debounce(onInputChange("batch"), 500)}
                  onClose={onClose("batch")}
                />
              </Box>
            </Grid>
            {/* Regional */}
            <Grid item xs={12} md={3}>
              <Box marginY={0}>
                <FilterAutoComplete
                  control={controller_filter}
                  field="regional_area"
                  label="Regional"
                  loading={dropdownOptionsLoading}
                  error={errors["regional_area"]?.message}
                  options={(dropdownOptions.regional_area ?? []).map((item) => item.value.toString())}
                  onInputChange={debounce(onInputChange("regional_area"), 500)}
                  onClose={onClose("regional_area")}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
            </Grid>
            {/* button action */}
            <Grid item xs={12} md={3}>
              <Box display={'flex'} justifyContent={'end'} alignItems={'center'} gap={'1rem'} height={'100%'}>
                <Button color="info" variant="contained" size="small" onClick={onClear} startIcon={<Clear />}>
                    Clear
                </Button>
                <Button color="primary" variant="contained" size="small" type="submit" startIcon={<Search />}>
                    Search
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </form>
    </Box>
  );
}
