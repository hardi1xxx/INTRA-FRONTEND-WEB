"use client";
import React, { SyntheticEvent } from "react";
import { Clear, Search } from "@mui/icons-material";
import { AutocompleteInputChangeReason, Box, Button, debounce, FormControl, FormHelperText, Grid, MenuItem, TextField } from "@mui/material";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import { RootState } from "@/lib/redux/store";
import { yupResolver } from "@hookform/resolvers/yup";
import { GET_CATEGORY_PROJECT, GET_CATEGORY_PROJECT_DROPDOWN } from "@/lib/redux/types";
import { parseStatus } from "@/lib/services/parseStatus";
import { FilterAutoComplete } from "@/components/Input/FilterAutoComplete";
import { categoryProjectActions } from "@/lib/redux/slices/master/categoryProject";

type FilterType = {
  setResetSearch: React.Dispatch<React.SetStateAction<boolean>>;
};

const TableFilter = ({ setResetSearch }: FilterType) => {
  const dispatch = useDispatch();
  const { dropdownOptions, dropdownOptionsLoading, params } = useSelector((state: RootState) => state.categoryProject);

  const schema = yup.object({
    status: yup.string().optional().nullable(),
    category_code: yup.string().optional().nullable(),
    category_name: yup.string().optional().nullable(),
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
      category_name: "",
      category_code: "",
      status: "all",
    },
  });

  const onSubmit: SubmitHandler<yup.InferType<typeof schema>> = (data) => {
    dispatch(categoryProjectActions.setIsFiltered(true));
    dispatch(categoryProjectActions.setParams({ ...params, ...data, start: 0 }));
    dispatch({ type: GET_CATEGORY_PROJECT });
  };

  const onClear = () => {
    dispatch(categoryProjectActions.setIsFiltered(false));
    setResetSearch(true)
    reset();
    dispatch(categoryProjectActions.resetDropdownOptions());
    dispatch(categoryProjectActions.clearParams());
    dispatch(categoryProjectActions.receiveNo());
  };

  const onInputChange = (field: string) => (event: SyntheticEvent<Element, Event>, value: string, reason: AutocompleteInputChangeReason) => {
    if (reason === "input") {
      if (value.length >= 1) {
        const filter = form.getValues();
        filter.status = parseStatus(filter.status);
        dispatch({
          type: GET_CATEGORY_PROJECT_DROPDOWN,
          payload: {
            ...filter,
            column: field,
            [field]: field == "status" ? (value == "active" ? true : false) : value,
          },
        });
      } else {
        dispatch(categoryProjectActions.resetDropdownOptions());
      }
    } else if (reason === "clear") {
      form.setValue(field as any, "");
      dispatch(categoryProjectActions.resetDropdownOptions());
    }
  };

  const onClose = (field: keyof yup.InferType<typeof schema>) => {
    return () => {
      const selected = form.getValues(field);
      const options = (dropdownOptions[field] ?? []).filter((item) => item.value == selected);
      dispatch(
        categoryProjectActions.receiveDropdownOptions({
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
            {/* Category Project Name */}
            <Grid item xs={12} md={3}>
              <Box marginY={0}>
                <FilterAutoComplete
                  control={controller_filter}
                  field="category_name"
                  label="Category Project Name"
                  loading={dropdownOptionsLoading}
                  error={errors["category_name"]?.message}
                  options={(dropdownOptions.category_name ?? []).map((item) => item.value.toString())}
                  onInputChange={debounce(onInputChange("category_name"), 500)}
                  onClose={onClose("category_name")}
                />
              </Box>
            </Grid>
            {/* Category Project Code */}
            <Grid item xs={12} md={3}>
              <Box marginY={0}>
                <FilterAutoComplete
                  control={controller_filter}
                  field="category_code"
                  label="Category Project Code"
                  loading={dropdownOptionsLoading}
                  error={errors["category_code"]?.message}
                  options={(dropdownOptions.category_code ?? []).map((item) => item.value.toString())}
                  onInputChange={debounce(onInputChange("category_code"), 500)}
                  onClose={onClose("category_code")}
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