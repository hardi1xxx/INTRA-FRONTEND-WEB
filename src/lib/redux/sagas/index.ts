import { all } from "redux-saga/effects";
import { watchChangePasswordAsync } from "./auth/changePassword";
import { watchLoginAsync } from "./auth/login";
import { watchLogoutAsync } from "./auth/logout";

//master user
import { watchChangeProfilePictureAsync } from "./auth/changeProfilePicture";

// Master

// Batch
import { watchExportBatchAsync } from "./master/batch/export";
import { watchGetBatchAsync } from "./master/batch/get";
import { watchUpdateBatchAsync } from "./master/batch/upsert";
// Status Project
import { watchExportStatusProjectAsync } from "./master/statusProject/export";
import { watchGetStatusProjectAsync } from "./master/statusProject/get";
import { watchUpdateStatusProjectAsync } from "./master/statusProject/upsert";
// Category Project
import { watchExportCategoryProjectAsync } from "./master/categoryProject/export";
import { watchGetCategoryProjectAsync } from "./master/categoryProject/get";
import { watchUpdateCategoryProjectAsync } from "./master/categoryProject/upsert";
// Mitra
import { watchExportMitraAsync } from "./master/mitra/export";
import { watchGetMitraAsync } from "./master/mitra/get";
import { watchUpdateMitraAsync } from "./master/mitra/upsert";
// Regional
import { watchExportRegionalAsync } from "./master/regional/export";
import { watchGetRegionalAsync } from "./master/regional/get";
import { watchUpdateRegionalAsync } from "./master/regional/upsert";
// Area
import { watchExportAreaAsync } from "./master/area/export";
import { watchGetAreaAsync } from "./master/area/get";
import { watchUpdateAreaAsync } from "./master/area/upsert";
// Branch
import { watchExportBranchAsync } from "./master/branch/export";
import { watchGetBranchAsync } from "./master/branch/get";
import { watchUpdateBranchAsync } from "./master/branch/upsert";
// STO
import { watchExportSTOAsync } from "./master/sto/export";
import { watchGetSTOAsync } from "./master/sto/get";
import { watchUpdateSTOAsync } from "./master/sto/upsert";

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

// notification
import { watchAllNotificationsAsync } from "./notifications/allNotificaitons";
import { watchGetNotificationsAsync } from "./notifications/getNotifications";
import { watchGetUnreadNotificationsAsync } from "./notifications/getUnreadNotifications";
import { watchReadNotificationsAsync } from "./notifications/readNotifications";

export function* rootSaga() {
  yield all([
    watchLoginAsync(),
    watchLogoutAsync(),
    watchChangePasswordAsync(),
    watchChangeProfilePictureAsync(),

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

    // notifications
    watchGetNotificationsAsync(),
    watchGetUnreadNotificationsAsync(),
    watchReadNotificationsAsync(),
    watchAllNotificationsAsync(),

    // Master

    // Batch
    watchGetBatchAsync(),
    watchUpdateBatchAsync(),
    watchExportBatchAsync(),
    // Mitra
    watchGetMitraAsync(),
    watchUpdateMitraAsync(),
    watchExportMitraAsync(),
    // Status Project
    watchGetStatusProjectAsync(),
    watchUpdateStatusProjectAsync(),
    watchExportStatusProjectAsync(),
    // Category Project
    watchGetCategoryProjectAsync(),
    watchUpdateCategoryProjectAsync(),
    watchExportCategoryProjectAsync(),
    // Regional
    watchGetRegionalAsync(),
    watchUpdateRegionalAsync(),
    watchExportRegionalAsync(),
    // Area
    watchGetAreaAsync(),
    watchUpdateAreaAsync(),
    watchExportAreaAsync(),
    // Branch
    watchGetBranchAsync(),
    watchUpdateBranchAsync(),
    watchExportBranchAsync(),
    // STO
    watchGetSTOAsync(),
    watchUpdateSTOAsync(),
    watchExportSTOAsync(),
  ]);
}
