import * as yup from "yup";

export const upsertShiftSchema = yup.object().shape({
  status: yup.boolean().required("Please Input Field Status"),
  area: yup
    .string()
    .required("Please Input Field Area")
    .max(225, 'Area must be at most 225 characters'),
  shift: yup
    .string()
    .required("Please Input Field Shift")
    .max(225, 'Shift must be at most 225 characters'),
});

export type UpsertShiftRequest = yup.InferType<
  typeof upsertShiftSchema
>;
