import { branchActions } from "@/lib/redux/slices/master/branch";
import { setTextNotification } from "@/lib/redux/slices/notification";
import { EXPORT_BRANCH } from "@/lib/redux/types";
import { put, select, takeEvery } from "redux-saga/effects";
import { errorHandler } from "../../errorHandler";
import { exportBranch } from "@/lib/services";
import { RootState } from "@/lib/redux/store";

function* exportData() {
  try {
    yield put(branchActions.requestExport());

    const params: RootState["branch"]["params"] = yield select(
      (state: RootState) => state.branch.params
    );

    const response: Awaited<ReturnType<typeof exportBranch>> =
      yield exportBranch(params);

    yield put(
      setTextNotification({
        text: "Data Exported successfully",
        severity: "success",
      })
    );

    yield put(branchActions.receiveExport());
  } catch (error) {
    const { message, statusCode } = errorHandler(error);
    yield put(branchActions.error(message));
    yield put(
      setTextNotification({
        text: message,
        severity: "error",
        responseCode: statusCode,
      })
    );
  }
}

export function* watchExportBranchAsync() {
  yield takeEvery(EXPORT_BRANCH, exportData);
}
