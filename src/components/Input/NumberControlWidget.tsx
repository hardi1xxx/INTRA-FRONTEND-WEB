import { Box, FormControl, FormHelperText, InputLabel, TextField } from "@mui/material";
import { Control, Controller, FieldPath, FieldValues } from "react-hook-form";

type Props<T extends FieldValues> = {
  control?: Control<T>;
  name: FieldPath<T>;
  label?: string;
  type?: React.HTMLInputTypeAttribute;
  disabled?: boolean;
  placeholder?: string;
  autoFocus?: boolean;
  labelOnTextField?: boolean;
};

export function NumberControlWidget<T extends FieldValues>({
  control,
  name,
  label,
  type = "text",
  disabled,
  ...props
}: Props<T>) {
  return (
    <Box marginY={1}>
      <Controller
        control={control}
        name={name}
        rules={{
          validate: (value) => {
            if (!value) return "Input is required.";

            // Validasi angka
            const numericRegex = /^-?\d+(\.\d{1,2})?$/; // Format angka dengan maksimal 2 desimal
            if (!numericRegex.test(value)) {
              return "Input must be a valid number with up to 2 decimal places.";
            }

            // Validasi nilai absolut (precision dan scale)
            const numericValue = parseFloat(value);
            if (Math.abs(numericValue) >= 100000000) {
              return "Input must be less than 100,000,000.";
            }

            return true;
          },
        }}
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
              type="text"
              fullWidth
              size="small"
              error={!!fieldState.error}
              placeholder={props.placeholder ?? "Type here..."}
              disabled={disabled}
              autoFocus={props.autoFocus}
              label={props.labelOnTextField ? label : undefined}
              inputProps={{
                inputMode: "decimal", // Memunculkan keyboard angka dengan desimal pada perangkat mobile
              }}
              onChange={(e) => {
                // Memfilter input agar sesuai dengan aturan SQL
                let value = e.target.value.replace(/[^0-9.]/g, ""); // Hanya angka, tanda minus, dan titik desimal
                const parts = value.split(".");
                if (parts[0]?.length > 8) {
                  parts[0] = parts[0].slice(0, 8); // Maksimal 8 digit sebelum desimal
                }
                if (parts[1]?.length > 2) {
                  parts[1] = parts[1].slice(0, 2); // Maksimal 2 digit setelah desimal
                }
                value = parts.join(".");
                field.onChange(value); // Update nilai input
              }}
            />

            <FormHelperText id={`${name}-text`}>
              {fieldState.error?.message || "Enter a valid number (max 10 digits, 2 decimal places)."}
            </FormHelperText>
          </FormControl>
        )}
      />
    </Box>
  );
}
