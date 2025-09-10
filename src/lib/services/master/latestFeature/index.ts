import { AxiosInstance } from "axios"
import { DefaultServiceResponse } from "../.."

export type GetLatestFeatureRequestType = {
    start_date: string
    end_date: string
    start: number
    length: number
    search: string
    filter_param: string
    order_param: string
    column: string
}

export type LatestFeatureResponseType = {
    id: number
    date_update: string
    modul: string
    keterangan: string
    created_at: string
    created_nik: number
    created_by: string
    updated_at: string
    updated_nik: number
    updated_by: string
}

export type LatestFeatureRequestType = {
    date_update: string
    modul: string
    keterangan: string
}

export type ExportLatestFeatureRequestType = {
    start_date: string
    end_date: string
    search: string
}

export const getLatestFeatureDropdownService = (axios: AxiosInstance) => async (data: GetLatestFeatureRequestType): Promise<DefaultServiceResponse & { result: { data: any[], recordsTotal: number, recordsFiltered: number } }> => {
    try {
        const response = await axios.post('/log/filter-data', {
            type: 'dropdown',
            ...data
        })

        return response.data
    } catch (error: any) {
        throw new Error(error.response.data.message, {
            cause: error
        })
    }
}

export const getLatestFeatureService = (axios: AxiosInstance) => async (data: GetLatestFeatureRequestType): Promise<DefaultServiceResponse & { result: { data: LatestFeatureResponseType[], recordsTotal: number, recordsFiltered: number } }> => {
    try {
        const response = await axios.post('/log/filter-data', {
            type: 'table',
            ...data
        })

        return response.data
    } catch (error: any) {
        throw new Error(error.response.data.message, {
            cause: error
        })
    }
}

export const createLatestFeatureService = (axios: AxiosInstance) => async (data: LatestFeatureRequestType): Promise<DefaultServiceResponse> => {
    try {
        const response = await axios.post('/log/insert', data)

        return response.data
    } catch (error: any) {
        throw new Error(error.response.data.message, {
            cause: error
        })
    }
}

export const updateLatestFeatureService = (axios: AxiosInstance) => async (id: number, data: LatestFeatureRequestType): Promise<DefaultServiceResponse> => {
    try {
        const response = await axios.put(`/log/update/${id}`, data)

        return response.data
    } catch (error: any) {
        throw new Error(error.response.data.message, {
            cause: error
        })
    }
}

export const deleteLatestFeatureService = (axios: AxiosInstance) => async (id: number): Promise<DefaultServiceResponse> => {
    try {
        const response = await axios.delete(`/log/delete/${id}`)

        return response.data
    } catch (error: any) {
        throw new Error(error.response.data.message, {
            cause: error
        })
    }
}

export const exportLatestFeatureService = (axios: AxiosInstance) => async (data: GetLatestFeatureRequestType): Promise<Blob> => {
    try {
        const response = await axios.post('/log/export-excel', {
            type: 'table',
            ...data
        }, {
            responseType: 'blob'
        })

        return response.data
    } catch (error: any) {
        throw new Error(error.response.data.message, {
            cause: error
        })
    }
}

export type LatestFeatureServiceType = {
    getLatestFeature: (data: GetLatestFeatureRequestType) => Promise<DefaultServiceResponse & { result: { data: LatestFeatureResponseType[], recordsTotal: number, recordsFiltered: number } }>,
    getLatestFeatureDropdown: (data: GetLatestFeatureRequestType) => Promise<DefaultServiceResponse & { result: { data: any[], recordsTotal: number, recordsFiltered: number } }>,
    createLatestFeature: (data: LatestFeatureRequestType) => Promise<DefaultServiceResponse>,
    updateLatestFeature: (id: number, data: LatestFeatureRequestType) => Promise<DefaultServiceResponse>,
    deleteLatestFeature: (id: number) => Promise<DefaultServiceResponse>,
    exportLatestFeature: (data: GetLatestFeatureRequestType) => Promise<Blob>
}

export const LatestFeatureServices = (axiosInstanceWithToken: AxiosInstance): LatestFeatureServiceType => ({
    getLatestFeature: getLatestFeatureService(axiosInstanceWithToken),
    getLatestFeatureDropdown: getLatestFeatureDropdownService(axiosInstanceWithToken),
    createLatestFeature: createLatestFeatureService(axiosInstanceWithToken),
    updateLatestFeature: updateLatestFeatureService(axiosInstanceWithToken),
    deleteLatestFeature: deleteLatestFeatureService(axiosInstanceWithToken),
    exportLatestFeature: exportLatestFeatureService(axiosInstanceWithToken)
})