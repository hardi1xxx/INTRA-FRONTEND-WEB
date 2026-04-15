import { errorUser, receiveExportUser, requestExportUser } from "@/lib/redux/slices/master/user";
import { exportUser } from "@/lib/services";
import { put, takeEvery } from "redux-saga/effects";
import { errorHandler } from "../../errorHandler";
import { setTextNotification } from "@/lib/redux/slices/notification";
import { EXPORT_MASTER_USER } from "@/lib/redux/types";

export function* exportUserSagas() {
  try {
    yield put(requestExportUser())

    const response: Blob = yield exportUser({})

    const url = window.URL.createObjectURL(new Blob([response]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Master-User.xlsx`);
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