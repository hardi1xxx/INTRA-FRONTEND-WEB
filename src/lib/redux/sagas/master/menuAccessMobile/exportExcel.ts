import { errorMenuAccessMobile, receiveExportMenuAccessMobile, requestExportMenuAccessMobile } from "@/lib/redux/slices/master/menuAccessMobile";
import { exportExcelMenuAccessMobile } from "@/lib/services";
import { put, takeEvery } from "redux-saga/effects";
import { errorHandler } from "../../errorHandler";
import { setTextNotification } from "@/lib/redux/slices/notification";
import { EXPORT_MENU_ACCESS_MOBILE } from "@/lib/redux/types";
import { getDateNow } from "@/components/helper";

// type AnyAction = {
//     search: string
// }

type AnyAction = {
    type: string;  // Add this to match Redux action format
    payload: { search: string }; // Ensure payload is correctly structured
};

// export function* exportMenuAccessMobileSagas({ search }: AnyAction) {
export function* exportMenuAccessMobileSagas({ payload }: AnyAction) {
    try {
        yield put(requestExportMenuAccessMobile())
        const response: Blob = yield exportExcelMenuAccessMobile(payload.search)

        const url = window.URL.createObjectURL(new Blob([response]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Setting-Menu-Access-Mobile-export-${getDateNow()}.xlsx`);
        document.body.appendChild(link);
        link.click();

        yield put(receiveExportMenuAccessMobile())
    } catch (error: any) {
        const { message } = errorHandler(error)
        yield put(errorMenuAccessMobile(message))
        yield put(setTextNotification({ text: message, severity: "error" }))
    }
}

export function* watchExportMenuAccessMobileAsync() {
    yield takeEvery(EXPORT_MENU_ACCESS_MOBILE, exportMenuAccessMobileSagas)
    // ({ type: EXPORT_MENU_ACCESS_MOBILE, payload: { search: "exportMenuAccessMobileSagas" } });

}