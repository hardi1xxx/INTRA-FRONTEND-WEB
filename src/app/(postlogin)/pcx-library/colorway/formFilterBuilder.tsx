import { DataColorwayIDMasterColorway, DataColorwayStateMasterColorway, DataColorwayStatusMasterColorway, DataColorwayTypeMasterColorway, DataNikeColorwayCodeMasterColorway, DataNikeColorwayIDMasterColorway, DataNikeColorwayNameMasterColorway } from "@/lib/redux/slices/pcxLibrary/colorway"
import { Autocomplete, AutocompleteInputChangeReason, FormControl, FormHelperText, Grid, InputLabel, TextField } from "@mui/material"
import { SyntheticEvent } from "react"
import { Control, Controller, FieldErrors } from "react-hook-form"

type FormFilterBuilderMasterColorwayType = {
    control: Control<any>,
    errors: FieldErrors<{ [key: string]: any }>,

    colorwayID: DataColorwayIDMasterColorway[],
    fetchingColorwayID: boolean,
    onInputChangeColorwayID: ((event: SyntheticEvent<Element, Event>, value: string, reason: AutocompleteInputChangeReason) => void),

    nikeColorwayID: DataNikeColorwayIDMasterColorway[],
    fetchingNikeColorwayID: boolean,
    onInputChangeNikeColorwayID: ((event: SyntheticEvent<Element, Event>, value: string, reason: AutocompleteInputChangeReason) => void),

    nikeColorwayCode: DataNikeColorwayCodeMasterColorway[],
    fetchingNikeColorwayCode: boolean,
    onInputChangeNikeColorwayCode: ((event: SyntheticEvent<Element, Event>, value: string, reason: AutocompleteInputChangeReason) => void),

    nikeColorwayName: DataNikeColorwayNameMasterColorway[],
    fetchingNikeColorwayName: boolean,
    onInputChangeNikeColorwayName: ((event: SyntheticEvent<Element, Event>, value: string, reason: AutocompleteInputChangeReason) => void),

    colorwayType: DataColorwayTypeMasterColorway[],
    fetchingColorwayType: boolean,
    onInputChangeColorwayType: ((event: SyntheticEvent<Element, Event>, value: string, reason: AutocompleteInputChangeReason) => void),

    colorwayStatus: DataColorwayStatusMasterColorway[],
    fetchingColorwayStatus: boolean,
    onInputChangeColorwayStatus: ((event: SyntheticEvent<Element, Event>, value: string, reason: AutocompleteInputChangeReason) => void),

    colorwayState: DataColorwayStateMasterColorway[],
    fetchingColorwayState: boolean,
    onInputChangeColorwayState: ((event: SyntheticEvent<Element, Event>, value: string, reason: AutocompleteInputChangeReason) => void),
}

