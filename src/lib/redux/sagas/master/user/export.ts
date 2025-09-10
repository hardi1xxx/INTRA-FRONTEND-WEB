import { FilterParamsUser, errorUser, receiveExportUser, requestExportUser } from "@/lib/redux/slices/master/user";
import { exportUser } from "@/lib/services";
import { put, select, takeEvery } from "redux-saga/effects";
import { errorHandler } from "../../errorHandler";
import { setTextNotification } from "@/lib/redux/slices/notification";
import { EXPORT_MASTER_USER } from "@/lib/redux/types";
import { RootState } from "@/lib/redux/store";
import { getDateNow } from "@/components/helper";

export function* exportUserSagas() {
  try {
    yield put(requestExportUser())

    const params: FilterParamsUser = yield select((state: RootState) => state.user.params)
    const response: Blob = yield exportUser(params)

    const url = window.URL.createObjectURL(new Blob([response]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Setting-User-export-${getDateNow()}.xlsx`);
    document.body.appendChild(link);
    link.click();

    yield put(receiveExportUser())
  } catch (error: any) {
    const { message, statusCode } = errorHandler(error)
    yield put(errorUser(message))
    yield put(setTextNotification({ text: message, severity: "error", responseCode: statusCode }))
  }
}

export function* watchExportUserAsync() {
  yield takeEvery(EXPORT_MASTER_USER, exportUserSagas)
}