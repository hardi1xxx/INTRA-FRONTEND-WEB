import { all } from "redux-saga/effects";
import { watchLoginAsync } from "./auth/login";
import { watchLogoutAsync } from "./auth/logout";
import { watchChangePasswordAsync } from "./auth/changePassword";
import { watchGetRoleAsync } from "./master/role/get";
import { watchCreateRoleAsync } from "./master/role/create";
import { watchUpdateRoleAsync } from "./master/role/update";
import { watchDeleteRoleAsync } from "./master/role/delete";
import { watchExportRoleAsync } from "./master/role/exportExcel";

//menu access
import { watchGetMenuAccessByRoleAsync } from "./master/menuAccess/getByRole";
import { watchSaveMenuAccessAsync } from "./master/menuAccess/save";

//master user
import { watchGetUserAsync } from "./master/user/get";
import { watchCreateUserAsync } from "./master/user/create";
import { watchUpdateUserAsync } from "./master/user/update";
import { watchDeleteUserAsync } from "./master/user/delete";
import { watchExportUserAsync } from "./master/user/export";
import { watchChangeProfilePictureAsync } from "./auth/changeProfilePicture";

//log activity
import { watchGetLogActivityAsync } from "./log/logActivity/get";
import { watchDeleteLogActivityByIdAsync } from "./log/logActivity/deleteById";
import { watchDeleteLogActivityFilterAsync } from "./log/logActivity/deleteFilter";
import { watchDownloadtLogActivityByIdAsync } from "./log/logActivity/downloadById";
import { watchDownloadLogActivityFilterAsync } from "./log/logActivity/downloadFilter";

//latest feature
import { watchGetLatestFeatureAsync } from "./master/latestFeature/get";
import { watchCreateLatestFeatureAsync } from "./master/latestFeature/create";
import { watchUpdateLatestFeatureAsync } from "./master/latestFeature/update";
import { watchDeleteLatestFeatureAsync } from "./master/latestFeature/delete";
import { watchExportLatestFeatureAsync } from "./master/latestFeature/export";
import { watchGetSystemUpdateAsync } from "./systemUpdate/get";

import { watchExportMenuAccessAsync } from "./master/menuAccess/exportExcel";

//master colorway
import { watchGetDropdownColorwayAsync } from "./pcxLibrary/colorway/getDropdownColorway";
import { watchGetColorwayAsync } from "./pcxLibrary/colorway/getColorway";
import { watchCreateColorwayAsync } from "./pcxLibrary/colorway/create";
import { watchDeleteColorwayAsync } from "./pcxLibrary/colorway/delete";
import { watchDownloadTemplateColorwayAsync } from "./pcxLibrary/colorway/downloadTemplate";
import { watchUpdateColorwayAsync } from "./pcxLibrary/colorway/update";
import { watchExportColorwayAsync } from "./pcxLibrary/colorway/export";
import { watchUploadColorwayAsync } from "./pcxLibrary/colorway/upload";
import { watchInsertUploadColorwayAsync } from "./pcxLibrary/colorway/insertUpload";


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

        // master user
        watchGetUserAsync(),
        watchCreateUserAsync(),
        watchUpdateUserAsync(),
        watchDeleteUserAsync(),
        watchExportUserAsync(),

        // setting latest feature
        watchGetLatestFeatureAsync(),
        watchCreateLatestFeatureAsync(),
        watchUpdateLatestFeatureAsync(),
        watchDeleteLatestFeatureAsync(),
        watchExportLatestFeatureAsync(),

        // log activity
        watchGetLogActivityAsync(),
        watchDeleteLogActivityByIdAsync(),
        watchDeleteLogActivityFilterAsync(),
        watchDownloadtLogActivityByIdAsync(),
        watchDownloadLogActivityFilterAsync(),

        // system update
        watchGetSystemUpdateAsync(),

        // notifications
        // watchGetNotificationsAsync(),
        // watchGetUnreadNotificationsAsync(),
        // watchReadNotificationsAsync(),
        // watchAllNotificationsAsync()
       
        // pcx library colorway
        watchGetDropdownColorwayAsync(),
        watchGetColorwayAsync(),
        watchCreateColorwayAsync(),
        watchDeleteColorwayAsync(),
        watchDownloadTemplateColorwayAsync(),
        watchUpdateColorwayAsync(),
        watchExportColorwayAsync(),
        watchUploadColorwayAsync(),
        watchInsertUploadColorwayAsync(),
    ])
}
