import { errorLogNotification, receiveLogNotification, requestLogNotification } from "@/lib/redux/slices/log/logNotification"
import { DefaultServiceResponse, getLogNotification } from "@/lib/services"
import { GetLogNotificationDataResponse } from "@/lib/services/log-notification"
import { put, takeEvery } from "redux-saga/effects"
import { errorHandler } from "../../errorHandler"
import { setTextNotification } from "@/lib/redux/slices/notification"
import { GET_LOG_NOTIFICATION } from "@/lib/redux/types"

type AnyAction = {
  type: string,
  param: {
    start_date?: string,
    end_date?: string,
    order?: string,
    search?: string,
    start: number,
    length: number,
  },
}

export function* getLogNotificationSagas({ param }: AnyAction) {
  try {
    yield put(requestLogNotification())

    const response: DefaultServiceResponse & {
        result: GetLogNotificationDataResponse;
    } = yield  getLogNotification({
      date_start: param.start_date,
      date_end: param.end_date,
      start: param.start,
      length: param.length,
      search: param.search ?? ''
    })

    yield put(receiveLogNotification({result: response.result, param: param}))
  } catch (error: any) {
    const { message, statusCode } = errorHandler(error)
    yield put(errorLogNotification(message))
    yield put(setTextNotification({ text: message, severity: "error", responseCode: statusCode }))
  }
}

export function* watchGetLogNotificationAsync() {
  yield takeEvery(GET_LOG_NOTIFICATION, getLogNotificationSagas)
}