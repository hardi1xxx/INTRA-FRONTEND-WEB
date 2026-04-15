import { Autocomplete, AutocompleteInputChangeReason, Box, FormControl, FormHelperText, InputLabel, TextField } from "@mui/material";
import { SyntheticEvent, useEffect, useState } from "react";
import { Control, Controller, FieldPath, FieldValues } from "react-hook-form";

export function AutoCompleteWidget<T extends FieldValues>({
  control,
  field,
  label,
  error,
  loading,
  options,
  onInputChange,
  ...props
}: {
  control: Control<T>;
  field: FieldPath<T>;
  label?: string;
  error?: string;
  loading: boolean;
  options: { label: string; value: any }[];
  onInputChange?: (event: SyntheticEvent<Element, Event>, value: string, reason: AutocompleteInputChangeReason) => void;
  onChange?: (value: any) => void;
  onClose?: () => void;
  disabled?: boolean;
  labelOnTextField?: boolean;
  tempLabel?: Record<string, string>;
  onTempLabelChange?: (props: { key: string; label: string }) => void;
  marginY?: number;
  placeholder?: string;
}) {
  const [tempLabel, setTempLabel] = useState<Record<string, string>>({});

  useEffect(() => {
    const initialLabels = (options ?? []).reduce((prev, curr, i) => ({ ...prev, [curr.value]: curr.label }), {});
    setTempLabel((prev) => ({ ...prev, ...initialLabels }));
  }, [options]);

  return (
    <Box marginY={props.marginY ?? 1}>
      <Controller
        name={field}
        control={control}
        render={({ field: fieldControl }) => {
          return (
            <FormControl error={!!error} variant="standard" fullWidth size="small">
              {!!label && !props.labelOnTextField && (
                <InputLabel
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
                </InputLabel>
              )}
              <Autocomplete
                // disablePortal
                {...fieldControl}
                id={field}
                options={loading ? [] : (options ?? []).map((e) => e.value)}
                // sx={{ width: "100%" }}
                renderInput={(params) => (
                  <TextField {...params} aria-describedby={`${field}-text`} error={!!error} placeholder={props.placeholder ?? "Please enter min 1 character"} size="small" label={props.labelOnTextField ? label : undefined} />
                )}
                multiple={false}
                getOptionLabel={(option) => (options ?? []).find((e) => e.value === option)?.label ?? tempLabel[option] ?? props.tempLabel?.[option] ?? "-"}
                onChange={(event, data) => {
                  const label = options?.find((o) => o.value == data)?.label;
                  setTempLabel((prev) => ({ ...prev, [data]: label }));
                  props.onTempLabelChange?.({
                    key: data,
                    label: label ?? "Unknown",
                  });
                  fieldControl.onChange(data);
                  props.onChange?.(data);
                }}
                onClose={props.onClose}
                filterOptions={(options, state) => options}
                noOptionsText="No Data"
                value={fieldControl.value ?? null}
                onInputChange={onInputChange}
                loading={loading}
                disabled={props.disabled}
              />
              <FormHelperText id={`${field}-text`}>{!!error && error}</FormHelperText>
            </FormControl>
          );
        }}
      />
    </Box>
  );
}
