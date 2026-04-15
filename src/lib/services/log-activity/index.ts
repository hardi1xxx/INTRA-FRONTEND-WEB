import { AxiosInstance } from "axios"
import { DefaultServiceResponse } from ".."

export type LogActivityDataResponse =  {
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
    date_start: string | null,
    date_end: string | null,
    data: LogActivityDataResponse[],
    draw: null,
    recordsTotal: number | null,
    recordsFiltered: number | null
}

export type GetLogActivityDataRequest = {
    date_start?  : string | null,
    date_end?    : string | null,
    start       : string | number,
    length      : string | number
}


export const getLogActivityService = (axios: AxiosInstance) => async (param:GetLogActivityDataRequest): Promise<DefaultServiceResponse & {result : GetLogActivityDataResponse}> => {
    try{
        const response = await axios.post('/log-activity/show_log_activity_filter',param)

        return response.data
    }catch(error: any){
       throw new Error(error.response.data.message,{
            cause: error
        })
    }
}

export const deleteLogActivityByIdService = (axios: AxiosInstance) => async (id:number): Promise<DefaultServiceResponse> => {
    try{
        const response = await axios.delete(`/log-activity/delete_log_activity/${id}`)

        return response.data
    }catch(error: any){
       throw new Error(error.response.data.message,{
            cause: error
        })
    }
}

export const deleteLogActivityFilterService = (axios: AxiosInstance) => async (param: {
    start_date?  : string | null,
    end_date?    : string | null,
}): Promise<DefaultServiceResponse> => {
    try{
        const response = await axios.post(`/log-activity/delete_log_activity_filter`,param)

        return response.data
    }catch(error: any){
       throw new Error(error.response.data.message,{
            cause: error
        })
    }
}

export const downloadLogActivityFilterService = (axios: AxiosInstance) => async (param: {
    start_date?  : string | null,
    end_date?    : string | null,
}): Promise<Blob> => {
    try{
        const response = await axios.post(`/log-activity/export/excel-filter`,param,{
            responseType: 'blob'
        })

        return response.data
    }catch(error: any){
       throw new Error(error.response.data.message,{
            cause: error
        })
    }
}

export const downloadLogActivityByIdService = (axios: AxiosInstance) => async (id: number): Promise<Blob> => {
    try{
        const response = await axios.get(`/log-activity/export/excel/${id}`,{
            responseType: 'blob'
        })

        return response.data
    }catch(error: any){
       throw new Error(error.response.data.message,{
            cause: error
        })
    }
}

export type LogActivityServiceType = {
    getLogActivity : (param: GetLogActivityDataRequest) => Promise<DefaultServiceResponse & {result : GetLogActivityDataResponse}>,
    deleteLogActivityById : (id: number) => Promise<DefaultServiceResponse>,
    deleteLogActivityFilter : (data: {
        start_date?  : string | null,
        end_date?    : string | null,
    }) => Promise<DefaultServiceResponse>,
    downloadLogActivityFilter : (data: {
        start_date?  : string | null,
        end_date?    : string | null,
    }) => Promise<Blob>
    downloadLogActivityById : (id: number) => Promise<Blob>
}

export const LogActivityServices = (axiosInstanceWithToken: AxiosInstance) : LogActivityServiceType => ({
    getLogActivity : getLogActivityService(axiosInstanceWithToken),
    deleteLogActivityById : deleteLogActivityByIdService(axiosInstanceWithToken),
    deleteLogActivityFilter : deleteLogActivityFilterService(axiosInstanceWithToken),
    downloadLogActivityFilter : downloadLogActivityFilterService(axiosInstanceWithToken),
    downloadLogActivityById : downloadLogActivityByIdService(axiosInstanceWithToken)
})