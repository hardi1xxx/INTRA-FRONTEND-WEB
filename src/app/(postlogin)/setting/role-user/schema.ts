import { object, string} from 'yup';

export const roleUserSchema = object({
    role : string().required().label("Role")
})