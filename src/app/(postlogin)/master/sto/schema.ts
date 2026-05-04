import * as yup from "yup";

export const upsertSTOSchema = yup.object().shape({
  status: yup.boolean().required("Please Input Field Status"),
  sto_code: yup
    .string()
    .required("Please Input Field STO Code")
    .max(255, 'STO Code must be at most 255 characters'),
  sto_name: yup
    .string()
    .required("Please Input Field STO Name")
    .max(255, 'STO Name must be at most 255 characters'),
  description: yup
    .string()
    .max(255, 'Description must be at most 255 characters'),
});

export type UpsertSTORequest = yup.InferType<
  typeof upsertSTOSchema
>;
