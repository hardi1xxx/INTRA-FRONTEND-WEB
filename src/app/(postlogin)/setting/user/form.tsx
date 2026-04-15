/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import { RootState } from "@/lib/redux/store"
import { yupResolver } from "@hookform/resolvers/yup"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { userSchema } from "./schema"
import { Dialogs } from "@/components/dialog"
import { Autocomplete, AutocompleteInputChangeReason, Box, Button, CircularProgress, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material"
import { SyntheticEvent, useCallback, useEffect, useState } from "react"
import { CREATE_MASTER_USER, GET_USER_BY_ID, UPDATE_MASTER_USER } from "@/lib/redux/types"
import { DataUserRequestType } from "@/lib/services/master/user"
import { Save } from "@mui/icons-material"
import { DataUser } from "@/lib/redux/slices/master/user"
import { errorHandler } from "@/lib/redux/sagas/errorHandler"
import { setTextNotification } from "@/lib/redux/slices/notification"
import { getUserDepartementDropdown, getUserJobPositionsDropdown, getUserRoleDropdown } from "@/lib/services"
import { useDebouncedCallback } from "use-debounce"

type FormUserType = {
  open: boolean,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>,
  data: DataUser,
  setIsFiltered: React.Dispatch<React.SetStateAction<boolean>>,
}

type FormUserDataType = {
  name: string,
  nik: string,
  role_id: string,
  picture: string,
  // departement_user_id: string,
  email: string,
  phone_number: string,
  picture_sign: string,
}

const FormUser = ({ open, setOpen, data, setIsFiltered }: FormUserType) => {
  const dispatch = useDispatch()
  const { fetching, user } = useSelector((state: RootState) => state.user)
  const { severity } = useSelector((state: RootState) => state.notification)
  const { formErrorsUser } = useSelector((state: RootState) => state.user)
  const [pictureSignPath, setPictureSignPath] = useState<string>("")
  const [errorImageSign, setErrorImageSign] = useState<boolean>(false)

  // const [selectDepartementData, setSelectDepartementData] = useState<{ id: string; name: string, }[]>([])
  // const [selectDepartementLoading, setSelectDepartementLoading] = useState<boolean>(false)
  // const [selectDepartementOpen, setSelectDepartementOpen] = useState<boolean>(false)

  // const [selectJobPositionData, setSelectJobPositionData] = useState<{ id: string; name: string, }[]>([])
  // const [selectJobPositionLoading, setSelectJobPositionLoading] = useState<boolean>(false)
  // const [selectJobPositionOpen, setSelectJobPositionOpen] = useState<boolean>(false)

  const [selectRoleData, setSelectRoleData] = useState<{ id: string; name: string, }[]>([])
  const [selectRoleLoading, setSelectRoleLoading] = useState<boolean>(false)
  const [selectRoleOpen, setSelectRoleOpen] = useState<boolean>(false)

  // function for call api get departement user
  // const getDataDepartementUser = useCallback(async (keyword: string) => {
  //   try {
  //     if (keyword.length >= 1) {
  //       setSelectDepartementLoading(true)
  //       const res = await getUserDepartementDropdown(keyword)
  //       const parsingData = res.result != undefined ? res.result.data.map((item) => ({ id: item.id.toString() ?? "", name: item.departement ?? "" })) : []
  
  //       setSelectDepartementData(parsingData)
  //       setSelectDepartementLoading(false)

  //       if (parsingData.length == 0) {
  //         dispatch(setTextNotification({ text: "Data not available.", severity: "error" }))
  //       }
  //     } else {
  //       setSelectDepartementLoading(false)
  //       setSelectDepartementData([])
  //     }
  //   } catch (error) {
  //     const { message, statusCode } = errorHandler(error)
  //     dispatch(setTextNotification({ text: message, severity: "error", responseCode: statusCode }))
  //     setSelectDepartementLoading(false)
  //     setSelectDepartementData([])
  //   }
  // }, [dispatch])

  // // function for call api get job position
  // const getDataJobPosition = useCallback(async (keyword: string) => {
  //   try {
  //     if (keyword.length >= 1) {
  //       setSelectJobPositionLoading(true)
  //       const res = await getUserJobPositionsDropdown(keyword)
  //       const parsingData = res.result != undefined ? res.result.data.map((item) => ({ id: item.id.toString() ?? "", name: item.job_position ?? "" })) : []
  
  //       setSelectJobPositionData(parsingData)
  //       setSelectJobPositionLoading(false)

  //       if (parsingData.length == 0) {
  //         dispatch(setTextNotification({ text: "Data not available.", severity: "error" }))
  //       }
  //     } else {
  //       setSelectJobPositionLoading(false)
  //       setSelectJobPositionData([])
  //     }
  //   } catch (error) {
  //     const { message, statusCode } = errorHandler(error)
  //     dispatch(setTextNotification({ text: message, severity: "error", responseCode: statusCode }))
  //     setSelectJobPositionLoading(false)
  //     setSelectJobPositionData([])
  //   }
  // }, [dispatch])

  // function for call api get role
  const getDataRole = useCallback(async (keyword: string) => {
    try {
      if (keyword.length >= 1) {
        setSelectRoleLoading(true)
        const res = await getUserRoleDropdown(keyword)
        const parsingData = res.result != undefined ? res.result.data.map((item) => ({ id: item.id.toString() ?? "", name: item.role ?? "" })) : []
  
        setSelectRoleData(parsingData)
        setSelectRoleLoading(false)

        if (parsingData.length == 0) {
          dispatch(setTextNotification({ text: "Data not available.", severity: "error" }))
        }
      } else {
        setSelectRoleLoading(false)
        setSelectRoleData([])
      }
    } catch (error) {
      const { message, statusCode } = errorHandler(error)
      dispatch(setTextNotification({ text: message, severity: "error", responseCode: statusCode }))
      setSelectRoleLoading(false)
      setSelectRoleData([])
    }
  }, [dispatch])

  // function on input change select departement user
  // const onInputChangeSelectDepartement = useDebouncedCallback(async (event: SyntheticEvent<Element, Event>, value: string, reason: AutocompleteInputChangeReason) => {
  //   if (reason === 'input' || reason === 'clear') {
  //     getDataDepartementUser(value)
  //   }
  // }, 500)

  // function on input change select job position
  // const onInputChangeSelectJobPosition = useDebouncedCallback(async (event: SyntheticEvent<Element, Event>, value: string, reason: AutocompleteInputChangeReason) => {
  //   if (reason === 'input' || reason === 'clear') {
  //     getDataJobPosition(value)
  //   }
  // }, 500)

  // function on input change select role
  const onInputChangeSelectRole = useDebouncedCallback(async (event: SyntheticEvent<Element, Event>, value: string, reason: AutocompleteInputChangeReason) => {
    if (reason === 'input' || reason === 'clear') {
      getDataRole(value)
    }
  }, 500)

  // useEffect(() => {
  //   if (selectDepartementOpen) {
  //     getDataDepartementUser('')
  //   }
  // }, [selectDepartementOpen])

  // useEffect(() => {
  //   if (selectJobPositionOpen) {
  //     getDataJobPosition('')
  //   }
  // }, [selectJobPositionOpen])

  useEffect(() => {
    if (selectRoleOpen) {
      getDataRole('')
    }
  }, [selectRoleOpen])

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
      role_id: undefined,
      picture: null,
      // departement_user_id: undefined,
      is_web: "1",
      is_app: "1",
      email: "",
      phone_number: "",
      picture_sign: null,
      // job_position_id: undefined,
    }
  })

  // function when submit data
  const onSubmit: SubmitHandler<{
    name: string,
    nik: string,
    role_id: {
      id: string,
      name: string
    } | undefined,
    // departement_user_id: {
    //   id: string,
    //   name: string
    // } | undefined,
    // job_position_id: {
    //   id: string,
    //   name: string
    // } | undefined,
    picture?: File | null,
    is_web: string,
    is_app: string,
    email: string,
    phone_number?: string | null,
    picture_sign?: File | null,
  }> = (value) => {
    const dataSubmit: DataUserRequestType = {
      name: value.name ?? "",
      nik: value.nik ?? "",
      role_id: value.role_id?.id ?? '',
      picture: value.picture,
      // departement_user_id: value.departement_user_id?.id ?? '',
      is_app: value.is_app,
      is_web: value.is_web,
      email: value.email ?? "",
      phone_number: value.phone_number ?? "",
      picture_sign: value.picture_sign,
      // job_position_id: value.job_position_id?.id ?? '',
    }

    if (data.id) {
      dispatch({ type: UPDATE_MASTER_USER, id: data.id, data: dataSubmit })
    } else {
      dispatch({ type: CREATE_MASTER_USER, data: dataSubmit })
    }
    setIsFiltered(true)
  }

  // function for image handling
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

  // function for image handling picture sign
  const onImageHandlerPictureSign = (event: React.ChangeEvent<HTMLInputElement>) => {
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
        setValue('picture_sign', null)
        setError("picture_sign", { message: "Invalid file" })
      } else {
        setValue("picture_sign", file)
        clearErrors("picture_sign")
      }
    }
  }

  useEffect(() => {
    if (severity === "success") {
      reset()
      setOpen(false)
    }
  }, [severity, reset, setOpen])

  useEffect(() => {
    setErrorImageSign(false)
    if (data.id !== undefined) {
      reset({
        name: data.name,
        nik: data.nik,
        // departement_user_id: data.departement_user_id != null ? {
        //   id: data.departement_user_id ?? "",
        //   name: data.departement_name ?? ''
        // } : undefined,
        role_id: data.role_id != null ? {
          id: data.role_id ?? "",
          name: data.role_name ?? ''
        } : undefined,
        is_web: data.is_web,
        is_app: data.is_app,
        email: data.email,
        phone_number: data.phone_number,
        // job_position_id: data.job_position_id != null ? {
        //   id: data.job_position_id ?? "",
        //   name: data.job_position_name ?? ''
        // } : undefined,
      })
      dispatch({ type: GET_USER_BY_ID, id: data.id })
    } else {
      reset({
        name: '',
        nik: "",
        role_id: undefined,
        picture: null,
        // departement_user_id: undefined,
        is_web: "1",
        is_app: "1",
        email: "",
        phone_number: "",
        picture_sign: null,
        // job_position_id: undefined,
      })
      setPictureSignPath('')
    }
  }, [open, reset, data])

  useEffect(() => {
    if (formErrorsUser.length > 0) {
      for (const error of formErrorsUser) {
        for (const [key, message] of Object.entries(error)) {
          setError(key as keyof FormUserDataType, { message })
        }
      }
    } else {
      clearErrors()
    }
  }, [formErrorsUser, clearErrors, setError])

  useEffect(() => {
    if (user != null) {
      setPictureSignPath(user.picture_sign ?? "")
    }
  }, [user])

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
                        NIK *
                      </InputLabel>
                      <TextField
                        {...field}
                        id="nik"
                        aria-describedby={`nik-text`}
                        autoComplete="nik"
                        autoFocus
                        variant="outlined"
                        size="small"
                        error={!!errors['nik']?.message}
                        onChange={(event) => {
                          const value = event.target.value
                          if (value) {
                            event.target.value = value.replace(/[^\d]/g, '').toString()
                          }
                          field.onChange(event)
                        }}
                        inputProps={{ maxLength: 255 }}
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
                        Name *
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
                        inputProps={{ maxLength: 255 }}
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
                  name="email"
                  control={control}
                  render={({ field }) => {
                    return <FormControl
                      error={errors['email'] != undefined}
                      variant="standard"
                      fullWidth
                      size="small"
                    >
                      <InputLabel
                        id={`email-label`}
                        htmlFor={"email"}
                        sx={{
                          fontSize: '1rem',
                          color: '#364152',
                          fontWeight: '500',
                          position: 'relative'
                        }}
                        shrink
                      >
                        Email *
                      </InputLabel>
                      <TextField
                        {...field}
                        id="email"
                        aria-describedby={`email-text`}
                        autoComplete="email"
                        type="email"
                        variant="outlined"
                        size="small"
                        error={!!errors['email']?.message}
                        inputProps={{ maxLength: 255 }}
                      />
                      <FormHelperText id="email-text">
                        {errors['email']?.message as string}
                      </FormHelperText>
                    </FormControl>
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Controller
                  name="phone_number"
                  control={control}
                  render={({ field }) => {
                    return <FormControl
                      error={errors['phone_number'] != undefined}
                      variant="standard"
                      fullWidth
                      size="small"
                    >
                      <InputLabel
                        id={`phone_number-label`}
                        htmlFor={"phone_number"}
                        sx={{
                          fontSize: '1rem',
                          color: '#364152',
                          fontWeight: '500',
                          position: 'relative'
                        }}
                        shrink
                      >
                        Phone Number
                      </InputLabel>
                      <TextField
                        {...field}
                        id="phone_number"
                        aria-describedby={`phone_number-text`}
                        autoComplete="phone_number"
                        type="text"
                        variant="outlined"
                        size="small"
                        error={!!errors['phone_number']?.message}
                        inputProps={{ maxLength: 20 }}
                        onChange={(event) => {
                          const value = event.target.value

                          if (value) {
                            event.target.value = value.replace(/[^\d]/g, '').toString()
                          }

                          field.onChange(event)
                        }}
                      />
                      <FormHelperText id="phone_number-text">
                        {errors['phone_number']?.message as string}
                      </FormHelperText>
                    </FormControl>
                  }}
                />
              </Grid>

              {/* ROLE */}
              <Grid item xs={12}>
                <Controller
                  name="role_id"
                  control={control}
                  render={({ field }) => {
                    return <FormControl
                      variant="standard"
                      fullWidth
                      size="small"
                      error={errors['role_id'] != undefined}
                    >
                      <InputLabel
                        id={`role_id-id-label`}
                        htmlFor={'role_id-id'}
                        sx={{
                          fontSize: '1rem',
                          color: '#364152',
                          fontWeight: '500',
                          position: 'relative'
                        }}
                        shrink
                      >
                        Role *
                      </InputLabel>
                      <Autocomplete
                        sx={{
                          '& .MuiAutocomplete-inputRoot': {
                            minHeight: '40px'
                          }
                        }}
                        value={field.value ?? null}
                        defaultValue={null}
                        open={selectRoleOpen ?? []}
                        onOpen={() => setSelectRoleOpen(true)}
                        onClose={() => setSelectRoleOpen(false)}
                        options={selectRoleData}
                        renderInput={(params) => <TextField {...params}
                          aria-describedby={`role_id-text`}
                          autoComplete="role_id"
                          error={errors['role_id'] != undefined}
                          variant="outlined"
                          placeholder="Please enter min 1 character"
                          size="small" />}
                        getOptionLabel={(option) => option.name}
                        getOptionKey={(option) => option.id}
                        onChange={(_, data) => {
                          field.onChange(data)
                        }}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        slotProps={{
                          paper: {
                            elevation: 5,
                          }
                        }}
                        loading={selectRoleLoading}
                        noOptionsText="No Data"
                        onInputChange={onInputChangeSelectRole}
                      />
                      <FormHelperText id="role_id-text">
                        {errors['role_id'] != undefined ? 'Please Input Field Role' : ''}
                      </FormHelperText>
                    </FormControl>
                  }}
                />
              </Grid>
              {/* END ROLE */}

              {/* JOB POSITON */}
              {/* <Grid item xs={12}>
                <Controller
                  name="job_position_id"
                  control={control}
                  render={({ field }) => {
                    return <FormControl
                      variant="standard"
                      fullWidth
                      size="small"
                      error={errors['job_position_id'] != undefined}
                    >
                      <InputLabel
                        id={`job_position_id-id-label`}
                        htmlFor={'job_position_id-id'}
                        sx={{
                          fontSize: '1rem',
                          color: '#364152',
                          fontWeight: '500',
                          position: 'relative'
                        }}
                        shrink
                      >
                        Job Position *
                      </InputLabel>
                      <Autocomplete
                        sx={{
                          '& .MuiAutocomplete-inputRoot': {
                            minHeight: '40px'
                          }
                        }}
                        value={field.value ?? null}
                        defaultValue={null}
                        open={selectJobPositionOpen ?? []}
                        onOpen={() => setSelectJobPositionOpen(true)}
                        onClose={() => setSelectJobPositionOpen(false)}
                        options={selectJobPositionData}
                        renderInput={(params) => <TextField {...params}
                          aria-describedby={`job_position_id-text`}
                          autoComplete="job_position_id"
                          error={errors['job_position_id'] != undefined}
                          variant="outlined"
                          placeholder="Please enter min 1 character"
                          size="small" />}
                        getOptionLabel={(option) => option.name}
                        getOptionKey={(option) => option.id}
                        onChange={(_, data) => {
                          field.onChange(data)
                        }}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        slotProps={{
                          paper: {
                            elevation: 5,
                          }
                        }}
                        loading={selectJobPositionLoading}
                        noOptionsText="No Data"
                        onInputChange={onInputChangeSelectJobPosition}
                      />
                      <FormHelperText id="job_position_id-text">
                        {errors['job_position_id'] != undefined ? 'Please Input Field Job Position' : ''}
                      </FormHelperText>
                    </FormControl>
                  }}
                />
              </Grid> */}
              {/* END JOB POSITION */}

              {/* DEPARTEMENT */}
              {/* <Grid item xs={12}>
                <Controller
                  name="departement_user_id"
                  control={control}
                  render={({ field }) => {
                    return <FormControl
                      variant="standard"
                      fullWidth
                      size="small"
                      error={errors['departement_user_id'] != undefined}
                    >
                      <InputLabel
                        id={`departement_user_id-id-label`}
                        htmlFor={'departement_user_id-id'}
                        sx={{
                          fontSize: '1rem',
                          color: '#364152',
                          fontWeight: '500',
                          position: 'relative'
                        }}
                        shrink
                      >
                        Departement *
                      </InputLabel>
                      <Autocomplete
                        sx={{
                          '& .MuiAutocomplete-inputRoot': {
                            minHeight: '40px'
                          }
                        }}
                        value={field.value ?? null}
                        defaultValue={null}
                        open={selectDepartementOpen ?? []}
                        onOpen={() => setSelectDepartementOpen(true)}
                        onClose={() => setSelectDepartementOpen(false)}
                        options={selectDepartementData}
                        renderInput={(params) => <TextField {...params}
                          aria-describedby={`departement_user_id-text`}
                          autoComplete="departement_user_id"
                          error={errors['departement_user_id'] != undefined}
                          variant="outlined"
                          placeholder="Please enter min 1 character"
                          size="small" />}
                        getOptionLabel={(option) => option.name}
                        getOptionKey={(option) => option.id}
                        onChange={(_, data) => {
                          field.onChange(data)
                        }}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        slotProps={{
                          paper: {
                            elevation: 5,
                          }
                        }}
                        loading={selectDepartementLoading}
                        noOptionsText="No Data"
                        onInputChange={onInputChangeSelectDepartement}
                      />
                      <FormHelperText id="departement_user_id-text">
                        {errors['departement_user_id'] != undefined ? 'Please Input Field Departement' : ''}
                      </FormHelperText>
                    </FormControl>
                  }}
                />
              </Grid> */}
              {/* END DEPARTEMENT */}

              <Grid item xs={12}>
                <Controller
                  name="is_web"
                  control={control}
                  render={({ field }) => {
                    return <FormControl
                      error={errors['is_web'] != undefined}
                      variant="standard"
                      fullWidth
                      size="small"
                    >
                      <InputLabel
                        id={`is_web-label`}
                        htmlFor={"is_web"}
                        sx={{
                          fontSize: '1rem',
                          color: '#364152',
                          fontWeight: '500',
                          position: 'relative'
                        }}
                        shrink
                      >
                        Is Web? *
                      </InputLabel>
                      <Select
                        {...field}
                        aria-describedby={`${'is_web'}-text`}
                        id={'is_web'}
                        fullWidth
                        labelId={`${'is_web'}-label`}
                        variant="outlined"
                        displayEmpty
                      >
                        <MenuItem value={"1"}>Active</MenuItem>
                        <MenuItem value={"0"}>Inactive</MenuItem>
                      </Select>
                      <FormHelperText id="is_web-text">
                        {errors['is_web']?.message as string}
                      </FormHelperText>
                    </FormControl>
                  }}
                ></Controller>
              </Grid>

              <Grid item xs={12}>
                <Controller
                  name="is_app"
                  control={control}
                  render={({ field }) => {
                    return <FormControl
                      error={errors['is_app'] != undefined}
                      variant="standard"
                      fullWidth
                      size="small"
                    >
                      <InputLabel
                        id={`is_app-label`}
                        htmlFor={"is_app"}
                        sx={{
                          fontSize: '1rem',
                          color: '#364152',
                          fontWeight: '500',
                          position: 'relative'
                        }}
                        shrink
                      >
                        Is App? *
                      </InputLabel>
                      <Select
                        {...field}
                        aria-describedby={`${'is_app'}-text`}
                        id={'is_app'}
                        fullWidth
                        labelId={`${'is_app'}-label`}
                        variant="outlined"
                        displayEmpty
                      >
                        <MenuItem value={"1"}>Active</MenuItem>
                        <MenuItem value={"0"}>Inactive</MenuItem>
                      </Select>
                      <FormHelperText id="is_app-text">
                        {errors['is_app']?.message as string}
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
                        field.value != null || data.picture != null
                          ? <Box
                            alignItems={"center"}
                            display={'flex'}
                            flexDirection={'column'}
                            gap={'1rem'}
                            sx={{ mt: 2 }}>
                            <Typography>{data.picture != null && field.value == null ? "Current" : "New"} Picture</Typography>
                            <img src={field.value != null ? URL.createObjectURL(field.value) : ((process.env.NEXT_PUBLIC_TARGET_API)?.replace('/api', '/storage/') + (data.picture ?? ''))}
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

              <Grid item xs={12}>
                <Controller
                  name="picture_sign"
                  control={control}
                  render={({ field }) => {
                    return <FormControl
                      error={errors['picture_sign'] != undefined}
                      variant="standard"
                      fullWidth
                      size="small"
                    >
                      <InputLabel
                        id={`picture_sign-label`}
                        htmlFor={"picture_sign"}
                        sx={{
                          fontSize: '1rem',
                          color: '#364152',
                          fontWeight: '500',
                          position: 'relative'
                        }}
                        shrink
                      >
                        Picture Sign
                      </InputLabel>
                      <TextField
                        type="file"
                        size="small"
                        onChange={onImageHandlerPictureSign}
                        error={!!errors['picture_sign']?.message}
                        inputProps={{
                          accept: 'image/*'
                        }}
                      />
                      <FormHelperText id="picture_sign-text">
                        {errors['picture_sign']?.message as string}
                      </FormHelperText>

                      {
                        (field.value != null || pictureSignPath != '') && !errorImageSign
                          ? <Box
                            alignItems={"center"}
                            display={'flex'}
                            flexDirection={'column'}
                            gap={'1rem'}
                            sx={{ mt: 2 }}>
                            <Typography>{pictureSignPath != '' && field.value == null ? "Current" : "New"} Picture Sign</Typography>
                            <img src={field.value != null ? URL.createObjectURL(field.value) : ((process.env.NEXT_PUBLIC_TARGET_API)?.replace('/api', '/storage/') + (pictureSignPath ?? ''))}
                              style={{
                                objectFit: 'cover',
                                objectPosition: 'bottom',
                                maxWidth: 'calc(100vh - 500px)',
                                maxHeight: 'calc(100vh - 500px)',
                              }}
                              onError={({ currentTarget }) => {
                                currentTarget.onerror = null; // prevents looping
                                currentTarget.src = "https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available_87543-11093.jpg";
                                setErrorImageSign(true)
                              }}
                              alt="Picture Sign" />
                          </Box>
                          : null
                      }
                    </FormControl>
                  }}
                />
              </Grid>

            </Grid>
          </Grid>
          {
            !data.id && (
              <Grid item xs={12}>
                <span>Note : Create user will generate default password with "<span style={{ color: 'red' }}>password</span>"</span>
              </Grid>
            )
          }
        </Grid>

        <Box display={'flex'} flexDirection={'row-reverse'} justifyContent={'end'} width={'100%'} marginTop={'1rem'} gap={'1rem'}>
          <Button
            color="primary"
            variant='contained'
            size="small"
            type="submit"
            endIcon={
              fetching && <CircularProgress color='inherit' size={'1rem'} />
            }
            startIcon={<Save />}
            disabled={fetching}>
            Submit
          </Button>
        </Box>
      </form>
    </Dialogs>
  )
}

export default FormUser