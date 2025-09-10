import { errorHandler } from "@/lib/redux/sagas/errorHandler"
import { DataDropdownUser, receiveUser } from "@/lib/redux/slices/master/user"
import { setTextNotification } from "@/lib/redux/slices/notification"
import { RootState } from "@/lib/redux/store"
import { GET_MASTER_USER } from "@/lib/redux/types"
import { getUserDropdownData } from "@/lib/services"
import { Clear, Search } from "@mui/icons-material"
import { Autocomplete, AutocompleteInputChangeReason, Box, Button, FormControl, Grid, MenuItem, TextField } from "@mui/material"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useDebouncedCallback } from "use-debounce"

type FilterUserType = {
    setIsFiltered: React.Dispatch<React.SetStateAction<boolean>>,
    pageProps: {
        start: number;
        length: number;
        order: string;
        search: string
    },
    setResetSearch: React.Dispatch<React.SetStateAction<boolean>>,
}

const FilterUser = ({ setIsFiltered, pageProps, setResetSearch }: FilterUserType) => {
    const { params } = useSelector((state: RootState) => state.user)
    const dispatch = useDispatch()

    // define columns filter
    const columns: { label: string, value: string, column_name: string }[] = [
        { label: "NIK", value: "users.nik", column_name: 'nik' },
        { label: "Name", value: "users.name", column_name: 'name' },
        { label: "Role", value: "m_role.role", column_name: 'role' },
        { label: "Email", value: "users.email", column_name: 'email' },
        { label: "Phone Number", value: "users.phone_number", column_name: 'phone_number' },
        { label: "Job Position", value: "m_job_position.job_position", column_name: 'job_position' },
        { label: "Departement User", value: "m_departement_user.departement", column_name: 'departement' }
    ]

    const [columnFilterLoadings, setColumnFilterLoadings] = useState<{ [key: string]: boolean }>({})
    const [columnFilterValues, setColumnFilterValues] = useState<{ [key: string]: { label?: string, value?: string, value_name?: string } }>({})
    const [columnFilterOptions, setColumnFilterOptions] = useState<{ [key: string]: { label?: string, value?: string }[] }>({})
    const [filterIsWeb, setFilterIsWeb] = useState<string>('99')
    const [filterIsApp, setFilterIsApp] = useState<string>('99')

    // function click button search
    const onClickButtonSearch = () => {
        dispatch({
            type: GET_MASTER_USER,
            params: {
                ...params,
                filter_param: Object.keys(columnFilterValues).filter(val => columnFilterValues[val].value).map((val) => `${columnFilterValues[val].value_name},${columnFilterValues[val].value}`).join('|'),
                start: pageProps.start,
                length: pageProps.length,
                search: pageProps.search,
                order_param: pageProps.order,
            }
        })
        setIsFiltered(true)
    }

    // filter reset data
    const onReset = () => {
        setColumnFilterValues({})
        setColumnFilterOptions({})
        setColumnFilterLoadings({})
        dispatch(receiveUser({
            data: [],
            recordsFiltered: 0,
            params: {
                type: "table",
                column: "",
                filter_param: "",
                order_param: "",
                start: 0,
                length: 10,
                search: "",
            }
        }))
        setFilterIsWeb('99')
        setFilterIsApp('99')
        setIsFiltered(false)
        setResetSearch(true)
    }

    // function for onchange input filtered
    const onFilterInputChange = useDebouncedCallback(async (valueColumn: string, columnName: string, value: string, reason: AutocompleteInputChangeReason) => {
        try {
            if (reason === 'input') {
                if (value.length >= 1) {
                    setColumnFilterLoadings({ ...columnFilterLoadings, [columnName]: true })
                    const filterParam = [...Object.keys(columnFilterValues).filter(val => columnFilterValues[val].value && val != columnName).map((val) => `${columnFilterValues[val].value_name},${columnFilterValues[val].value}`), `${valueColumn},${value}`]
                    const res = await getUserDropdownData({
                        type: 'dropdown',
                        column: valueColumn,
                        start: 0,
                        length: 10,
                        filter_param: filterParam.join('|'),
                        order_param: `${valueColumn},asc`
                    })
                    const data = [...new Set(res.result.data.filter((val: any) => val[columnName as keyof DataDropdownUser]).map(val => val[columnName as keyof DataDropdownUser]))]

                    setColumnFilterOptions({ ...columnFilterOptions, [columnName]: (data).map(val => ({ label: val.toString(), value: val.toString() })) })
                    setColumnFilterLoadings({ ...columnFilterLoadings, [columnName]: false })

                    if (data.filter((item: string) => RegExp(value.toLowerCase()).exec(item.toLowerCase())).length == 0) {
                        dispatch(setTextNotification({ text: "Data not available.", severity: "error" }))
                    }
                } else {
                    setColumnFilterOptions({ ...columnFilterOptions, [columnName]: [] })
                }
            } else if (reason === 'clear' || reason === 'reset') {
                setColumnFilterOptions({ ...columnFilterOptions, [columnName]: [] })
            }
        } catch (error) {
            const { message, statusCode } = errorHandler(error)
            dispatch(setTextNotification({ text: message, severity: "error", responseCode: statusCode }))
            setColumnFilterLoadings({ ...columnFilterLoadings, [columnName]: false })
            setColumnFilterOptions({ ...columnFilterOptions, [columnName]: [] })
        }
    }, 500)

    return (
        <Box
            sx={{
                backgroundColor: "white",
                height: "auto",
            }}
            display={"flex"}
            flexDirection={"column"}
            // width={"calc(100% - 40px)"}
            paddingX={"10px"}
            paddingY={"10px"}
            borderRadius={"8px"}
            gap={"1rem"}
        >
            <Box display={"flex"} flexDirection={"column"} width={"100%"} gap={"1rem"}>
                <Grid container columnSpacing={"0.5rem"} rowSpacing={"0.7rem"}>
                    {
                        columns.map(column => {
                            return (
                                <Grid item xs={12} md={4} lg={3} key={`container-${column.column_name}`}>
                                    <Box marginY={0}>
                                        <FormControl
                                            key={`autocomplete-${column.column_name}`}
                                            variant="standard"
                                            fullWidth
                                            size="small"
                                        >
                                            <Autocomplete
                                                disablePortal
                                                sx={{
                                                    "& .MuiAutocomplete-inputRoot": {
                                                        minHeight: "40px",
                                                    },
                                                }}
                                                value={columnFilterValues[column.column_name ?? ''] ?? null}
                                                options={columnFilterOptions[column.column_name ?? ''] ?? []}
                                                renderInput={(params) =>
                                                    <TextField
                                                        {...params}
                                                        aria-describedby={`${column.column_name}-text`}
                                                        autoComplete={column.column_name}
                                                        variant="outlined"
                                                        placeholder="Please enter min 1 character"
                                                        size="small"
                                                        label={column.label}
                                                    />
                                                }
                                                getOptionLabel={(option) => option.label ?? ''}
                                                onChange={(event, data) => {
                                                    setColumnFilterValues({
                                                        ...columnFilterValues,
                                                        [column.column_name ?? '']: {
                                                            ...data,
                                                            value_name: column.value ?? ""
                                                        },
                                                    })
                                                }}
                                                isOptionEqualToValue={(option, value) => option.value === value.value}
                                                slotProps={{
                                                    paper: {
                                                        elevation: 5,
                                                    }
                                                }}
                                                fullWidth
                                                loading={columnFilterLoadings[column.column_name ?? '']}
                                                onInputChange={(event, value, reason) => onFilterInputChange(column.value ?? '', column.column_name ?? '', value, reason)}
                                                noOptionsText="No Data"
                                            />
                                        </FormControl>
                                    </Box>
                                </Grid>
                            )
                        })
                    }
                    <Grid item xs={12} md={4} lg={3}>
                        <Box marginY={0}>
                            <FormControl
                                key={`select-is_web`}
                                variant="standard"
                                fullWidth
                                size="small"
                            >
                                <TextField
                                    id="is_web"
                                    value={filterIsWeb}
                                    label="Is Web"
                                    variant="outlined"
                                    size="small"
                                    select
                                    onChange={(event) => {
                                        setColumnFilterValues({
                                            ...columnFilterValues,
                                            is_web: {
                                                label: "Is Web",
                                                value: event.target.value == '99' ? '' : event.target.value,
                                                value_name: "users.is_web",
                                            }
                                        })
                                        setFilterIsWeb(event.target.value)
                                    }}
                                >
                                    <MenuItem value="99">All</MenuItem>
                                    <MenuItem value="1">Active</MenuItem>
                                    <MenuItem value="0">Inactive</MenuItem>
                                </TextField>
                            </FormControl>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={4} lg={3}>
                        <Box marginY={0}>
                            <FormControl
                                key={`select-is_app`}
                                variant="standard"
                                fullWidth
                                size="small"
                            >
                                <TextField
                                    id="is_app"
                                    value={filterIsApp}
                                    label="Is App"
                                    variant="outlined"
                                    size="small"
                                    select
                                    onChange={(event) => {
                                        setColumnFilterValues({
                                            ...columnFilterValues,
                                            is_app: {
                                                label: "Is App",
                                                value: event.target.value == '99' ? '' : event.target.value,
                                                value_name: "users.is_app",
                                            }
                                        })
                                        setFilterIsApp(event.target.value)
                                    }}
                                >
                                    <MenuItem value="99">All</MenuItem>
                                    <MenuItem value="1">Active</MenuItem>
                                    <MenuItem value="0">Inactive</MenuItem>
                                </TextField>
                            </FormControl>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={12} lg={9} display={'flex'} alignItems={'center'}>
                        <Box display={'flex'} justifyContent={'end'} width={'100%'} gap={'1rem'}>
                            <Button
                                color="info"
                                variant='contained'
                                size="small"
                                onClick={onReset}
                                startIcon={<Clear />}>
                                Clear
                            </Button>
                            <Button
                                color="primary"
                                variant='contained'
                                size="small"
                                onClick={onClickButtonSearch}
                                startIcon={<Search />}>
                                Search
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    )
}

export default FilterUser