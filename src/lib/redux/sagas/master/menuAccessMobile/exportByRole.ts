import { errorMenuAccessMobile, receiveExportMenuAccessMobile, requestExportMenuAccessMobile } from "@/lib/redux/slices/master/menuAccessMobile"
import { errorHandler } from "../../errorHandler"
import { put, takeEvery } from "redux-saga/effects"
import { setTextNotification } from "@/lib/redux/slices/notification"
import { exportExcelMenuAccessMobileByRole } from "@/lib/services"
import { EXPORT_MENU_ACCESS_MOBILE_BY_ROLE_ID } from "@/lib/redux/types"
import { getDateNow } from "@/components/helper"

type AnyAction = {
    type: string,
    role_id: number
}

export function* exportExcelMenuAccessMobileByRoleSagas({ role_id }: AnyAction) {
    try {
        yield put(requestExportMenuAccessMobile())

        const response: Blob = yield exportExcelMenuAccessMobileByRole(role_id)

        const url = window.URL.createObjectURL(new Blob([response]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Setting-Role-Menu-Access-Mobile-export-${getDateNow()}.xlsx`);
        document.body.appendChild(link);
        link.click();

        yield put(receiveExportMenuAccessMobile())
    } catch (error: any) {
        const { message } = errorHandler(error)
        yield put(errorMenuAccessMobile(message))
        yield put(setTextNotification({ text: message, severity: "error" }))
    }
}

export function* watchExportExcelMenuAccessMobileByRoleAsync() {
    yield takeEvery(EXPORT_MENU_ACCESS_MOBILE_BY_ROLE_ID, exportExcelMenuAccessMobileByRoleSagas)
}