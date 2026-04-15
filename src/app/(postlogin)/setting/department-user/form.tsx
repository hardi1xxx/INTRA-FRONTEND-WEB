import { useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Save } from "@mui/icons-material";
import { Box, Button, CircularProgress, FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import { Dialogs } from "@/components/dialog";
import { RootState } from "@/lib/redux/store";
import { CREATE_MASTER_DEPARTEMENT_USER, UPDATE_MASTER_DEPARTEMENT_USER } from "@/lib/redux/types";
import { WithId } from "@/type/services";
import { UpsertDepartementUserRequest, upsertDepartementUserSchema } from "@/lib/services/master/departementUser";

type FormType = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsFiltered: React.Dispatch<React.SetStateAction<boolean>>;
  data?: UpsertDepartementUserRequest &
  WithId & {
    departement?: string;
  };
};

const UpsertForm = ({ open, setOpen, data, setIsFiltered }: FormType) => {
  const dispatch = useDispatch();
  const { fetching } = useSelector((state: RootState) => state.departementUser);
  const { severity } = useSelector((state: RootState) => state.notification);

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
    getValues,
    ...form
  } = useForm({
    resolver: yupResolver(upsertDepartementUserSchema),
    defaultValues: {
      departement: "",
      status: 1,
    },
  });

  useEffect(() => {
    if (data?.id) {
      reset(data);
    } else {
      reset({
        departement: "",
        status: 1,
      });
    }
  }, [data, open, reset]);

  useEffect(() => {
    if (severity == "success") {
      reset();
      setOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [severity]);

  const onSubmit: SubmitHandler<UpsertDepartementUserRequest> = (values) => {
    if (data?.id) {
      dispatch({
        type: UPDATE_MASTER_DEPARTEMENT_USER,
        payload: { id: data.id, ...values },
      });
    } else {
      dispatch({ type: CREATE_MASTER_DEPARTEMENT_USER, payload: { ...values } });
    }
    setIsFiltered(true);
  };

  return (
    <Dialogs open={open} title={`Form ${data?.id ? "Edit" : "Add"}`} setOpen={setOpen}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box marginY={1}>
          <Controller
            name="departement"
            control={control}
            render={({ field }) => {
              return (
                <FormControl error={errors["departement"] != undefined} variant="standard" fullWidth size="small" required>
                  <InputLabel
                    id={`departement-label`}
                    htmlFor={"departement"}
                    sx={{
                      fontSize: "1rem",
                      color: "#364152",
                      fontWeight: "500",
                      position: "relative",
                    }}
                    shrink
                  >
                    Department
                  </InputLabel>
                  <TextField
                    {...field}
                    id="departement"
                    aria-describedby={`departement-text`}
                    autoComplete="departement"
                    autoFocus
                    variant="outlined"
                    size="small"
                    error={!!errors["departement"]?.message}
                    inputProps={{ maxLength: 255 }}
                  />
                  <FormHelperText id="departement-text">{errors["departement"]?.message as string}</FormHelperText>
                </FormControl>
              );
            }}
          />
        </Box>
        {!!data?.id && (
          <Box marginY={1}>
            <Controller
              name="status"
              control={control}
              render={({ field }) => {
                return (
                  <FormControl error={errors["status"] != undefined} variant="standard" fullWidth size="small">
                    <InputLabel
                      id={`status-label`}
                      htmlFor={"status"}
                      sx={{
                        fontSize: "1rem",
                        color: "#364152",
                        fontWeight: "500",
                        position: "relative",
                      }}
                      shrink
                    >
                      Status
                    </InputLabel>
                    <Select
                      labelId="status-label"
                      id="status"
                      variant="outlined"
                      size="small"
                      value={field.value ? String(field.value) : "0"}
                      onChange={(event) => {
                        field.onChange(event.target.value);
                      }}
                    >
                      <MenuItem value={"1"}>Active</MenuItem>
                      <MenuItem value={"0"}>Inactive</MenuItem>
                    </Select>
                    <FormHelperText id="status-text">{errors["status"]?.message as string}</FormHelperText>
                  </FormControl>
                );
              }}
            />
          </Box>
        )}

        <Box display={"flex"} flexDirection={"row-reverse"} justifyContent={"end"} width={"100%"} marginTop={"1rem"} gap={"1rem"}>
          <Button color="primary" variant="contained" size="small" type="submit" startIcon={<Save />} endIcon={fetching && <CircularProgress color="inherit" size={"1rem"} />} disabled={fetching}>
            Submit
          </Button>
        </Box>
      </form>
    </Dialogs>
  );
};

export default UpsertForm;
