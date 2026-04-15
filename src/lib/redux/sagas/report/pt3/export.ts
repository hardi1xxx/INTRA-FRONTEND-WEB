import { reportPT3Actions } from "@/lib/redux/slices/report/reportPT3";
import { setTextNotification } from "@/lib/redux/slices/notification";
import { EXPORT_REPORT_PT3 } from "@/lib/redux/types";
import { put, select, takeEvery } from "redux-saga/effects";
import { errorHandler } from "../../errorHandler";
import { exportReportPT3 } from "@/lib/services";
import { RootState } from "@/lib/redux/store";

function* exportData() {
  try {
    yield put(reportPT3Actions.requestExport());

    const params: RootState["reportPT3"]["params"] = yield select(
      (state: RootState) => state.reportPT3.params
    );

    const response: Awaited<ReturnType<typeof exportReportPT3>> =
      yield exportReportPT3(params);

    yield put(
      setTextNotification({
        text: "Data Exported successfully",
        severity: "success",
      })
    );

    yield put(reportPT3Actions.receiveExport());
  } catch (error) {
    const { message, statusCode } = errorHandler(error);
    yield put(reportPT3Actions.error(message));
    yield put(
      setTextNotification({
        text: message,
        severity: "error",
        responseCode: statusCode,
      })
    );
  }
}

export function* watchExportReportPT3Async() {
  yield takeEvery(EXPORT_REPORT_PT3, exportData);
}
