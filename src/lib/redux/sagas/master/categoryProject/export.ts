import { categoryProjectActions } from "@/lib/redux/slices/master/categoryProject";
import { setTextNotification } from "@/lib/redux/slices/notification";
import { EXPORT_CATEGORY_PROJECT } from "@/lib/redux/types";
import { put, select, takeEvery } from "redux-saga/effects";
import { errorHandler } from "../../errorHandler";
import { exportCategoryProject } from "@/lib/services";
import { RootState } from "@/lib/redux/store";

function* exportData() {
  try {
    yield put(categoryProjectActions.requestExport());

    const params: RootState["categoryProject"]["params"] = yield select(
      (state: RootState) => state.categoryProject.params
    );

    const response: Awaited<ReturnType<typeof exportCategoryProject>> =
      yield exportCategoryProject(params);

    yield put(
      setTextNotification({
        text: "Data Exported successfully",
        severity: "success",
      })
    );

    yield put(categoryProjectActions.receiveExport());
  } catch (error) {
    const { message, statusCode } = errorHandler(error);
    yield put(categoryProjectActions.error(message));
    yield put(
      setTextNotification({
        text: message,
        severity: "error",
        responseCode: statusCode,
      })
    );
  }
}

export function* watchExportCategoryProjectAsync() {
  yield takeEvery(EXPORT_CATEGORY_PROJECT, exportData);
}
