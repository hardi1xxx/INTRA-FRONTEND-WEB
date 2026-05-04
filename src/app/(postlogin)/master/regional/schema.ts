import * as yup from "yup";

export const upsertRegionalSchema = yup.object().shape({
  status: yup.boolean().required("Please Input Field Status"),
  regional_code: yup
    .string()
    .required("Please Input Field Regional Code")
    .max(255, 'Regional Code must be at most 255 characters'),
  regional_name: yup
    .string()
    .required("Please Input Field Regional Name")
    .max(255, 'Regional Name must be at most 255 characters'),
  description: yup
    .string()
    .max(255, 'Description must be at most 255 characters'),
});

export type UpsertRegionalRequest = yup.InferType<
  typeof upsertRegionalSchema
>;
