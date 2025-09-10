import { errorLogActivity, receiveExportLogActivity, requestExportLogActivity } from "@/lib/redux/slices/log/logActivity";
// import { downloadLogActivityById } from "@/lib/services";
import { put, takeEvery } from "redux-saga/effects";
import { errorHandler } from "../../errorHandler";
import { setTextNotification } from "@/lib/redux/slices/notification";
import { DOWNLOAD_ACTIVITY_BY_ID } from "@/lib/redux/types";

type AnyAction = {
    type: string,
    id: number
}

export function* downloadLogActivityByIdSagas({ id }: AnyAction) {
  try {
    yield put(requestExportLogActivity())

    // const response: Blob = yield downloadLogActivityById(id)

    // const url = window.URL.createObjectURL(new Blob([response]));
    // const link = document.createElement('a');
    // link.href = url;
    // link.setAttribute('download', `Log Activity - ${id}.xlsx`);
    // document.body.appendChild(link);
    // link.click();

    yield put(receiveExportLogActivity())
  } catch (error: any) {
    const { message, statusCode } = errorHandler(error)
    yield put(errorLogActivity(message))
    yield put(setTextNotification({ text: message, severity: "error", responseCode: statusCode }))
  }
}

export function* watchDownloadtLogActivityByIdAsync() {
  yield takeEvery(DOWNLOAD_ACTIVITY_BY_ID, downloadLogActivityByIdSagas)
}