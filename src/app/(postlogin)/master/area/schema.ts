import * as yup from "yup";

export const upsertAreaSchema = yup.object().shape({
  status: yup.boolean().required("Please Input Field Status"),
  regional_id: yup
    .number()
    .typeError("Please Select Regional")
    .required("Please Select Regional"),
  area_code: yup
    .string()
    .required("Please Input Field Area Code")
    .max(255, 'Area Code must be at most 255 characters'),
  area_name: yup
    .string()
    .required("Please Input Field Area Name")
    .max(255, 'Area Name must be at most 255 characters'),
  description: yup
    .string()
    .max(255, 'Description must be at most 255 characters'),
  regional_code: yup
    .string()
    .max(255, 'Regional Code must be at most 255 characters'),
});

export type UpsertAreaRequest = yup.InferType<
  typeof upsertAreaSchema
>;
