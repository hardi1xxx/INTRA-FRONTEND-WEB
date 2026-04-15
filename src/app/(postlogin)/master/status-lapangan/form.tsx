import { SyntheticEvent, useCallback, useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Save } from "@mui/icons-material";
import { Autocomplete, AutocompleteInputChangeReason, Box, Button, CircularProgress, debounce, FormControl, FormHelperText, Grid, InputLabel, MenuItem, TextField } from "@mui/material";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";

import { Dialogs } from "@/components/dialog";
import FormBuilder from "@/components/FormBuilder";
import { IFormLayout } from "@/components/FormBuilder/interfaces";
import { RootState } from "@/lib/redux/store";
import { CREATE_STATUS_LAPANGAN, UPDATE_STATUS_LAPANGAN } from "@/lib/redux/types";
import { WithId } from "@/type/services";
import { UpsertStatusLapanganRequest, upsertStatusLapanganSchema } from "./schema";
import { TextControlWidget } from "@/components/Input/TextControlWidget";
import { AutoCompleteWidget } from "@/components/Input/AutoCompleteWidget";
import { statusLapanganActions } from "@/lib/redux/slices/master/statusLapangan";
import { getUserRoleDropdown } from "@/lib/services";
import { setTextNotification } from "@/lib/redux/slices/notification";
import { errorHandler } from "@/lib/redux/sagas/errorHandler";
import { useDebouncedCallback } from "use-debounce";

type FormType = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  data?: UpsertStatusLapanganRequest & WithId;
  onUpsert?: () => void;
  readonly?: boolean;
};

const UpsertForm = ({ open, setOpen, data, ...props }: FormType) => {
  const dispatch = useDispatch();
  const { fetching } = useSelector((state: RootState) => state.statusLapangan);
  const { severity } = useSelector((state: RootState) => state.notification);

  const [selectRoleData, setSelectRoleData] = useState<{ id: string; name: string, }[]>([])
  const [selectRoleLoading, setSelectRoleLoading] = useState<boolean>(false)
  const [selectRoleOpen, setSelectRoleOpen] = useState<boolean>(false)

  const {
    control, 
    formState: {
      errors,
    },
    handleSubmit,
    reset,
    ...form
  } = useForm({
    resolver: yupResolver(upsertStatusLapanganSchema),
    defaultValues: {
      name: "",
      description: "",
      accessed_by: [],
      status: true,
    },
  });
  
  useEffect(() => {
    if (data?.id) {
      console.log(data.accessed_by);
      console.log(selectRoleData);
      const accessedByObjects =
        Array.isArray(data.accessed_by)
          ? data.accessed_by.map((item: any) => {
              if (typeof item === "string") {
                const found = selectRoleData.find((role) => role.id === item);
                return found ?? { id: item, name: item };
              }
              return item; // sudah object {id, name}
            })
          : [];

      reset({
        ...data,
        accessed_by: accessedByObjects,
      });
    } else {
      reset({
        name: "",
        description: "",
        accessed_by: [],
        status: true,
      });
    }
  }, [data, selectRoleData, reset]);

  useEffect(() => {
    if (severity == "success") {
      reset();
      setOpen(false);
      props.onUpsert?.();
      dispatch(statusLapanganActions.setIsFiltered(true));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [severity]);

  // function for call api get role
  const getDataRole = useCallback(async (keyword: string) => {
    try {
      if (keyword.length >= 1) {
        setSelectRoleLoading(true)
        const res = await getUserRoleDropdown(keyword)
        const parsingData = res.result != undefined ? res.result.data.map((item) => ({ id: item.id.toString() ?? "", name: item.role ?? "" })) : []
  
        setSelectRoleData(parsingData)
        setSelectRoleLoading(false)

        if (parsingData.length == 0) {
          dispatch(setTextNotification({ text: "Data not available.", severity: "error" }))
        }
      } else {
        setSelectRoleLoading(false)
        setSelectRoleData([])
      }
    } catch (error) {
      const { message, statusCode } = errorHandler(error)
      dispatch(setTextNotification({ text: message, severity: "error", responseCode: statusCode }))
      setSelectRoleLoading(false)
      setSelectRoleData([])
    }
  }, [dispatch])
  
  // function on input change select role
  const onInputChangeSelectRole = useDebouncedCallback(async (event: SyntheticEvent<Element, Event>, value: string, reason: AutocompleteInputChangeReason) => {
    if (reason === 'input' || reason === 'clear') {
      getDataRole(value)
    }
  }, 500)
  
  useEffect(() => {
    if (selectRoleOpen) {
      getDataRole('')
    }
  }, [selectRoleOpen, getDataRole])

  const onSubmit: SubmitHandler<UpsertStatusLapanganRequest> = (values) => {
    const payload = {
      ...values,
      accessed_by: (values.accessed_by ?? []).map((item: any) =>
        typeof item === "string" ? item : item.id
      ),
    };

    if (data?.id) {
      dispatch({
        type: UPDATE_STATUS_LAPANGAN,
        payload: { id: data.id, ...payload },
      });
    } else {
      dispatch({ type: CREATE_STATUS_LAPANGAN, payload });
    }
  };

  return (
    <Dialogs open={open} title={`Form ${data?.id ? "Edit" : "Add"}`} setOpen={setOpen}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={"1rem"} justifyContent={"center"}>
          <Grid item xs={12} md={12}>
            <TextControlWidget control={control} name="name" label="Name*" type="text" maxLength={225} autoFocus disabled={props.readonly} labelOnTextField />
            <TextControlWidget control={control} name="description" label="Description" type="text" maxLength={225} disabled={props.readonly} labelOnTextField />
            
            {/* ACCESSED BY */}
            <Grid item xs={12}>
              <Controller
                name="accessed_by"
                control={control}
                render={({ field }) => (
                  <FormControl
                    variant="standard"
                    fullWidth
                    size="small"
                    error={!!errors['accessed_by']}
                  >
                    <InputLabel
                      id={`accessed_by-id-label`}
                      htmlFor={'accessed_by-id'}
                      sx={{
                        fontSize: '1rem',
                        color: '#364152',
                        fontWeight: '500',
                        position: 'relative',
                      }}
                      shrink
                    >
                      Accessed By
                    </InputLabel>
                    <Autocomplete
                      multiple
                      disableCloseOnSelect
                      value={field.value ?? []}
                      options={selectRoleData}
                      getOptionLabel={(option) => option.name}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      onChange={(_, newValue) => {
                        field.onChange(newValue); // simpan array objek
                      }}
                      onInputChange={onInputChangeSelectRole}
                      onOpen={() => setSelectRoleOpen(true)}
                      onClose={() => setSelectRoleOpen(false)}
                      loading={selectRoleLoading}
                      noOptionsText="No Data"
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Please enter min 1 character"
                          size="small"
                          error={!!errors['accessed_by']}
                          helperText={errors['accessed_by'] ? 'Please Input Field Role' : ''}
                        />
                      )}
                    />
                  </FormControl>
                )}
              />

            </Grid>
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
