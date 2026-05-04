import { SyntheticEvent, useCallback, useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Save } from "@mui/icons-material";
import { Autocomplete, AutocompleteInputChangeReason, Box, Button, CircularProgress, debounce, FormControl, FormHelperText, Grid, InputLabel, MenuItem, TextField } from "@mui/material";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Dialogs } from "@/components/dialog";
import { RootState } from "@/lib/redux/store";
import { CREATE_BRANCH, UPDATE_BRANCH } from "@/lib/redux/types";
import { WithId } from "@/type/services";
import { UpsertBranchRequest, upsertBranchSchema } from "./schema";
import { TextControlWidget } from "@/components/Input/TextControlWidget";
import { branchActions } from "@/lib/redux/slices/master/branch";

type FormType = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  data?: UpsertBranchRequest & WithId;
  onUpsert?: () => void;
  readonly?: boolean;
};

const UpsertForm = ({ open, setOpen, data, ...props }: FormType) => {
  const dispatch = useDispatch();
  const { fetching } = useSelector((state: RootState) => state.branch);
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
    resolver: yupResolver(upsertBranchSchema),
    defaultValues: {
      branch_code: "",
      branch_name: "",
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
        branch_name: "",
        branch_code: "",
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
      dispatch(branchActions.setIsFiltered(true));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [severity]);

  const onSubmit: SubmitHandler<UpsertBranchRequest> = (values) => {
    const payload = {
      ...values
    };

    if (data?.id) {
      dispatch({
        type: UPDATE_BRANCH,
        payload: { id: data.id, ...payload },
      });
    } else {
      dispatch({ type: CREATE_BRANCH, payload });
    }
  };

  return (
    <Dialogs open={open} title={`Form ${data?.id ? "Edit" : "Add"}`} setOpen={setOpen}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={"1rem"} justifyContent={"center"}>
          <Grid item xs={12} md={12}>
            <TextControlWidget control={control} name="branch_code" label="Branch Code*" type="text" maxLength={255} autoFocus disabled={props.readonly} labelOnTextField />
            <TextControlWidget control={control} name="branch_name" label="Branch Name*" type="text" maxLength={255} disabled={props.readonly} labelOnTextField />
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
