'use client'

import { yupResolver } from "@hookform/resolvers/yup"
import { Box, Button, CircularProgress, FormControl, FormHelperText, Grid, IconButton, InputAdornment, InputLabel, TextField, Typography, Input } from "@mui/material"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { changePasswordSchema } from "./schema"
import { ChangePasswordServiceRequest } from "@/lib/services/auth"
import { CHANGE_PASSWORD } from "@/lib/redux/types"
import { SetStateAction, useEffect, useState } from "react"
import { RootState } from "@/lib/redux/store"
import { Dialogs } from "@/components/dialog"

type ModalChangePasswordType = {
    open: boolean,
    setOpen: React.Dispatch<SetStateAction<boolean>>,
}

const ModalChangePassword = ({open,setOpen}: ModalChangePasswordType) => {
    const dispatch = useDispatch()
    const {fetching, auth, error} = useSelector((state: RootState) => state.auth)
    const {text,severity} = useSelector((state: RootState) => state.notification)
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false)
    const {
        control,
        handleSubmit,
        formState: {
            errors
        },
        setValue,
        reset
    } = useForm({
        resolver: yupResolver(changePasswordSchema),
        defaultValues: {
            current_password: '',
            password: '',
            password_confirmation: '',
        }
    })

    // submit change password
    const onSubmit : SubmitHandler<ChangePasswordServiceRequest> = (data) => {
        dispatch({type: CHANGE_PASSWORD,param: data})
    }

    // reset and close modal when success change password
    useEffect(() => {
        if(severity == 'success'){
            reset({
                current_password: '',
                password: '',
                password_confirmation: '',
            })
            setOpen(false)
        }
    },[severity])

    return(
        <Dialogs
            open={open}
            title={`Change Password`}
            setOpen={setOpen}
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        {/* field current password */}
                        <Controller
                            name="current_password"
                            control={control}
                            render={({ field }) => <FormControl variant="standard" size='small' fullWidth>
                            <InputLabel>Current Password</InputLabel>
                            <Input
                                {...field}
                                size='small'
                                fullWidth
                                type={showCurrentPassword ? 'text' : 'password'}
                                id="current_password"
                                autoComplete="current_password"
                                endAdornment={
                                    <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                        onMouseDown={(e) => e.preventDefault()}
                                        edge="end"
                                    >
                                        {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                    </InputAdornment>
                                }
                            />
                        </FormControl>}
                        />
                        {!! errors.current_password?.message && (
                            <FormHelperText error id="accountId-error">
                                {errors.current_password?.message}
                            </FormHelperText>
                        )}
                    </Grid>
                    <Grid item xs={12}>
                        {/* field new password */}
                        <Controller
                            name="password"
                            control={control}
                            render={({ field }) => <FormControl variant="standard" size='small' fullWidth>
                            <InputLabel>New Password</InputLabel>
                            <Input
                                {...field}
                                size='small'
                                fullWidth
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                autoComplete="password"
                                endAdornment={
                                    <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() => setShowPassword(!showPassword)}
                                        onMouseDown={(e) => e.preventDefault()}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                    </InputAdornment>
                                }
                            />
                        </FormControl>}
                        />
                        {!! errors.password?.message && (
                            <FormHelperText error id="accountId-error">
                                {errors.password?.message}
                            </FormHelperText>
                        )}
                    </Grid>
                    <Grid item xs={12}>
                        {/* field password confirmation */}
                        <Controller
                            name="password_confirmation"
                            control={control}
                            render={({ field }) => <FormControl variant="standard" size='small' fullWidth>
                            <InputLabel>New Password Confirmation</InputLabel>
                            <Input
                                {...field}
                                size='small'
                                fullWidth
                                type={showPasswordConfirmation ? 'text' : 'password'}
                                id="password_confirmation"
                                autoComplete="password_confirmation"
                                endAdornment={
                                    <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                                        onMouseDown={(e) => e.preventDefault()}
                                        edge="end"
                                    >
                                        {showPasswordConfirmation ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                    </InputAdornment>
                                }
                            />
                        </FormControl>}
                        />
                        {!! errors.password_confirmation?.message && (
                            <FormHelperText error id="accountId-error">
                                {errors.password_confirmation?.message}
                            </FormHelperText>
                        )}
                    </Grid>
                    
                    <Grid item xs={12} display={'flex'} flexDirection={'row-reverse'} alignItems={'center'} gap={'1rem'}>
                        <Button 
                            color="primary" 
                            variant='contained' 
                            size="small" 
                            type="submit" 
                            endIcon={
                                fetching && <CircularProgress color='inherit' size={'1rem'}/>
                            }
                            disabled = {fetching}
                        >
                            Submit
                        </Button>
                        <Button color="error" variant='contained' size="small" type="button" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Dialogs>
    )
}

export default ModalChangePassword