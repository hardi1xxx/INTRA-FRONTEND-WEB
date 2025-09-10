import { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Save } from "@mui/icons-material";
import { AutocompleteInputChangeReason, Box, Button, CircularProgress, debounce, FormControl, FormHelperText, Grid, InputLabel, MenuItem, TextField } from "@mui/material";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";

import { Dialogs } from "@/components/dialog";
import FormBuilder from "@/components/FormBuilder";
import { IFormLayout } from "@/components/FormBuilder/interfaces";
import { RootState } from "@/lib/redux/store";
import { CREATE_SHIFT, GET_AREA, GET_AREA_DROPDOWN, UPDATE_SHIFT } from "@/lib/redux/types";
import { WithId } from "@/type/services";
import { UpsertShiftRequest, upsertShiftSchema } from "./schema";
import { TextControlWidget } from "@/components/Input/TextControlWidget";
import { AutoCompleteWidget } from "@/components/Input/AutoCompleteWidget";
import { areaActions } from "@/lib/redux/slices/master/area";
import { shiftActions } from "@/lib/redux/slices/master/shift";

type FormType = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  data?: UpsertShiftRequest & WithId;
  onUpsert?: () => void;
  readonly?: boolean;
};

const UpsertForm = ({ open, setOpen, data, ...props }: FormType) => {
  const dispatch = useDispatch();
  const { fetching } = useSelector((state: RootState) => state.shift);
  const { severity } = useSelector((state: RootState) => state.notification);
  const area = useSelector((state: RootState) => state.area);
  const { handleSubmit, reset, ...form } = useForm({
    resolver: yupResolver(upsertShiftSchema),
    defaultValues: {
      shift: "",
      status: true,
    },
  });

  useEffect(() => {
    if (data?.id) {
      reset(data);
      dispatch(
        areaActions.receiveDropdownOptions({
          column: "area",
          options: [
            {
              label: data.area,
              value: data.area,
            },
          ],
        })
      );
    } else {
      dispatch(
        areaActions.receiveDropdownOptions({
          column: "area",
          options: [],
        })
      );
      reset({
        area: undefined,
        shift: "",
        status: true,
      });
    }
  }, [data, dispatch, open, reset]);

  useEffect(() => {
    if (severity == "success") {
      reset();
      setOpen(false);
      props.onUpsert?.();
      dispatch(shiftActions.setIsFiltered(true));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [severity]);

  const onSubmit: SubmitHandler<UpsertShiftRequest> = (values) => {
    if (data?.id) {
      dispatch({
        type: UPDATE_SHIFT,
        payload: { id: data.id, ...values },
      });
    } else {
      dispatch({ type: CREATE_SHIFT, payload: { ...values } });
    }
  };

  const getAreaHandler = (search: string) => {
    dispatch({
      type: GET_AREA_DROPDOWN,
      payload: {
        column: "area",
        area: search,
        status: 1
      },
    });
  };

  const onInputChange = (name: string) => (event: React.SyntheticEvent<Element, Event>, value: string, reason: AutocompleteInputChangeReason) => {
    if (reason !== "input") return;

    if (value.trim() === "") {
      // Kosongkan data area
      dispatch(areaActions.receive({ data: [], recordsFiltered: 0, recordsTotal: 0 }));
      return;
    }

    getAreaHandler(value);
  };

  const onClose = (field: keyof yup.InferType<typeof upsertShiftSchema>) => {
    return () => {
      dispatch(areaActions.receiveDropdownOptions({ column: "area", options: [] }));
    };
  };
  return (
    <Dialogs open={open} title={`Form ${data?.id ? "Edit" : "Add"}`} setOpen={setOpen}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={"1rem"} justifyContent={"center"}>
          <Grid item xs={12} md={12}>
            <TextControlWidget control={form.control} name="shift" label="Shift*" type="text" maxLength={225} autoFocus disabled={props.readonly} labelOnTextField />

            <AutoCompleteWidget
              control={form.control}
              field="area"
              label="Area*"
              loading={area.dropdownOptionsLoading}
              error={form.formState.errors["area"]?.message}
              options={(area.dropdownOptions.area ?? []).map((e) => ({ label: e.label, value: e.value }))}
              onInputChange={debounce(onInputChange("area"), 500)}
              onClose={onClose("area")}
              disabled={props.readonly}
              labelOnTextField
            />
            {!props.readonly && !!data?.id && (
              <Box marginY={1}>
                <Controller
                  name="status"
                  control={form.control}
                  render={({ field, fieldState }) => {
                    return (
                      <FormControl error={fieldState.error != undefined} variant="standard" fullWidth size="small">

                        <TextField
                          id="status"
                          value={field.value}
                          variant="outlined"
                          size="small"
                          select
                          label="Status*"
                          onChange={(event) => {
                            field.onChange(event.target.value);
                          }}
                        >
                          <MenuItem value={"true"}>Active</MenuItem>
                          <MenuItem value={"false"}>Inactive</MenuItem>
                        </TextField>
                        <FormHelperText id="status-text">{fieldState.error?.message as string}</FormHelperText>
                      </FormControl>
                    );
                  }}
                />
              </Box>
            )}
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
