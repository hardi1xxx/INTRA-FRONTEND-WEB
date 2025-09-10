/* eslint-disable react-hooks/exhaustive-deps */
import { RootState } from "@/lib/redux/store"
import { yupResolver } from "@hookform/resolvers/yup"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { latestFeatureSchema } from "./schema"
import dayjs, { Dayjs } from "dayjs"
import { IFormLayout } from "@/components/FormBuilder/interfaces"
import { useEffect, useState } from "react"
import { Dialogs } from "@/components/dialog"
import { CREATE_SETTING_LATEST_FEATURE, UPDATE_SETTING_LATEST_FEATURE } from "@/lib/redux/types"
import FormBuilder from "@/components/FormBuilder"
import { Box, Button, CircularProgress, FormControl, FormHelperText, Grid, InputLabel } from "@mui/material"
import { Save } from "@mui/icons-material"
import { DateTimePicker } from "@mui/x-date-pickers"

type FormLatestFeatureType = {
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    data: {
        id?: number,
        date_update?: Dayjs,
        modul?: string,
        keterangan?: string,
    },
    setIsFiltered: React.Dispatch<React.SetStateAction<boolean>>,
}

const FormLatestFeature = ({ open, setOpen, data, setIsFiltered }: FormLatestFeatureType) => {
    const dispatch = useDispatch()
    const {
        params,
        fetching,
    } = useSelector((state: RootState) => state.latestFeature)
    const { severity } = useSelector((state: RootState) => state.notification)
    const [openDatePicker, setOpenDatePicker] = useState<boolean>(false)

    const {
        control,
        formState: {
            errors
        },
        handleSubmit,
        reset,
    } = useForm({
        resolver: yupResolver(latestFeatureSchema),
        defaultValues: {
            date_update: dayjs(new Date()),
            modul: '',
            keterangan: ""
        }
    })

    const formLayout: IFormLayout[] = [
        {
            width: 12,
            title: 'Latest Feature',
            fields: [
                {
                    fieldName: "modul",
                    label: "Modul",
                    autoFocus: true,
                    maxLength: 255,
                    required: true
                },
                {
                    fieldName: "keterangan",
                    label: "Information",
                    multiline: true,
                    maxLength: 255,
                    required: true
                }
            ]
        }
    ]

    useEffect(() => {
        if (data.id) {
            reset({
                ...data
            })
        } else {
            reset({
                date_update: dayjs(new Date()),
                modul: '',
                keterangan: ""
            })
        }
    }, [open])

    useEffect(() => {
        if (severity == 'success') {
            reset()
            setOpen(false)
        }
    }, [severity])

    const onSubmit: SubmitHandler<FormLatestFeatureType['data']> = (data) => {
        if (data.id) {
            dispatch({
                type: UPDATE_SETTING_LATEST_FEATURE,
                id: data.id,
                data: { ...data, date_update: data.date_update?.format("YYYY-MM-DD HH:mm:ss") },
                params
            })
        } else {
            dispatch({
                type: CREATE_SETTING_LATEST_FEATURE,
                data: { ...data, date_update: data.date_update?.format("YYYY-MM-DD HH:mm:ss") },
                params
            })
        }
        setIsFiltered(true)
    }

    return (
        <Dialogs
            open={open}
            title={`Form ${data.id ? 'Edit' : "Add"} Latest Feature`}
            setOpen={setOpen}
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <FormBuilder
                    formLayout={formLayout}
                    control={control}
                    errors={errors}
                    withCard={false}
                />
                <Grid container spacing={'1rem'} marginTop={'0.5rem'}>
                    <Grid item xs={12}>
                        <Controller
                            name="date_update"
                            control={control}
                            render={({ field }) => {
                                return <FormControl
                                    error={errors['date_update'] != undefined}
                                    variant="standard"
                                    fullWidth
                                    size="small"
                                >
                                    <InputLabel
                                        id={`date_update-label`}
                                        htmlFor={"date_update"}
                                        sx={{
                                            fontSize: '1rem',
                                            color: '#364152',
                                            fontWeight: '500',
                                            position: 'relative'
                                        }}
                                        shrink
                                    >
                                        Date Update
                                    </InputLabel>
                                    <DateTimePicker
                                        {...field}
                                        open={openDatePicker}
                                        onOpen={() => { setOpenDatePicker(true) }}
                                        onClose={() => { setOpenDatePicker(false) }}
                                        closeOnSelect
                                        onChange={(newValue) => {
                                            field.onChange(newValue)
                                        }}
                                        slotProps={{
                                            textField: {
                                                onClick: () => setOpenDatePicker(true),
                                                size: "small",
                                                variant: "outlined"
                                            },
                                        }}
                                        ampm={false}
                                    />
                                    <FormHelperText id="date_update-text">
                                        {errors['date_update']?.message as string}
                                    </FormHelperText>
                                </FormControl>
                            }}
                        />
                    </Grid>
                </Grid>
                <Box display={'flex'} flexDirection={'row-reverse'} justifyContent={'end'} width={'100%'} marginTop={'1rem'} gap={'1rem'}>
                    <Button
                        color="primary"
                        variant='contained'
                        size="small"
                        type="submit"
                        startIcon={<Save />}
                        endIcon={
                            fetching && <CircularProgress color='inherit' size={'1rem'} />
                        }
                        disabled={fetching}>
                        Submit
                    </Button>
                </Box>
            </form>
        </Dialogs>
    )
}

export default FormLatestFeature