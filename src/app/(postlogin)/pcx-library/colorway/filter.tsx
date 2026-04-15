import { DataColorwayIDMasterColorway, DataColorwayStateMasterColorway, DataColorwayStatusMasterColorway, DataColorwayTypeMasterColorway, DataNikeColorwayCodeMasterColorway, DataNikeColorwayIDMasterColorway, DataNikeColorwayNameMasterColorway, receiveColorwayIDMasterColorway, receiveColorwayStateMasterColorway, receiveColorwayStatusMasterColorway, receiveColorwayTypeMasterColorway, receiveMasterColorway, receiveNikeColorwayCodeMasterColorway, receiveNikeColorwayIDMasterColorway, receiveNikeColorwayNameMasterColorway } from "@/lib/redux/slices/pcxLibrary/colorway"
import { RootState } from "@/lib/redux/store"
import { AutocompleteInputChangeReason, Box, Button, Grid } from "@mui/material"
import { SyntheticEvent } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import FormFilterBuilderMasterColorway from "./formFilterBuilder"
import { Clear, Search } from "@mui/icons-material"
import { DataDropdownMasterColorway, DataFilterMasterColorway } from "@/lib/services/pcx-library/colorway"
import { GET_DATA_COLORWAY, GET_DROPDOWN_DATA_COLORWAY } from "@/lib/redux/types"

type FormInputFilterColorway = {
    colorway_id: DataColorwayIDMasterColorway | null,
    nike_colorway_id: DataNikeColorwayIDMasterColorway | null,
    nike_colorway_code: DataNikeColorwayCodeMasterColorway | null,
    nike_colorway_name: DataNikeColorwayNameMasterColorway | null,
    colorway_type: DataColorwayTypeMasterColorway | null,
    colorway_state: DataColorwayStateMasterColorway | null,
    colorway_status: DataColorwayStatusMasterColorway | null
}

type FilterColorwayType = {
    pageProps: {
        start: number;
        length: number;
        order: string;
        search: string
    },
    setIsFiltered: React.Dispatch<React.SetStateAction<boolean>>
}

