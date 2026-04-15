import { RootState } from "@/lib/redux/store"
import { yupResolver } from "@hookform/resolvers/yup"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { userSchema } from "./schema"
import { Dialogs } from "@/components/dialog"
import { Box, Button, CircularProgress, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { CREATE_MASTER_USER, UPDATE_MASTER_USER } from "@/lib/redux/types"
import { DataUserRequestType } from "@/lib/services/master/user"
import { Save } from "@mui/icons-material"

type FormUserType = {
  open: boolean,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>,
  data: {
    id?: number,
    name?: string,
    nik?: string,
    email?: string,
    role_id?: string,
    picture?: File | null,
    picture_url?: string,
  },
  roles: {
    id: number,
    role: string,
  }[],
}

const FormUser = ({ open, setOpen, data, roles }: FormUserType) => {
  const dispatch = useDispatch()
  const [oldValue,setOldValue] = useState<{[key: string]: any}>()
  const user = useSelector((state: RootState) => state.user)
  const { severity } = useSelector((state: RootState) => state.notification)

  const {
    control,
    formState: {
      errors,
    },
    handleSubmit,
    reset,
    setValue,
    clearErrors,
    setError
  } = useForm({
    resolver: yupResolver(userSchema),
    defaultValues: {
      name: '',
      nik: "",
      role_id: "",
      picture: null,
    }
  })

  const onSubmit: SubmitHandler<FormUserType['data']> = (data) => {

    if(
      oldValue?.nik.toLowerCase() != data.nik?.toLowerCase() ||
      oldValue?.name.toLowerCase() != data.name?.toLowerCase()
    ){
        if(user.rows.find(value => 
            (value.nik.toLowerCase() === data.nik?.toLowerCase() &&
            value.name.toLowerCase() === data.name?.toLowerCase())
        )){
            setError('name',{type: 'custom',message: `Name already exists`})
            setError('nik',{type: 'custom',message: `Nik already exists`})
            return null
        }
    }

    const dataSubmit: DataUserRequestType = {
      email: "",
      name: data.name ?? "",
      nik: data.nik ?? "",
      role_id: data.role_id ?? "",
      picture: data.picture
    }

    if (data.id) {
      dispatch({ type: UPDATE_MASTER_USER, id: data.id, data: dataSubmit })
    } else {
      dispatch({ type: CREATE_MASTER_USER, data: dataSubmit })
    }
  }

  const onImageHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files != null) {
      const file = event.target.files[0]
      const acceptedImageTypes = [
        'image/apng',
        'image/avif',
        'image/gif', 
        'image/jpeg', 
        'image/png', 
        'image/jpg',
        'image/svg+xml',
        'image/webp'
      ];
      if (!acceptedImageTypes.includes(file.type)) {
        setValue('picture', null)
        setError("picture", { message: "Invalid file" })
      } else {
        setValue("picture", file)
        clearErrors("picture")
      }
    }
  }

  useEffect(() => {
    if (severity === "success") {
      reset()
      setOpen(false)
    }
  }, [severity])

  useEffect(() => {
    if (data.id !== undefined) {
      setOldValue(data)
      reset(data)
    } else {
      setOldValue(undefined)
      reset({
        name: '',
        nik: "",
        role_id: "",
        picture: null,
      })
    }
  }, [open])

  return (
    <Dialogs
      open={open}
      title={`Form ${data.id ? 'Edit' : "Add"} User`}
      setOpen={setOpen}
    >
      <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
        <Grid container spacing={'1rem'}>
          <Grid item xs={12}>
            <Grid container spacing={'1rem'}>

              <Grid item xs={12}>
                <Controller
                  name="nik"
                  control={control}
                  render={({ field }) => {
                    return <FormControl
                      error={errors['nik'] != undefined}
                      variant="standard"
                      fullWidth
                      size="small"
                    >
                      <InputLabel
                        id={`nik-label`}
                        htmlFor={"nik"}
                        sx={{
                          fontSize: '1rem',
                          color: '#364152',
                          fontWeight: '500',
                          position: 'relative'
                        }}
                        shrink
                      >
                        NIK
                      </InputLabel>
                      <TextField
                        {...field}
                        id="nik"
                        aria-describedby={`nik-text`}
                        autoComplete="nik"
                        autoFocus
                        type="number"
                        variant="outlined"
                        size="small"
                        error={!!errors['nik']?.message}
                      />
                      <FormHelperText id="nik-text">
                        {errors['nik']?.message as string}
                      </FormHelperText>
                    </FormControl>
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => {
                    return <FormControl
                      error={errors['name'] != undefined}
                      variant="standard"
                      fullWidth
                      size="small"
                    >
                      <InputLabel
                        id={`name-label`}
                        htmlFor={"name"}
                        sx={{
                          fontSize: '1rem',
                          color: '#364152',
                          fontWeight: '500',
                          position: 'relative'
                        }}
                        shrink
                      >
                        Name
                      </InputLabel>
                      <TextField
                        {...field}
                        id="name"
                        aria-describedby={`name-text`}
                        autoComplete="name"
                        type="text"
                        variant="outlined"
                        size="small"
                        error={!!errors['name']?.message}
                      />
                      <FormHelperText id="name-text">
                        {errors['name']?.message as string}
                      </FormHelperText>
                    </FormControl>
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Controller
                  name="role_id"
                  control={control}
                  render={({ field }) => {
                    return <FormControl
                      error={errors['role_id'] != undefined}
                      variant="standard"
                      fullWidth
                      size="small"
                    >
                      <InputLabel
                        id={`role_id-label`}
                        htmlFor={"role_id"}
                        sx={{
                          fontSize: '1rem',
                          color: '#364152',
                          fontWeight: '500',
                          position: 'relative'
                        }}
                        shrink
                      >
                        Role
                      </InputLabel>
                      <Select
                        {...field}
                        aria-describedby={`${'role_id'}-text`}
                        id={'role_id'}
                        fullWidth
                        labelId={`${'role_id'}-label`}
                        variant="outlined"
                        displayEmpty
                      >
                        <MenuItem value={""}>Please Select Role</MenuItem>
                        {roles.map((role) => {
                          return <MenuItem key={role.id} value={role.id}>{role.role}</MenuItem>
                        })}
                      </Select>
                      <FormHelperText id="role_id-text">
                        {errors['role_id']?.message as string}
                      </FormHelperText>
                    </FormControl>
                  }}
                ></Controller>
              </Grid>

              <Grid item xs={12}>
                <Controller
                  name="picture"
                  control={control}
                  render={({ field }) => {
                    return <FormControl
                      error={errors['picture'] != undefined}
                      variant="standard"
                      fullWidth
                      size="small"
                    >
                      <InputLabel
                        id={`picture-label`}
                        htmlFor={"picture"}
                        sx={{
                          fontSize: '1rem',
                          color: '#364152',
                          fontWeight: '500',
                          position: 'relative'
                        }}
                        shrink
                      >
                        Profile Picture
                      </InputLabel>
                      <TextField
                        type="file"
                        size="small"
                        onChange={onImageHandler}
                        error={!!errors['picture']?.message}
                        inputProps={{
                          accept: 'image/*'
                        }}
                      />
                      <FormHelperText id="picture-text">
                        {errors['picture']?.message as string}
                      </FormHelperText>

                      {
                        field.value != null || data.picture_url != null
                          ? <Box
                            alignItems={"center"}
                            display={'flex'}
                            flexDirection={'column'}
                            gap={'1rem'}
                            sx={{ mt: 2 }}>
                            <Typography>{data.picture_url != null && field.value == null ? "Current" : "New"} Picture</Typography>
                            <img src={field.value != null ? URL.createObjectURL(field.value) : ((data.picture_url ?? ''))}
                              style={{
                                objectFit: 'cover',
                                objectPosition: 'bottom',
                                maxWidth: 'calc(100vh - 500px)',
                                maxHeight: 'calc(100vh - 500px)',
                              }}
                              alt="Profile Pic" />
                          </Box>
                          : null
                      }
                    </FormControl>
                  }}
                />
              </Grid>

            </Grid>
          </Grid>
        </Grid>

        <Box display={'flex'} flexDirection={'row-reverse'} justifyContent={'end'} width={'100%'} marginTop={'1rem'} gap={'1rem'}>
          <Button
            color="primary"
            variant='contained'
            size="small"
            type="submit"
            endIcon={
              user.fetching && <CircularProgress color='inherit' size={'1rem'} />
            }
            startIcon={<Save />}
            disabled={user.fetching}>
            Submit
          </Button>
        </Box>
      </form>
    </Dialogs>
  )
}

export default FormUser