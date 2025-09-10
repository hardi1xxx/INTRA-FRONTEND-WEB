import { AxiosInstance } from 'axios'
import { DefaultServiceResponse } from '../..'

export type DataMenuAccessRequestType = {
    role_id: number,
    menu: string,
    show: boolean,
    create: boolean,
    edit: boolean,
    delete: boolean,
}

export type DataMenuAccessResponseType = {
    id: number,
    role_id: number,
    menu: string,
    show: boolean,
    create: boolean,
    edit: boolean,
    delete: boolean,
    created_at: string,
    created_nik: number,
    created_by: string,
    updated_at: string,
    updated_nik: number,
    updated_by: string,
}

export const getMenuAccessByRoleIdService = (axios: AxiosInstance) => async (role_id: number): Promise<DefaultServiceResponse & { result: DataMenuAccessResponseType[] }> => {
    try {
        const response = await axios.get(`/master/menu-access/get-by-role-id/${role_id}`)

        return response.data
    } catch (error: any) {
        throw new Error(error.response.data.message, {
            cause: error
        })
    }
}

export const saveMenuAccessService = (axios: AxiosInstance) => async (data: DataMenuAccessRequestType[]): Promise<DefaultServiceResponse & { result: DataMenuAccessResponseType }> => {
    try {
        const response = await axios.post('/master/menu-access/save', { data: data })

        return response.data
    } catch (error: any) {
        throw new Error(error.response.data.message, {
            cause: error
        })
    }
}

export const exportExcelMenuAccessService = (axios: AxiosInstance) => async (role_id: number): Promise<Blob> => {
    try {
        const response = await axios.post(`/master/menu-access/excel-download-data-menu-access/${role_id}`, {}, {
            responseType: 'blob'
        })

        return response.data
    } catch (error: any) {
        console.log('ERR',error)
        throw new Error(error.response.data.message, {
            cause: error
        })
    }
}

export type MenuAccessServiceType = {
    getMenuAccessByRoleId: (role_id: number) => Promise<DefaultServiceResponse & { result: DataMenuAccessResponseType[] }>,
    saveMenuAccess: (data: DataMenuAccessRequestType[]) => Promise<DefaultServiceResponse & { result: DataMenuAccessResponseType }>,
    exportExcelMenuAccess: (role_id: number) => Promise<Blob>
}

export const MenuAccessServices = (axiosInstanceWithToken: AxiosInstance): MenuAccessServiceType => ({
    getMenuAccessByRoleId: getMenuAccessByRoleIdService(axiosInstanceWithToken),
    saveMenuAccess: saveMenuAccessService(axiosInstanceWithToken),
    exportExcelMenuAccess: exportExcelMenuAccessService(axiosInstanceWithToken),
})