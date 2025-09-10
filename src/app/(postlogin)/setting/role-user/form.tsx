import { useForm, SubmitHandler } from 'react-hook-form';
import { Dialogs } from "@/components/dialog"
import { yupResolver } from '@hookform/resolvers/yup';
import { roleUserSchema } from './schema';
import FormBuilder from '@/components/FormBuilder';
import { IFormLayout } from '@/components/FormBuilder/interfaces';
import { Box, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CREATE_ROLE, UPDATE_ROLE } from '@/lib/redux/types';
import { Save } from '@mui/icons-material';
import { RootState } from '@/lib/redux/store';

type FormRoleUserType = {
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    data: {
        id?: number,
        role?: string,
        created_at?: string,
        created_nik?: number,
        created_by?: string,
        updated_at?: string,
        updated_nik?: number,
        updated_by?: string,
    }
}

const FormRoleUser = ({ open, setOpen, data }: FormRoleUserType) => {
    const [oldValue, setOldValue] = useState<{ [key: string]: any }>()
    const { role } = useSelector((state: RootState) => state.role)
    const dispatch = useDispatch()
    const {
        control,
        formState: { errors },
        handleSubmit,
        reset,
        setError
    } = useForm({
        resolver: yupResolver(roleUserSchema),
        defaultValues: {
            role: ''
        }
    })

    // configuration for field
    const formLayout: IFormLayout[] = [
        {
            width: 12,
            title: 'Role User',
            fields: [
                {
                    fieldName: 'role',
                    label: 'Role *',
                    autoFocus: true,
                    maxLength: 255,
                },
            ]
        }
    ]

    // set value to field when modal open
    useEffect(() => {
        if (data.id) {
            setOldValue(data)
            reset(data)
        } else {
            setOldValue(undefined)
            reset({
                role: ''
            })
        }
    }, [data, open, reset])

    // submit data
    const onSubmit: SubmitHandler<FormRoleUserType['data']> = (data) => {
        if (oldValue?.role.toLowerCase() != data.role?.toLocaleLowerCase()) {
            if (role.find(value => value.role?.toLocaleLowerCase() === data.role?.toLocaleLowerCase())) {
                setError('role', { type: 'custom', message: 'Role already exists' })
                return null
            }
        }
        if (data.id) {
            dispatch({ type: UPDATE_ROLE, data: data })
        } else {
            dispatch({ type: CREATE_ROLE, data: data })
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
            title={`Form ${data.id ? 'Edit' : 'Add'} Role User`}
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

export default FormRoleUser