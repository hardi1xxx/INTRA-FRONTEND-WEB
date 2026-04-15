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
import { CREATE_WITEL, UPDATE_WITEL } from "@/lib/redux/types";
import { WithId } from "@/type/services";
import { UpsertWitelRequest, upsertWitelSchema } from "./schema";
import { TextControlWidget } from "@/components/Input/TextControlWidget";
import { AutoCompleteWidget } from "@/components/Input/AutoCompleteWidget";
import { witelActions } from "@/lib/redux/slices/master/witel";

type FormType = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  data?: UpsertWitelRequest & WithId;
  onUpsert?: () => void;
  readonly?: boolean;
};

const UpsertForm = ({ open, setOpen, data, ...props }: FormType) => {
  const dispatch = useDispatch();
  const { fetching } = useSelector((state: RootState) => state.witel);
  const { severity } = useSelector((state: RootState) => state.notification);
  const { handleSubmit, reset, ...form } = useForm({
    resolver: yupResolver(upsertWitelSchema),
    defaultValues: {
      regional: "",
      witel: "",
      sto: "",
      status: true,
    },
  });

  useEffect(() => {
    if (data?.id) {
      reset(data);
    } else {
      reset({
        regional: "",
        witel: "",
        sto: "",
        status: true,
      });
    }
  }, [data, dispatch, open, reset]);

  useEffect(() => {
    if (severity == "success") {
      reset();
      setOpen(false);
      props.onUpsert?.();
      dispatch(witelActions.setIsFiltered(true));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [severity]);

  const onSubmit: SubmitHandler<UpsertWitelRequest> = (values) => {
    if (data?.id) {
      dispatch({
        type: UPDATE_WITEL,
        payload: { id: data.id, ...values },
      });
    } else {
      dispatch({ type: CREATE_WITEL, payload: { ...values } });
    }
  };

  return (
    <Dialogs open={open} title={`Form ${data?.id ? "Edit" : "Add"}`} setOpen={setOpen}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={"1rem"} justifyContent={"center"}>
          <Grid item xs={12} md={12}>
            <TextControlWidget control={form.control} name="regional" label="Regional*" type="text" maxLength={225} autoFocus disabled={props.readonly} labelOnTextField />
            <TextControlWidget control={form.control} name="witel" label="Witel*" type="text" maxLength={225} autoFocus disabled={props.readonly} labelOnTextField />
            <TextControlWidget control={form.control} name="sto" label="STO*" type="text" maxLength={225} autoFocus disabled={props.readonly} labelOnTextField />
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
