import { AxiosInstance } from "axios"
import { DefaultServiceResponse } from ".."

export type DataNotificationType = {
    id: number,
    title: string,
    description: string,
    read_status: boolean,
    user_id: number,
    user_name: string,
    user_nik: string,
    picture: string,
    created_at: string,
    updated_at: string
}

export const getNotificationsService = (axios: AxiosInstance) => async (): Promise<DataNotificationType[]> => {
    try {
      const response = await axios.get('/notifications/get')
      return response.data.result
    } catch (error: any) {
      throw new Error(error.response.data.message, {
        cause: error
      })
    }
}

export const getUnreadNotificationsService = (axios: AxiosInstance) => async (): Promise<DataNotificationType[]> => {
    try {
      const response = await axios.get('/notifications/get-unread')
      return response.data.result
    } catch (error: any) {
      throw new Error(error.response.data.message, {
        cause: error
      })
    }
}

export const readNotificationsService = (axios: AxiosInstance) => async (): Promise<DefaultServiceResponse> => {
    try {
      const response = await axios.post('/notifications/read-notification')
      return response.data.result
    } catch (error: any) {
      throw new Error(error.response.data.message, {
        cause: error
      })
    }
}

export const getAllNotificationsService = (axios: AxiosInstance) => async (isAll: boolean): Promise<DataNotificationType[]> => {
  try {
    const response = await axios.get(`/notifications/get-all/${isAll ? 1 : 0}`)
    return response.data.result
  } catch (error: any) {
    throw new Error(error.response.data.message, {
      cause: error
    })
  }
}

export type NotificationsServiceType = {
    getNotifications : () => Promise<DataNotificationType[]>,
    getUnreadNotifications: () => Promise<DataNotificationType[]>,
    readNotifications : () => Promise<DefaultServiceResponse>,
    getAllNotifications : (isAll: boolean) => Promise<DataNotificationType[]>,
}

export const NotificationsServices = (axiosInstanceWithToken: AxiosInstance): NotificationsServiceType => ({
    getNotifications : getNotificationsService(axiosInstanceWithToken),
    getUnreadNotifications: getUnreadNotificationsService(axiosInstanceWithToken),
    readNotifications : readNotificationsService(axiosInstanceWithToken),
    getAllNotifications : getAllNotificationsService(axiosInstanceWithToken),
})