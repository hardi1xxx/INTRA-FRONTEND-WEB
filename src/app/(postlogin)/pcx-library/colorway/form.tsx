import { yupResolver } from "@hookform/resolvers/yup"
import { SubmitHandler, useForm } from "react-hook-form"
import { colorwaySchema } from "./schema"
import { IFormLayout } from "@/components/FormBuilder/interfaces"
import { Dialogs } from "@/components/dialog"
import FormBuilder from "@/components/FormBuilder"
import { Box, Button, CircularProgress } from "@mui/material"
import { Save } from "@mui/icons-material"
import { useEffect } from "react"
import { DataMasterColorway } from "@/lib/redux/slices/pcxLibrary/colorway"
import { useDispatch, useSelector } from "react-redux"
import { CREATE_COLORWAY, UPDATE_COLORWAY } from "@/lib/redux/types"
import { RootState } from "@/lib/redux/store"

type FormColorwayType = {
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    data: DataMasterColorway,
    pageProps: {
        start: number;
        length: number;
        order: string;
        search: string
    },
    setIsFiltered: React.Dispatch<React.SetStateAction<boolean>>
}

const FormColorway = ({ open, setOpen, data, pageProps, setIsFiltered }: FormColorwayType) => {
    const { fetching, params } = useSelector((state: RootState) => state.pcxLibraryColorway)
    const { severity } = useSelector((state: RootState) => state.notification)

    const dispatch = useDispatch()
    const {
        control,
        formState: { errors },
        handleSubmit,
        reset
    } = useForm({
        resolver: yupResolver(colorwaySchema),
        defaultValues: {
            colorway_state: "",
            colorway_status: "Active",
            colorway_type: "",
            nike_colorway_code: "",
            nike_colorway_id: "",
            nike_colorway_name: ""
        }
    })

    // define variable form layout
    const formLayout: IFormLayout[] = [
        {
            width: 12,
            title: "Colorway",
            fields: [
                {
                    fieldName: "nike_colorway_id",
                    label: "Nike Colorway ID",
                    type: "number"
                },
                {
                    fieldName: "nike_colorway_code",
                    label: "Nike Colorway Code",
                    maxLength: 10,
                },
                {
                    fieldName: "nike_colorway_name",
                    label: "Nike Colorway Name"
                },
                {
                    fieldName: "colorway_type",
                    label: "Colorway Type",
                    select: true,
                    selectItem: [
                        {
                            label: "Line Planned",
                            value: "Line Planned"
                        },
                        {
                            label: "Target",
                            value: "Target"
                        },
                        {
                            label: "Drop",
                            value: "Drop"
                        },
                    ]
                },
                {
                    fieldName: "colorway_status",
                    label: "Colorway Status",
                    select: true,
                    selectItem: [
                        {
                            label: 'Active',
                            value: 'Active'
                        },
                        {
                            label: 'Inactive',
                            value: 'Inactive'
                        },
                    ]
                },
                {
                    fieldName: "colorway_state",
                    label: "Colorway State",
                    select: true,
                    selectItem: [
                        {
                            label: "DBOM Released",
                            value: "DBOM Released"
                        },
                        {
                            label: "DBOM Update Pending",
                            value: "DBOM Update Pending"
                        },
                        {
                            label: "DBOM In-Work",
                            value: "DBOM In-Work"
                        },
                        {
                            label: "MBOM Tentative",
                            value: "MBOM Tentative"
                        },
                        {
                            label: "MBOM Confirmed",
                            value: "MBOM Confirmed"
                        },
                    ]
                }
            ]
        }
    ]

    // function when submit data
    const onSubmit: SubmitHandler<FormColorwayType['data']> = (data) => {
        if (data.colorway_id) {
            dispatch({
                type: UPDATE_COLORWAY,
                data: {
                    ...data,
                    org_id: "82"
                },
                filter: {
                    ...params,
                    start: pageProps.start,
                    length: pageProps.length,
                    search: pageProps.search,
                    order_param: pageProps.order,
                },
                id: data.colorway_id
            })
        } else {
            dispatch({
                type: CREATE_COLORWAY,
                data: {
                    ...data,
                    org_id: "82"
                },
                filter: {
                    ...params,
                    start: pageProps.start,
                    length: pageProps.length,
                    search: pageProps.search,
                    order_param: pageProps.order,
                }
            })
        }
        setIsFiltered(true)
    }

    useEffect(() => {
        if (data.colorway_id) {
            reset(data)
        } else {
            reset({
                colorway_state: "",
                colorway_status: "Active",
                colorway_type: "",
                nike_colorway_code: "",
                nike_colorway_id: "",
                nike_colorway_name: "",
            })
        }
    }, [open])

    useEffect(() => {
        if (severity == 'success') {
            reset()
            setOpen(false)
        }
    }, [severity])

    return (
        <Dialogs
            open={open}
            title={`Form ${data.colorway_id ? 'Edit' : 'Add'} Colorway`}
            setOpen={setOpen}
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <FormBuilder
                    formLayout={formLayout}
                    control={control}
                    errors={errors}
                    withCard={false}
                />
                <Box display={'flex'} flexDirection={'row-reverse'} justifyContent={'end'} width={'100%'} marginTop={'1rem'} gap={'1rem'}>
                    <Button color="primary" variant='contained' size="small" type="submit" startIcon={<Save />} endIcon={
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

export default FormColorway