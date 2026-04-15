'use client'

import ActionButtonResponsive from '@/components/ActionButtonResponsive'
import MainPage from '@/components/MainPage'
import { Add, IosShare, Upload } from '@mui/icons-material'
import { Box, CircularProgress } from '@mui/material'
import React, { useCallback, useRef, useState } from 'react'
import FilterColorway from './filter'
import { useDispatch, useSelector } from "react-redux"
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { ColDef, GetRowIdParams, ICellRendererParams, IRowNode } from 'ag-grid-community'
import DataGridAction from '@/components/DataGridAction'
import AGGrid, { CustomAGGridProps } from '@/components/AGGrid'
import FormColorway from './form'
import CustomSwitch from '@/components/Switch'
import { DataMasterColorway } from '@/lib/redux/slices/pcxLibrary/colorway'
import { RootState } from '@/lib/redux/store'
import FormUploadMasterColorway from './upload'
import { DELETE_COLORWAY, EXPORT_COLORWAY, GET_DATA_COLORWAY, UPDATE_COLORWAY } from '@/lib/redux/types'
import { DataFilterExportMasterColorway, DataFilterMasterColorway } from '@/lib/services/pcx-library/colorway'
import { useConfirm } from 'material-ui-confirm'
import { dateTimeFormat } from '@/components/helper'

interface IRow {
    colorway_id?: number,
    nike_colorway_id?: string,
    nike_colorway_code?: string,
    nike_colorway_name?: string,
    colorway_type?: string | null,
    colorway_status?: number,
    colorway_state?: string | null,
    action?: string,
    no?: string,
    created_at?: string,
    updated_at?: string,
    created_by?: string,
    updated_by?: string,
}

