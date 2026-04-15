import { errorMenuAccess} from "@/lib/redux/slices/master/menuAccess"
import { setTextNotification } from "@/lib/redux/slices/notification"
import { exportExcelMenuAccess } from "@/lib/services"
import { put, takeEvery } from "redux-saga/effects"
import { errorHandler } from "../../errorHandler"
import { EXPORT_MENU_ACCESS } from "@/lib/redux/types"

type AnyAction = {
  type: string,
  role_id: number
}

export function* exportMenuAccessSagas({role_id}: AnyAction) {
  try {
    const response : Blob = yield exportExcelMenuAccess(role_id)

    const url = window.URL.createObjectURL(new Blob([response]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Master-Role-Menu-Access.xlsx`);
    document.body.appendChild(link);
    link.click();
    
  } catch (error: any) {
    const { message, statusCode } = errorHandler(error)
    yield put(errorMenuAccess(message))
    yield put(setTextNotification({ text: message, severity: "error" }))
  }
}

export function* watchExportMenuAccessAsync() {
  yield takeEvery(EXPORT_MENU_ACCESS, exportMenuAccessSagas)
}