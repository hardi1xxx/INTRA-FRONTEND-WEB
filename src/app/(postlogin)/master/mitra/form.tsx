import { SyntheticEvent, useCallback, useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Save } from "@mui/icons-material";
import { Autocomplete, AutocompleteInputChangeReason, Box, Button, CircularProgress, debounce, FormControl, FormHelperText, Grid, InputLabel, MenuItem, TextField } from "@mui/material";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import { Dialogs } from "@/components/dialog";
import { RootState } from "@/lib/redux/store";
import { CREATE_MITRA, UPDATE_MITRA } from "@/lib/redux/types";
import { WithId } from "@/type/services";
import { UpsertMitraRequest, upsertMitraSchema } from "./schema";
import { TextControlWidget } from "@/components/Input/TextControlWidget";
import { mitraActions } from "@/lib/redux/slices/master/mitra";

type FormType = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  data?: UpsertMitraRequest & WithId;
  onUpsert?: () => void;
  readonly?: boolean;
};

const UpsertForm = ({ open, setOpen, data, ...props }: FormType) => {
  const dispatch = useDispatch();
  const { fetching } = useSelector((state: RootState) => state.mitra);
  const { severity } = useSelector((state: RootState) => state.notification);

  const {
    control, 
    formState: {
      errors,
    },
    handleSubmit,
    reset,
    ...form
  } = useForm({
    resolver: yupResolver(upsertMitraSchema),
    defaultValues: {
      name: "",
      phone: "",
      pic: "",
      description: "",
      status: true,
    },
  });
  
  useEffect(() => {
    if (data?.id) {
      reset({
        ...data
      });
    } else {
      reset({
        name: "",
        phone: "",
        pic: "",
        description: "",
        status: true,
      });
    }
  }, [data, reset]);

  useEffect(() => {
    if (severity == "success") {
      reset();
      setOpen(false);
      props.onUpsert?.();
      dispatch(mitraActions.setIsFiltered(true));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [severity]);

  const onSubmit: SubmitHandler<UpsertMitraRequest> = (values) => {
    const payload = {
      ...values
    };

    if (data?.id) {
      dispatch({
        type: UPDATE_MITRA,
        payload: { id: data.id, ...payload },
      });
    } else {
      dispatch({ type: CREATE_MITRA, payload });
    }
  };

  return (
    <Dialogs open={open} title={`Form ${data?.id ? "Edit" : "Add"}`} setOpen={setOpen}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={"1rem"} justifyContent={"center"}>
          <Grid item xs={12} md={12}>
            <TextControlWidget control={control} name="name" label="Name*" type="text" maxLength={255} autoFocus disabled={props.readonly} labelOnTextField />
            <TextControlWidget control={control} name="phone" label="Phone*" type="text" maxLength={255} disabled={props.readonly} labelOnTextField />
            <TextControlWidget control={control} name="pic" label="PIC*" type="text" maxLength={255} disabled={props.readonly} labelOnTextField />
            <TextControlWidget control={control} name="description" label="Description" type="text" maxLength={255} disabled={props.readonly} labelOnTextField />
            {/* Status */}
            {!props.readonly && !!data?.id && (
              <Box marginY={1}>
                <Controller
                  name="status"
                  control={control}
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
            <Button color="primary" variant="contained" size="small" type="submit" startIcon={<Save />} endIcon={fetching && <CircularProgress color="inherit" size={"1rem"} />} disabled={fetching} sx={{borderRadius: "12px"}}>
              Submit
            </Button>
          </Box>
        )}
      </form>
    </Dialogs>
  );
};

export default UpsertForm;
