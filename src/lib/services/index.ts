import axios from "axios";
import { getCookie } from "cookies-next";
import { AuthServices, AuthServiceType } from "./auth";
import { RoleServices, RoleServiceType } from "./master/role";
import { MenuAccessServices, MenuAccessServiceType } from "./master/menuAccess";
import { UserServices, UserServiceType } from "./master/user";
import { LogActivityServices, LogActivityServiceType } from "./log-activity";
import { LatestFeatureServices, LatestFeatureServiceType } from "./master/latestFeature";
import { SystemUpdateServices, SystemUpdateServiceType } from "./system-update";
import { NotificationsServiceType, NotificationsServices } from "./notifications";
import { ColorwayServices, ColorwayServiceType } from "./pcx-library/colorway";

export type DefaultServiceResponse = {
    code: number,
    message: string,
    status: boolean,
}

type ServiceType =
    AuthServiceType &
    RoleServiceType &
    MenuAccessServiceType &
    UserServiceType &
    LatestFeatureServiceType &

    // dashboard

    //Log Activity
    LogActivityServiceType &

    // system update
    SystemUpdateServiceType &

    // notification
    NotificationsServiceType &

    // pcx library
    ColorwayServiceType


const axiosInstanceWithoutToken = axios.create({
    baseURL: process.env.NEXT_PUBLIC_TARGET_API,
    headers: {
        "Content-Type": "application/json",
    }
})

axiosInstanceWithoutToken.interceptors.response.use((response) => response, (error) => {
    if (error.code == "ERR_NETWORK") {
        throw {
            response: {
                data: {
                    code: 503,
                    message: 'No Internet Connection',
                    status: false,
                    result: null
                }
            }
        }
    }
    throw error;
});

const token = getCookie('intra_auth_token')

const axiosInstanceWithToken = axios.create({
    baseURL: process.env.NEXT_PUBLIC_TARGET_API,
    headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}`
    }
})

axiosInstanceWithToken.interceptors.response.use((response) => response, (error) => {
    if (error.code == "ERR_NETWORK") {
        throw {
            response: {
                data: {
                    code: 503,
                    message: 'No Internet Connection',
                    status: false,
                    result: null
                }
            }
        }
    }
    throw error;
});

const services: ServiceType = {
    ...AuthServices(axiosInstanceWithToken, axiosInstanceWithoutToken),

    //master
    ...RoleServices(axiosInstanceWithToken),
    ...MenuAccessServices(axiosInstanceWithToken),
    ...UserServices(axiosInstanceWithToken),
    ...LatestFeatureServices(axiosInstanceWithToken),

    // log activity
    ...LogActivityServices(axiosInstanceWithToken),

    // system update
    ...SystemUpdateServices(axiosInstanceWithToken),

    // notifications
    ...NotificationsServices(axiosInstanceWithToken),

    // pcx library
    ...ColorwayServices(axiosInstanceWithToken),
}

export const {
    login,
    logout,
    changePassword,
    changeProfilePicture,
    getMenuAccess,

    // master role
    getRole,
    createRole,
    updateRole,
    deleteRole,
    exportExcelRole,

    getMenuAccessByRoleId,
    saveMenuAccess,
    exportExcelMenuAccess,

    // master user
    getUser,
    createUser,
    updateUser,
    deleteUser,
    exportUser,

    // setting latest feature
    getLatestFeature,
    createLatestFeature,
    updateLatestFeature,
    deleteLatestFeature,
    exportLatestFeature,

    // log activity
    getLogActivity,
    deleteLogActivityById,
    deleteLogActivityFilter,
    downloadLogActivityById,
    downloadLogActivityFilter,

    // system update
    getSystemUpdate,

    // notification
    getNotifications,
    getUnreadNotifications,
    readNotifications,
    getAllNotifications,

    // pcx library color way
    getDataDropdownColorway,
    getColorway,
    exportExcelColorway,
    createColorway,
    updateColorway,
    deleteColorway,
    downloadTemplateColorway,
    uploadColorway,
    inserFileColorway,


    //Master Data
} = services
