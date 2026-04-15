import { shiftActions } from "@/lib/redux/slices/master/shift";
import { setTextNotification } from "@/lib/redux/slices/notification";
import { GET_SHIFT, GET_SHIFT_DROPDOWN } from "@/lib/redux/types";
import { put, select, takeEvery } from "redux-saga/effects";
import { errorHandler } from "../../errorHandler";
import { getDropdownShift, getShiftDatatable } from "@/lib/services";
import { RootState } from "@/lib/redux/store";
import { PayloadAction } from "@reduxjs/toolkit";

function* getDatatable() {
  try {
    yield put(shiftActions.request());

    const params: RootState["shift"]["params"] = yield select(
      (state: RootState) => state.shift.params
    );

    const response: Awaited<ReturnType<typeof getShiftDatatable>> =
      yield getShiftDatatable(params);

    yield put(shiftActions.receive(response));
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

function* getDropdownOptions(props: PayloadAction<any>) {
  try {
    yield put(shiftActions.requestDropdownOptions());

    const params: RootState["shift"]["params"] = yield select(
      (state: RootState) => state.shift.params
    );

    const response: Awaited<ReturnType<typeof getDropdownShift>> =
      yield getDropdownShift({ ...params, ...props.payload });

    yield put(
      shiftActions.receiveDropdownOptions({
        column: props.payload.column,
        options: response,
      })
    );
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

export function* watchGetShiftAsync() {
  yield takeEvery(GET_SHIFT, getDatatable);
  yield takeEvery(GET_SHIFT_DROPDOWN, getDropdownOptions);
}
