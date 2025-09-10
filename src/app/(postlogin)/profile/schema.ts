import { object, string} from 'yup';

export const changePasswordSchema = object({
    current_password: string().required(),
    password: string().required(),
    password_confirmation: string().required(),
})