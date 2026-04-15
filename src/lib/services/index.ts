import axios from "axios";
import { getCookie } from "cookies-next";
import { AuthServices, AuthServiceType } from "./auth";
import { LogActivityServices, LogActivityServiceType } from "./log-activity";
import { DepartementUserServices, DepartementUserServicesType } from "./master/departementUser";
import { JobPositionServices, JobPositionServicesType } from "./master/job-position";
import { LatestFeatureServices, LatestFeatureServiceType } from "./master/latestFeature";
import { MenuAccessMobileServices, MenuAccessMobileType } from "./master/menu-access-mobile";
import { MenuAccessServices, MenuAccessServiceType } from "./master/menuAccess";
import { RoleServices, RoleServiceType } from "./master/role";
import { UserServices, UserServiceType } from "./master/user";

import { StatusLapanganServices, StatusLapanganServicesType } from "./master/statusLapangan";
import { WitelServices, WitelServicesType } from "./master/witel";

import { NotificationsServices, NotificationsServiceType } from "./notifications";
import { SystemUpdateServices, SystemUpdateServiceType } from "./system-update";
import { LogNotificationServices, LogNotificationServiceType } from "./log-notification";

import { DailyManPowerServices, DailyManPowerServicesType } from "./transaction/daily-man-power";

import { ReportPT3Services, ReportPT3ServicesType } from "./report/pt3";

export type DefaultServiceResponse = {
  code: number;
  message: string;
  status: boolean;
};

type ServiceType = AuthServiceType &
  RoleServiceType &
  MenuAccessServiceType &
  UserServiceType &
  JobPositionServicesType &
  DepartementUserServicesType &

  // Master
  StatusLapanganServicesType &
  WitelServicesType &

  // Transaction
  DailyManPowerServicesType &

  // Report
  ReportPT3ServicesType &

  //Log Activity
  LogActivityServiceType &
  LogNotificationServiceType &

  //Latest Feature
  LatestFeatureServiceType &
  // system update
  SystemUpdateServiceType &
  // notification
  NotificationsServiceType &
  // master menu access mobile
  MenuAccessMobileType;

const axiosInstanceWithoutToken = axios.create({
  baseURL: process.env.NEXT_PUBLIC_TARGET_API,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstanceWithoutToken.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code == "ERR_NETWORK") {
      throw {
        response: {
          data: {
            code: 503,
            message: "No Internet Connection",
            status: false,
            result: null,
          },
        },
      };
    }
    throw error;
  },
);

const token = getCookie("intra_auth_token");

const axiosInstanceWithToken = axios.create({
  baseURL: process.env.NEXT_PUBLIC_TARGET_API,
  headers: {
    "Content-Type": "application/json",
    // Authorization: `Bearer ${token}`,
  },
});

axiosInstanceWithToken.interceptors.request.use((config) => {
  const token = getCookie("intra_auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstanceWithToken.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code == "ERR_NETWORK") {
      throw {
        response: {
          data: {
            code: 503,
            message: "No Internet Connection",
            status: false,
            result: null,
          },
        },
      };
    }
    throw error;
  },
);

const services: ServiceType = {
  ...AuthServices(axiosInstanceWithToken, axiosInstanceWithoutToken),

  //master
  ...DepartementUserServices(axiosInstanceWithToken),
  ...StatusLapanganServices(axiosInstanceWithToken),
  ...WitelServices(axiosInstanceWithToken),

  // Transaction
  ...DailyManPowerServices(axiosInstanceWithToken),

  // Report
  ...ReportPT3Services(axiosInstanceWithToken),

  //Setting
  ...RoleServices(axiosInstanceWithToken),
  ...MenuAccessServices(axiosInstanceWithToken),
  ...UserServices(axiosInstanceWithToken),
  ...JobPositionServices(axiosInstanceWithToken),
  ...LatestFeatureServices(axiosInstanceWithToken),
  ...MenuAccessMobileServices(axiosInstanceWithToken),

  // log activity
  ...LogActivityServices(axiosInstanceWithToken),
  ...LogNotificationServices(axiosInstanceWithToken),

  // system update
  ...SystemUpdateServices(axiosInstanceWithToken),

  // notifications
  ...NotificationsServices(axiosInstanceWithToken),
};

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
  getUserFilterData,
  getUserDropdownData,
  createUser,
  updateUser,
  deleteUser,
  exportUser,
  resetPassword,
  getUserDepartementDropdown,
  getUserByID,
  getUserByNik,
  getUserJobPositionsDropdown,
  getUserRoleDropdown,

  // master menu access mobile
  getMenuAccessMobile,
  createMenuAccessMobile,
  updateMenuAccessMobile,
  deleteMenuAccessMobile,
  exportExcelMenuAccessMobile,
  getMenuAccessMobileByRoleId,
  saveMenuAccessMobileByRoleId,
  exportExcelMenuAccessMobileByRole,

  // master department user
  createDepartementUser,
  deleteDepartementUser,
  exportDepartementUser,
  getDropdownDepartementUser,
  getDepartementUserDatatable,
  updateDepartementUser,
  updateStatusDepartementUser,

  // master status lapangan
  getDropdownStatusLapangan,
  getStatusLapanganDatatable,
  updateStatusStatusLapangan,
  createStatusLapangan,
  deleteStatusLapangan,
  updateStatusLapangan,
  exportStatusLapangan,

  // master witel
  getDropdownWitel,
  getWitelDatatable,
  updateStatusWitel,
  createWitel,
  deleteWitel,
  updateWitel,
  exportWitel,

  // setting latest feature
  getLatestFeature,
  getLatestFeatureDropdown,
  createLatestFeature,
  updateLatestFeature,
  deleteLatestFeature,
  exportLatestFeature,

  // master job position
  getDropdownJobPosition,
  getJobPositionDatatable,
  createJobPosition,
  deleteJobPosition,
  updateJobPosition,
  updateStatusJobPosition,
  exportJobPosition,

  // log activity
  getLogActivity,
  deleteLogActivityById,
  deleteLogActivityFilter,
  downloadLogActivityFilter,

  // system update
  getSystemUpdate,

  // notification
  getNotifications,
  getUnreadNotifications,
  readNotifications,
  getAllNotifications,
  deleteLogNotificationById,
  deleteLogNotificationFilter,
  downloadLogNotificationById,
  downloadLogNotificationFilter,
  getLogNotification,

  // Transaction
  getDropdownDailyManPower,
  getDailyManPowerDatatable,
  createDailyManPower,
  importDailyManPower,
  deleteDailyManPower,
  updateDailyManPower,
  exportDailyManPower,

  // Report PT3
  getDropdownReportPT3,
  getReportPT3Datatable,
  createReportPT3,
  importReportPT3,
  deleteReportPT3,
  updateReportPT3,
  exportReportPT3,
} = services;
