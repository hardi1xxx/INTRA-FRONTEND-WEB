import { RootState } from "@/lib/redux/store"
import { useEffect, useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { menuAccessMobileSchema } from "./schema"
import { yupResolver } from "@hookform/resolvers/yup"
import { IFormLayout } from "@/components/FormBuilder/interfaces"
import { CREATE_MENU_ACCESS_MOBILE, UPDATE_MENU_ACCESS_MOBILE } from "@/lib/redux/types"
import { Dialogs } from "@/components/dialog"
import FormBuilder from "@/components/FormBuilder"
import { Box, Button } from "@mui/material"
import { Save } from "@mui/icons-material"

type FormMenuAccessMobileType = {
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    data: {
        id?: number,
        menu?: string,
    }
}

const FormMenuAccessMobile = ({ open, setOpen, data }: FormMenuAccessMobileType) => {
    const [oldValue, setOldValue] = useState<{ [key: string]: any }>()
    const { rows } = useSelector((state: RootState) => state.menuAccessMobile)
    const dispatch = useDispatch()

    const {
        control,
        formState: { errors },
        handleSubmit,
        reset,
        setError,
    } = useForm({
        resolver: yupResolver(menuAccessMobileSchema),
        defaultValues: {
            menu: '',
        }
    })

    // configuration for field
    const formLayout: IFormLayout[] = [
        {
            width: 12,
            title: 'Menu Access Mobile',
            fields: [
                {
                    fieldName: 'menu',
                    label: 'Menu *',
                    autoFocus: true,
                    maxLength: 255,
                },
            ]
        }
    ]

    // set value to field when open modal
    useEffect(() => {
        if (data.id) {
            setOldValue(data)
            reset(data)
        } else {
            setOldValue(undefined)
            reset({
                menu: ''
            })
        }
    }, [open, reset, setOldValue, data])

    // on submit data
    const onSubmit: SubmitHandler<FormMenuAccessMobileType['data']> = (data) => {
        if (oldValue?.menu.toLowerCase() !== data.menu?.toLowerCase()) {
            if (rows.find(value => value.menu?.toLowerCase() === data.menu?.toLowerCase())) {
                setError('menu', { type: 'custom', message: "Menu already exists" })
                return null
            }
        }

        if (data.id) {
            dispatch({ type: UPDATE_MENU_ACCESS_MOBILE, data })
        } else {
            dispatch({ type: CREATE_MENU_ACCESS_MOBILE, data })
        }

        onCancel()
    }

    // close modal
    const onCancel = () => {
        reset()
        setOpen(false)
    }

    return (
        <Dialogs
            open={open}
            title={`Form ${data.id ? 'Edit' : 'Add'} Menu Access Mobile`}
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
                    <Button color="primary" variant='contained' size="small" type="submit" startIcon={<Save />}>
                        Submit
                    </Button>
                </Box>
            </form>
        </Dialogs>
    )
}

export default FormMenuAccessMobile