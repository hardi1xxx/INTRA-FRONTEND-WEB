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
import { GET_SHIFT, GET_SHIFT_DROPDOWN } from "@/lib/redux/types";
import { shiftActions } from "@/lib/redux/slices/master/shift";
import { parseStatus } from "@/lib/services/parseStatus";
import { FilterAutoComplete } from "@/components/Input/FilterAutoComplete";

export default function TableFilter() {
  const dispatch = useDispatch();
  const { dropdownOptions, dropdownOptionsLoading, params } = useSelector((state: RootState) => state.shift);

  const schema = yup.object({
    status: yup.string().optional().nullable(),
    area: yup.string().optional().nullable(),
    shift: yup.string().optional().nullable(),
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
      area: "",
      shift: "",
      status: "all",
    },
  });

  const onSubmit: SubmitHandler<yup.InferType<typeof schema>> = (data) => {
    dispatch(shiftActions.setIsFiltered(true));
    dispatch(shiftActions.setParams({ ...params, ...data, start: 0 }));
    dispatch({ type: GET_SHIFT });
  };

  const onClear = () => {
    dispatch(shiftActions.setIsFiltered(false));
    reset();
    dispatch(shiftActions.resetDropdownOptions());
    dispatch(shiftActions.clearParams());
    dispatch(shiftActions.receiveNo());
  };

  const onInputChange = (field: string) => (event: SyntheticEvent<Element, Event>, value: string, reason: AutocompleteInputChangeReason) => {
    if (reason === "input") {
      if (value.length >= 1) {
        const filter = form.getValues();
        filter.status = parseStatus(filter.status);
        dispatch({
          type: GET_SHIFT_DROPDOWN,
          payload: {
            ...filter,
            column: field,
            [field]: field == "status" ? (value == "active" ? true : false) : value,
          },
        });
      } else {
        dispatch(shiftActions.resetDropdownOptions());
      }
    } else if (reason === "clear") {
      form.setValue(field as any, "");
      dispatch(shiftActions.resetDropdownOptions());
    }
  };

  const onClose = (field: keyof yup.InferType<typeof schema>) => {
    return () => {
      const selected = form.getValues(field);
      const options = (dropdownOptions[field] ?? []).filter((item) => item.value == selected);
      dispatch(
        shiftActions.receiveDropdownOptions({
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
            {/* Area */}
            <Grid item xs={12} md={3}>
              <Box marginY={0}>
                <FilterAutoComplete
                  control={controller_filter}
                  field="area"
                  label="Area"
                  loading={dropdownOptionsLoading}
                  error={errors["area"]?.message}
                  options={(dropdownOptions.area ?? []).map((item) => item.value.toString())}
                  onInputChange={debounce(onInputChange("area"), 500)}
                  onClose={onClose("area")}
                />
              </Box>
            </Grid>
            {/* Shift */}
            <Grid item xs={12} md={3}>
              <Box marginY={0}>
                <FilterAutoComplete
                  control={controller_filter}
                  field="shift"
                  label="Shift"
                  loading={dropdownOptionsLoading}
                  error={errors["shift"]?.message}
                  options={(dropdownOptions.shift ?? []).map((item) => item.value.toString())}
                  onInputChange={debounce(onInputChange("shift"), 500)}
                  onClose={onClose("shift")}
                />
              </Box>
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
