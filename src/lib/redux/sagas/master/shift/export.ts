import { shiftActions } from "@/lib/redux/slices/master/shift";
import { setTextNotification } from "@/lib/redux/slices/notification";
import { CREATE_SHIFT, EXPORT_SHIFT, GET_SHIFT, UPDATE_SHIFT, UPDATE_STATUS_SHIFT } from "@/lib/redux/types";
import { put, select, takeEvery } from "redux-saga/effects";
import { errorHandler } from "../../errorHandler";
import { createShift, exportShift, updateShift, updateStatusShift } from "@/lib/services";
import { PayloadAction } from "@reduxjs/toolkit";
import { UpsertShiftRequest } from "@/app/(postlogin)/master/shift/schema";
import { WithId } from "@/type/services";
import { RootState } from "@/lib/redux/store";

function* exportData() {
  try {
    yield put(shiftActions.requestExport());

    const params: RootState["shift"]["params"] = yield select(
      (state: RootState) => state.shift.params
    );

    const response: Awaited<ReturnType<typeof exportShift>> =
      yield exportShift(params);

    yield put(
      setTextNotification({
        text: "Data Exported successfully",
        severity: "success",
      })
    );

    yield put(shiftActions.receiveExport());
  } catch (error) {
    const { message, statusCode } = errorHandler(error);
    yield put(shiftActions.error(message));
    yield put(
      setTextNotification({
        text: message,
        severity: "error",
        responseCode: statusCode,
      })
    );
  }
}

export function* watchExportShiftAsync() {
  yield takeEvery(EXPORT_SHIFT, exportData);
}
