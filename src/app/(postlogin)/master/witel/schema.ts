import * as yup from "yup";

export const upsertWitelSchema = yup.object().shape({
  status: yup.boolean().required("Please Input Field Status"),
  regional: yup
    .string()
    .required("Please Input Field Regional")
    .max(225, 'Regional must be at most 225 characters'),
  witel: yup
    .string()
    .required("Please Input Field Witel")
    .max(225, 'Witel must be at most 225 characters'),
  sto: yup
    .string()
    .required("Please Input Field STO")
    .max(225, 'STO must be at most 225 characters'),
});

export type UpsertWitelRequest = yup.InferType<
  typeof upsertWitelSchema
>;
