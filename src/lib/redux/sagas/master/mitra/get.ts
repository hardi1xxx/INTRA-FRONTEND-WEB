import { mitraActions } from "@/lib/redux/slices/master/mitra";
import { setTextNotification } from "@/lib/redux/slices/notification";
import { GET_MITRA, GET_MITRA_DROPDOWN } from "@/lib/redux/types";
import { put, select, takeEvery } from "redux-saga/effects";
import { errorHandler } from "../../errorHandler";
import { getDropdownMitra, getMitraDatatable } from "@/lib/services";
import { RootState } from "@/lib/redux/store";
import { PayloadAction } from "@reduxjs/toolkit";

function* getDatatable() {
  try {
    yield put(mitraActions.request());

    const params: RootState["mitra"]["params"] = yield select(
      (state: RootState) => state.mitra.params
    );

    const response: Awaited<ReturnType<typeof getMitraDatatable>> =
      yield getMitraDatatable(params);

    yield put(mitraActions.receive(response));
  } catch (error) {
    const { message, statusCode } = errorHandler(error);
    yield put(mitraActions.error(message));
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
    yield put(mitraActions.requestDropdownOptions());

    const params: RootState["mitra"]["params"] = yield select(
      (state: RootState) => state.mitra.params
    );

    const response: Awaited<ReturnType<typeof getDropdownMitra>> =
      yield getDropdownMitra({ ...params, ...props.payload });

    yield put(
      mitraActions.receiveDropdownOptions({
        column: props.payload.column,
        options: response,
      })
    );
  } catch (error) {
    const { message, statusCode } = errorHandler(error);
    yield put(mitraActions.error(message));
    yield put(
      setTextNotification({
        text: message,
        severity: "error",
        responseCode: statusCode,
      })
    );
  }
}

export function* watchGetMitraAsync() {
  yield takeEvery(GET_MITRA, getDatatable);
  yield takeEvery(GET_MITRA_DROPDOWN, getDropdownOptions);
}
