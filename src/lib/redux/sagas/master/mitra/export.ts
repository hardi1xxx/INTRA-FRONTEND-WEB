import { mitraActions } from "@/lib/redux/slices/master/mitra";
import { setTextNotification } from "@/lib/redux/slices/notification";
import { EXPORT_MITRA } from "@/lib/redux/types";
import { put, select, takeEvery } from "redux-saga/effects";
import { errorHandler } from "../../errorHandler";
import { exportMitra } from "@/lib/services";
import { RootState } from "@/lib/redux/store";

function* exportData() {
  try {
    yield put(mitraActions.requestExport());

    const params: RootState["mitra"]["params"] = yield select(
      (state: RootState) => state.mitra.params
    );

    const response: Awaited<ReturnType<typeof exportMitra>> =
      yield exportMitra(params);

    yield put(
      setTextNotification({
        text: "Data Exported successfully",
        severity: "success",
      })
    );

    yield put(mitraActions.receiveExport());
  } catch (error) {
    const { message, statusCode } = errorHandler(error);
    yield put(mitraActions.error(message));
    yield put(
      setTextNotification({
        text: message,
        severity: "error",
        responseCode: statusCode,
      })
    );
  }
}

export function* watchExportMitraAsync() {
  yield takeEvery(EXPORT_MITRA, exportData);
}
