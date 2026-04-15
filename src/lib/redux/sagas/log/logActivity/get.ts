import { errorLogActivity, receiveLogActivity, requestLogActivity } from "@/lib/redux/slices/log/logActivity"
import { DefaultServiceResponse, getLogActivity } from "@/lib/services"
import { GetLogActivityDataResponse, GetLogActivityDataRequest } from "@/lib/services/log-activity"
import { put, takeEvery } from "redux-saga/effects"
import { errorHandler } from "../../errorHandler"
import { setTextNotification } from "@/lib/redux/slices/notification"
import { GET_LOG_ACTIVITY } from "@/lib/redux/types"

type AnyAction = {
  type: string,
  param: GetLogActivityDataRequest
}

export function* getLogActivitySagas({ param }: AnyAction) {
  try {
    yield put(requestLogActivity())

    const response: DefaultServiceResponse & {
        result: GetLogActivityDataResponse;
    } = yield getLogActivity(param)

    yield put(receiveLogActivity({result: response.result, param: param}))
  } catch (error: any) {
    const { message, statusCode } = errorHandler(error)
    yield put(errorLogActivity(message))
    yield put(setTextNotification({ text: message, severity: "error", responseCode: statusCode }))
  }
}

export function* watchGetLogActivityAsync() {
  yield takeEvery(GET_LOG_ACTIVITY, getLogActivitySagas)
}