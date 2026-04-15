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
import { GET_WITEL, GET_WITEL_DROPDOWN } from "@/lib/redux/types";
import { witelActions } from "@/lib/redux/slices/master/witel";
import { parseStatus } from "@/lib/services/parseStatus";
import { FilterAutoComplete } from "@/components/Input/FilterAutoComplete";

export default function TableFilter() {
  const dispatch = useDispatch();
  const { dropdownOptions, dropdownOptionsLoading, params } = useSelector((state: RootState) => state.witel);

  const schema = yup.object({
    status: yup.string().optional().nullable(),
    regional: yup.string().optional().nullable(),
    witel: yup.string().optional().nullable(),
    sto: yup.string().optional().nullable(),
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
      regional: "",
      witel: "",
      sto: "",
      status: "all",
    },
  });

  const onSubmit: SubmitHandler<yup.InferType<typeof schema>> = (data) => {
    dispatch(witelActions.setIsFiltered(true));
    dispatch(witelActions.setParams({ ...params, ...data, start: 0 }));
    dispatch({ type: GET_WITEL });
  };

  const onClear = () => {
    dispatch(witelActions.setIsFiltered(false));
    reset();
    dispatch(witelActions.resetDropdownOptions());
    dispatch(witelActions.clearParams());
    dispatch(witelActions.receiveNo());
  };

  const onInputChange = (field: string) => (event: SyntheticEvent<Element, Event>, value: string, reason: AutocompleteInputChangeReason) => {
    if (reason === "input") {
      if (value.length >= 1) {
        const filter = form.getValues();
        filter.status = parseStatus(filter.status);
        dispatch({
          type: GET_WITEL_DROPDOWN,
          payload: {
            ...filter,
            column: field,
            [field]: field == "status" ? (value == "active" ? true : false) : value,
          },
        });
      } else {
        dispatch(witelActions.resetDropdownOptions());
      }
    } else if (reason === "clear") {
      form.setValue(field as any, "");
      dispatch(witelActions.resetDropdownOptions());
    }
  };

  const onClose = (field: keyof yup.InferType<typeof schema>) => {
    return () => {
      const selected = form.getValues(field);
      const options = (dropdownOptions[field] ?? []).filter((item) => item.value == selected);
      dispatch(
        witelActions.receiveDropdownOptions({
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
          {/* status */}
            <Grid item xs={12} md={3}>
              <Box marginY={0}>
                <Controller
                  name="status"
                  control={controller_filter}
                  render={({ field }) => {
                    return (
                      <FormControl error={errors["status"] != undefined} variant="outlined" fullWidth size="small">
                        <TextField
                            id="status"
                            value={field.value ?? "all"}
                            label="Status"
                            variant="outlined"
                            size="small"
                            select
                            onChange={(event) => {
                              field.onChange(event.target.value);
                            }}
                          >
                          <MenuItem value={"all"}>All Status</MenuItem>
                          <MenuItem value={"1"}>Active</MenuItem>
                          <MenuItem value={"0"}>Inactive</MenuItem>
                        </TextField>
                        <FormHelperText id="status-text">{errors["status"]?.message as string}</FormHelperText>
                      </FormControl>
                    );
                  }}
                />
              </Box>
            </Grid>
            {/* Regional */}
            <Grid item xs={12} md={3}>
              <Box marginY={0}>
                <FilterAutoComplete
                  control={controller_filter}
                  field="regional"
                  label="Regional"
                  loading={dropdownOptionsLoading}
                  error={errors["regional"]?.message}
                  options={(dropdownOptions.regional ?? []).map((item) => item.value.toString())}
                  onInputChange={debounce(onInputChange("regional"), 500)}
                  onClose={onClose("regional")}
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
            {/* STO */}
            <Grid item xs={12} md={3}>
              <Box marginY={0}>
                <FilterAutoComplete
                  control={controller_filter}
                  field="sto"
                  label="STO"
                  loading={dropdownOptionsLoading}
                  error={errors["sto"]?.message}
                  options={(dropdownOptions.sto ?? []).map((item) => item.value.toString())}
                  onInputChange={debounce(onInputChange("sto"), 500)}
                  onClose={onClose("sto")}
                />
              </Box>
            </Grid>
            {/* button action */}
            <Grid item xs={12} md={12}>
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
