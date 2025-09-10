import { Dayjs } from "dayjs";
import { mixed, object, string } from "yup";

export const latestFeatureSchema = object({
    date_update: mixed<Dayjs>().required().label('Date Update'),
    modul: string().required().label('Modul'),
    keterangan: string().required().label('Information')
})