import { errorLogNotification, receiveLogNotification, requestLogNotification } from "@/lib/redux/slices/log/logNotification"
import { setTextNotification } from "@/lib/redux/slices/notification"
import { DefaultServiceResponse, deleteLogNotificationFilter, getLogNotification } from "@/lib/services"
import { GetLogNotificationDataResponse } from "@/lib/services/log-notification"
import { put, select, takeEvery } from "redux-saga/effects"
import { errorHandler } from "../../errorHandler"
import { DELETE_LOG_NOTIFICATION_FILTER } from "@/lib/redux/types"
import { RootState } from "@/lib/redux/store"

export function* deleteLogNotificationFilterSagas() {
    try {
        yield put(requestLogNotification())

        const param: {
            start_date?: string | undefined;
            end_date?: string | undefined;
            order?: string | undefined;
            search?: string | undefined;
            start: number;
            length: number;
        } = yield select((state: RootState) => state.logNotification.param)
        yield deleteLogNotificationFilter({
            date_start: param.start_date,
            date_end: param.end_date
        })
        const response: DefaultServiceResponse & {
            result: GetLogNotificationDataResponse;
        } = yield getLogNotification({
            date_start: param.start_date,
            date_end: param.end_date,
            start: param.start,
            length: param.length,
            search: param.search ?? ''
        })

        yield put(receiveLogNotification({ result: response.result, param: param }))
        yield put(setTextNotification({ text: "Delete Data Successfully", severity: "success" }))
    } catch (error) {
        const { message, statusCode } = errorHandler(error)
        yield put(errorLogNotification(message))
        yield put(setTextNotification({ text: message, severity: "error", responseCode: statusCode }))
    }
}

export function* watchDeleteLogNotificationFilterAsync() {
    yield takeEvery(DELETE_LOG_NOTIFICATION_FILTER, deleteLogNotificationFilterSagas)
}