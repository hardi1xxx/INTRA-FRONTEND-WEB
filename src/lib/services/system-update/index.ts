import { AxiosInstance } from "axios"
import { DefaultServiceResponse } from ".."

export type SystemUpdateResponseType = {
    date_update: string
    modul: string
    keterangan: string
}

export const getSystemUpdateService = (axios: AxiosInstance) => async (): Promise<DefaultServiceResponse & { result: SystemUpdateResponseType[] }> => {
    try {
        const response = await axios.get('/log/show-by-month')

        return response.data
    } catch (error: any) {
        throw new Error(error.response.data.message, {
            cause: error
        })
    }
}

export type SystemUpdateServiceType = {
    getSystemUpdate: () => Promise<DefaultServiceResponse & { result: SystemUpdateResponseType[] }>
}

export const SystemUpdateServices = (axiosInstanceWithToken: AxiosInstance): SystemUpdateServiceType => ({
    getSystemUpdate: getSystemUpdateService(axiosInstanceWithToken),
})