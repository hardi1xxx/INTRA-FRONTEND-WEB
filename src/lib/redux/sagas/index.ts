import { all } from "redux-saga/effects";
import { watchChangePasswordAsync } from "./auth/changePassword";
import { watchLoginAsync } from "./auth/login";
import { watchLogoutAsync } from "./auth/logout";
import { watchCreateRoleAsync } from "./master/role/create";
import { watchDeleteRoleAsync } from "./master/role/delete";
import { watchExportRoleAsync } from "./master/role/exportExcel";
import { watchGetRoleAsync } from "./master/role/get";
import { watchUpdateRoleAsync } from "./master/role/update";

//menu access
import { watchGetMenuAccessByRoleAsync } from "./master/menuAccess/getByRole";
import { watchSaveMenuAccessAsync } from "./master/menuAccess/save";

// menu access mobile
import { watchCreateMenuAccessMobileAsync } from "./master/menuAccessMobile/create";
import { watchDeleteMenuAccessMobileAsync } from "./master/menuAccessMobile/delete";
import { watchExportExcelMenuAccessMobileByRoleAsync } from "./master/menuAccessMobile/exportByRole";
import { watchExportMenuAccessMobileAsync } from "./master/menuAccessMobile/exportExcel";
import { watchGetMenuAccessMobileAsync } from "./master/menuAccessMobile/get";
import { watchGetMenuAccessMobileByRoleAsync } from "./master/menuAccessMobile/getByRole";
import { watchSaveMenuAccessMobileByRoleAsync } from "./master/menuAccessMobile/saveByRole";
import { watchUpdateMenuAccessMobileAsync } from "./master/menuAccessMobile/update";

//master shift
import { watchExportShiftAsync } from "./master/shift/export";
import { watchGetShiftAsync } from "./master/shift/get";
import { watchUpdateShiftAsync } from "./master/shift/upsert";

//master status lapangan
import { watchExportStatusLapanganAsync } from "./master/statusLapangan/export";
import { watchGetStatusLapanganAsync } from "./master/statusLapangan/get";
import { watchUpdateStatusLapanganAsync } from "./master/statusLapangan/upsert";

//master witel
import { watchExportWitelAsync } from "./master/witel/export";
import { watchGetWitelAsync } from "./master/witel/get";
import { watchUpdateWitelAsync } from "./master/witel/upsert";

//master user
import { watchChangeProfilePictureAsync } from "./auth/changeProfilePicture";
import { watchCreateUserAsync } from "./master/user/create";
import { watchDeleteUserAsync } from "./master/user/delete";
import { watchExportUserAsync } from "./master/user/export";
import { watchGetUserAsync } from "./master/user/get";
import { watchGetDetailUserAsync } from "./master/user/getDetail";
import { watchUpdateUserAsync } from "./master/user/update";

//master job position
import { watchExportJobPositionAsync } from "./master/job-position/export";
import { watchGetJobPositionAsync } from "./master/job-position/get";
import { watchUpdateJobPositionAsync } from "./master/job-position/upsert";

//log activity
import { watchDeleteLogActivityByIdAsync } from "./log/logActivity/deleteById";
import { watchDeleteLogActivityFilterAsync } from "./log/logActivity/deleteFilter";
import { watchDownloadLogActivityFilterAsync } from "./log/logActivity/downloadFilter";
import { watchGetLogActivityAsync } from "./log/logActivity/get";

// log notification
import { watchDeleteLogNotificationByIdAsync } from './log/logNotification/deleteById'
import { watchDeleteLogNotificationFilterAsync } from './log/logNotification/deleteFilter'
import { watchDownloadtLogNotificationByIdAsync } from './log/logNotification/downloadById'
import { watchDownloadLogNotificationFilterAsync } from './log/logNotification/downloadFilter'
import { watchGetLogNotificationAsync } from './log/logNotification/get'

//latest feature
import { watchCreateLatestFeatureAsync } from "./master/latestFeature/create";
import { watchDeleteLatestFeatureAsync } from "./master/latestFeature/delete";
import { watchExportLatestFeatureAsync } from "./master/latestFeature/export";
import { watchGetLatestFeatureAsync } from "./master/latestFeature/get";
import { watchUpdateLatestFeatureAsync } from "./master/latestFeature/update";
import { watchGetSystemUpdateAsync } from "./systemUpdate/get";

import { watchExportMenuAccessAsync } from "./master/menuAccess/exportExcel";

