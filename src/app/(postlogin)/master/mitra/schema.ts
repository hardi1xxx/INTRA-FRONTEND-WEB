import * as yup from "yup";

export const upsertMitraSchema = yup.object().shape({
  status: yup.boolean().required("Please Input Field Status"),
  phone: yup
    .string()
    .required("Please Input Field Phone")
    .max(255, 'Phone must be at most 255 characters'),
  name: yup
    .string()
    .required("Please Input Field Name")
    .max(255, 'Name must be at most 255 characters'),
  pic: yup
    .string()
    .required("Please Input Field PIC")
    .max(255, 'PIC must be at most 255 characters'),
  description: yup
    .string()
    .max(255, 'Description must be at most 255 characters'),
});

export type UpsertMitraRequest = yup.InferType<
  typeof upsertMitraSchema
>;
