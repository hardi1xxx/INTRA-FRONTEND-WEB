import { Box, FormControl, FormHelperText, InputLabel, TextField } from "@mui/material";
import moment from "moment";
import { Control, Controller, FieldPath, FieldValues } from "react-hook-form";

type Props<T extends FieldValues> = { control?: Control<T>; name: FieldPath<T>; label?: string; type?: React.HTMLInputTypeAttribute; disabled?: boolean; placeholder?: string };

export function FilterTextControlWidget<T extends FieldValues>({ control, name, label, type = "text", disabled, ...props }: Props<T>) {
  return (
    <Box>
      <Controller
        control={control}
        name={name}
        render={({ field, fieldState }) => (
          <FormControl error={!!fieldState.error} variant="standard" fullWidth size="small">
            {!!label && (
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
              placeholder={props.placeholder ?? "type here..."}
              disabled={disabled}
              // helperText={fieldState.error?.message}
            />

            <FormHelperText id={`${name}-text`}>{!!fieldState.error?.message && fieldState.error.message}</FormHelperText>
          </FormControl>
        )}
      />
    </Box>
  );
}
