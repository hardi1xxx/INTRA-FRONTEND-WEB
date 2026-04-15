import { AxiosInstance } from "axios"
import { DefaultServiceResponse } from ".."

export type LogActivityDataResponse = {
    id: number,
    action: string,
    modul: string,
    submodul: string | null,
    user: string,
    description: string,
    created_at: string,
    updated_at: string | null
}

export type GetLogActivityDataResponse = {
    search: string | null,
    start_date: string | null,
    end_date: string | null,
    data: LogActivityDataResponse[],
    draw: null,
    recordsTotal: number | null,
    recordsFiltered: number | null
}

export type GetLogActivityDataRequest = {
    start_date?: string | null,
    end_date?: string | null,
    start: string | number,
    length: string | number
}


export const getLogActivityService = (axios: AxiosInstance) => async (param: GetLogActivityDataRequest): Promise<DefaultServiceResponse & { result: GetLogActivityDataResponse }> => {
    try {
        const response = await axios.post('/log-activity/show', param)

        return response.data
    } catch (error: any) {
        throw new Error(error.response.data.message, {
            cause: error
        })
    }
}

export const deleteLogActivityByIdService = (axios: AxiosInstance) => async (id: number): Promise<DefaultServiceResponse> => {
    try {
        const response = await axios.delete(`/log-activity/delete/${id}`)

        return response.data
    } catch (error: any) {
        throw new Error(error.response.data.message, {
            cause: error
        })
    }
}

export const deleteLogActivityFilterService = (axios: AxiosInstance) => async (param: {
    start_date?: string | null,
    end_date?: string | null,
}): Promise<DefaultServiceResponse> => {
    try {
        const response = await axios.post(`/log-activity/delete-all`, param)

        return response.data
    } catch (error: any) {
        throw new Error(error.response.data.message, {
            cause: error
        })
    }
}

export const downloadLogActivityFilterService = (axios: AxiosInstance) => async (param: {
    start_date?: string | null,
    end_date?: string | null,
    search: string | null,
    order: string | null
}): Promise<Blob> => {
    try {
        const response = await axios.post(`/log-activity/export-excel`, param, {
            responseType: 'blob'
        })

        return response.data
    } catch (error: any) {
        throw new Error(error.response.data.message, {
            cause: error
        })
    }
}

export type LogActivityServiceType = {
    getLogActivity: (param: GetLogActivityDataRequest) => Promise<DefaultServiceResponse & { result: GetLogActivityDataResponse }>,
    deleteLogActivityById: (id: number) => Promise<DefaultServiceResponse>,
    deleteLogActivityFilter: (data: {
        start_date?: string | null,
        end_date?: string | null,
    }) => Promise<DefaultServiceResponse>,
    downloadLogActivityFilter: (data: {
        start_date?: string | null,
        end_date?: string | null,
        search: string | null,
        order: string | null
    }) => Promise<Blob>
}

export const LogActivityServices = (axiosInstanceWithToken: AxiosInstance): LogActivityServiceType => ({
    getLogActivity: getLogActivityService(axiosInstanceWithToken),
    deleteLogActivityById: deleteLogActivityByIdService(axiosInstanceWithToken),
    deleteLogActivityFilter: deleteLogActivityFilterService(axiosInstanceWithToken),
    downloadLogActivityFilter: downloadLogActivityFilterService(axiosInstanceWithToken),
})