const FormFilterBuilderMasterColorway = ({
    control,
    errors,
    colorwayID,
    fetchingColorwayID,
    onInputChangeColorwayID,
    nikeColorwayID,
    fetchingNikeColorwayID,
    onInputChangeNikeColorwayID,
    nikeColorwayCode,
    fetchingNikeColorwayCode,
    onInputChangeNikeColorwayCode,
    nikeColorwayName,
    fetchingNikeColorwayName,
    onInputChangeNikeColorwayName,
    colorwayType,
    fetchingColorwayType,
    onInputChangeColorwayType,
    colorwayStatus,
    fetchingColorwayStatus,
    onInputChangeColorwayStatus,
    colorwayState,
    fetchingColorwayState,
    onInputChangeColorwayState,
}: FormFilterBuilderMasterColorwayType) => {
    return (
        <>
            <Grid item xs={12} md={4} lg={3}>
                <Controller
                    name="colorway_id"
                    control={control}
                    render={({ field }) => {
                        return <FormControl
                            error={errors['colorway_id'] != undefined}
                            variant="standard"
                            fullWidth
                            size="small"
                        >
                            <InputLabel
                                id={`colorway_id-label`}
                                htmlFor={"colorway_id"}
                                sx={{
                                    fontSize: '1rem',
                                    color: '#364152',
                                    fontWeight: '500',
                                    position: 'relative'
                                }}
                                shrink
                            >
                                Colorway ID
                            </InputLabel>
                            <Autocomplete
                                disablePortal
                                sx={{
                                    '& .MuiAutocomplete-inputRoot': {
                                        minHeight: '40px'
                                    }
                                }}
                                {...field}
                                options={colorwayID ?? []}
                                renderInput={(params) => <TextField {...params}
                                    aria-describedby={`colorway_id-text`}
                                    autoComplete="colorway_id"
                                    error={errors['colorway_id'] != undefined}
                                    variant="outlined"
                                    placeholder="Please enter min 1 character"
                                    size="small" />}
                                getOptionLabel={(option) => option.colorway_id.toString()}
                                onChange={(_, data) => field.onChange(data)}
                                isOptionEqualToValue={(option, value) => option.colorway_id.toString() === value.colorway_id.toString()}
                                slotProps={{
                                    paper: {
                                        elevation: 5,
                                    }
                                }}
                                loading={fetchingColorwayID}
                                noOptionsText="No Data"
                                onInputChange={onInputChangeColorwayID}
                            />
                            <FormHelperText id="colorway_id-text">
                                {errors['colorway_id']?.message as string}
                            </FormHelperText>
                        </FormControl>
                    }}
                />
            </Grid>
            <Grid item xs={12} md={4} lg={3}>
                <Controller
                    name="nike_colorway_id"
                    control={control}
                    render={({ field }) => {
                        return <FormControl
                            error={errors['nike_colorway_id'] != undefined}
                            variant="standard"
                            fullWidth
                            size="small"
                        >
                            <InputLabel
                                id={`nike_colorway_id-label`}
                                htmlFor={"nike_colorway_id"}
                                sx={{
                                    fontSize: '1rem',
                                    color: '#364152',
                                    fontWeight: '500',
                                    position: 'relative'
                                }}
                                shrink
                            >
                                Nike Colorway ID
                            </InputLabel>
                            <Autocomplete
                                disablePortal
                                sx={{
                                    '& .MuiAutocomplete-inputRoot': {
                                        minHeight: '40px'
                                    }
                                }}
                                {...field}
                                options={nikeColorwayID ?? []}
                                renderInput={(params) => <TextField {...params}
                                    aria-describedby={`nike_colorway_id-text`}
                                    autoComplete="nike_colorway_id"
                                    error={errors['nike_colorway_id'] != undefined}
                                    variant="outlined"
                                    placeholder="Please enter min 1 character"
                                    size="small" />}
                                getOptionLabel={(option) => option.nike_colorway_id.toString()}
                                onChange={(_, data) => field.onChange(data)}
                                isOptionEqualToValue={(option, value) => option.nike_colorway_id.toString() === value.nike_colorway_id.toString()}
                                slotProps={{
                                    paper: {
                                        elevation: 5,
                                    }
                                }}
                                loading={fetchingNikeColorwayID}
                                noOptionsText="No Data"
                                onInputChange={onInputChangeNikeColorwayID}
                            />
                            <FormHelperText id="nike_colorway_id-text">
                                {errors['nike_colorway_id']?.message as string}
                            </FormHelperText>
                        </FormControl>
                    }}
                />
            </Grid>
            <Grid item xs={12} md={4} lg={3}>
                <Controller
                    name="nike_colorway_code"
                    control={control}
                    render={({ field }) => {
                        return <FormControl
                            error={errors['nike_colorway_code'] != undefined}
                            variant="standard"
                            fullWidth
                            size="small"
                        >
                            <InputLabel
                                id={`nike_colorway_code-label`}
                                htmlFor={"nike_colorway_code"}
                                sx={{
                                    fontSize: '1rem',
                                    color: '#364152',
                                    fontWeight: '500',
                                    position: 'relative'
                                }}
                                shrink
                            >
                                Nike Colorway Code
                            </InputLabel>
                            <Autocomplete
                                disablePortal
                                sx={{
                                    '& .MuiAutocomplete-inputRoot': {
                                        minHeight: '40px'
                                    }
                                }}
                                {...field}
                                options={nikeColorwayCode ?? []}
                                renderInput={(params) => <TextField {...params}
                                    aria-describedby={`nike_colorway_code-text`}
                                    autoComplete="nike_colorway_code"
                                    error={errors['nike_colorway_code'] != undefined}
                                    variant="outlined"
                                    placeholder="Please enter min 1 character"
                                    size="small" />}
                                getOptionLabel={(option) => option.nike_colorway_code}
                                onChange={(_, data) => field.onChange(data)}
                                isOptionEqualToValue={(option, value) => option.nike_colorway_code === value.nike_colorway_code}
                                slotProps={{
                                    paper: {
                                        elevation: 5,
                                    }
                                }}
                                loading={fetchingNikeColorwayCode}
                                noOptionsText="No Data"
                                onInputChange={onInputChangeNikeColorwayCode}
                            />
                            <FormHelperText id="nike_colorway_code-text">
                                {errors['nike_colorway_code']?.message as string}
                            </FormHelperText>
                        </FormControl>
                    }}
                />
            </Grid>
            <Grid item xs={12} md={4} lg={3}>
                <Controller
                    name="nike_colorway_name"
                    control={control}
                    render={({ field }) => {
                        return <FormControl
                            error={errors['nike_colorway_name'] != undefined}
                            variant="standard"
                            fullWidth
                            size="small"
                        >
                            <InputLabel
                                id={`nike_colorway_name-label`}
                                htmlFor={"nike_colorway_name"}
                                sx={{
                                    fontSize: '1rem',
                                    color: '#364152',
                                    fontWeight: '500',
                                    position: 'relative'
                                }}
                                shrink
                            >
                                Nike Colorway Name
                            </InputLabel>
                            <Autocomplete
                                disablePortal
                                sx={{
                                    '& .MuiAutocomplete-inputRoot': {
                                        minHeight: '40px'
                                    }
                                }}
                                {...field}
                                options={nikeColorwayName ?? []}
                                renderInput={(params) => <TextField {...params}
                                    aria-describedby={`nike_colorway_name-text`}
                                    autoComplete="nike_colorway_name"
                                    error={errors['nike_colorway_name'] != undefined}
                                    variant="outlined"
                                    placeholder="Please enter min 1 character"
                                    size="small" />}
                                getOptionLabel={(option) => option.nike_colorway_name}
                                onChange={(_, data) => field.onChange(data)}
                                isOptionEqualToValue={(option, value) => option.nike_colorway_name === value.nike_colorway_name}
                                slotProps={{
                                    paper: {
                                        elevation: 5,
                                    }
                                }}
                                loading={fetchingNikeColorwayName}
                                noOptionsText="No Data"
                                onInputChange={onInputChangeNikeColorwayName}
                            />
                            <FormHelperText id="nike_colorway_name-text">
                                {errors['nike_colorway_name']?.message as string}
                            </FormHelperText>
                        </FormControl>
                    }}
                />
            </Grid>
            <Grid item xs={12} md={4} lg={3}>
                <Controller
                    name="colorway_type"
                    control={control}
                    render={({ field }) => {
                        return <FormControl
                            error={errors['colorway_type'] != undefined}
                            variant="standard"
                            fullWidth
                            size="small"
                        >
                            <InputLabel
                                id={`colorway_type-label`}
                                htmlFor={"colorway_type"}
                                sx={{
                                    fontSize: '1rem',
                                    color: '#364152',
                                    fontWeight: '500',
                                    position: 'relative'
                                }}
                                shrink
                            >
                                Colorway Type
                            </InputLabel>
                            <Autocomplete
                                disablePortal
                                sx={{
                                    '& .MuiAutocomplete-inputRoot': {
                                        minHeight: '40px'
                                    }
                                }}
                                {...field}
                                options={colorwayType ?? []}
                                renderInput={(params) => <TextField {...params}
                                    aria-describedby={`colorway_type-text`}
                                    autoComplete="colorway_type"
                                    error={errors['colorway_type'] != undefined}
                                    variant="outlined"
                                    placeholder="Please enter min 1 character"
                                    size="small" />}
                                getOptionLabel={(option) => option.colorway_type}
                                onChange={(_, data) => field.onChange(data)}
                                isOptionEqualToValue={(option, value) => option.colorway_type === value.colorway_type}
                                slotProps={{
                                    paper: {
                                        elevation: 5,
                                    }
                                }}
                                loading={fetchingColorwayType}
                                noOptionsText="No Data"
                                onInputChange={onInputChangeColorwayType}
                            />
                            <FormHelperText id="colorway_type-text">
                                {errors['colorway_type']?.message as string}
                            </FormHelperText>
                        </FormControl>
                    }}
                />
            </Grid>
            <Grid item xs={12} md={4} lg={3}>
                <Controller
                    name="colorway_status"
                    control={control}
                    render={({ field }) => {
                        return <FormControl
                            error={errors['colorway_status'] != undefined}
                            variant="standard"
                            fullWidth
                            size="small"
                        >
                            <InputLabel
                                id={`colorway_status-label`}
                                htmlFor={"colorway_status"}
                                sx={{
                                    fontSize: '1rem',
                                    color: '#364152',
                                    fontWeight: '500',
                                    position: 'relative'
                                }}
                                shrink
                            >
                                Colorway Status
                            </InputLabel>
                            <Autocomplete
                                disablePortal
                                sx={{
                                    '& .MuiAutocomplete-inputRoot': {
                                        minHeight: '40px'
                                    }
                                }}
                                {...field}
                                options={colorwayStatus ?? []}
                                renderInput={(params) => <TextField {...params}
                                    aria-describedby={`colorway_status-text`}
                                    autoComplete="colorway_status"
                                    error={errors['colorway_status'] != undefined}
                                    variant="outlined"
                                    placeholder="Please enter min 1 character"
                                    size="small" />}
                                getOptionLabel={(option) => option.colorway_status}
                                onChange={(_, data) => field.onChange(data)}
                                isOptionEqualToValue={(option, value) => option.colorway_status === value.colorway_status}
                                slotProps={{
                                    paper: {
                                        elevation: 5,
                                    }
                                }}
                                loading={fetchingColorwayStatus}
                                noOptionsText="No Data"
                                onInputChange={onInputChangeColorwayStatus}
                            />
                            <FormHelperText id="colorway_status-text">
                                {errors['colorway_status']?.message as string}
                            </FormHelperText>
                        </FormControl>
                    }}
                />
            </Grid>
            <Grid item xs={12} md={4} lg={3}>
                <Controller
                    name="colorway_state"
                    control={control}
                    render={({ field }) => {
                        return <FormControl
                            error={errors['colorway_state'] != undefined}
                            variant="standard"
                            fullWidth
                            size="small"
                        >
                            <InputLabel
                                id={`colorway_state-label`}
                                htmlFor={"colorway_state"}
                                sx={{
                                    fontSize: '1rem',
                                    color: '#364152',
                                    fontWeight: '500',
                                    position: 'relative'
                                }}
                                shrink
                            >
                                Colorway Status
                            </InputLabel>
                            <Autocomplete
                                disablePortal
                                sx={{
                                    '& .MuiAutocomplete-inputRoot': {
                                        minHeight: '40px'
                                    }
                                }}
                                {...field}
                                options={colorwayState ?? []}
                                renderInput={(params) => <TextField {...params}
                                    aria-describedby={`colorway_state-text`}
                                    autoComplete="colorway_state"
                                    error={errors['colorway_state'] != undefined}
                                    variant="outlined"
                                    placeholder="Please enter min 1 character"
                                    size="small" />}
                                getOptionLabel={(option) => option.colorway_state}
                                onChange={(_, data) => field.onChange(data)}
                                isOptionEqualToValue={(option, value) => option.colorway_state === value.colorway_state}
                                slotProps={{
                                    paper: {
                                        elevation: 5,
                                    }
                                }}
                                loading={fetchingColorwayState}
                                noOptionsText="No Data"
                                onInputChange={onInputChangeColorwayState}
                            />
                            <FormHelperText id="colorway_state-text">
                                {errors['colorway_state']?.message as string}
                            </FormHelperText>
                        </FormControl>
                    }}
                />
            </Grid>
        </>
    )
}

export default FormFilterBuilderMasterColorway