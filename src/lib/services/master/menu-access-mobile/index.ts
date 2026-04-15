import { AxiosInstance } from 'axios'
import { DefaultServiceResponse } from '../..'

export type DataMenuAccessMobileRequest = {
    id?: number,
    menu: string
}

export type DataMenuAccessMobileResponse = {
    id: number
    menu: string
    created_at: string
    created_nik: number
    created_by: string
    updated_at: string
    updated_nik: number
    updated_by: string
}

export type DataAccessMobileRequest = {
    role_id: number,
    menu: string,
    show: boolean,
    create: boolean,
    edit: boolean,
    delete: boolean,
}

export type DataAccessMobileResponse = {
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

export const getMenuAccessMobileService = (axios: AxiosInstance) => async (): Promise<DefaultServiceResponse & { result: DataMenuAccessMobileResponse[] }> => {
    try {
        const response = await axios.get('/master/menu-access-mobile/show-data')

        return response.data
    } catch (error: any) {
        throw new Error(error.response.data.message, {
            cause: error
        })
    }
}

export const createMenuAccessMobileService = (axios: AxiosInstance) => async (data: DataMenuAccessMobileRequest): Promise<DefaultServiceResponse> => {
    try {
        const response = await axios.post('/master/menu-access-mobile/insert-data', data)

        return response.data
    } catch (error: any) {
        throw new Error(error.response.data.message, {
            cause: error
        })
    }
}

export const updateMenuAccessMobileService = (axios: AxiosInstance) => async (data: DataMenuAccessMobileRequest): Promise<DefaultServiceResponse> => {
    try {
        const response = await axios.put(`/master/menu-access-mobile/update-data/${data.id}`, data)

        return response.data
    } catch (error: any) {
        throw new Error(error.response.data.message, {
            cause: error
        })
    }
}

export const deleteMenuAccessMobileService = (axios: AxiosInstance) => async (id: number): Promise<DefaultServiceResponse> => {
    try {
        const response = await axios.delete(`/master/menu-access-mobile/delete-data/${id}`)

        return response.data
    } catch (error: any) {
        throw new Error(error.response.data.message, {
            cause: error
        })
    }
}

export const exportExcelMenuAccessMobileService = (axios: AxiosInstance) => async (search: string): Promise<Blob> => {
    try {
        const response = await axios.post(`/master/menu-access-mobile/export-excel`, { search }, {
            responseType: 'blob'
        })

        return response.data
    } catch (error: any) {
        throw new Error(error.response.data.message, {
            cause: error
        })
    }
}

export const getMenuAccessMobileByRoleIdService = (axios: AxiosInstance) => async (role_id: number): Promise<DefaultServiceResponse & { result: DataAccessMobileResponse[] }> => {
    try {
        const response = await axios.get(`/master/menu-access-mobile/get-by-role-id/${role_id}`)

        return response.data
    } catch (error: any) {
        throw new Error(error.response.data.message, {
            cause: error
        })
    }
}

export const saveMenuAccessMobileByRoleIdService = (axios: AxiosInstance) => async (data: DataAccessMobileRequest[]): Promise<DefaultServiceResponse> => {
    try {
        const response = await axios.post('/master/menu-access-mobile/save-menu', { data: data })

        return response.data
    } catch (error: any) {
        throw new Error(error.response.data.message, {
            cause: error
        })
    }
}

export const exportExcelMenuAccessMobileByRoleService = (axios: AxiosInstance) => async (role_id: number): Promise<Blob> => {
    try {
        const response = await axios.post(`/master/menu-access-mobile/export-excel-by-role/${role_id}`, {}, {
            responseType: 'blob'
        })

        return response.data
    } catch (error: any) {
        throw new Error(error.response.data.message, {
            cause: error
        })
    }
}

export type MenuAccessMobileType = {
    getMenuAccessMobile: () => Promise<DefaultServiceResponse & { result: DataMenuAccessMobileResponse[] }>,
    createMenuAccessMobile: (data: DataMenuAccessMobileRequest) => Promise<DefaultServiceResponse>,
    updateMenuAccessMobile: (data: DataMenuAccessMobileRequest) => Promise<DefaultServiceResponse>,
    deleteMenuAccessMobile: (id: number) => Promise<DefaultServiceResponse>,
    exportExcelMenuAccessMobile: (search: string) => Promise<Blob>,
    getMenuAccessMobileByRoleId: (role_id: number) => Promise<DefaultServiceResponse & { result: DataAccessMobileResponse[] }>,
    saveMenuAccessMobileByRoleId: (data: DataAccessMobileRequest[]) => Promise<DefaultServiceResponse>,
    exportExcelMenuAccessMobileByRole: (role_id: number) => Promise<Blob>
}

export const MenuAccessMobileServices = (axiosInstanceWithToken: AxiosInstance): MenuAccessMobileType => ({
    getMenuAccessMobile: getMenuAccessMobileService(axiosInstanceWithToken),
    createMenuAccessMobile: createMenuAccessMobileService(axiosInstanceWithToken),
    updateMenuAccessMobile: updateMenuAccessMobileService(axiosInstanceWithToken),
    deleteMenuAccessMobile: deleteMenuAccessMobileService(axiosInstanceWithToken),
    exportExcelMenuAccessMobile: exportExcelMenuAccessMobileService(axiosInstanceWithToken),
    getMenuAccessMobileByRoleId: getMenuAccessMobileByRoleIdService(axiosInstanceWithToken),
    saveMenuAccessMobileByRoleId: saveMenuAccessMobileByRoleIdService(axiosInstanceWithToken),
    exportExcelMenuAccessMobileByRole: exportExcelMenuAccessMobileByRoleService(axiosInstanceWithToken),
})