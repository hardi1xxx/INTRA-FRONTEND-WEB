import { object, string } from 'yup';

export const menuAccessMobileSchema = object({
    menu: string().required("Please Input Field Menu").label("Menu")
})