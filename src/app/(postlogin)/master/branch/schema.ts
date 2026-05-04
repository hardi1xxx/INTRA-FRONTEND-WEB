import * as yup from "yup";

export const upsertBranchSchema = yup.object().shape({
  status: yup.boolean().required("Please Input Field Status"),
  branch_code: yup
    .string()
    .required("Please Input Field Branch Code")
    .max(255, 'Branch Code must be at most 255 characters'),
  branch_name: yup
    .string()
    .required("Please Input Field Branch Name")
    .max(255, 'Branch Name must be at most 255 characters'),
  description: yup
    .string()
    .max(255, 'Description must be at most 255 characters'),
});

export type UpsertBranchRequest = yup.InferType<
  typeof upsertBranchSchema
>;
