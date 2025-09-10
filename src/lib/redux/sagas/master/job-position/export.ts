import { jobPositionActions } from "@/lib/redux/slices/master/job-position";
import { setTextNotification } from "@/lib/redux/slices/notification";
import { EXPORT_MASTER_JOB_POSITION } from "@/lib/redux/types";
import { put, select, takeEvery } from "redux-saga/effects";
import { errorHandler } from "../../errorHandler";
import { exportJobPosition } from "@/lib/services";
import { RootState } from "@/lib/redux/store";

function* exportData() {
  try {
    yield put(jobPositionActions.requestExport());

    const params: RootState["jobPosition"]["params"] = yield select((state: RootState) => state.jobPosition.params);

    const response: Awaited<ReturnType<typeof exportJobPosition>> = yield exportJobPosition(params);

    yield put(
      setTextNotification({
        text: "Data Exported successfully",
        severity: "success",
      })
    );

    yield put(jobPositionActions.receiveExport());
  } catch (error) {
    const { message, statusCode } = errorHandler(error);
    yield put(jobPositionActions.error(message));
    yield put(
      setTextNotification({
        text: message,
        severity: "error",
        responseCode: statusCode,
      })
    );
  }
}

export function* watchExportJobPositionAsync() {
  yield takeEvery(EXPORT_MASTER_JOB_POSITION, exportData);
}
