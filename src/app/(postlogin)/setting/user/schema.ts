import { mixed, object, string } from "yup";

export const userSchema = object({
    name: string().required("Please Input Field Name").label("Name"),
    nik: string().required("Please Input Field NIK").label("NIK"),
    role_id: object().shape({
        id: string().required().label("Role"),
        name: string().required(),
    }),
    // departement_user_id: object().shape({
    //     id: string().required().label("Departement"),
    //     name: string().required(),
    // }),
    picture: mixed<File>().nullable(),
    is_web: string().required("Please Input Field Is Web").label("Is Web"),
    is_app: string().required("Please Input Field Is App").label("Is App"),
    email: string().required("Please Input Field Email").label("Email").email(),
    phone_number: string().label("Phone Number").nullable(),
    picture_sign: mixed<File>().nullable(),
    // job_position_id: object().shape({
    //     id: string().required().label("Job Position"),
    //     name: string().required(),
    // }),
})