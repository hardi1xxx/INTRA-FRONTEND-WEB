import { Box, FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { Control, Controller, FieldPath, FieldValues } from "react-hook-form";

type Props<T extends FieldValues, Value extends unknown> = {
  control?: Control<T>;
  name: FieldPath<T>;
  label?: string;
  type?: React.HTMLInputTypeAttribute;
  disabled?: boolean;
  placeholder?: string;
  options?: { value: Value; label: string }[];
  onChange?: (value: Value) => void;
  labelOnTextField?: boolean;
};

export function SelectControlWidget<T extends FieldValues, Value extends unknown>({ control, name, label, type = "text", disabled, ...props }: Props<T, Value>) {
  return (
    <Box marginY={1}>
      <Controller
        control={control}
        name={name}
        render={({ field, fieldState }) => (
          <FormControl error={!!fieldState.error} variant="standard" fullWidth size="small">
            {!!label && !props.labelOnTextField && (
              <InputLabel
                id={`${name}-label`}
                htmlFor={name}
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
            {/* <Select
              {...field}
              id={name}
              aria-describedby={`${name}-text`}
              variant="outlined"
              size="small"
              error={!!fieldState.error}
              disabled={disabled}
              // displayEmpty
              // renderValue={(value: any) => {
              //   if (!value) {
              //     return <Typography color="gray">{props.placeholder || "Select..."}</Typography>;
              //   }
              //   return value;
              // }}
              label={props.labelOnTextField ? label : undefined}
            >
              {props.options?.map((option) => (
                <MenuItem key={option.value as any} value={option.value as any} onSelect={() => props.onChange?.(option.value)}>
                  {option.label}
                </MenuItem>
              ))}
            </Select> */}

            <TextField {...field} select label={props.labelOnTextField ? label : undefined} id={name} aria-describedby={`${name}-text`} variant="outlined" size="small" error={!!fieldState.error} disabled={disabled}>
              {props.options?.map((option) => (
                <MenuItem key={option.value as any} value={option.value as any} onSelect={() => props.onChange?.(option.value)}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>

            <FormHelperText id={`${name}-text`}>{!!fieldState.error?.message && fieldState.error.message}</FormHelperText>
          </FormControl>
        )}
      />
    </Box>
  );
}
