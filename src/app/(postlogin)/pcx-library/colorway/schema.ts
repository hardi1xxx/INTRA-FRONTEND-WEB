import { number, object, string } from "yup";

export const colorwaySchema = object({
    nike_colorway_id: string().required().label("Nike Colorway ID"),
    nike_colorway_code: string().required().label("Nike Colorway Code"),
    nike_colorway_name: string().required().label("Nike Colorway Name"),
    colorway_type: string().required().label("Colorway Type").nullable(),
    colorway_status: string().required().label("Colorway Status"),
    colorway_state: string().required().label("Colorway State").nullable()
})