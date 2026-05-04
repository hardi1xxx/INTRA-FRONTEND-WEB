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
import { GET_REGIONAL, GET_REGIONAL_DROPDOWN } from "@/lib/redux/types";
import { parseStatus } from "@/lib/services/parseStatus";
import { FilterAutoComplete } from "@/components/Input/FilterAutoComplete";
import { regionalActions } from "@/lib/redux/slices/master/regional";

type FilterType = {
  setResetSearch: React.Dispatch<React.SetStateAction<boolean>>;
};

const TableFilter = ({ setResetSearch }: FilterType) => {
  const dispatch = useDispatch();
  const { dropdownOptions, dropdownOptionsLoading, params } = useSelector((state: RootState) => state.regional);

  const schema = yup.object({
    status: yup.string().optional().nullable(),
    regional_code: yup.string().optional().nullable(),
    regional_name: yup.string().optional().nullable(),
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
      regional_name: "",
      regional_code: "",
      status: "all",
    },
  });

  const onSubmit: SubmitHandler<yup.InferType<typeof schema>> = (data) => {
    dispatch(regionalActions.setIsFiltered(true));
    dispatch(regionalActions.setParams({ ...params, ...data, start: 0 }));
    dispatch({ type: GET_REGIONAL });
  };

  const onClear = () => {
    dispatch(regionalActions.setIsFiltered(false));
    setResetSearch(true)
    reset();
    dispatch(regionalActions.resetDropdownOptions());
    dispatch(regionalActions.clearParams());
    dispatch(regionalActions.receiveNo());
  };

  const onInputChange = (field: string) => (event: SyntheticEvent<Element, Event>, value: string, reason: AutocompleteInputChangeReason) => {
    if (reason === "input") {
      if (value.length >= 1) {
        const filter = form.getValues();
        filter.status = parseStatus(filter.status);
        dispatch({
          type: GET_REGIONAL_DROPDOWN,
          payload: {
            ...filter,
            column: field,
            [field]: field == "status" ? (value == "active" ? true : false) : value,
          },
        });
      } else {
        dispatch(regionalActions.resetDropdownOptions());
      }
    } else if (reason === "clear") {
      form.setValue(field as any, "");
      dispatch(regionalActions.resetDropdownOptions());
    }
  };

  const onClose = (field: keyof yup.InferType<typeof schema>) => {
    return () => {
      const selected = form.getValues(field);
      const options = (dropdownOptions[field] ?? []).filter((item) => item.value == selected);
      dispatch(
        regionalActions.receiveDropdownOptions({
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
            {/* Regional Name */}
            <Grid item xs={12} md={3}>
              <Box marginY={0}>
                <FilterAutoComplete
                  control={controller_filter}
                  field="regional_name"
                  label="Regional Name"
                  loading={dropdownOptionsLoading}
                  error={errors["regional_name"]?.message}
                  options={(dropdownOptions.regional_name ?? []).map((item) => item.value.toString())}
                  onInputChange={debounce(onInputChange("regional_name"), 500)}
                  onClose={onClose("regional_name")}
                />
              </Box>
            </Grid>
            {/* Regional Code */}
            <Grid item xs={12} md={3}>
              <Box marginY={0}>
                <FilterAutoComplete
                  control={controller_filter}
                  field="regional_code"
                  label="Regional Code"
                  loading={dropdownOptionsLoading}
                  error={errors["regional_code"]?.message}
                  options={(dropdownOptions.regional_code ?? []).map((item) => item.value.toString())}
                  onInputChange={debounce(onInputChange("regional_code"), 500)}
                  onClose={onClose("regional_code")}
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