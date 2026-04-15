import { errorRole} from "@/lib/redux/slices/master/role"
import { setTextNotification } from "@/lib/redux/slices/notification"
import { exportExcelRole } from "@/lib/services"
import { put, takeEvery } from "redux-saga/effects"
import { errorHandler } from "../../errorHandler"
import { EXPORT_ROLE } from "@/lib/redux/types"

type AnyAction = {
  type: string
}

export function* exportRoleSagas({}: AnyAction) {
  try {
    const response : Blob = yield exportExcelRole()

    const url = window.URL.createObjectURL(new Blob([response]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Master-Role.xlsx`);
    document.body.appendChild(link);
    link.click();
    
  } catch (error: any) {
    const { message, statusCode } = errorHandler(error)
    yield put(errorRole(message))
    yield put(setTextNotification({ text: message, severity: "error" }))
  }
}

export function* watchExportRoleAsync() {
  yield takeEvery(EXPORT_ROLE, exportRoleSagas)
}