import { statusProjectActions } from "@/lib/redux/slices/master/statusProject";
import { setTextNotification } from "@/lib/redux/slices/notification";
import { EXPORT_STATUS_PROJECT } from "@/lib/redux/types";
import { put, select, takeEvery } from "redux-saga/effects";
import { errorHandler } from "../../errorHandler";
import { exportStatusProject } from "@/lib/services";
import { RootState } from "@/lib/redux/store";

function* exportData() {
  try {
    yield put(statusProjectActions.requestExport());

    const params: RootState["statusProject"]["params"] = yield select(
      (state: RootState) => state.statusProject.params
    );

    const response: Awaited<ReturnType<typeof exportStatusProject>> =
      yield exportStatusProject(params);

    yield put(
      setTextNotification({
        text: "Data Exported successfully",
        severity: "success",
      })
    );

    yield put(statusProjectActions.receiveExport());
  } catch (error) {
    const { message, statusCode } = errorHandler(error);
    yield put(statusProjectActions.error(message));
    yield put(
      setTextNotification({
        text: message,
        severity: "error",
        responseCode: statusCode,
      })
    );
  }
}

export function* watchExportStatusProjectAsync() {
  yield takeEvery(EXPORT_STATUS_PROJECT, exportData);
}
