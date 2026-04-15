import { errorLogNotification, receiveExportLogNotification, requestExportLogNotification } from "@/lib/redux/slices/log/logNotification";
import { downloadLogNotificationFilter } from "@/lib/services";
import { put, select, takeEvery } from "redux-saga/effects";
import { errorHandler } from "../../errorHandler";
import { setTextNotification } from "@/lib/redux/slices/notification";
import { DOWNLOAD_NOTIFICATION_FILTER } from "@/lib/redux/types";
import { RootState } from "@/lib/redux/store";


export function* downloadLogNotificationFilterSagas() {
    try {
        yield put(requestExportLogNotification())

        const param: {
            start_date?: string | undefined;
            end_date?: string | undefined;
            order?: string | undefined;
            search?: string | undefined;
            start: number;
            length: number;
        } = yield select((state: RootState) => state.logNotification.param)

        const response: Blob = yield downloadLogNotificationFilter({
            date_start: param.start_date,
            date_end: param.end_date
        })

        const url = window.URL.createObjectURL(new Blob([response]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Log Notification.xlsx`);
        document.body.appendChild(link);
        link.click();

        yield put(receiveExportLogNotification())
    } catch (error: any) {
        const { message, statusCode } = errorHandler(error)
        yield put(errorLogNotification(message))
        yield put(setTextNotification({ text: message, severity: "error", responseCode: statusCode }))
    }
}

export function* watchDownloadLogNotificationFilterAsync() {
    yield takeEvery(DOWNLOAD_NOTIFICATION_FILTER, downloadLogNotificationFilterSagas)
}