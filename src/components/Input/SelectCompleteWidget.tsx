import { Autocomplete, AutocompleteInputChangeReason, Box, FormControl, FormHelperText, InputLabel, TextField } from "@mui/material";
import { SyntheticEvent, useEffect, useState } from "react";
import { Control, Controller, FieldPath, FieldValues } from "react-hook-form";

export function SelectCompleteWidget<T extends FieldValues>({
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
  const [searchValue, setSearchValue] = useState<string>(""); // 🔹 Menyimpan input user
  const [tempLabel, setTempLabel] = useState<Record<string, string>>({});
  const [filteredOptions, setFilteredOptions] = useState(options);

  useEffect(() => {
    const initialLabels = (options ?? []).reduce((prev, curr) => ({ ...prev, [curr.value]: curr.label }), {});
    setTempLabel((prev) => ({ ...prev, ...initialLabels }));
  }, [options]);

  useEffect(() => {
    setFilteredOptions(
      options.filter((option) =>
        option.label.toLowerCase().includes(searchValue.toLowerCase()) // 🔹 Filter opsi berdasarkan input user
      )
    );
  }, [searchValue, options]);

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
                {...fieldControl}
                id={field}
                options={loading ? [] : filteredOptions.map((e) => e.value)} // 🔹 Gunakan opsi yang difilter
                renderInput={(params) => (
                  <TextField
                    {...params}
                    aria-describedby={`${field}-text`}
                    error={!!error}
                    placeholder={props.placeholder ?? "Please enter min 1 character"}
                    size="small"
                    label={props.labelOnTextField ? label : undefined}
                    onChange={(e) => setSearchValue(e.target.value)} // 🔹 Update searchValue ketika user mengetik
                  />
                )}
                multiple={false}
                getOptionLabel={(option) => filteredOptions.find((e) => e.value === option)?.label ?? tempLabel[option] ?? props.tempLabel?.[option] ?? "-"}
                onChange={(event, data) => {
                  const label = options.find((o) => o.value === data)?.label;
                  setTempLabel((prev) => ({ ...prev, [data]: label }));
                  props.onTempLabelChange?.({ key: data, label: label ?? "Unknown" });
                  fieldControl.onChange(data);
                  props.onChange?.(data);
                }}
                onClose={() => {
                  setSearchValue(""); // 🔹 Reset input saat dropdown ditutup
                  props.onClose?.();
                }}
                filterOptions={(options) => options} // 🔹 Hindari filter bawaan, karena kita sudah memfilter secara manual
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
