import { errorLogActivity, receiveLogActivity, requestLogActivity } from "@/lib/redux/slices/log/logActivity"
import { setTextNotification } from "@/lib/redux/slices/notification"
import { DefaultServiceResponse, deleteLogActivityFilter, getLogActivity } from "@/lib/services"
import { GetLogActivityDataRequest, GetLogActivityDataResponse } from "@/lib/services/log-activity"
import { put, select, takeEvery } from "redux-saga/effects"
import { errorHandler } from "../../errorHandler"
import { DELETE_LOG_ACTIVITY_FILTER } from "@/lib/redux/types"
import { RootState } from "@/lib/redux/store"

export function* deleteLogActivityFilterSagas() {
  try {
    yield put(requestLogActivity())

    const param : {
      start_date?: string | undefined;
      end_date?: string | undefined;
      order?: string | undefined;
      search?: string | undefined;
      start: number;
      length: number;
  } = yield select((state: RootState) => state.logActivity.param)
    yield deleteLogActivityFilter({
        start_date: param.start_date,
        end_date: param.end_date
    })
    const response: DefaultServiceResponse & {
        result: GetLogActivityDataResponse;
    } = yield getLogActivity({
      date_start: param.start_date,
      date_end: param.end_date,
      start: param.start,
      length: param.length
    })

    yield put(receiveLogActivity({result: response.result, param: param}))
    yield put(setTextNotification({ text: "Delete Data Successfully", severity: "success" }))
  } catch (error) {
    const { message, statusCode } = errorHandler(error)
    yield put(errorLogActivity(message))
    yield put(setTextNotification({ text: message, severity: "error", responseCode: statusCode }))
  }
}

export function* watchDeleteLogActivityFilterAsync() {
  yield takeEvery(DELETE_LOG_ACTIVITY_FILTER, deleteLogActivityFilterSagas)
}