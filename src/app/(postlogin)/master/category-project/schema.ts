import * as yup from "yup";

export const upsertCategoryProjectSchema = yup.object().shape({
  status: yup.boolean().required("Please Input Field Status"),
  category_code: yup
    .string()
    .required("Please Input Field Category Code")
    .max(255, 'Category Code must be at most 255 characters'),
  category_name: yup
    .string()
    .required("Please Input Field Category Name")
    .max(255, 'Category Name must be at most 255 characters'),
  description: yup
    .string()
    .max(255, 'Description must be at most 255 characters'),
});

export type UpsertCategoryProjectRequest = yup.InferType<
  typeof upsertCategoryProjectSchema
>;
