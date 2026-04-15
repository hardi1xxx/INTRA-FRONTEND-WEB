import * as yup from "yup";

export const upsertStatusLapanganSchema = yup.object().shape({
  status: yup.boolean().required("Please Input Field Status"),
  name: yup
    .string()
    .required("Please Input Field Name")
    .max(225, 'Name must be at most 225 characters'),
  description: yup
    .string()
    .max(225, 'Description must be at most 225 characters'),
   accessed_by: yup
    .array()
    .of(
      yup.object({
        id: yup.string().required(),
        name: yup.string().required(),
      })
    )
    .required("Please Input Field Role")
    .min(1, "Please select at least one role"),
  accessed_by_name: yup
    .string()
    .max(225, 'Description must be at most 225 characters'),

});

export type UpsertStatusLapanganRequest = yup.InferType<
  typeof upsertStatusLapanganSchema
>;
