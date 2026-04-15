import { witelActions } from "@/lib/redux/slices/master/witel";
import { setTextNotification } from "@/lib/redux/slices/notification";
import { EXPORT_WITEL } from "@/lib/redux/types";
import { put, select, takeEvery } from "redux-saga/effects";
import { errorHandler } from "../../errorHandler";
import { exportWitel } from "@/lib/services";
import { RootState } from "@/lib/redux/store";

function* exportData() {
  try {
    yield put(witelActions.requestExport());

    const params: RootState["witel"]["params"] = yield select(
      (state: RootState) => state.witel.params
    );

    const response: Awaited<ReturnType<typeof exportWitel>> =
      yield exportWitel(params);

    yield put(
      setTextNotification({
        text: "Data Exported successfully",
        severity: "success",
      })
    );

    yield put(witelActions.receiveExport());
  } catch (error) {
    const { message, statusCode } = errorHandler(error);
    yield put(witelActions.error(message));
    yield put(
      setTextNotification({
        text: message,
        severity: "error",
        responseCode: statusCode,
      })
    );
  }
}

export function* watchExportWitelAsync() {
  yield takeEvery(EXPORT_WITEL, exportData);
}
