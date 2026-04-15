import axios, {AxiosInstance} from 'axios'
import { DefaultServiceResponse } from '..'

export type LoginServiceRequest = {
    nik: string,
    password: string
}

export type MenuAccessResponse = {
    menu: string,
    show: boolean,
    create: boolean,
    edit: boolean,
    delete: boolean
}[]

export type LoginServiceResponse = DefaultServiceResponse & {
    data : {
        access_token: string,
        expires_in: number,
        user : {
            name: string,
            nik: string,
            // picture: string,
        }
        role: string,
        menu_access: MenuAccessResponse,
    }
}

export type ChangePasswordServiceRequest = {
    current_password: string,
    password: string,
    password_confirmation: string
}

export const loginService = (axios: AxiosInstance) => async (param: LoginServiceRequest): Promise<LoginServiceResponse> => {
    try{
        const response = await axios.post<LoginServiceResponse>('/auth/login',param)

        return response.data
    }catch(error: any){
        throw new Error(error.response.data.message,{
            cause: error
        })
    }
}

export const logoutService = (axios: AxiosInstance) => async (): Promise<DefaultServiceResponse> => {
    try{
        const response = await axios.post<DefaultServiceResponse>('/auth/logout')

        return response.data
    }catch(error: any){
        throw new Error(error.response.data.message,{
            cause: error
        })
    }
}

export const changePasswordService = (axios: AxiosInstance) => async (param: ChangePasswordServiceRequest): Promise<DefaultServiceResponse> => {
    try{
        const response = await axios.post<DefaultServiceResponse>('/auth/change-password',param)

        return response.data
    }catch(error: any){
        throw new Error(error.response.data.message,{
            cause: error
        })
    }
}

export const changeProfilePictureService = (axios: AxiosInstance) => async (picture: File): Promise<DefaultServiceResponse & {result: string}> => {
    try{
        var bodyFormData = new FormData();
        bodyFormData.append('picture', picture);
        const response = await axios.post<DefaultServiceResponse & {result: string}>('/auth/change-profile-picture',bodyFormData,{
            headers: { "Content-Type": "multipart/form-data" }
        })

        return response.data
    }catch(error: any){
        throw new Error(error.response.data.message,{
            cause: error
        })
    }
}

export const getMenuAccessService = (axios: AxiosInstance) => async (): Promise<DefaultServiceResponse & {result: MenuAccessResponse }> => {
    try{
        const response = await axios.get<DefaultServiceResponse & {result: MenuAccessResponse }>('/auth/menu-access')

        return response.data
    }catch(error: any){
        throw new Error(error.response.data.message,{
            cause: error
        })
    }
}

export type AuthServiceType = {
    login    : (param: LoginServiceRequest) => Promise<LoginServiceResponse>,
    logout : () => Promise<DefaultServiceResponse>,
    changePassword: (param: ChangePasswordServiceRequest) => Promise<DefaultServiceResponse>,
    changeProfilePicture: (picture: File) => Promise<DefaultServiceResponse & {result: string}>,
    getMenuAccess: () => Promise<DefaultServiceResponse & {result: MenuAccessResponse }>,
}

export const AuthServices = (axiosInstanceWithToken: AxiosInstance,axiosInstanceWithoutToken: AxiosInstance) : AuthServiceType => ({
    login    : loginService(axiosInstanceWithoutToken),
    logout : logoutService(axiosInstanceWithToken),
    changePassword: changePasswordService(axiosInstanceWithToken),
    changeProfilePicture: changeProfilePictureService(axiosInstanceWithToken),
    getMenuAccess: getMenuAccessService(axiosInstanceWithToken)
})