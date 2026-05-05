import { SyntheticEvent, useCallback, useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Save } from "@mui/icons-material";
import { Autocomplete, AutocompleteInputChangeReason, Box, Button, CircularProgress, debounce, FormControl, FormHelperText, Grid, InputLabel, MenuItem, TextField } from "@mui/material";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Dialogs } from "@/components/dialog";
import { RootState } from "@/lib/redux/store";
import { CREATE_AREA, GET_REGIONAL_DROPDOWN, UPDATE_AREA } from "@/lib/redux/types";
import { WithId } from "@/type/services";
import { UpsertAreaRequest, upsertAreaSchema } from "./schema";
import { TextControlWidget } from "@/components/Input/TextControlWidget";
import { areaActions } from "@/lib/redux/slices/master/area";

type FormType = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  data?: UpsertAreaRequest & WithId;
  onUpsert?: () => void;
  readonly?: boolean;
};

type RegionalOption = {
  id: number;
  regional_code: string;
  regional_name: string;
};

const UpsertForm = ({ open, setOpen, data, ...props }: FormType) => {
  const dispatch = useDispatch();
  const { fetching } = useSelector((state: RootState) => state.area);
  const { severity } = useSelector((state: RootState) => state.notification);
  const { options, optionsLoading } = useSelector((state: RootState) => state.regional);

  const regionalOptions: RegionalOption[] = options
    .flatMap((opt) => opt.data)
    .map((item) => ({
      id: item.id,
      regional_code: item.regional_code,
      regional_name: item.regional_name,
    }));

  const {
    control, 
    formState: {
      errors,
    },
    handleSubmit,
    reset,
    ...form
  } = useForm({
    resolver: yupResolver(upsertAreaSchema),
    defaultValues: {
      regional_id: undefined,
      regional_code: "",
      area_code: "",
      area_name: "",
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
        regional_id: undefined,
        regional_code: "",
        area_name: "",
        area_code: "",
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
      dispatch(areaActions.setIsFiltered(true));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [severity]);

  const onSubmit: SubmitHandler<UpsertAreaRequest> = (values) => {
    const payload = {
      ...values
    };

    if (data?.id) {
      dispatch({
        type: UPDATE_AREA,
        payload: { id: data.id, ...payload },
      });
    } else {
      dispatch({ type: CREATE_AREA, payload });
    }
  };

  const onRegionalInputChange = (event: SyntheticEvent<Element, Event>, value: string, reason: AutocompleteInputChangeReason) => {
    if (reason === "input" && value.length >= 1) {
      dispatch({
        type: GET_REGIONAL_DROPDOWN,
        payload: { search: value },
      });
    }
  };

  const debouncedRegionalInputChange = debounce(onRegionalInputChange, 500);

  return (
    <Dialogs open={open} title={`Form ${data?.id ? "Edit" : "Add"}`} setOpen={setOpen}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={"1rem"} justifyContent={"center"}>
          <Grid item xs={12} md={12}>
            <Box mt={1}>
              <Controller
                name="regional_id"
                control={control}
                render={({ field, fieldState }) => {
                  return (
                    <Autocomplete<RegionalOption, false, false, false>
                      options={regionalOptions}
                      loading={optionsLoading}
                      getOptionLabel={(option) => `${option.regional_code} - ${option.regional_name}`}
                      value={regionalOptions.find((item) => item.id === field.value) || null}
                      onChange={(_, value) => {
                        if (value) {
                          // Update both the id and the code
                          field.onChange(value.id);
                          form.setValue("regional_code", value.regional_code, { shouldValidate: true });
                        } else {
                          field.onChange(undefined);
                          form.setValue("regional_code", "", { shouldValidate: true });
                        }
                      }}
                      onInputChange={debouncedRegionalInputChange}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Regional*"
                          size="small"
                          error={!!fieldState.error}
                          helperText={fieldState.error?.message}
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <>
                                {optionsLoading && <CircularProgress size={16} />}
                                {params.InputProps.endAdornment}
                              </>
                            ),
                          }}
                        />
                      )}
                      disabled={props.readonly}
                    />
                  );
                }}
              />
            </Box>
            <TextControlWidget control={control} name="area_code" label="Area Code*" type="text" maxLength={255} autoFocus disabled={props.readonly} labelOnTextField />
            <TextControlWidget control={control} name="area_name" label="Area Name*" type="text" maxLength={255} disabled={props.readonly} labelOnTextField />
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
