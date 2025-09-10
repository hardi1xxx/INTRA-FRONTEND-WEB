import { SyntheticEvent, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Clear, Search } from "@mui/icons-material";
import { Autocomplete, AutocompleteInputChangeReason, Box, Button, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { Control, Controller, FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import { debounce } from "@mui/material/utils";
import { RootState } from "@/lib/redux/store";
import { GET_MASTER_JOB_POSITION, GET_MASTER_JOB_POSITION_DROPDOWN } from "@/lib/redux/types";
import { jobPositionActions } from "@/lib/redux/slices/master/job-position";

type FilterType = {
  setIsFiltered: React.Dispatch<React.SetStateAction<boolean>>;
  setResetSearch: React.Dispatch<React.SetStateAction<boolean>>;
};

const FilterWidget = ({ setIsFiltered, setResetSearch }: FilterType) => {
  const dispatch = useDispatch();
  const { dropdownOptions, dropdownOptionsLoading, params } = useSelector((state: RootState) => state.jobPosition);

  const schema = yup.object({
    job_position: yup.string().optional().nullable(),
    status: yup.string().optional().nullable(),
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
      job_position: "",
      status: "all",
    },
  });

  const onSubmit: SubmitHandler<yup.InferType<typeof schema>> = (data) => {
    dispatch(jobPositionActions.setParam({ ...params, ...data }));
    dispatch({ type: GET_MASTER_JOB_POSITION });
    setIsFiltered(true);
  };

  const onClear = () => {
    reset();
    dispatch(jobPositionActions.resetDropdownOptions());
    dispatch(jobPositionActions.resetParam());
    dispatch(jobPositionActions.receiveNo());
    setResetSearch(true);
    setIsFiltered(false);
  };

  const onInputChange = (field: string) => (event: SyntheticEvent<Element, Event>, value: string, reason: AutocompleteInputChangeReason) => {
    if (reason === "input") {
      if (value.length >= 1) {
        const filter = form.getValues();
        filter.status = filter.status == "" ? undefined : filter.status;

        dispatch({
          type: GET_MASTER_JOB_POSITION_DROPDOWN,
          payload: {
            ...filter,
            column: field,
            [field]: value,
            order: `${field},asc`
          },
        });
      } else {
        dispatch(jobPositionActions.resetDropdownOptions());
      }
    } else if (reason === "clear") {
      form.setValue(field as any, "");
      dispatch(jobPositionActions.resetDropdownOptions());
    }
  };

  const resetOptions = (column: string) => {
    dispatch(jobPositionActions.resetSelectedDropdownOptions({ column }));
  };

  return (
    <Box
      sx={{
        backgroundColor: "white",
        height: "auto",
      }}
      display={"flex"}
      flexDirection={"column"}
      // width={"calc(100% - 40px)"}
      p={"10px"}
      borderRadius={"8px"}
      gap={"0.5rem"}
      // flexGrow={0.1}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box display={"flex"} flexDirection={"column"} width={"100%"} gap={"1rem"}>
          <Grid container spacing={"0.5rem"}>
            <Grid item xs={12} md={3}>
              <Box marginY={0}>
                <Controller
                  name="status"
                  control={controller_filter}
                  render={({ field }) => {
                    return (
                      <FormControl error={errors["status"] != undefined} variant="outlined" fullWidth size="small">
                        {/* <InputLabel
                          id={`status-label`}
                          htmlFor={"status"}
                          sx={{
                            fontSize: "1rem",
                            color: "#364152",
                            fontWeight: "500",
                            position: "relative",
                          }}
                          variant="standard"
                          shrink
                        >
                          Status
                        </InputLabel> */}
                        <Select
                          labelId="status-label"
                          id="status"
                          value={field.value ?? "all"}
                          onChange={(event, data) => {
                            field.onChange(event.target.value);
                          }}
                        >
                          <MenuItem value={"all"}>All Status</MenuItem>
                          <MenuItem value={"1"}>Active</MenuItem>
                          <MenuItem value={"0"}>Inactive</MenuItem>
                        </Select>
                        <FormHelperText id="status-text">{errors["status"]?.message as string}</FormHelperText>
                      </FormControl>
                    );
                  }}
                />
              </Box>
            </Grid>

            <Grid item xs={12} md={3}>
              <Box marginY={0}>
                <ControllerWidget
                  control={controller_filter}
                  field="job_position"
                  label="Job Position"
                  loading={dropdownOptionsLoading}
                  error={errors["job_position"]?.message}
                  options={(dropdownOptions.job_position ?? []).map((item) => item.value.toString())}
                  onInputChange={debounce(onInputChange("job_position"), 500)}
                  onClose={() => resetOptions("job_position")}
                />
              </Box>
            </Grid>

            <Grid item xs={12} md>
              <Box display={"flex"} justifyContent={"flex-end"} alignItems={"center"} gap={"1rem"} height={"100%"} marginY={0}>
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
};

export default FilterWidget;

function ControllerWidget({
  control,
  field,
  label,
  error,
  loading,
  options,
  onInputChange,
  onClose,
}: {
  control: Control<FieldValues>;
  field: string;
  label: string;
  error?: string;
  loading: boolean;
  options: string[];
  onInputChange: ((event: SyntheticEvent<Element, Event>, value: string, reason: AutocompleteInputChangeReason) => void) | undefined;
  onClose: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  return (
    <Controller
      name={field}
      control={control}
      render={({ field: { onChange, value, ...field } }) => (
        <FormControl error={!!error} variant="standard" fullWidth size="small">
          <Autocomplete
            disablePortal
            {...field}
            open={open}
            value={value ?? ""}
            inputValue={inputValue}
            onOpen={() => setOpen(true)}
            onClose={() => {
              onClose();
              setOpen(false);
            }}
            onInputChange={(event, newInputValue, reason) => {
              setInputValue(newInputValue);
              onInputChange?.(event, newInputValue, reason);
            }}
            onChange={(event, data) => {
              setInputValue(data || "");
              onChange(data);
            }}
            options={loading ? [] : options}
            renderInput={(params) => <TextField {...params} aria-describedby={`${field}-text`} label={label} variant="outlined" placeholder="Please enter min 1 character" size="small" />}
            getOptionLabel={(option) => option}
            slotProps={{
              paper: { elevation: 5 },
            }}
            loading={loading}
            noOptionsText="No Data"
          />
          <FormHelperText id={`${field}-text`}>{error}</FormHelperText>
        </FormControl>
      )}
    />
  );
}
