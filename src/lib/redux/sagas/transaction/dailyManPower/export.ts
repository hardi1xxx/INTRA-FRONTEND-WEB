import { dailyManPowerActions } from "@/lib/redux/slices/transaction/dailyManPower";
import { setTextNotification } from "@/lib/redux/slices/notification";
import { EXPORT_DAILY_MANPOWER } from "@/lib/redux/types";
import { put, select, takeEvery } from "redux-saga/effects";
import { errorHandler } from "../../errorHandler";
import { exportDailyManPower } from "@/lib/services";
import { RootState } from "@/lib/redux/store";

function* exportData() {
  try {
    yield put(dailyManPowerActions.requestExport());

    const params: RootState["dailyManPower"]["params"] = yield select(
      (state: RootState) => state.dailyManPower.params
    );

    const response: Awaited<ReturnType<typeof exportDailyManPower>> =
      yield exportDailyManPower(params);

    yield put(
      setTextNotification({
        text: "Data Exported successfully",
        severity: "success",
      })
    );

    yield put(dailyManPowerActions.receiveExport());
  } catch (error) {
    const { message, statusCode } = errorHandler(error);
    yield put(dailyManPowerActions.error(message));
    yield put(
      setTextNotification({
        text: message,
        severity: "error",
        responseCode: statusCode,
      })
    );
  }
}

export function* watchExportDailyManPowerAsync() {
  yield takeEvery(EXPORT_DAILY_MANPOWER, exportData);
}
