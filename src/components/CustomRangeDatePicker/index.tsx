import { FormHelperText, Grid } from "@mui/material"
import { DateField, DatePicker } from "@mui/x-date-pickers"
import dayjs from "dayjs"
import { useState } from "react"

export type CustomRangeDatePickerProp = {
    value: dayjs.Dayjs[]
    onChange: (value : dayjs.Dayjs[]) => void
    startDateLabel?: string
    endDateLabel?: string
}

const CustomRangeDatePicker = ({value, onChange,startDateLabel,endDateLabel}: CustomRangeDatePickerProp) => {
    return(
        <Grid container>
            <Grid item xs={6} pr={1}>
                <DatePicker
                    label={startDateLabel}
                    slots={{ field: DateField }}
                    slotProps={{ textField: { InputProps: { size: 'small' }, fullWidth: true, error: value[1].diff(value[0]) < 0 } }}
                    value={value[0]}
                    onChange={(newValue) => {
                        onChange([newValue as dayjs.Dayjs,value[1]])
                    }}
                    format="DD MMM YYYY"
                />
            </Grid>
            <Grid item xs={6} pl={1}>
                <DatePicker
                    label={endDateLabel}
                    slots={{ field: DateField }}
                    slotProps={{ textField: { InputProps: { size: 'small' }, fullWidth: true, error: value[1].diff(value[0]) < 0 } }}
                    value={value[1]}
                    onChange={(newValue) => {
                        onChange([value[0],newValue as dayjs.Dayjs])
                    }}
                    format="DD MMM YYYY"
                />
            </Grid>
            <FormHelperText error={value[1].diff(value[0]) < 0}>{value[1].diff(value[0]) < 0 ? 'Start Date cannot more that End Date' : ''}</FormHelperText>
        </Grid>
    )
}

export default CustomRangeDatePicker