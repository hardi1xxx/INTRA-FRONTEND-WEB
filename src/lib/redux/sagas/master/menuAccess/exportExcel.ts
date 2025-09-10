import { errorMenuAccess, receiveExportMenuAccess, requestExportMenuAccess} from "@/lib/redux/slices/master/menuAccess"
import { setTextNotification } from "@/lib/redux/slices/notification"
import { exportExcelMenuAccess } from "@/lib/services"
import { put, takeEvery } from "redux-saga/effects"
import { errorHandler } from "../../errorHandler"
import { EXPORT_MENU_ACCESS } from "@/lib/redux/types"
import { getDateNow } from "@/components/helper"

type AnyAction = {
  type: string,
  role_id: number
}

export function* exportMenuAccessSagas({role_id}: AnyAction) {
  try {
    yield put(requestExportMenuAccess())
    const response : Blob = yield exportExcelMenuAccess(role_id)

    const url = window.URL.createObjectURL(new Blob([response]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Setting-Role-Menu-Access-export-${getDateNow()}.xlsx`);
    document.body.appendChild(link);
    link.click();

    yield put(receiveExportMenuAccess())
  } catch (error: any) {
    const { message } = errorHandler(error)
    yield put(errorMenuAccess(message))
    yield put(setTextNotification({ text: message, severity: "error" }))
  }
}

export function* watchExportMenuAccessAsync() {
  yield takeEvery(EXPORT_MENU_ACCESS, exportMenuAccessSagas)
}