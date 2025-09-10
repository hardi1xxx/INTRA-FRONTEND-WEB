import { Box, FormControl, FormHelperText, InputLabel, TextField } from "@mui/material";
import { Control, Controller, FieldPath, FieldValues } from "react-hook-form";

type Props<T extends FieldValues> = {
  control?: Control<T>;
  name?: FieldPath<T>;
  label?: string;
  type?: React.HTMLInputTypeAttribute;
  disabled?: boolean;
  placeholder?: string;
  autoFocus?: boolean;
  maxLength?: number;
  labelOnTextField?: boolean;
  defaultValue?: string;
  toUpperCase?: boolean;
  shrink?: boolean;
  marginY?: number;
  formatter?: (value: string) => string;
};

export function TextControlWidget<T extends FieldValues>({ control, name, label, type = "text", disabled, ...props }: Props<T>) {
  return (
    <Box marginY={props.marginY ?? 1}>
      <Controller
        control={control}
        name={name ?? ("" as any)}
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
            <TextField
              {...field}
              type={type}
              fullWidth
              size="small"
              error={!!fieldState.error}
              placeholder={props.placeholder ?? "Type here..."}
              disabled={disabled}
              // helperText={fieldState.error?.message}
              autoFocus={props.autoFocus}
              inputProps={{ maxLength: props.maxLength }}
              // variant={props.variant}
              onChange={(e) => {
                let value = e.target.value;
                // Logika untuk formatter
                if (props.formatter) {
                  value = props.formatter(value);
                }

                // Logika untuk uppercase
                if (props.toUpperCase) {
                  value = value.toUpperCase();
                }
                field.onChange(value);
              }}
              label={props.labelOnTextField ? label : undefined}
              value={field.value ?? props.defaultValue ?? ""}
              InputLabelProps={{ shrink: props.shrink }}
            />

            <FormHelperText id={`${name}-text`}>{!!fieldState.error?.message && fieldState.error.message}</FormHelperText>
          </FormControl>
        )}
      />
    </Box>
  );
}

export function TextWidget<T extends FieldValues>({
  control,
  name,
  label,
  type = "text",
  disabled,
  ...props
}: Props<T> & {
  control?: never;
  name?: string;
  value: string;
}) {
  return (
    <Box>
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
      <TextField
        type={type}
        fullWidth
        size="small"
        placeholder={props.placeholder ?? "Type here..."}
        disabled={disabled}
        // helperText={fieldState.error?.message}
        autoFocus={props.autoFocus}
        inputProps={{ maxLength: props.maxLength }}
        // variant={props.variant}
        label={props.labelOnTextField ? label : undefined}
        value={props.value}
        InputLabelProps={{ shrink: true }}
      />
    </Box>
  );
}
