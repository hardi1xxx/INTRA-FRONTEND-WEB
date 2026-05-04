import { areaActions } from "@/lib/redux/slices/master/area";
import { setTextNotification } from "@/lib/redux/slices/notification";
import { EXPORT_AREA } from "@/lib/redux/types";
import { put, select, takeEvery } from "redux-saga/effects";
import { errorHandler } from "../../errorHandler";
import { exportArea } from "@/lib/services";
import { RootState } from "@/lib/redux/store";

function* exportData() {
  try {
    yield put(areaActions.requestExport());

    const params: RootState["area"]["params"] = yield select(
      (state: RootState) => state.area.params
    );

    const response: Awaited<ReturnType<typeof exportArea>> =
      yield exportArea(params);

    yield put(
      setTextNotification({
        text: "Data Exported successfully",
        severity: "success",
      })
    );

    yield put(areaActions.receiveExport());
  } catch (error) {
    const { message, statusCode } = errorHandler(error);
    yield put(areaActions.error(message));
    yield put(
      setTextNotification({
        text: message,
        severity: "error",
        responseCode: statusCode,
      })
    );
  }
}

export function* watchExportAreaAsync() {
  yield takeEvery(EXPORT_AREA, exportData);
}
