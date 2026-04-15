import AGGrid from "@/components/AGGrid"
import DataGridAction from "@/components/DataGridAction"
import { Dialogs } from "@/components/dialog"
import { fileToBase64 } from "@/components/helper"
import { useAlerts } from "@/components/hooks"
import { setTextNotification } from "@/lib/redux/slices/notification"
import { receiveUploadMasterColorway } from "@/lib/redux/slices/pcxLibrary/colorway"
import { RootState } from "@/lib/redux/store"
import { DOWNLOAD_TEMPLATE_COLORWAY, INSERT_FILE_UPLOAD_COLORWAY, UPLOAD_COLORWAY } from "@/lib/redux/types"
import { Save } from "@mui/icons-material"
import { Box, Button, CircularProgress, Tab, Tabs, TextField } from "@mui/material"
import { ColDef, ICellRendererParams } from "ag-grid-community"
import { AgGridReact } from "ag-grid-react"
import { ChangeEvent, useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

type FormUploadMasterColorwayType = {
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    setIsFiltered: React.Dispatch<React.SetStateAction<boolean>>,
    pageProps: {
        start: number;
        length: number;
        order: string;
        search: string
    },
}

interface IRowUpload {
    colorway_id?: number,
    nike_colorway_id?: string,
    nike_colorway_code?: string,
    nike_colorway_name?: string,
    colorway_type?: string | null,
    colorway_status?: number,
    colorway_state?: string | null
}

const FormUploadMasterColorway = ({ open, setOpen, setIsFiltered, pageProps }: FormUploadMasterColorwayType) => {
    const alert = useAlerts()
    const [file, setFile] = useState<FileList | null>()
    const [fileError, setFileError] = useState<string>()
    const [fileValue, setFileValue] = useState<string>()
    const [selectedTab, setSelectedTab] = useState<'invalid' | 'valid'>('valid')
    const gridRef = useRef<AgGridReact>(null)
    const invalidGridRef = useRef<AgGridReact>(null)
    const dispatch = useDispatch()
    const { fetchingDownloadTemplate, fetchingUpload, fetching, uploadData: { valid, invalid }, params } = useSelector((state: RootState) => state.pcxLibraryColorway)
    const { severity } = useSelector((state: RootState) => state.notification)

    // define valid columns
    const columns: ColDef<IRowUpload, any>[] = [
        { field: 'nike_colorway_id', headerName: 'Nike Colorway ID' },
        { field: 'nike_colorway_code', headerName: 'Nike Colorway Code' },
        { field: 'nike_colorway_name', headerName: 'Nike Colorway Name', minWidth: 400 },
        { field: 'colorway_type', headerName: 'Colorway Type' },
        { field: 'colorway_status', headerName: 'Colorway Status' },
        { field: 'colorway_state', headerName: 'Colorway State' },
    ]

    // define invalid columns
    const invalidColumns: ColDef<IRowUpload & { error_message: string }, any>[] = [
        {
            field: "error_message",
            headerName: 'Action',
            cellRenderer: (row: ICellRendererParams<IRowUpload & { error_message: string }>) => (
                <DataGridAction
                    item={[
                        {
                            text: 'Show Error',
                            onClick: () => {
                                alert.show("Notification", row.data?.error_message)
                            }
                        }
                    ]}
                />
            )
        },
        { field: 'nike_colorway_id', headerName: 'Nike Colorway ID' },
        { field: 'nike_colorway_code', headerName: 'Nike Colorway Code' },
        { field: 'nike_colorway_name', headerName: 'Nike Colorway Name', minWidth: 400 },
        { field: 'colorway_type', headerName: 'Colorway Type' },
        { field: 'colorway_status', headerName: 'Colorway Status' },
        { field: 'colorway_state', headerName: 'Colorway State' },
    ]

    useEffect(() => {
        if (!open) {
            setFile(null)
            setFileValue(undefined)
            dispatch(receiveUploadMasterColorway({ valid: [], invalid: [] }))
        }
    }, [open])

    // function when onchange file
    const onFileUploadChange = (event: ChangeEvent<HTMLInputElement>) => {
        setFile(event.target.files)
        setFileValue(event.target.value)
        setFileError(undefined)
    }

    // function when click button upload
    const handleUpload = async () => {
        if ((file || []).length > 0) {
            const base64File = await fileToBase64((file || [])[0])

            dispatch({ type: UPLOAD_COLORWAY, file: base64File, fileName: fileValue })
        } else {
            setFileError('Please choose file')
        }
    }

    // function for handle download template
    const handleDownloadTemplate = () => {
        dispatch({
            type: DOWNLOAD_TEMPLATE_COLORWAY
        })
    }

    // function for submit data
    const onSubmit = () => {
        if (valid.length > 0) {
            dispatch({
                type: INSERT_FILE_UPLOAD_COLORWAY, data: valid, filter: {
                    ...params,
                    start: pageProps.start,
                    length: pageProps.length,
                    search: pageProps.search,
                    order_param: pageProps.order,
                }
            })
        } else {
            dispatch(setTextNotification({ severity: 'error', text: 'Valid data is empty' }))
        }
        setIsFiltered(true)
    }

    useEffect(() => {
        if (severity == 'success') {
            setOpen(false)
        }
    }, [severity])

    return (
        <Dialogs
            open={open}
            setOpen={setOpen}
            title="Form Upload Colorway"
        >
            <Box
                sx={{ minWidth: { sm: '100%', xs: 'auto' } }}
            >
                <Box
                    display={'flex'}
                    gap={'1rem'}
                    justifyContent={'space-between'}
                    sx={{
                        flexDirection: { sm: 'row', xs: 'column' }
                    }}
                >
                    <TextField
                        type="file"
                        onChange={onFileUploadChange}
                        size="small"
                        sx={{ flexGrow: '1' }}
                        error={typeof fileError == 'string'}
                        helperText={fileError}
                        inputProps={{
                            accept: '.xls,.xlsx'
                        }}
                    />
                    <Box
                        display={'flex'}
                        gap={'1rem'}
                        sx={{
                            justifyContent: { sm: 'space-between', xs: 'end' },
                            flexDirection: { sm: 'row', xs: 'row-reverse' }
                        }}
                    >
                        <Button type="button" size="small" color="primary" variant="contained" onClick={handleUpload} disabled={fetchingUpload} endIcon={fetchingUpload && <CircularProgress color='inherit' size={'1rem'} />}>Upload</Button>
                        <Button
                            type="button"
                            size="small"
                            color="info"
                            variant="contained"
                            onClick={handleDownloadTemplate}
                            disabled={fetchingDownloadTemplate}
                            endIcon={fetchingDownloadTemplate && <CircularProgress color='inherit' size={'1rem'} />}
                        >
                            {fetchingDownloadTemplate ? 'Loading' : 'Download Template'}
                        </Button>
                    </Box>
                </Box>
                <Box>
                    <Tabs value={selectedTab} onChange={(event, newValue) => setSelectedTab(newValue)} aria-label="basic tabs example">
                        <Tab label="Valid Data" value={'valid'} />
                        <Tab label="Invalid Data" value={'invalid'} />
                    </Tabs>
                </Box>
                <Box display={selectedTab == 'valid' ? 'block' : 'none'} height={'380px'}>
                    <AGGrid
                        gridRef={gridRef}
                        rowData={valid}
                        columnDefs={columns}
                        totalData={valid.length}
                        isLoading={false}
                    ></AGGrid>
                </Box>
                <Box display={selectedTab == 'invalid' ? 'block' : 'none'} height={'380px'}>
                    <AGGrid
                        gridRef={invalidGridRef}
                        rowData={invalid}
                        columnDefs={invalidColumns}
                        totalData={invalid.length}
                        isLoading={false}
                    ></AGGrid>
                </Box>
                <Box display={'flex'} flexDirection={'row-reverse'} justifyContent={'end'} width={'100%'} marginTop={'1rem'} gap={'1rem'}>
                    <Button color="primary" variant='contained' size="small" type="button" onClick={onSubmit} startIcon={<Save />} disabled={fetching} endIcon={fetching && <CircularProgress color='inherit' size={'1rem'} />}>
                        Submit
                    </Button>
                </Box>
            </Box>
        </Dialogs>
    )
}

export default FormUploadMasterColorway