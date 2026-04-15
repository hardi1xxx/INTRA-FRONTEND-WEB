import { statusLapanganActions } from "@/lib/redux/slices/master/statusLapangan";
import { setTextNotification } from "@/lib/redux/slices/notification";
import { EXPORT_STATUS_LAPANGAN } from "@/lib/redux/types";
import { put, select, takeEvery } from "redux-saga/effects";
import { errorHandler } from "../../errorHandler";
import { exportStatusLapangan } from "@/lib/services";
import { RootState } from "@/lib/redux/store";

function* exportData() {
  try {
    yield put(statusLapanganActions.requestExport());

    const params: RootState["statusLapangan"]["params"] = yield select(
      (state: RootState) => state.statusLapangan.params
    );

    const response: Awaited<ReturnType<typeof exportStatusLapangan>> =
      yield exportStatusLapangan(params);

    yield put(
      setTextNotification({
        text: "Data Exported successfully",
        severity: "success",
      })
    );

    yield put(statusLapanganActions.receiveExport());
  } catch (error) {
    const { message, statusCode } = errorHandler(error);
    yield put(statusLapanganActions.error(message));
    yield put(
      setTextNotification({
        text: message,
        severity: "error",
        responseCode: statusCode,
      })
    );
  }
}

export function* watchExportStatusLapanganAsync() {
  yield takeEvery(EXPORT_STATUS_LAPANGAN, exportData);
}
