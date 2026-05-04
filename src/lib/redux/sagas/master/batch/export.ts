import { batchActions } from "@/lib/redux/slices/master/batch";
import { setTextNotification } from "@/lib/redux/slices/notification";
import { EXPORT_BATCH } from "@/lib/redux/types";
import { put, select, takeEvery } from "redux-saga/effects";
import { errorHandler } from "../../errorHandler";
import { exportBatch } from "@/lib/services";
import { RootState } from "@/lib/redux/store";

function* exportData() {
  try {
    yield put(batchActions.requestExport());

    const params: RootState["batch"]["params"] = yield select(
      (state: RootState) => state.batch.params
    );

    const response: Awaited<ReturnType<typeof exportBatch>> =
      yield exportBatch(params);

    yield put(
      setTextNotification({
        text: "Data Exported successfully",
        severity: "success",
      })
    );

    yield put(batchActions.receiveExport());
  } catch (error) {
    const { message, statusCode } = errorHandler(error);
    yield put(batchActions.error(message));
    yield put(
      setTextNotification({
        text: message,
        severity: "error",
        responseCode: statusCode,
      })
    );
  }
}

export function* watchExportBatchAsync() {
  yield takeEvery(EXPORT_BATCH, exportData);
}
