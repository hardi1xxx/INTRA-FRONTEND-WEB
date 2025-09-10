import { shiftActions } from "@/lib/redux/slices/master/shift";
import { setTextNotification } from "@/lib/redux/slices/notification";
import { CREATE_SHIFT, DELETE_SHIFT, GET_SHIFT, UPDATE_SHIFT, UPDATE_STATUS_SHIFT } from "@/lib/redux/types";
import { put, select, takeEvery } from "redux-saga/effects";
import { errorHandler } from "../../errorHandler";
import { createShift, deleteShift, updateShift, updateStatusShift } from "@/lib/services";
import { PayloadAction } from "@reduxjs/toolkit";
import { UpsertShiftRequest } from "@/app/(postlogin)/master/shift/schema";
import { WithId } from "@/type/services";

function* updateStatus(props: PayloadAction<{ id: number; status: 0 | 1 }>) {
  try {
    yield put(shiftActions.request());

    try {
      const response: Awaited<ReturnType<typeof updateStatusShift>> =
        yield updateStatusShift(props.payload);
    } catch (error) {}

    yield put(
      setTextNotification({
        text: "Status has been updated successfully",
        severity: "success",
      })
    );

    yield put({ type: GET_SHIFT });
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

function* create(props: PayloadAction<UpsertShiftRequest>) {
  try {
    yield put(shiftActions.request());

    const response: Awaited<ReturnType<typeof createShift>> =
      yield createShift(props.payload);

    yield put(
      setTextNotification({
        text: response,
        severity: "success",
      })
    );

    yield put({ type: GET_SHIFT });
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

function* update(props: PayloadAction<UpsertShiftRequest & WithId>) {
  try {
    yield put(shiftActions.request());

    const response: Awaited<ReturnType<typeof updateShift>> =
      yield updateShift(props.payload);

    yield put(
      setTextNotification({
        text: response,
        severity: "success",
      })
    );

    yield put({ type: GET_SHIFT });
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
function* deleteData(props: PayloadAction<WithId>) {
  try {
    yield put(shiftActions.request());

    const response: Awaited<ReturnType<typeof deleteShift>> =
      yield deleteShift(props.payload);

    yield put(
      setTextNotification({
        text: response,
        severity: "success",
      })
    );

    yield put({ type: GET_SHIFT });
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

export function* watchUpdateShiftAsync() {
  yield takeEvery(UPDATE_STATUS_SHIFT, updateStatus);
  yield takeEvery(CREATE_SHIFT, create);
  yield takeEvery(UPDATE_SHIFT, update);
  yield takeEvery(DELETE_SHIFT, deleteData);
}
