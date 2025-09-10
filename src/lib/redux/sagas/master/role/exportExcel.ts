import { errorRole, receiveExportRole, requestExportRole} from "@/lib/redux/slices/master/role"
import { setTextNotification } from "@/lib/redux/slices/notification"
import { exportExcelRole } from "@/lib/services"
import { put, takeEvery } from "redux-saga/effects"
import { errorHandler } from "../../errorHandler"
import { EXPORT_ROLE } from "@/lib/redux/types"
import { getDateNow } from "@/components/helper"

type AnyAction = {
  type: string,
  search: string
}

export function* exportRoleSagas({ search }: AnyAction) {
  try {
    yield put(requestExportRole())
    const response : Blob = yield exportExcelRole(search)

    const url = window.URL.createObjectURL(new Blob([response]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Setting-Role-User-export-${getDateNow()}.xlsx`);
    document.body.appendChild(link);
    link.click();

    yield put(receiveExportRole())
  } catch (error: any) {
    const { message } = errorHandler(error)
    yield put(errorRole(message))
    yield put(setTextNotification({ text: message, severity: "error" }))
  }
}

export function* watchExportRoleAsync() {
  yield takeEvery(EXPORT_ROLE, exportRoleSagas)
}