import {AxiosInstance} from 'axios'
import { DefaultServiceResponse } from '../..'

export type DataRoleRequestType = {
    id? : number,
    role : string
}

export type DataRoleResponseType = {
    id: number
    role : string
    created_at: string
    created_nik: number
    created_by: string
    updated_at: string
    updated_nik: number
    updated_by: string
}

export const getRoleService = (axios: AxiosInstance) => async (): Promise<DefaultServiceResponse & {result : DataRoleResponseType[]}> => {
    try{
        const response = await axios.get('/master/role/show-data-role')

        return response.data
    }catch(error: any){
       throw new Error(error.response.data.message,{
            cause: error
        })
    }
}

export const createRoleService = (axios: AxiosInstance) => async (data: DataRoleRequestType): Promise<DefaultServiceResponse & {result: DataRoleResponseType}> => {
    try{
        const response = await axios.post('/master/role/insert-data-role',data)

        return response.data
    }catch(error: any){
       throw new Error(error.response.data.message,{
            cause: error
        })
    }
}

export const updateRoleService = (axios: AxiosInstance) => async (data: DataRoleRequestType): Promise<DefaultServiceResponse & {result: DataRoleResponseType}> => {
    try{
        const response = await axios.put(`/master/role/update-data-role/${data.id}`,data)

        return response.data
    }catch(error: any){
       throw new Error(error.response.data.message,{
            cause: error
        })
    }
}

export const deleteRoleService = (axios: AxiosInstance) => async (id:number): Promise<DefaultServiceResponse> => {
    try{
        const response = await axios.delete(`/master/role/delete-data-role/${id}`)

        return response.data
    }catch(error: any){
       throw new Error(error.response.data.message,{
            cause: error
        })
    }
}

export const exportExcelRoleService = (axios: AxiosInstance) => async () : Promise<Blob> => {
    try{
        const response = await axios.post(`/master/role/excel-download-data-role`,{},{
            responseType: 'blob'
        })

        return response.data
    }catch(error: any){
       throw new Error(error.response.data.message,{
            cause: error
        })
    }
}

export type RoleServiceType = {
    getRole : () => Promise<DefaultServiceResponse & {result: DataRoleResponseType[]}>,
    createRole : (data: DataRoleRequestType) => Promise<DefaultServiceResponse & {result: DataRoleResponseType}>,
    updateRole : (data: DataRoleRequestType) => Promise<DefaultServiceResponse & {result: DataRoleResponseType}>
    deleteRole : (id: number) => Promise<DefaultServiceResponse>
    exportExcelRole : () => Promise<Blob>
}

export const RoleServices = (axiosInstanceWithToken: AxiosInstance) : RoleServiceType => ({
    getRole : getRoleService(axiosInstanceWithToken),
    createRole : createRoleService(axiosInstanceWithToken),
    updateRole : updateRoleService(axiosInstanceWithToken),
    deleteRole : deleteRoleService(axiosInstanceWithToken),
    exportExcelRole : exportExcelRoleService(axiosInstanceWithToken)
})