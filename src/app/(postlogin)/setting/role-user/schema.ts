import { object, string} from 'yup';

export const roleUserSchema = object({
    role : string().required("Please Input Field Role").label("Role")
})