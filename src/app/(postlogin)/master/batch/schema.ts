import * as yup from "yup";

export const upsertBatchSchema = yup.object().shape({
  status: yup.boolean().required("Please Input Field Status"),
  batch_code: yup
    .string()
    .required("Please Input Field Batch Code")
    .max(255, 'Batch Code must be at most 255 characters'),
  batch_name: yup
    .string()
    .required("Please Input Field Batch Name")
    .max(255, 'Batch Name must be at most 255 characters'),
  description: yup
    .string()
    .max(255, 'Description must be at most 255 characters'),
});

export type UpsertBatchRequest = yup.InferType<
  typeof upsertBatchSchema
>;