const FilterColorway = ({ pageProps, setIsFiltered }: FilterColorwayType) => {
    const dispatch = useDispatch()
    const {
        colorwayID,
        fetchingColorwayID,
        nikeColorwayID,
        fetchingNikeColorwayID,
        nikeColorwayCode,
        fetchingNikeColorwayCode,
        nikeColorwayName,
        fetchingNikeColorwayName,
        colorwayType,
        fetchingColorwayType,
        colorwayStatus,
        fetchingColorwayStatus,
        colorwayState,
        fetchingColorwayState,
    } = useSelector((state: RootState) => state.pcxLibraryColorway)
    const {
        control,
        formState: {
            errors,
        },
        handleSubmit,
        reset,
        getValues
    } = useForm<FormInputFilterColorway>({
        defaultValues: {
            colorway_id: null,
            nike_colorway_id: null,
            nike_colorway_code: null,
            nike_colorway_name: null,
            colorway_type: null,
            colorway_state: null,
            colorway_status: null,
        }
    })

    // function for submit filter
    const onSubmit: SubmitHandler<{
        colorway_id: DataColorwayIDMasterColorway | null | undefined,
        nike_colorway_id: DataNikeColorwayIDMasterColorway | null | undefined,
        nike_colorway_code: DataNikeColorwayCodeMasterColorway | null | undefined,
        nike_colorway_name: DataNikeColorwayNameMasterColorway | null | undefined,
        colorway_type: DataColorwayTypeMasterColorway | null | undefined,
        colorway_state: DataColorwayStateMasterColorway | null | undefined,
        colorway_status: DataColorwayStatusMasterColorway | null | undefined,
    }> = (data) => {
        const dataFilter: DataFilterMasterColorway = {
            colorway_id: data.colorway_id?.colorway_id ?? '',
            org_id: "",
            nike_colorway_id: data.nike_colorway_id?.nike_colorway_id ?? '',
            nike_colorway_code: data.nike_colorway_code?.nike_colorway_code ?? '',
            nike_colorway_name: data.nike_colorway_name?.nike_colorway_name ?? '',
            colorway_type: data.colorway_type?.colorway_type ?? '',
            colorway_status: data.colorway_status?.colorway_status ?? '',
            colorway_state: data.colorway_state?.colorway_state ?? '',
            start: pageProps.start,
            length: pageProps.length,
            search: pageProps.search,
            order_param: pageProps.order,
        }
        dispatch({
            type: GET_DATA_COLORWAY,
            data: dataFilter
        })
        setIsFiltered(true)
    }

    // function for reset filter
    const onClear = () => {
        reset()
        dispatch(receiveMasterColorway({
            data: [],
            recordsFiltered: 0,
            params: {
                colorway_id: null,
                nike_colorway_id: null,
                nike_colorway_code: null,
                nike_colorway_name: null,
                colorway_type: null,
                colorway_status: null,
                colorway_state: null
            }
        }))
        setIsFiltered(false)
    }

    // function ger colorway id
    const getColorwayID = (value: string) => {
        const nike_colorway_id = getValues('nike_colorway_id.nike_colorway_id')
        const nike_colorway_code = getValues('nike_colorway_code.nike_colorway_code')
        const nike_colorway_name = getValues('nike_colorway_name.nike_colorway_name')
        const colorway_type = getValues('colorway_type.colorway_type')
        const colorway_status = getValues('colorway_status.colorway_status')
        const colorway_state = getValues('colorway_state.colorway_state')

        const requestValue: DataDropdownMasterColorway = {
            column: "colorway_id",
            colorway_id: value ?? "",
            nike_colorway_id,
            nike_colorway_code,
            nike_colorway_name,
            colorway_type,
            colorway_status,
            colorway_state,
            org_id: "",
        }

        dispatch({
            type: GET_DROPDOWN_DATA_COLORWAY,
            data: requestValue
        })
    }

    // function get nike colorway id
    const getNikeColorwayID = (value: string) => {
        const colorway_id = getValues('colorway_id.colorway_id')
        const nike_colorway_code = getValues('nike_colorway_code.nike_colorway_code')
        const nike_colorway_name = getValues('nike_colorway_name.nike_colorway_name')
        const colorway_type = getValues('colorway_type.colorway_type')
        const colorway_status = getValues('colorway_status.colorway_status')
        const colorway_state = getValues('colorway_state.colorway_state')

        const requestValue: DataDropdownMasterColorway = {
            column: "nike_colorway_id",
            colorway_id,
            nike_colorway_id: value ?? "",
            nike_colorway_code,
            nike_colorway_name,
            colorway_type,
            colorway_status,
            colorway_state,
            org_id: "",
        }

        dispatch({
            type: GET_DROPDOWN_DATA_COLORWAY,
            data: requestValue
        })
    }

    // function get nike colorway code
    const getNikeColorwayCode = (value: string) => {
        const colorway_id = getValues('colorway_id.colorway_id')
        const nike_colorway_id = getValues('nike_colorway_id.nike_colorway_id')
        const nike_colorway_name = getValues('nike_colorway_name.nike_colorway_name')
        const colorway_type = getValues('colorway_type.colorway_type')
        const colorway_status = getValues('colorway_status.colorway_status')
        const colorway_state = getValues('colorway_state.colorway_state')

        const requestValue: DataDropdownMasterColorway = {
            column: "nike_colorway_code",
            colorway_id,
            nike_colorway_id,
            nike_colorway_code: value ?? "",
            nike_colorway_name,
            colorway_type,
            colorway_status,
            colorway_state,
            org_id: "",
        }

        dispatch({
            type: GET_DROPDOWN_DATA_COLORWAY,
            data: requestValue
        })
    }

    // function get nike colorway name
    const getNikeColorwayName = (value: string) => {
        const colorway_id = getValues('colorway_id.colorway_id')
        const nike_colorway_id = getValues('nike_colorway_id.nike_colorway_id')
        const nike_colorway_code = getValues("nike_colorway_code.nike_colorway_code")
        const colorway_type = getValues('colorway_type.colorway_type')
        const colorway_status = getValues('colorway_status.colorway_status')
        const colorway_state = getValues('colorway_state.colorway_state')

        const requestValue: DataDropdownMasterColorway = {
            column: "nike_colorway_name",
            colorway_id,
            nike_colorway_id,
            nike_colorway_code,
            nike_colorway_name: value ?? "",
            colorway_type,
            colorway_status,
            colorway_state,
            org_id: "",
        }

        dispatch({
            type: GET_DROPDOWN_DATA_COLORWAY,
            data: requestValue
        })
    }

    // function for get colorway type
    const getColorwayType = (value: string) => {
        const colorway_id = getValues('colorway_id.colorway_id')
        const nike_colorway_id = getValues('nike_colorway_id.nike_colorway_id')
        const nike_colorway_code = getValues("nike_colorway_code.nike_colorway_code")
        const nike_colorway_name = getValues("nike_colorway_name.nike_colorway_name")
        const colorway_status = getValues('colorway_status.colorway_status')
        const colorway_state = getValues('colorway_state.colorway_state')

        const requestValue: DataDropdownMasterColorway = {
            column: "colorway_type",
            colorway_id,
            nike_colorway_id,
            nike_colorway_code,
            nike_colorway_name,
            colorway_type: value ?? "",
            colorway_status,
            colorway_state,
            org_id: "",
        }

        dispatch({
            type: GET_DROPDOWN_DATA_COLORWAY,
            data: requestValue
        })
    }

    // function for get colorway status
    const getColorwayStatus = (value: string) => {
        const colorway_id = getValues('colorway_id.colorway_id')
        const nike_colorway_id = getValues('nike_colorway_id.nike_colorway_id')
        const nike_colorway_code = getValues("nike_colorway_code.nike_colorway_code")
        const nike_colorway_name = getValues("nike_colorway_name.nike_colorway_name")
        const colorway_type = getValues('colorway_type.colorway_type')
        const colorway_state = getValues('colorway_state.colorway_state')

        const requestValue: DataDropdownMasterColorway = {
            column: "colorway_status",
            colorway_id,
            nike_colorway_id,
            nike_colorway_code,
            nike_colorway_name,
            colorway_type,
            colorway_status: value ?? "",
            colorway_state,
            org_id: "",
        }

        dispatch({
            type: GET_DROPDOWN_DATA_COLORWAY,
            data: requestValue
        })
    }

    // function for get colorway state
    const getColorwayState = (value: string) => {
        const colorway_id = getValues('colorway_id.colorway_id')
        const nike_colorway_id = getValues('nike_colorway_id.nike_colorway_id')
        const nike_colorway_code = getValues("nike_colorway_code.nike_colorway_code")
        const nike_colorway_name = getValues("nike_colorway_name.nike_colorway_name")
        const colorway_type = getValues('colorway_type.colorway_type')
        const colorway_status = getValues('colorway_status.colorway_status')

        const requestValue: DataDropdownMasterColorway = {
            column: "colorway_state",
            colorway_id,
            nike_colorway_id,
            nike_colorway_code,
            nike_colorway_name,
            colorway_type,
            colorway_status,
            colorway_state: value ?? "",
            org_id: "",
        }

        dispatch({
            type: GET_DROPDOWN_DATA_COLORWAY,
            data: requestValue
        })
    }

    const onInputChangeColorwayID = (event: SyntheticEvent<Element, Event>, value: string, reason: AutocompleteInputChangeReason) => {
        if (reason === 'input') {
            if (value.length >= 1) {
                getColorwayID(value)
            } else {
                dispatch(receiveColorwayIDMasterColorway([]))
            }
        } else if (reason === 'clear') {
            dispatch(receiveColorwayIDMasterColorway([]))
        }
    }

    const onInputChangeNikeColorwayID = (event: SyntheticEvent<Element, Event>, value: string, reason: AutocompleteInputChangeReason) => {
        if (reason === 'input') {
            if (value.length >= 1) {
                getNikeColorwayID(value)
            } else {
                dispatch(receiveNikeColorwayIDMasterColorway([]))
            }
        } else if (reason === 'clear') {
            dispatch(receiveNikeColorwayIDMasterColorway([]))
        }
    }

    const onInputChangeNikeColorwayCode = (event: SyntheticEvent<Element, Event>, value: string, reason: AutocompleteInputChangeReason) => {
        if (reason === 'input') {
            if (value.length >= 1) {
                getNikeColorwayCode(value)
            } else {
                dispatch(receiveNikeColorwayCodeMasterColorway([]))
            }
        } else if (reason === 'clear') {
            dispatch(receiveNikeColorwayCodeMasterColorway([]))
        }
    }

    const onInputChangeNikeColorwayName = (event: SyntheticEvent<Element, Event>, value: string, reason: AutocompleteInputChangeReason) => {
        if (reason === 'input') {
            if (value.length >= 1) {
                getNikeColorwayName(value)
            } else {
                dispatch(receiveNikeColorwayNameMasterColorway([]))
            }
        } else if (reason === 'clear') {
            dispatch(receiveNikeColorwayNameMasterColorway([]))
        }
    }

    const onInputChangeColorwayType = (event: SyntheticEvent<Element, Event>, value: string, reason: AutocompleteInputChangeReason) => {
        if (reason === 'input') {
            if (value.length >= 1) {
                getColorwayType(value)
            } else {
                dispatch(receiveColorwayTypeMasterColorway([]))
            }
        } else if (reason === 'clear') {
            dispatch(receiveColorwayTypeMasterColorway([]))
        }
    }

    const onInputChangeColorwayStatus = (event: SyntheticEvent<Element, Event>, value: string, reason: AutocompleteInputChangeReason) => {
        if (reason === 'input') {
            if (value.length >= 1) {
                getColorwayStatus(value)
            } else {
                dispatch(receiveColorwayStatusMasterColorway([]))
            }
        } else if (reason === 'clear') {
            dispatch(receiveColorwayStatusMasterColorway([]))
        }
    }

    const onInputChangeColorwayState = (event: SyntheticEvent<Element, Event>, value: string, reason: AutocompleteInputChangeReason) => {
        if (reason === 'input') {
            if (value.length >= 1) {
                getColorwayState(value)
            } else {
                dispatch(receiveColorwayStateMasterColorway([]))
            }
        } else if (reason === 'clear') {
            dispatch(receiveColorwayStateMasterColorway([]))
        }
    }

    return (
        <Box
            sx={{
                backgroundColor: 'white',
                height: "auto"
            }}
            display={'flex'}
            flexDirection={'column'}
            width={'calc(100% - 40px)'}
            p={'20px'}
            borderRadius={'8px'}
            gap={'1rem'}
            flexGrow={1}
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <Box display={'flex'} width={'100%'} gap={'1rem'}>
                    <Grid container spacing={'1rem'}>
                        <FormFilterBuilderMasterColorway
                            control={control}
                            errors={errors}
                            colorwayID={colorwayID}
                            fetchingColorwayID={fetchingColorwayID}
                            onInputChangeColorwayID={onInputChangeColorwayID}
                            nikeColorwayID={nikeColorwayID}
                            fetchingNikeColorwayID={fetchingNikeColorwayID}
                            onInputChangeNikeColorwayID={onInputChangeNikeColorwayID}
                            nikeColorwayCode={nikeColorwayCode}
                            fetchingNikeColorwayCode={fetchingNikeColorwayCode}
                            onInputChangeNikeColorwayCode={onInputChangeNikeColorwayCode}
                            nikeColorwayName={nikeColorwayName}
                            fetchingNikeColorwayName={fetchingNikeColorwayName}
                            onInputChangeNikeColorwayName={onInputChangeNikeColorwayName}
                            colorwayType={colorwayType}
                            fetchingColorwayType={fetchingColorwayType}
                            onInputChangeColorwayType={onInputChangeColorwayType}
                            colorwayStatus={colorwayStatus}
                            fetchingColorwayStatus={fetchingColorwayStatus}
                            onInputChangeColorwayStatus={onInputChangeColorwayStatus}
                            colorwayState={colorwayState}
                            fetchingColorwayState={fetchingColorwayState}
                            onInputChangeColorwayState={onInputChangeColorwayState}
                        />
                        <Grid item xs={12} display={'flex'} alignItems={'center'} sx={{ marginTop: '15px' }}>
                            <Box display={'flex'} justifyContent={'end'} width={'100%'} gap={'1rem'}>
                                <Button
                                    color="primary"
                                    variant='contained'
                                    size="small"
                                    type="submit"
                                    startIcon={<Search />}>
                                    Search
                                </Button>
                                <Button
                                    color="info"
                                    variant='contained'
                                    size="small"
                                    onClick={onClear}
                                    startIcon={<Clear />}>
                                    Clear
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </form>
        </Box>
    )
}

export default FilterColorway