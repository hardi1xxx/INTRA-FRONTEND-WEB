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
import { GET_BATCH, GET_BATCH_DROPDOWN, GET_BATCH_FILTER } from "@/lib/redux/types";
import { parseStatus } from "@/lib/services/parseStatus";
import { FilterAutoComplete } from "@/components/Input/FilterAutoComplete";
import { batchActions } from "@/lib/redux/slices/master/batch";

type FilterType = {
  setResetSearch: React.Dispatch<React.SetStateAction<boolean>>;
};

const TableFilter = ({ setResetSearch }: FilterType) => {
  const dispatch = useDispatch();
  const { dropdownOptions, dropdownOptionsLoading, params } = useSelector((state: RootState) => state.batch);

  const schema = yup.object({
    status: yup.string().optional().nullable(),
    batch_code: yup.string().optional().nullable(),
    batch_name: yup.string().optional().nullable(),
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
      batch_name: "",
      batch_code: "",
      status: "all",
    },
  });

  const onSubmit: SubmitHandler<yup.InferType<typeof schema>> = (data) => {
    dispatch(batchActions.setIsFiltered(true));
    dispatch(batchActions.setParams({ ...params, ...data, start: 0 }));
    dispatch({ type: GET_BATCH });
  };

  const onClear = () => {
    dispatch(batchActions.setIsFiltered(false));
    setResetSearch(true)
    reset();
    dispatch(batchActions.resetDropdownOptions());
    dispatch(batchActions.clearParams());
    dispatch(batchActions.receiveNo());
  };

  const onInputChange = (field: string) => (event: SyntheticEvent<Element, Event>, value: string, reason: AutocompleteInputChangeReason) => {
    if (reason === "input") {
      if (value.length >= 1) {
        const filter = form.getValues();
        filter.status = parseStatus(filter.status);
        dispatch({
          type: GET_BATCH_FILTER,
          payload: {
            ...filter,
            column: field,
            [field]: field == "status" ? (value == "active" ? true : false) : value,
          },
        });
      } else {
        dispatch(batchActions.resetDropdownOptions());
      }
    } else if (reason === "clear") {
      form.setValue(field as any, "");
      dispatch(batchActions.resetDropdownOptions());
    }
  };

  const onClose = (field: keyof yup.InferType<typeof schema>) => {
    return () => {
      const selected = form.getValues(field);
      const options = (dropdownOptions[field] ?? []).filter((item) => item.value == selected);
      dispatch(
        batchActions.receiveDropdownOptions({
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
      padding={'24px'}
      borderRadius={"12px"}
      gap={"0.5rem"}
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
            {/* Batch Name */}
            <Grid item xs={12} md={3}>
              <Box marginY={0}>
                <FilterAutoComplete
                  control={controller_filter}
                  field="batch_name"
                  label="Batch Name"
                  loading={dropdownOptionsLoading}
                  error={errors["batch_name"]?.message}
                  options={(dropdownOptions.batch_name ?? []).map((item) => item.value.toString())}
                  onInputChange={debounce(onInputChange("batch_name"), 500)}
                  onClose={onClose("batch_name")}
                />
              </Box>
            </Grid>
            {/* Batch Code */}
            <Grid item xs={12} md={3}>
              <Box marginY={0}>
                <FilterAutoComplete
                  control={controller_filter}
                  field="batch_code"
                  label="Batch Code"
                  loading={dropdownOptionsLoading}
                  error={errors["batch_code"]?.message}
                  options={(dropdownOptions.batch_code ?? []).map((item) => item.value.toString())}
                  onInputChange={debounce(onInputChange("batch_code"), 500)}
                  onClose={onClose("batch_code")}
                />
              </Box>
            </Grid>
            {/* button action */}
            <Grid item xs={12} md={3}>
              <Box display={'flex'} justifyContent={'end'} alignItems={'center'} gap={'1rem'} height={'100%'}>
                <Button color="info" variant="contained" size="small" onClick={onClear} startIcon={<Clear />} sx={{borderRadius: "12px"}}>
                    Clear
                </Button>
                <Button color="primary" variant="contained" size="small" type="submit" startIcon={<Search />} sx={{borderRadius: "12px"}}>
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

export default TableFilter;