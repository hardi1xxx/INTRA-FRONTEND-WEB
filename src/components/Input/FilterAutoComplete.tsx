import { Autocomplete, AutocompleteInputChangeReason, FormControl, FormHelperText, TextField } from "@mui/material";
import { SyntheticEvent, useState } from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";

type Props<T extends FieldValues> = {
  control: Control<T>;
  field: Path<T>;
  label: string;
  error?: string;
  loading: boolean;
  options: any[];
  onInputChange?: (
    event: SyntheticEvent<Element, Event>,
    value: string,
    reason: AutocompleteInputChangeReason
  ) => void;
  getOptionLabel?: (option: any) => string;
  onChange?: (value: any) => void;
  onClose?: () => void;
};

export function FilterAutoComplete<T extends FieldValues>({
  control,
  field,
  label,
  error,
  loading,
  options,
  onInputChange,
  getOptionLabel,
  ...props
}: Props<T>) {
  const [open, setOpen] = useState(false);
  return (
    <Controller
      name={field}
      control={control}
      render={({ field }) => {
        return (
          <FormControl error={!!error} variant="standard" fullWidth size="small">
            {/* <InputLabel
                id={`${field}-label`}
                htmlFor={field as any}
                sx={{
                  fontSize: "1rem",
                  color: "#364152",
                  fontWeight: "500",
                  position: "relative",
                }}
                shrink
              >
                {label}
              </InputLabel> */}
            <Autocomplete
              disablePortal
              sx={{
                "& .MuiAutocomplete-inputRoot": {
                  minHeight: "40px",
                },
              }}
              {...field}
              open={open}
              onOpen={() => {
                setOpen(true);
              }}
              onClose={() => {
                props.onClose?.();
                setOpen(false);
              }}
              options={loading ? [] : options ?? []}
              renderInput={(params) => (
                <TextField
                  {...params}
                  aria-describedby={`${field}-text`}
                  // autoComplete={field as any}
                  label={label}
                  variant="outlined"
                  placeholder="Please enter min 1 character"
                  size="small"
                />
              )}
              // getOptionLabel={(option) => option}
              getOptionLabel={(option: any) => {
                if (getOptionLabel) {
                  return getOptionLabel(option);
                }

                if (typeof option === "string") {
                  return option;
                }

                return "";
              }}
              onChange={(event, data) => {
                field.onChange(data || "");
                props.onChange?.(data);
              }}
              // isOptionEqualToValue={(option, value) =>
              //   option.id === value.id
              // }
              slotProps={{
                paper: {
                  elevation: 5,
                },
              }}
              // getOptionKey={(option) => option.id}
              loading={loading}
              onInputChange={onInputChange}
              noOptionsText="No Data"
              filterOptions={(options, params) => {
                return options
              }}
            />
            <FormHelperText id="season_code-text">{!!error && error}</FormHelperText>
          </FormControl>
        );
      }}
    />
  );
}
