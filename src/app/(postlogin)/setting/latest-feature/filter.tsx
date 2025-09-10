import { errorHandler } from "@/lib/redux/sagas/errorHandler";
import { receiveLatestFeature } from "@/lib/redux/slices/master/latestFeature";
import { setTextNotification } from "@/lib/redux/slices/notification";
import { RootState } from "@/lib/redux/store";
import { GET_SETTING_LATEST_FEATURE } from "@/lib/redux/types";
import { getLatestFeatureDropdown } from "@/lib/services";
import { Search, Clear } from "@mui/icons-material";
import { Autocomplete, AutocompleteInputChangeReason, Box, Button, FormControl, Grid, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDebouncedCallback } from "use-debounce";

type FilterLatestFeatureType = {
    setIsFiltered: React.Dispatch<React.SetStateAction<boolean>>,
    pageProps: {
        start: number;
        length: number;
        order: string;
        search: string
    },
    setResetSearch: React.Dispatch<React.SetStateAction<boolean>>,
}

type DataDropdownLatestFeature = {
    modul?: string,
    keterangan?: string,
    date_update?: string,
}

const FilterLatestFeature = ({ setIsFiltered, pageProps, setResetSearch }: FilterLatestFeatureType) => {
    const { params } = useSelector((state: RootState) => state.latestFeature)
    const dispatch = useDispatch()

    // define columns filter
    const columns: { label: string, value: string, column_name: string }[] = [
        { label: "Modul", value: "modul", column_name: "modul" },
        { label: "Information", value: "keterangan", column_name: "keterangan" },
        { label: "Date Update", value: "date_update", column_name: "date_update" },
    ]

    const [columnFilterLoadings, setColumnFilterLoadings] = useState<{ [key: string]: boolean }>({})
    const [columnFilterValues, setColumnFilterValues] = useState<{ [key: string]: { label?: string, value?: string, value_name?: string } }>({})
    const [columnFilterOptions, setColumnFilterOptions] = useState<{ [key: string]: { label?: string, value?: string }[] }>({})

    const [dateUpdate, setDateUpdate] = useState<dayjs.Dayjs | null>(null)

    // function for click button search
    const onClickButtonSearch = () => {
        dispatch({
            type: GET_SETTING_LATEST_FEATURE,
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
        setDateUpdate(null)

        dispatch(receiveLatestFeature({
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

        setIsFiltered(false)
        setResetSearch(true)
    }

    // function for onchange input filtered
    const onFilterInputChange = useDebouncedCallback(async (valueColumn: string, columnName: string, value: string, reason: AutocompleteInputChangeReason) => {
        if (columnName != 'date_update') {
            try {
                if (reason === 'input') {
                    if (value.length >= 1) {
                        setColumnFilterLoadings({ ...columnFilterLoadings, [columnName]: true })

                        const filterParam = [...Object.keys(columnFilterValues).filter(val => columnFilterValues[val].value && val != columnName).map((val) => `${columnFilterValues[val].value_name},${columnFilterValues[val].value}`), `${valueColumn},${value}`]

                        const res = await getLatestFeatureDropdown({
                            column: valueColumn,
                            start: 0,
                            length: 10,
                            filter_param: filterParam.join('|'),
                            order_param: `${valueColumn},asc`,
                            start_date: "",
                            end_date: "",
                            search: ""
                        })

                        const data = [...new Set(res.result.data.filter((val: any) => val[columnName as keyof DataDropdownLatestFeature]).map(val => val[columnName as keyof DataDropdownLatestFeature]))]

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
                                            {column.column_name === 'date_update' ?
                                                <DatePicker
                                                    label={column.label}
                                                    slotProps={{ textField: { size: 'small', fullWidth: true }, }}
                                                    value={dateUpdate}
                                                    onChange={(newValue: dayjs.Dayjs | null) => {
                                                        setDateUpdate(newValue)
                                                        setColumnFilterValues({
                                                            ...columnFilterValues,
                                                            [column.column_name ?? '']: {
                                                                label: column.label,
                                                                value: newValue?.format('YYYY-MM-DD') ?? '',
                                                                value_name: column.value ?? ""
                                                            },
                                                        })
                                                    }}
                                                    format="DD MMM YYYY"

                                                /> :
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
                                                />}
                                        </FormControl>
                                    </Box>
                                </Grid>
                            )
                        })
                    }
                    <Grid item xs={12} md={12} lg={3} display={'flex'} alignItems={'center'}>
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

export default FilterLatestFeature