const PcxLibraryColorwayPage = () => {
    const dispatch = useDispatch()
    const { rows, fetching, recordsTotal, params, fetchingExport } = useSelector((state: RootState) => state.pcxLibraryColorway)
    const [openForm, setOpenForm] = useState<boolean>(false)
    const [openFormUpload, setOpenFormUpload] = useState<boolean>(false)
    const confirm = useConfirm()
    const [isFiltered, setIsFiltered] = useState<boolean>(false)

    const [selectedData, setSelectedData] = useState<DataMasterColorway>({})
    const [pageProps, setPageProps] = useState<{
        start: number;
        length: number;
        order: string;
        search: string
    }>({
        start: 0,
        length: 10,
        order: '',
        search: ''
    })

    // define column action
    const columns: ColDef<DataMasterColorway & { no?: string, action?: string }, any>[] = [
        {
            field: 'no',
            headerName: "No.",
            width: 70,
            sortable: false,
            pinned: 'left',
        },
        {
            field: 'colorway_id', headerName: 'Colorway ID', width: 170, initialSort: 'asc', cellRenderer: (row: ICellRendererParams<DataMasterColorway & { no?: string, action?: string }>) => {
                return row.value === null || row.value === '' || row.value === undefined ? '-' : row.value
            },
        },
        {
            field: 'nike_colorway_id', headerName: 'Nike Colorway ID', cellRenderer: (row: ICellRendererParams<DataMasterColorway & { no?: string, action?: string }>) => {
                return row.value === null || row.value === '' || row.value === undefined ? '-' : row.value
            },
        },
        {
            field: 'nike_colorway_code', headerName: 'Nike Colorway Code', cellRenderer: (row: ICellRendererParams<DataMasterColorway & { no?: string, action?: string }>) => {
                return row.value === null || row.value === '' || row.value === undefined ? '-' : row.value
            },
        },
        {
            field: 'nike_colorway_name', headerName: 'Nike Colorway Name', minWidth: 400, cellRenderer: (row: ICellRendererParams<DataMasterColorway & { no?: string, action?: string }>) => {
                return row.value === null || row.value === '' || row.value === undefined ? '-' : row.value
            },
        },
        {
            field: 'colorway_type', headerName: 'Colorway Type', cellRenderer: (row: ICellRendererParams<DataMasterColorway & { no?: string, action?: string }>) => {
                return row.value === null || row.value === '' || row.value === undefined ? '-' : row.value
            },
        },
        {
            field: 'colorway_status',
            headerName: 'Colorway Status',
            width: 120,
            cellRenderer: (row: IRowNode<DataMasterColorway & { no?: string, action?: string }>) => {
                return <CustomSwitch
                    checked={row.data!.colorway_status === "Active"}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        const rowNode = gridRef.current!.api.getRowNode(row.data?.colorway_id?.toString() ?? "0")!;
                        rowNode.updateData({ ...row.data!, colorway_status: event.target.checked ? "Active" : "Inactive" })
                        dispatch({
                            type: UPDATE_COLORWAY,
                            data: {
                                ...row.data!,
                                org_id: "82",
                                colorway_status: event.target.checked ? "Active" : "Inactive"
                            },
                            filter: params,
                            id: row.data?.colorway_id
                        })
                    }}
                />
            }
        },
        {
            field: 'colorway_state', headerName: 'Colorway State', cellRenderer: (row: ICellRendererParams<DataMasterColorway & { no?: string, action?: string }>) => {
                return row.value === null || row.value === '' || row.value === undefined ? '-' : row.value
            },
        },
        {
            field: "create_date", headerName: "Created AT", width: 170, sortable: false, cellRenderer: (row: ICellRendererParams<DataMasterColorway & { no?: string, action?: string }>) => {
                return row.value === null || row.value === '' || row.value === undefined ? '-' : dateTimeFormat(row.value)
            },
        },
        {
            field: "user_id", headerName: "Created BY", width: 150, sortable: false, cellRenderer: (row: ICellRendererParams<DataMasterColorway & { no?: string, action?: string }>) => {
                return row.value === null || row.value === '' || row.value === undefined ? '-' : row.value
            },
        },
        {
            field: "last_update_date", headerName: "Updated AT", width: 170, sortable: false, cellRenderer: (row: ICellRendererParams<DataMasterColorway & { no?: string, action?: string }>) => {
                return row.value === null || row.value === '' || row.value === undefined ? '-' : dateTimeFormat(row.value)
            },
        },
        {
            field: "last_update_by", headerName: "Updated BY", width: 150, sortable: false, cellRenderer: (row: ICellRendererParams<DataMasterColorway & { no?: string, action?: string }>) => {
                return row.value === null || row.value === '' || row.value === undefined ? '-' : row.value
            },
        },
        // Group button action
        {
            field: 'action',
            headerName: 'Action',
            pinned: 'right',
            width: 80,
            sortable: false,
            cellRenderer: (row: ICellRendererParams<DataMasterColorway & { no?: string, action?: string }>) => (
                <DataGridAction item={[
                    {
                        text: 'Edit',
                        onClick: () => {
                            setOpenForm(true)
                            setSelectedData(row.data!)
                        }
                    },
                    {
                        text: 'Delete',
                        onClick: () => {
                            confirm({ description: "Are you sure to delete this data?" })
                                .then(() => {
                                    dispatch({
                                        type: DELETE_COLORWAY,
                                        id: row.data?.colorway_id,
                                        filter: params
                                    })
                                })
                                .catch((err) => {

                                })
                        }
                    }
                ]} />
            )
        }
    ]

    const gridRef = useRef<AgGridReact>(null)

    // function for button create
    const onCreateButtonClick = () => {
        setOpenForm(true)
        setSelectedData({})
    }

    // function for get row id in aggrid
    const getRowId = useCallback((row: GetRowIdParams<IRow>): any => {
        return row.data.colorway_id ?? 0
    }, []);

    // function for button upload
    const onUploadButtonClick = () => {
        setOpenFormUpload(true)
    }

    // function for parsing get order param
    const getOrderParam = (order: string) => {
        let orderParam = ''
        if (order != '') {
            for (const splitted of order.split('|')) {
                const split = splitted.split(',')
                if (split[1] != 'null' && split[1] != 'undefined') {
                    orderParam += `${split[0]},${split[1]}`
                }
            }
        }
        return orderParam
    }

    // function for get data with serverside method
    const onServerSidePropsChange: CustomAGGridProps['onServerSidePropsChange'] = (data) => {
        setPageProps({
            start: data.start,
            length: data.length,
            order: getOrderParam(data.order),
            search: data.search
        })
        if (isFiltered) {
            const dataFilter: DataFilterMasterColorway = {
                colorway_id: "",
                org_id: "",
                nike_colorway_id: "",
                nike_colorway_code: "",
                nike_colorway_name: "",
                colorway_type: "",
                colorway_status: "",
                colorway_state: "",
                start: data.start,
                length: data.length,
                search: data.search,
                order_param: getOrderParam(data.order),
            }
            dispatch({ type: GET_DATA_COLORWAY, data: dataFilter })
        }
    }

    // function export excel
    const onExportButtonClick = () => {
        const filterExport: DataFilterExportMasterColorway = {
            colorway_id: params.colorway_id ?? '',
            colorway_state: params.colorway_state ?? '',
            colorway_status: params.colorway_status ?? '',
            colorway_type: params.colorway_type ?? '',
            nike_colorway_code: params.nike_colorway_code ?? '',
            nike_colorway_id: params.nike_colorway_id ?? '',
            nike_colorway_name: params.nike_colorway_name ?? '',
            org_id: ""
        }
        dispatch({
            type: EXPORT_COLORWAY,
            data: filterExport
        })
    }

    return (
        <MainPage
            title='Master Colorway'
        >
            <FilterColorway setIsFiltered={setIsFiltered} pageProps={pageProps} />

            <Box
                sx={{
                    backgroundColor: 'white'
                }}
                display={'flex'}
                flexDirection={'column'}
                width={'calc(100% - 40px)'}
                p={'20px'}
                borderRadius={'8px'}
                gap={'1rem'}
                flexGrow={1}
                height={'500px'}
                minHeight={'500px'}
            >
                <ActionButtonResponsive
                    items={[
                        {
                            color: 'primary',
                            variant: 'contained',
                            size: 'small',
                            onClick: onCreateButtonClick,
                            text: 'Create',
                            startIcon: <Add />
                        },
                        {
                            color: 'info',
                            variant: 'contained',
                            size: 'small',
                            onClick: onUploadButtonClick,
                            text: 'Upload',
                            startIcon: <Upload />
                        },
                        {
                            color: 'info',
                            variant: 'contained',
                            size: 'small',
                            onClick: onExportButtonClick,
                            text: 'Export',
                            disabled: fetchingExport || rows.length === 0,
                            endIcon: fetchingExport && <CircularProgress color='inherit' size={'1rem'} />,
                            startIcon: <IosShare />
                        },
                    ]}
                />
                <AGGrid
                    gridRef={gridRef}
                    rowData={rows}
                    columnDefs={columns}
                    totalData={recordsTotal}
                    getRowId={getRowId}
                    isLoading={fetching}
                    showSearchInput
                    serverSideMode
                    onServerSidePropsChange={onServerSidePropsChange}
                />
            </Box>
            <FormColorway setIsFiltered={setIsFiltered} open={openForm} setOpen={setOpenForm} data={selectedData} pageProps={pageProps} />
            <FormUploadMasterColorway setIsFiltered={setIsFiltered} pageProps={pageProps} open={openFormUpload} setOpen={setOpenFormUpload} />
        </MainPage>
    )
}

export default PcxLibraryColorwayPage