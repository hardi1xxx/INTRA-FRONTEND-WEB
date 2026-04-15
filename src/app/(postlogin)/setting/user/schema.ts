import { mixed, object, string } from "yup";

export const userSchema = object({
    name: string().required().label("Name"),
    nik: string().required().label("NIK"),
    role_id: string().required().label("Role"),
    picture: mixed<File>().nullable()
})