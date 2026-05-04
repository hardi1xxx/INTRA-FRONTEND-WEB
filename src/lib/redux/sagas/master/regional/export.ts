import { regionalActions } from "@/lib/redux/slices/master/regional";
import { setTextNotification } from "@/lib/redux/slices/notification";
import { EXPORT_REGIONAL } from "@/lib/redux/types";
import { put, select, takeEvery } from "redux-saga/effects";
import { errorHandler } from "../../errorHandler";
import { exportRegional } from "@/lib/services";
import { RootState } from "@/lib/redux/store";

function* exportData() {
  try {
    yield put(regionalActions.requestExport());

    const params: RootState["regional"]["params"] = yield select(
      (state: RootState) => state.regional.params
    );

    const response: Awaited<ReturnType<typeof exportRegional>> =
      yield exportRegional(params);

    yield put(
      setTextNotification({
        text: "Data Exported successfully",
        severity: "success",
      })
    );

    yield put(regionalActions.receiveExport());
  } catch (error) {
    const { message, statusCode } = errorHandler(error);
    yield put(regionalActions.error(message));
    yield put(
      setTextNotification({
        text: message,
        severity: "error",
        responseCode: statusCode,
      })
    );
  }
}

export function* watchExportRegionalAsync() {
  yield takeEvery(EXPORT_REGIONAL, exportData);
}
