import { errorLogActivity, receiveExportLogActivity, requestExportLogActivity } from "@/lib/redux/slices/log/logActivity";
import { downloadLogActivityFilter } from "@/lib/services";
import { put, select, takeEvery } from "redux-saga/effects";
import { errorHandler } from "../../errorHandler";
import { setTextNotification } from "@/lib/redux/slices/notification";
import { DOWNLOAD_ACTIVITY_FILTER } from "@/lib/redux/types";
import { GetLogActivityDataRequest } from "@/lib/services/log-activity";
import { RootState } from "@/lib/redux/store";


export function* downloadLogActivityFilterSagas() {
  try {
    yield put(requestExportLogActivity())

    const param : {
      start_date?: string | undefined;
      end_date?: string | undefined;
      order?: string | undefined;
      search?: string | undefined;
      start: number;
      length: number;
    } = yield select((state: RootState) => state.logActivity.param)

    const response: Blob = yield downloadLogActivityFilter({
        start_date: param.start_date,
        end_date: param.end_date
    })

    const url = window.URL.createObjectURL(new Blob([response]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Log Activity.xlsx`);
    document.body.appendChild(link);
    link.click();

    yield put(receiveExportLogActivity())
  } catch (error: any) {
    const { message, statusCode } = errorHandler(error)
    yield put(errorLogActivity(message))
    yield put(setTextNotification({ text: message, severity: "error", responseCode: statusCode }))
  }
}

export function* watchDownloadLogActivityFilterAsync() {
  yield takeEvery(DOWNLOAD_ACTIVITY_FILTER, downloadLogActivityFilterSagas)
}