// master departement User
import { watchExportDepartementUserAsync } from "./master/departementUser/export";
import { watchGetDepartementUserAsync } from "./master/departementUser/get";
import { watchUpdateDepartementUserAsync } from "./master/departementUser/upsert";
import { watchResetPasswordAsync } from "./master/user/reset_password";

// notification
import { watchAllNotificationsAsync } from "./notifications/allNotificaitons";
import { watchGetNotificationsAsync } from "./notifications/getNotifications";
import { watchGetUnreadNotificationsAsync } from "./notifications/getUnreadNotifications";
import { watchReadNotificationsAsync } from "./notifications/readNotifications";

// Transaction
import { watchExportDailyManPowerAsync } from "./transaction/dailyManPower/export";
import { watchGetDailyManPowerAsync } from "./transaction/dailyManPower/get";
import { watchUpdateDailyManPowerAsync } from "./transaction/dailyManPower/upsert";

// Report PT3
import { watchExportReportPT3Async } from "./report/pt3/export";
import { watchGetReportPT3Async } from "./report/pt3/get";
import { watchUpdateReportPT3Async } from "./report/pt3/upsert";

export function* rootSaga() {
  yield all([
    watchLoginAsync(),
    watchLogoutAsync(),
    watchChangePasswordAsync(),
    watchChangeProfilePictureAsync(),

    // master role
    watchGetRoleAsync(),
    watchCreateRoleAsync(),
    watchUpdateRoleAsync(),
    watchDeleteRoleAsync(),
    watchExportRoleAsync(),

    // master menu access
    watchGetMenuAccessByRoleAsync(),
    watchSaveMenuAccessAsync(),
    watchExportMenuAccessAsync(),

    // master menu access mobile
    watchGetMenuAccessMobileAsync(),
    watchCreateMenuAccessMobileAsync(),
    watchUpdateMenuAccessMobileAsync(),
    watchDeleteMenuAccessMobileAsync(),
    watchExportMenuAccessMobileAsync(),
    watchGetMenuAccessMobileByRoleAsync(),
    watchSaveMenuAccessMobileByRoleAsync(),
    watchExportExcelMenuAccessMobileByRoleAsync(),

    // master user
    watchGetUserAsync(),
    watchCreateUserAsync(),
    watchUpdateUserAsync(),
    watchDeleteUserAsync(),
    watchExportUserAsync(),
    watchResetPasswordAsync(),
    watchGetDetailUserAsync(),

    // master job position
    watchGetJobPositionAsync(),
    watchUpdateJobPositionAsync(),
    watchExportJobPositionAsync(),

    // master price for finance
    watchGetDepartementUserAsync(),
    watchUpdateDepartementUserAsync(),
    watchExportDepartementUserAsync(),

    // setting latest feature
    watchGetLatestFeatureAsync(),
    watchCreateLatestFeatureAsync(),
    watchUpdateLatestFeatureAsync(),
    watchDeleteLatestFeatureAsync(),
    watchExportLatestFeatureAsync(),

    // master shift
    watchGetShiftAsync(),
    watchUpdateShiftAsync(),
    watchExportShiftAsync(),

    // master status lapangan
    watchGetStatusLapanganAsync(),
    watchUpdateStatusLapanganAsync(),
    watchExportStatusLapanganAsync(),

    // master witel
    watchGetWitelAsync(),
    watchUpdateWitelAsync(),
    watchExportWitelAsync(),

    // log activity
    watchGetLogActivityAsync(),
    watchDeleteLogActivityByIdAsync(),
    watchDeleteLogActivityFilterAsync(),
    watchDownloadLogActivityFilterAsync(),

    // log notification
    watchDeleteLogNotificationByIdAsync(),
    watchDeleteLogNotificationFilterAsync(),
    watchDownloadtLogNotificationByIdAsync(),
    watchDownloadLogNotificationFilterAsync(),
    watchGetLogNotificationAsync(),

    // system update
    watchGetSystemUpdateAsync(),

    // notifications
    watchGetNotificationsAsync(),
    watchGetUnreadNotificationsAsync(),
    watchReadNotificationsAsync(),
    watchAllNotificationsAsync(),

    // Transaction
    watchGetDailyManPowerAsync(),
    watchUpdateDailyManPowerAsync(),
    watchExportDailyManPowerAsync(),

    // Report PT3
    watchGetReportPT3Async(),
    watchUpdateReportPT3Async(),
    watchExportReportPT3Async(),
  ]);
}
