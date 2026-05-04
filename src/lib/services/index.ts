import axios from "axios";
import { getCookie } from "cookies-next";
import { AuthServices, AuthServiceType } from "./auth";
import { LogActivityServices, LogActivityServiceType } from "./log-activity";

import { StatusProjectServices, StatusProjectServicesType } from "./master/statusProject";
import { CategoryProjectServices, CategoryProjectServicesType } from "./master/categoryProject";
import { BatchServices, BatchServicesType } from "./master/batch";
import { MitraServices, MitraServicesType } from "./master/mitra";
import { RegionalServices, RegionalServicesType } from "./master/regional";
import { AreaServices, AreaServicesType } from "./master/area";
import { BranchServices, BranchServicesType } from "./master/branch";
import { STOServices, STOServicesType } from "./master/sto";

import { NotificationsServices, NotificationsServiceType } from "./notifications";
import { SystemUpdateServices, SystemUpdateServiceType } from "./system-update";
import { LogNotificationServices, LogNotificationServiceType } from "./log-notification";

export type DefaultServiceResponse = {
  code: number;
  message: string;
  status: boolean;
};

type ServiceType = AuthServiceType &

  // Master
  StatusProjectServicesType &
  CategoryProjectServicesType &
  BatchServicesType &
  MitraServicesType &
  RegionalServicesType &
  AreaServicesType &
  BranchServicesType &
  STOServicesType &

  //Log Activity
  LogActivityServiceType &
  LogNotificationServiceType &
  // system update
  SystemUpdateServiceType &
  // notification
  NotificationsServiceType

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
  ...StatusProjectServices(axiosInstanceWithToken),
  ...CategoryProjectServices(axiosInstanceWithToken),
  ...MitraServices(axiosInstanceWithToken),
  ...BatchServices(axiosInstanceWithToken),
  ...RegionalServices(axiosInstanceWithToken),
  ...AreaServices(axiosInstanceWithToken),
  ...BranchServices(axiosInstanceWithToken),
  ...STOServices(axiosInstanceWithToken),

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
  
  //master

  //Status Project
  getDropdownStatusProject,
  getStatusProjectDatatable,
  createStatusProject,
  deleteStatusProject,
  updateStatusProject,
  updateStatusStatusProject,
  exportStatusProject,

  //Category Project
  getDropdownCategoryProject,
  getCategoryProjectDatatable,
  createCategoryProject,
  deleteCategoryProject,
  updateCategoryProject,
  updateStatusCategoryProject,
  exportCategoryProject,

  //Mitra
  getDropdownMitra,
  getMitraDatatable,
  createMitra,
  deleteMitra,
  updateMitra,
  updateStatusMitra,
  exportMitra,

  //Batch
  getDropdownBatch,
  getBatchDatatable,
  createBatch,
  deleteBatch,
  updateBatch,
  updateStatusBatch,
  exportBatch,

  //Regional
  getDropdownRegional,
  getRegionalDatatable,
  createRegional,
  deleteRegional,
  updateRegional,
  updateStatusRegional,
  exportRegional,

  //Area
  getDropdownArea,
  getAreaDatatable,
  createArea,
  deleteArea,
  updateArea,
  updateStatusArea,
  exportArea,

  //Branch
  getDropdownBranch,
  getBranchDatatable,
  createBranch,
  deleteBranch,
  updateBranch,
  updateStatusBranch,
  exportBranch,

  //STO
  getDropdownSTO,
  getSTODatatable,
  createSTO,
  deleteSTO,
  updateSTO,
  updateStatusSTO,
  exportSTO,

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
} = services;
