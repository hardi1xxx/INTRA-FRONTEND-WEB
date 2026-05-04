import { stoActions } from "@/lib/redux/slices/master/sto";
import { setTextNotification } from "@/lib/redux/slices/notification";
import { EXPORT_STO } from "@/lib/redux/types";
import { put, select, takeEvery } from "redux-saga/effects";
import { errorHandler } from "../../errorHandler";
import { exportSTO } from "@/lib/services";
import { RootState } from "@/lib/redux/store";

function* exportData() {
  try {
    yield put(stoActions.requestExport());

    const params: RootState["sto"]["params"] = yield select(
      (state: RootState) => state.sto.params
    );

    const response: Awaited<ReturnType<typeof exportSTO>> =
      yield exportSTO(params);

    yield put(
      setTextNotification({
        text: "Data Exported successfully",
        severity: "success",
      })
    );

    yield put(stoActions.receiveExport());
  } catch (error) {
    const { message, statusCode } = errorHandler(error);
    yield put(stoActions.error(message));
    yield put(
      setTextNotification({
        text: message,
        severity: "error",
        responseCode: statusCode,
      })
    );
  }
}

export function* watchExportSTOAsync() {
  yield takeEvery(EXPORT_STO, exportData);
}
