import * as yup from "yup";

export const upsertDailyManPowerSchema = yup.object().shape({
  witel: yup
    .string()
    .required("Please Input Field Witel")
    .max(225, 'Witel must be at most 225 characters'),
  total_surveyor: yup
    .number()
    .required("Please Input Field Total Surveyor")
    .max(3, 'Total Surveyor must be under 999'),
  total_drafter: yup
    .number()
    .required("Please Input Field Total Drafter")
    .max(3, 'Total Drafter must be under 999'),
  total_pt2: yup
    .number()
    .required("Please Input Field Total PT2")
    .max(3, 'Total PT2 must be under 999'),
  total_pt3: yup
    .number()
    .required("Please Input Field Total PT3")
    .max(3, 'Total PT3 must be under 999'),
  total_order: yup
    .number()
    .required("Please Input Field Total Order")
    .max(3, 'Total Order must be under 999'),
  notes: yup
    .string()
    .nullable()
    .max(225, 'Regional must be at most 225 characters'),
  date: yup
    .date()
    .nullable(),
});

export type UpsertDailyManPowerRequest = yup.InferType<
  typeof upsertDailyManPowerSchema
>;
