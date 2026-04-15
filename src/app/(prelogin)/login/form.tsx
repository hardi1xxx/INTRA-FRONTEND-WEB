import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm,Controller,SubmitHandler } from 'react-hook-form';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { CircularProgress, FormControl, FormHelperText, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField, Button, Box, Typography } from '@mui/material';
import { yupResolver } from "@hookform/resolvers/yup"
import { loginSchema } from './schema';
import { LOGIN } from '@/lib/redux/types';
import { RootState } from "@/lib/redux/store";

interface IFormInput{
    nik?: string,
    password?: string
}

const FormLogin = () => {
    const dispatch = useDispatch()
    const {fetching, error, auth} = useSelector((state: RootState) => state.auth)
    
    const submitButtonRef = useRef<HTMLButtonElement>(null)
    
    const [showPassword, setShowPassword] = useState(false);

    const {
        control,
        formState: { errors },
        handleSubmit,
      } = useForm({
        resolver: yupResolver(loginSchema),
        defaultValues: {
            nik: '',
            password: '',
        }
      })
    
    // submit data login
    const onSubmit : SubmitHandler<IFormInput> = (data) => {
        dispatch({type: LOGIN , param: {nik: data.nik, password: data.password}})
    }

    // toggle button show password
    const handleClickShowPassword = () => setShowPassword((show) => !show);

    // on key enter press
    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    return(
        <form
            onSubmit={handleSubmit(onSubmit)}
        >
            <Box sx={{ mt: 1}} display={'flex'} flexDirection={'column'}>
                <Controller
                    name="nik"
                    control={control}
                    render={({ field }) => <TextField
                        {...field}
                        size='small'
                        margin="normal"
                        fullWidth
                        id="nik"
                        label="NIK"
                        autoComplete="nik"
                        autoFocus
                        error={errors.nik != undefined}
                        helperText={errors.nik?.message}
                    />}
                />
                <Controller
                    name="password"
                    control={control}
                    render={({ field }) => <FormControl variant="outlined" size='small'>
                        <InputLabel>Password</InputLabel>
                        <OutlinedInput
                            {...field}
                            size='small'
                            fullWidth
                            label="Kata Sandi"
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            autoComplete="current-password"
                            onKeyDown={(e) => {
                                if(e.ctrlKey && e.key == 'Enter'){
                                    submitButtonRef.current?.click()
                                }
                            }}
                            endAdornment={
                                <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                                </InputAdornment>
                            }
                            // error={errors.password != undefined}
                        />
                    </FormControl>}
                />
                {!! errors.password?.message && (
                    <FormHelperText error id="accountId-error">
                        {errors.password?.message}
                    </FormHelperText>
                )}

                <Typography variant='caption' color={'lightslategray'} fontSize={'0.5rem'} mb={'1rem'}>Forgot your password ? contact admin</Typography>
                
                <Button
                ref={submitButtonRef}
                type="submit"
                fullWidth
                variant="contained"
                className='btn-theme'
                endIcon={
                    fetching && <CircularProgress color='inherit' size={'1rem'}/>
                }
                disabled = {fetching}
                >
                Login
                </Button>
                <Typography variant='caption' color={'lightslategray'} fontSize={'0.5rem'} mb={'1rem'}>Dont have an account? contact admin</Typography>

                <Typography variant='caption' fontWeight={'bold'} fontSize={'0.5rem'}>© 2026. INTRA TEAM</Typography>
            </Box>
        </form>
    )
}

export default FormLogin