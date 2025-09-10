import { object, string} from 'yup';

export const loginSchema = object({
    nik: string().required('Nik wajib diisi'),
    password: string().required('Password wajib diisi')
})