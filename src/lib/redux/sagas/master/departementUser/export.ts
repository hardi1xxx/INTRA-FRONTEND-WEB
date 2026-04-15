import { setTextNotification } from "@/lib/redux/slices/notification";
import { put, select, takeEvery } from "redux-saga/effects";
import { errorHandler } from "../../errorHandler";
import { RootState } from "@/lib/redux/store";
import { departementUserActions } from "@/lib/redux/slices/master/departementUser";
import { exportDepartementUser } from "@/lib/services";
import { EXPORT_MASTER_DEPARTEMENT_USER } from "@/lib/redux/types";

function* exportData() {
  try {
    yield put(departementUserActions.requestExport());

    const params: RootState["departementUser"]["params"] = yield select(
      (state: RootState) => state.departementUser.params
    );

    yield exportDepartementUser(params);

    yield put(
      setTextNotification({
        text: "Data Exported successfully",
        severity: "success",
      })
    );

    yield put(departementUserActions.receiveExport());
  } catch (error) {
    const { message, statusCode } = errorHandler(error);
    yield put(departementUserActions.error(message));
    yield put(
      setTextNotification({
        text: message,
        severity: "error",
        responseCode: statusCode,
      })
    );
  }
}

export function* watchExportDepartementUserAsync() {
  yield takeEvery(EXPORT_MASTER_DEPARTEMENT_USER, exportData);
}
