import { Autocomplete, AutocompleteInputChangeReason, FormControl, FormHelperText, InputLabel, SxProps, TextField, Theme } from "@mui/material";
import { SyntheticEvent, useState } from "react";
import { Control, Controller } from "react-hook-form";

export function FormAutoComplete({
  control,
  field,
  fieldName,
  label,
  error,
  loading,
  options,
  onInputChange,
  getOptionLabel,
  sx,
  ...props
}: {
  control: Control<any>;
  field: string;
  fieldName: string;
  label: string;
  defaultValue?: any;
  error?: string;
  loading: boolean;
  options: any[];
  sx?: SxProps<Theme>;
  onInputChange: ((event: SyntheticEvent<Element, Event>, value: string, reason: AutocompleteInputChangeReason) => void) | undefined;
  getOptionLabel?: (option: any) => string;
  onChange?: (value: any) => void;
  onClose?: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Controller
      name={field}
      control={control}
      defaultValue={props.defaultValue || { id: 0 }} // Initial empty object if defaultValue is delayed
      // defaultValue={props.defaultValue}
      render={({ field }) => {
        const { value, onChange, ...restField } = field;
        const selectedValue = value || null;

        return (
          <FormControl error={!!error} variant="standard" fullWidth size="small">
            <InputLabel
            id={`${fieldName}-label`}
            htmlFor={fieldName}
              sx={{
                fontSize: '1rem',
                color: '#364152',
                fontWeight: '500',
                position: 'relative'
              }}
              shrink
            >
              {label} *
            </InputLabel>
            <Autocomplete
              disablePortal
              value={selectedValue}
              sx={{
                ...sx,
                '& .MuiAutocomplete-inputRoot': {
                  minHeight: '40px'
                }
              }}
              // {...field}
              {...restField}
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
                  autoComplete={fieldName}
                  error={!!error}
                  variant="outlined"
                  placeholder="Please enter minimal 1 character code or description"
                  size="small"
                />
              )}
              getOptionLabel={(option: any) => {
                if (getOptionLabel) {
                  return getOptionLabel(option);
                }

                if (typeof option === 'string') {
                  return option;
                }

                return option[fieldName] ?? '';
              }}
              isOptionEqualToValue={(option, value) => {
                if (!option || !value) return false;
                return option?.id === value?.id;
              }}
              onChange={(event, data) => {
                field.onChange(data || { id: 0 });
                props.onChange?.(data);
              }}
              slotProps={{
                  paper: {
                    elevation: 5,
                    sx: {
                      backgroundColor: 'white !important',
                      '& .MuiAutocomplete-option': {
                        backgroundColor: 'white !important',
                        '&:hover': {
                          backgroundColor: '#f5f5f5 !important'
                        }
                      }
                    }
                  },
                  popper: {
                    sx: {
                      '& .MuiAutocomplete-paper': {
                        backgroundColor: 'white !important'
                      }
                    }
                  }
                }}
              loading={loading}
              onInputChange={onInputChange}
              noOptionsText="No Data"
            />
            <FormHelperText id={`${field}-text`}>
              {error}
            </FormHelperText>
          </FormControl>
        );
      }}
    />
  );
}
