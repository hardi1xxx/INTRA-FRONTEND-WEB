import * as yup from "yup";

export const upsertJobPositionSchema = yup.object().shape({
  job_position: yup.string().required("Please Input Field Job Position"),
});

export type UpsertJobPositionRequest = yup.InferType<typeof upsertJobPositionSchema>;
