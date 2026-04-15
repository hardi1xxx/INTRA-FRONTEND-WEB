import { SyntheticEvent } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Clear, Search } from "@mui/icons-material";
import { AutocompleteInputChangeReason, Box, Button, FormControl, FormHelperText, Grid, MenuItem, TextField } from "@mui/material";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";

import { RootState } from "@/lib/redux/store";
import { GET_MASTER_DEPARTEMENT_USER, GET_MASTER_DEPARTEMENT_USER_DROPDOWN } from "@/lib/redux/types";
import { departementUserActions } from "@/lib/redux/slices/master/departementUser";
import { debounce } from "@mui/material/utils";
import { parseStatus } from "@/lib/services/parseStatus";
import { FilterAutoComplete } from "@/components/Input/FilterAutoComplete";

type FilterType = {
  setIsFiltered: React.Dispatch<React.SetStateAction<boolean>>;
};

const FilterWidget = ({ setIsFiltered }: FilterType) => {
  const dispatch = useDispatch();
  const { dropdownOptions, dropdownOptionsLoading, params } = useSelector((state: RootState) => state.departementUser);

  const schema = yup.object({
    status: yup.string().optional().nullable(),
    departement: yup.string().optional().nullable(),
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
      departement: "",
      status: "All",
    },
  });

  const onSubmit: SubmitHandler<yup.InferType<typeof schema>> = (data) => {
    dispatch(departementUserActions.setParams({ ...params, ...data }));
    dispatch({ type: GET_MASTER_DEPARTEMENT_USER });
    setIsFiltered(true);
  };

  const onClear = () => {
    reset();
    dispatch(departementUserActions.resetDropdownOptions());
    dispatch(departementUserActions.resetParam());
    dispatch(departementUserActions.receiveNo());
    setIsFiltered(false);
  };

  const onInputChange = (field: string) => (event: SyntheticEvent<Element, Event>, value: string, reason: AutocompleteInputChangeReason) => {
    const filter = form.getValues() as Record<string, any>;
    filter.status = parseStatus(filter.status);
    if (reason === "input") {
      if (value.length >= 1) {

        dispatch({
          type: GET_MASTER_DEPARTEMENT_USER_DROPDOWN,
          payload: {
            ...filter,
            column: field,
            [field]: value,
          },
        });
      } else {
        dispatch(departementUserActions.resetDropdownOptions());
      }
    } else if (reason === "clear") {
      form.setValue(field as any, "");
      dispatch(departementUserActions.resetDropdownOptions());
    }
  };

  const onClose = (field: keyof yup.InferType<typeof schema>) => {
    return () => {
      const selected = form.getValues(field);
      const options = (dropdownOptions[field] ?? []).filter((item) => item.value == selected);
      dispatch(
        departementUserActions.receiveDropdownOptions({
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
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box display={"flex"} flexDirection={"column"} width={"100%"} gap={"1rem"}>
          <Grid container columnSpacing={"0.5rem"} rowSpacing={"0.5rem"}>
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
                          <MenuItem value={"All"}>All Status</MenuItem>
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
            <Grid item xs={12} md={3}>
              <Box marginY={0}>
                <FilterAutoComplete
                  control={controller_filter}
                  field="departement"
                  label="Department"
                  loading={dropdownOptionsLoading}
                  error={errors["departement"]?.message}
                  options={(dropdownOptions.departement ?? []).map((item) => item.value.toString())}
                  onInputChange={debounce(onInputChange("departement"), 500)}
                  onClose={onClose("departement")}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box display={"flex"} alignItems={"center"} justifyContent={"end"} gap={"1rem"} height={"100%"}>
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
