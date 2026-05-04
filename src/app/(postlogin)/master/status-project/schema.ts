import * as yup from "yup";

export const upsertStatusProjectSchema = yup.object().shape({
  status: yup.boolean().required("Please Input Field Status"),
  status_code: yup
    .string()
    .required("Please Input Field Status Code")
    .max(255, 'Status Code must be at most 255 characters'),
  status_name: yup
    .string()
    .required("Please Input Field Status Name")
    .max(255, 'Status Name must be at most 255 characters'),
  description: yup
    .string()
    .max(255, 'Description must be at most 255 characters'),
});

export type UpsertStatusProjectRequest = yup.InferType<
  typeof upsertStatusProjectSchema
>;
