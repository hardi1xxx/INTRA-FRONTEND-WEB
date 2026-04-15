import { errorLogNotification, receiveExportLogNotification, requestExportLogNotification } from "@/lib/redux/slices/log/logNotification";
import { downloadLogNotificationById } from "@/lib/services";
import { put, takeEvery } from "redux-saga/effects";
import { errorHandler } from "../../errorHandler";
import { setTextNotification } from "@/lib/redux/slices/notification";
import { DOWNLOAD_NOTIFICATION_BY_ID } from "@/lib/redux/types";

type AnyAction = {
    type: string,
    id: number
}

export function* downloadLogNotificationByIdSagas({ id }: AnyAction) {
    try {
        yield put(requestExportLogNotification())

        const response: Blob = yield downloadLogNotificationById(id)

        const url = window.URL.createObjectURL(new Blob([response]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Log Notification - ${id}.xlsx`);
        document.body.appendChild(link);
        link.click();

        yield put(receiveExportLogNotification())
    } catch (error: any) {
        const { message, statusCode } = errorHandler(error)
        yield put(errorLogNotification(message))
        yield put(setTextNotification({ text: message, severity: "error", responseCode: statusCode }))
    }
}

export function* watchDownloadtLogNotificationByIdAsync() {
    yield takeEvery(DOWNLOAD_NOTIFICATION_BY_ID, downloadLogNotificationByIdSagas)
}