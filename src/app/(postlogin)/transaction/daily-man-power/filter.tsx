"use client";
import React, { SyntheticEvent, useEffect, useState } from "react";
import { Clear, Search } from "@mui/icons-material";
import { AutocompleteInputChangeReason, Box, Button, debounce, Grid } from "@mui/material";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import { RootState } from "@/lib/redux/store";
import { yupResolver } from "@hookform/resolvers/yup";
import { GET_DAILY_MANPOWER, GET_DAILY_MANPOWER_DROPDOWN } from "@/lib/redux/types";
import { dailyManPowerActions } from "@/lib/redux/slices/transaction/dailyManPower";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { FilterAutoComplete } from "@/components/Input/FilterAutoComplete";

export default function TableFilter() {
  const dispatch = useDispatch();
  const { dropdownOptions, dropdownOptionsLoading, params } = useSelector((state: RootState) => state.witel);
  const [creationDate, setCreationDate] = useState<dayjs.Dayjs | null>(null)

  const schema = yup.object({
    witel: yup.string().optional().nullable(),
    date: yup.date().optional().nullable(),
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
      witel: "",
      date: null
    },
  });

  const onSubmit: SubmitHandler<yup.InferType<typeof schema>> = (data) => {
    const formattedData = {
      ...data,
      date: data.date ? dayjs(data.date).format("YYYY-MM-DD") : null,
    };
    dispatch(dailyManPowerActions.setIsFiltered(true));
    dispatch(dailyManPowerActions.setParams({ ...params, ...formattedData, start: 0 }));
    dispatch({ type: GET_DAILY_MANPOWER });
  };

  const onClear = () => {
    dispatch(dailyManPowerActions.setIsFiltered(false));
    reset();
    dispatch(dailyManPowerActions.resetDropdownOptions());
    dispatch(dailyManPowerActions.clearParams());
    dispatch(dailyManPowerActions.receiveNo());
    setCreationDate(null)
  };

  const onInputChange = (field: string) => (event: SyntheticEvent<Element, Event>, value: string, reason: AutocompleteInputChangeReason) => {
    if (reason === "input") {
      if (value.length >= 1) {
        const filter = form.getValues();
        dispatch({
          type: GET_DAILY_MANPOWER_DROPDOWN,
          payload: {
            ...filter,
            column: field,
            [field]: value,
          },
        });
      } else {
        dispatch(dailyManPowerActions.resetDropdownOptions());
      }
    } else if (reason === "clear") {
      form.setValue(field as any, "");
      dispatch(dailyManPowerActions.resetDropdownOptions());
    }
  };

  const onClose = (field: keyof yup.InferType<typeof schema>) => {
    return () => {
      const selected = form.getValues(field);
      const options = (dropdownOptions[field] ?? []).filter((item) => item.value == selected);
      dispatch(
        dailyManPowerActions.receiveDropdownOptions({
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
            {/* Date */}
            <Grid item xs={12} md={3}>
              <Controller
                name="date"
                control={controller_filter}
                render={({ field }) => (
                  <DatePicker
                    label="Date"
                    value={field.value ? dayjs(field.value) : null}
                    onChange={(newValue) => field.onChange(newValue ? newValue.toDate() : null)}
                    format="DD MMM YYYY"
                    slotProps={{
                      textField: {
                        size: "small",
                        fullWidth: true,
                        error: !!errors.date,
                        helperText: errors.date?.message,
                      },
                    }}
                  />
                )}
              />
            </Grid>
            {/* button action */}
            <Grid item xs={12} md={6}>
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
