import { AxiosInstance } from "axios";
import { DefaultServiceResponse } from "..";

export type LogNotificationDataResponse = {
    id: number;
    title: string;
    description: string;
    read_status: boolean;
    user_id: number;
    user_name: string;
    user_nik: string;
    picture: string;
    created_at: string;
    updated_at: string;
}

export type GetLogNotificationDataResponse = {
    search: string | null,
    date_start: string | null,
    date_end: string | null,
    data: LogNotificationDataResponse[],
    draw: null,
    recordsTotal: number | null,
    recordsFiltered: number | null
}

export type GetLogNotificationDataRequest = {
    date_start?: string | null,
    date_end?: string | null,
    start: string | number,
    length: string | number,
    search: string
}

export const getLogNotificationService = (axios: AxiosInstance) => async (param: GetLogNotificationDataRequest): Promise<DefaultServiceResponse & { result: GetLogNotificationDataResponse }> => {
    try {
        const response = await axios.post('/notifications/get-filtered', param)

        return response.data
    } catch (error: any) {
        throw new Error(error.response.data.message, {
            cause: error
        })
    }
}

export const deleteLogNotificationByIdService = (axios: AxiosInstance) => async (id: number): Promise<DefaultServiceResponse> => {
    try {
        const response = await axios.delete(`/notifications/delete/${id}`)

        return response.data
    } catch (error: any) {
        throw new Error(error.response.data.message, {
            cause: error
        })
    }
}

export const deleteLogNotificationFilterService = (axios: AxiosInstance) => async (param: {
    date_start?: string | null,
    date_end?: string | null,
}): Promise<DefaultServiceResponse> => {
    try {
        const response = await axios.post(`/notifications/delete-filter`, param)

        return response.data
    } catch (error: any) {
        throw new Error(error.response.data.message, {
            cause: error
        })
    }
}

export const downloadLogNotificationFilterService = (axios: AxiosInstance) => async (param: {
    date_start?: string | null,
    date_end?: string | null,
}): Promise<Blob> => {
    try {
        const response = await axios.post(`/notifications/export/excel-filter`, param, {
            responseType: 'blob'
        })

        return response.data
    } catch (error: any) {
        throw new Error(error.response.data.message, {
            cause: error
        })
    }
}

export const downloadLogNotificationByIdService = (axios: AxiosInstance) => async (id: number): Promise<Blob> => {
    try {
        const response = await axios.get(`/notifications/export/excel/${id}`, {
            responseType: 'blob'
        })

        return response.data
    } catch (error: any) {
        throw new Error(error.response.data.message, {
            cause: error
        })
    }
}

export type LogNotificationServiceType = {
    getLogNotification: (param: GetLogNotificationDataRequest) => Promise<DefaultServiceResponse & { result: GetLogNotificationDataResponse }>,
    deleteLogNotificationById: (id: number) => Promise<DefaultServiceResponse>,
    deleteLogNotificationFilter: (data: {
        date_start?: string | null,
        date_end?: string | null
    }) => Promise<DefaultServiceResponse>,
    downloadLogNotificationFilter: (data: {
        date_start?: string | null,
        date_end?: string | null
    }) => Promise<Blob>
    downloadLogNotificationById: (id: number) => Promise<Blob>
}

export const LogNotificationServices = (axiosInstanceWithToken: AxiosInstance): LogNotificationServiceType => ({
    getLogNotification: getLogNotificationService(axiosInstanceWithToken),
    deleteLogNotificationById: deleteLogNotificationByIdService(axiosInstanceWithToken),
    deleteLogNotificationFilter: deleteLogNotificationFilterService(axiosInstanceWithToken),
    downloadLogNotificationFilter: downloadLogNotificationFilterService(axiosInstanceWithToken),
    downloadLogNotificationById: downloadLogNotificationByIdService(axiosInstanceWithToken)
})