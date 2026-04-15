import { AxiosInstance } from "axios"
import { DefaultServiceResponse } from "../.."
import { getDateNow } from "@/components/helper"

export type DataUserRequestType = {
  name: string,
  nik: string,
  email: string,
  role_id: string,
  picture?: File | null
}

export type DataGetUserRequestType = {
  start?: number,
  length?: number,
  start_date?: string,
  end_date?: string,
  status?: number,
  search?: string
}

export type DataUserResponseType = {
  id: number,
  name: string,
  nik: string,
  email: string,
  role_id: number,
  picture: string,
  created_at: string
  created_nik: number
  created_by: string
  updated_at: string
  updated_nik: number
  updated_by: string,
  no: number,
}

export const getUserService = (axios: AxiosInstance) => async (data: DataGetUserRequestType): Promise<DefaultServiceResponse & { data: DataUserResponseType[] }> => {
  try {
    const response = await axios.get('/master/user/show-data-user')
    const sortingResult = response.data.result.sort((a: any, b: any) => a.id < b.id ? -1 : 1)
    return sortingResult.map((res: any, index: number) => {
      return {
        ...res,
        no: index + 1,
      }
    })
  } catch (error: any) {
    throw new Error(error.response.data.message, {
      cause: error
    })
  }
}

export const createUserService = (axios: AxiosInstance) => async (data: DataUserRequestType): Promise<DefaultServiceResponse & { data: DataUserResponseType[] }> => {
  try {
    const formData = new FormData()
    formData.append('name', data.name)
    formData.append('nik', data.nik)
    // formData.append('email', data.email)
    formData.append('role_id', data.role_id)
    if (data.picture) {
      formData.append('picture', data.picture)
    }

    const response = await axios.post('/master/user/insert-data-user', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    return response.data
  } catch (error: any) {
    throw new Error(error.response.data.message, {
      cause: error
    })
  }
}

export const updateUserService = (axios: AxiosInstance) => async (id: number, data: DataUserRequestType): Promise<DefaultServiceResponse & { data: DataUserResponseType[] }> => {
  try {
    const formData = new FormData()
    formData.append('id', id.toString())
    formData.append('name', data.name)
    formData.append('nik', data.nik)
    formData.append("_method", "PUT")
    // formData.append('email', data.email)
    formData.append('role_id', data.role_id)
    if (data.picture) {
      formData.append('picture', data.picture)
    }

    const response = await axios.post(`/master/user/update-data-user/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    return response.data
  } catch (error: any) {
    throw new Error(error.response.data.message, {
      cause: error
    })
  }
}

export const deleteUserService = (axios: AxiosInstance) => async (id: number): Promise<DefaultServiceResponse & { data: DataUserResponseType[] }> => {
  try {
    const response = await axios.delete(`/master/user/delete-data-user/${id}`)
    return response.data
  } catch (error: any) {
    throw new Error(error.response.data.message, {
      cause: error
    })
  }
}

export const exportUserService = (axios: AxiosInstance) => async (data: DataGetUserRequestType): Promise<Blob> => {
  try {
    const response = await axios.post('/master/user/excel-download-data-user', {
      start_date: "2024-01-01",
      end_date: getDateNow()
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

export type UserServiceType = {
  getUser: (data: DataGetUserRequestType) => Promise<DefaultServiceResponse & { data: DataUserResponseType[] }>,
  createUser: (data: DataUserRequestType) => Promise<DefaultServiceResponse & { data: DataUserResponseType[] }>,
  updateUser: (id: number, data: DataUserRequestType) => Promise<DefaultServiceResponse & { data: DataUserResponseType[] }>,
  deleteUser: (id: number) => Promise<DefaultServiceResponse & { data: DataUserResponseType[] }>,
  exportUser: (data: DataGetUserRequestType) => Promise<Blob>,
}

export const UserServices = (axiosInstanceWithToken: AxiosInstance): UserServiceType => ({
  getUser: getUserService(axiosInstanceWithToken),
  createUser: createUserService(axiosInstanceWithToken),
  updateUser: updateUserService(axiosInstanceWithToken),
  deleteUser: deleteUserService(axiosInstanceWithToken),
  exportUser: exportUserService(axiosInstanceWithToken)
})